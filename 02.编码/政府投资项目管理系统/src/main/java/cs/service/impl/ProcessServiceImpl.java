package cs.service.impl;


import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.domain.framework.Role;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ProjectRepoImpl;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.impl.TaskHeadRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.TaskHeadService;
/**
 * @Description: 任务信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class ProcessServiceImpl extends AbstractServiceImpl<ShenBaoInfoDto, ShenBaoInfo, String> implements ProcessService {
	private static Logger logger = Logger.getLogger(ProcessServiceImpl.class);
	
	@Autowired
	private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;	
	@Autowired
	private ShenBaoInfoRepoImpl shenBaoInfoRepoImpl;
	@Autowired
	private IRepository<SysConfig, String> sysConfigRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
    ProcessEngineFactoryBean processEngine;
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private TaskService taskService;
	@Autowired
	private ActivitiService activitiService;
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		List<String> ids = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		for (Role role : user.getRoles()) {
			ids.add(role.getId());
		}
		
		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		List<Task> tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
		tasks1.addAll(tasks2);
		
		List<String> processIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			processIds.add(processId);
		}
		
		if(!processIds.isEmpty()){
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj,processIds).stream().map((x) -> {
				return mapper.toDto(x);
			}).collect(Collectors.toList());
			
			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(shenBaoInfoDtos);
		}
		
		
		return pageModelDto;
		
	}
	
	@Override
	@Transactional
	public List<Object> getHistoryInfo(String shenbaoInfoId) {
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);
		
		List<HistoricActivityInstance> lists = activitiService.getHistoryInfoByActivity(shenBaoInfo.getZong_processId());
		List<HistoricProcessInstance> lists1 = activitiService.findHisProcessIntanceList(shenBaoInfo.getZong_processId());
		
		List<Object> hisList = new ArrayList<>();
		
		for(HistoricProcessInstance list1 : lists1){
			User user = userRepo.findById(list1.getStartUserId());
			Map<String, String> map1 = new HashMap<>();
			map1.put("name", "启动流程");
			map1.put("id", list1.getStartUserId());
			map1.put("endTime", list1.getStartTime().toLocaleString());
			map1.put("msg", user.getDisplayName()+"：启动了项目<"+shenBaoInfo.getProjectName()+">的审批流程！");
			
			hisList.add(map1);
		}
		for(HistoricActivityInstance list : lists){
			List<Comment> coms = activitiService.getTaskComment(list.getTaskId());
			ProcessDefinition processDefinition = activitiService.getRuntimeProcessDefinition(list.getProcessDefinitionId());

			if(!coms.isEmpty()){
				for(Comment com : coms){
					if(list.getTaskId().equals(com.getTaskId())){
						Map<String, String> map = new HashMap<>();
						map.put("name", list.getActivityName());
						map.put("id", list.getAssignee());
						map.put("endTime", list.getEndTime().toLocaleString());
						map.put("dur", list.getDurationInMillis().toString());
						map.put("msg", com.getFullMessage());
						
						hisList.add(map);
					}
				}
				
			}else{
				if(list.getAssignee()!=null){
					Map<String, String> map = new HashMap<>();
					map.put("name", list.getActivityName());
					map.put("id", list.getAssignee());
					map.put("endTime", list.getEndTime().toLocaleString());
					map.put("dur", list.getDurationInMillis().toString());
					map.put("msg", "未填写处理意见 ！");
					hisList.add(map);
				}
				
			}
			
		}
		
		return hisList;
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional
	public void taskComplete(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		String str = (String) data.get("str");//具体操作
		List att = (List) data.get("att");//附件
		String nextUsers = (String) data.get("nextUsers");//下一经办人
		
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		Map<String, Object> variables = new HashMap<String, Object>();
		
		//判断具体操作
		if(str.equals("next")){
			variables.put("isPass", 1);
		}else if(str.equals("tuiwen")){
			variables.put("isPass", 2);
		}else if(str.equals("reback")){
			variables.put("isPass", 3);
		}
		
		//如果有指定下一候选人
		if(!nextUsers.isEmpty()){
			variables.put("userIds", nextUsers);
		}

		List<Task> oldTask = taskService.createTaskQuery().taskId(shenBaoInfo.getThisTaskId()).orderByDueDate().desc().list();
		activitiService.setTaskComment(shenBaoInfo.getThisTaskId(), shenBaoInfo.getZong_processId(), msg);
//		oldTask.get(0).getAssignee()
//		activitiService.claimTask(shenBaoInfo.getThisTaskId(), currentUser.getUserId());
		
		activitiService.taskComplete(shenBaoInfo.getThisTaskId(),variables);
		
		List<Task> newtask = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).orderByDueDate().desc().list();
		
		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();
		
		//如果有附件
		if(att != null){
			for (int i = 0; i < att.toArray().length; i++) {
				map = gson.fromJson(att.toArray()[i].toString(), map.getClass());
				Attachment newatt = new Attachment();
				newatt.setId(UUID.randomUUID().toString());
				newatt.setName(map.get("name").toString());
				newatt.setUrl(map.get("url").toString());			
				newatt.setType(map.get("type").toString());
				newatt.setCreatedBy(currentUser.getUserId());
				newatt.setModifiedBy(currentUser.getUserId());
				shenBaoInfo.getAttachments().add(newatt);
			}
		}
		
		shenBaoInfo.setThisTaskId(newtask.get(0).getId());
		shenBaoInfo.setThisTaskName(newtask.get(0).getTaskDefinitionKey());
		shenBaoInfoRepo.save(shenBaoInfo);
					
		logger.info(String.format("查询角色组已办结上线请求,用户名:%s", currentUser.getLoginName()));
	}
}

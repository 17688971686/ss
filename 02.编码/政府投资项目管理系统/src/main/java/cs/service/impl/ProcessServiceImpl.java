package cs.service.impl;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Date;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.repository.ProcessDefinition;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.engine.task.TaskQuery;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.framework.Org;
import cs.domain.framework.Org_;
import cs.domain.framework.Role;
import cs.domain.framework.SysConfig;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.framework.OrgRepo;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObjNew;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ProcessService;
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
	@Autowired
	private OrgRepo orgRepo;
	
	@Autowired
	private HistoryService historyService;
	
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
	public Response getAssigneeByUserId(String processId) {
		Response response = new Response();
		boolean isShow = false;
		Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), processId);
		List<ShenBaoInfo> shenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
		User loginUser = userRepo.findById(currentUser.getUserId());
		
		List<HistoricVariableInstance> list = processEngine.getProcessEngineConfiguration().getHistoryService()  
	            .createHistoricVariableInstanceQuery()//创建一个历史的流程变量查询对象  
	            .variableName("nextUsers")
	            .processInstanceId(processId)
	            .list(); 
		List<Object> userList = new ArrayList<>();
		for (HistoricVariableInstance historicVariableInstance : list) {
			userList = Arrays.asList(historicVariableInstance.getValue().toString().split(","));
			System.out.println(historicVariableInstance);
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask2") || shenBaoInfo.get(0).getThisTaskName().equals("usertask6") 
				|| shenBaoInfo.get(0).getThisTaskName().equals("usertask7") || shenBaoInfo.get(0).getThisTaskName().equals("usertask8")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("科长")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask10")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("评审人员")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask12") || shenBaoInfo.get(0).getThisTaskName().equals("usertask18")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("秘书科分办人员")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask14") || shenBaoInfo.get(0).getThisTaskName().equals("usertask20")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("秘书科发文人员")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask13") || shenBaoInfo.get(0).getThisTaskName().equals("usertask21")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("局长")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask17") || shenBaoInfo.get(0).getThisTaskName().equals("usertask19")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals("副局长")){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask16") || shenBaoInfo.get(0).getThisTaskName().equals("usertask3")
				|| shenBaoInfo.get(0).getThisTaskName().equals("usertask22") ){
			List<HistoricActivityInstance> lists = activitiService.getHistoryInfoByActivity(processId);
			root:for (HistoricActivityInstance historicActivityInstance : lists) {
				if(("usertask3").equals(historicActivityInstance.getActivityId())&&(currentUser.getUserId()).equals(historicActivityInstance.getAssignee())){
					isShow = true;
					break root;
				}
			}
		}
		
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask3") && !userList.isEmpty()){
			root:for (Object object : userList) {
				if(currentUser.getUserId().equals(object)){
					isShow = true;
					break root;
				}
			}
		}
		
		if(isShow == true){
			response.setSuccess(true);
		}
		
		return response;
	}
	
	@SuppressWarnings("deprecation")
	@Override
	@Transactional
	public List<Object> getHistoryInfo(String shenbaoInfoId) {
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);
		
		List<Object> hisList = new ArrayList<>();
//		List<HistoricActivityInstance> lists = activitiService.getHistoryInfoByActivity(shenBaoInfo.getZong_processId());
		List<HistoricProcessInstance> lists1 = activitiService.findHisProcessIntanceList(shenBaoInfo.getZong_processId());
		
		List<HistoricActivityInstance> hais = historyService.createHistoricActivityInstanceQuery().processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask").list();
	
		for(HistoricProcessInstance list1 : lists1){
			Map<String, String> map1 = new HashMap<>();
			map1.put("name", "启动流程");
			map1.put("id", list1.getStartUserId());
			map1.put("endTime", list1.getStartTime().toLocaleString());
			map1.put("msg", list1.getStartUserId()+"：启动了项目<"+shenBaoInfo.getProjectName()+">的审批流程！");
			
			hisList.add(map1);
		}
		//       3）查询每个历史任务的批注
        for (HistoricActivityInstance hai : hais) {
            String historytaskId = hai.getTaskId();
            List<Comment> comments = taskService.getTaskComments(historytaskId);
            // 4）如果当前任务有批注信息，添加到集合中
            if(comments!=null && comments.size()>0){
            	for(Comment com : comments){
						Map<String, String> map = new HashMap<>();
						
						map.put("name", hai.getActivityName());
						map.put("id", com.getUserId());
						map.put("endTime", com.getTime().toLocaleString());
//						map.put("dur", hai.getDurationInMillis().toString());
						map.put("msg", com.getFullMessage());
						
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
		String isPass = (String) data.get("isPass");//下一经办人
		String isPass2 = (String) data.get("isPass2");//下一经办人
		
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		Map<String, Object> variables = new HashMap<String, Object>();
		
		//判断具体操作
		if(shenBaoInfo.getThisTaskName().equals("usertask3") && ("5").equals(isPass2)&&("8").equals(isPass)){
			isPass = "5";
		}else if(shenBaoInfo.getThisTaskName().equals("usertask3") && ("6").equals(isPass2)&&("8").equals(isPass)){
			isPass = "6";
		}
		
		if(isPass != ""){//其他方式通过
			variables.put("isPass", isPass);
		}else if(str.equals("tuiwen")){
			variables.put("isPass", 3);
		}else if(str.equals("reback")){
			variables.put("isPass", 2);
		}else if(isPass == ""){//正常通过
			variables.put("isPass", 1);
		} 
		
		variables.put("shenpi", 8);
		
		List<String> useridList = new ArrayList<String>();
		List<Org> findProjects = new ArrayList<>();
		Criterion criterion=Restrictions.eq(Org_.name.getName(), "投资科");
		Criterion criterion2=Restrictions.eq(Org_.name.getName(), "局领导");
		if(shenBaoInfo.getThisTaskName().equals("usertask6") || shenBaoInfo.getThisTaskName().equals("usertask7") || (shenBaoInfo.getThisTaskName().equals("usertask17")&&"5".equals(isPass))
				|| (shenBaoInfo.getThisTaskName().equals("usertask19")&&"5".equals(isPass))){
			Criterion criterion3=Restrictions.eq(Org_.name.getName(), "办公室");
			Criterion criterion4 = Restrictions.or(criterion,criterion2,criterion3);
			findProjects = orgRepo.findByCriteria(criterion4);
		}else{
			Criterion criterion3 = Restrictions.or(criterion,criterion2);
			
			findProjects = orgRepo.findByCriteria(criterion3);
		}
	
		for (Org org : findProjects) {
			for (User user : org.getUsers()) {
				useridList.add(user.getId().trim());
			}
		}
		if(!useridList.isEmpty()){//固定会签人员
			if(shenBaoInfo.getThisTaskName().equals("usertask3") && ("5").equals(isPass2)){
				useridList.addAll(Arrays.asList(nextUsers.toString().split(",")));
			}
			variables.put("userIds", useridList);
		}
		
		if(!nextUsers.isEmpty()){//设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		}else if(shenBaoInfo.getThisTaskName().equals("usertask2") && nextUsers.isEmpty()){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}else if(shenBaoInfo.getThisTaskName().equals("usertask3")&& ("5").equals(isPass2) && nextUsers.isEmpty()){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}
		
//		List<Task> oldTask = taskService.createTaskQuery().taskId(shenBaoInfo.getThisTaskId()).orderByDueDate().desc().list();
		Authentication.setAuthenticatedUserId(currentUser.getDisplayName());
		activitiService.setTaskComment(shenBaoInfo.getThisTaskId(), shenBaoInfo.getZong_processId(), msg);

		if(shenBaoInfo.getThisTaskName().equals("usertask1") &&  isPass !="" || shenBaoInfo.getThisTaskName().equals("usertask5") &&  isPass !="" ){
			processEngine.getProcessEngineConfiguration().getTaskService().setAssignee(shenBaoInfo.getThisTaskId(), nextUsers);
			processEngine.getProcessEngineConfiguration().getTaskService().setVariable(shenBaoInfo.getThisTaskId(), "isPass", isPass);

		}else{
			activitiService.claimTask(shenBaoInfo.getThisTaskId(), currentUser.getUserId());
			activitiService.taskComplete(shenBaoInfo.getThisTaskId(),variables);
		}
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
		if(shenBaoInfo.getThisTaskName().equals("usertask16")){
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
		}else if(str.equals("tuiwen")){
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
		}else{
			shenBaoInfo.setThisTaskId(newtask.get(0).getId());
			shenBaoInfo.setThisTaskName(newtask.get(0).getTaskDefinitionKey());
		}
	
		shenBaoInfoRepo.save(shenBaoInfo);
					
		logger.info(String.format("查询角色组已办结上线请求,用户名:%s", currentUser.getLoginName()));
	}
	
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional
	public void taskPinglun(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		List att = (List) data.get("att");//附件
//		String isPass = (String) data.get("isPass");//下一经办人
		
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

//		Map<String, Object> variables = new HashMap<String, Object>();
//		
//		variables.put("isPass", 1);
//
//		List<Task> oldTask = taskService.createTaskQuery().taskId(shenBaoInfo.getThisTaskId()).orderByDueDate().desc().list();
		Authentication.setAuthenticatedUserId(currentUser.getDisplayName());
		activitiService.setTaskComment(shenBaoInfo.getThisTaskId(), shenBaoInfo.getZong_processId(), msg);

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

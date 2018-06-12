package cs.service.impl;


import java.util.ArrayList;
import java.util.Arrays;
import java.util.Calendar;
import java.util.Date;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.annotation.Resource;
import javax.transaction.Transactional;
import javax.xml.bind.JAXBException;

import cs.common.*;
import cs.model.SendMsg;
import cs.service.sms.SmsService;
import cs.service.sms.exception.SMSException;
import org.activiti.engine.HistoryService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;

import cs.activiti.service.ActivitiService;
import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.framework.Org;
import cs.domain.framework.Org_;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.UserDto;
import cs.repository.framework.OrgRepo;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.framework.UserService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.UserUnitInfoService;
/**
 * @Description: 审批流程服务层
 * @author: neo
 * @Date：2018年4月10日
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
	private ICurrentUser currentUser;
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
	private UserService userService;
	@Autowired
	private HistoryService historyService;
<<<<<<< HEAD

	@Autowired
	private SmsService smsService;
	@Resource
	private Map<String, String> shenbaoSMSContent;

=======
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
>>>>>>> bfd9d835... 流转信息添加建设单位
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {	
		logger.info("查询工作台任务数据");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj,String str,String leixin) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		List<String> ids = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		for (Role role : user.getRoles()) {
			ids.add(role.getId());
		}
		
		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		List<Task> tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
		tasks1.addAll(tasks2);
		
		List<String> taskIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			taskIds.add(processId);
		}
		List<ShenBaoInfoDto> ourShenBaoInfoDtos = new ArrayList<>();
		if(!taskIds.isEmpty()){
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj,taskIds,str).stream().map((x) -> {
				return mapper.toDto(x);
			}).collect(Collectors.toList());
			
			
			if("geren".equals(leixin)){
				for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
					ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
					if(("audit").equals(str)){
						Response response = this.getAssigneeByUserId(array_element.getZong_processId());
						if(response.isSuccess() == true || ("usertask1").equals(array_element.getThisTaskName()) || ("usertask5").equals(array_element.getThisTaskName())){
							ourShenBaoInfoDtos.add(array_element);
						}
					}else{
						Response response = this.getAssigneeByUserId_plan(array_element.getZong_processId());
						if(response.isSuccess() == true || ("usertask1").equals(array_element.getThisTaskName()) || ("usertask2").equals(array_element.getThisTaskName())){
							ourShenBaoInfoDtos.add(array_element);
						}
					}
					
				}
			
			}else{
				for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
					ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
					if(("audit").equals(str)){
						Response response = this.getAssigneeByUserId(array_element.getZong_processId());
						if(response.isSuccess() == false){
							ourShenBaoInfoDtos.add(array_element);
						}
					}else{
						Response response = this.getAssigneeByUserId_plan(array_element.getZong_processId());
						if(response.isSuccess() == false){
							ourShenBaoInfoDtos.add(array_element);
						}
					}
				
				}
			}

			pageModelDto.setCount(ourShenBaoInfoDtos.size());
			pageModelDto.setValue(ourShenBaoInfoDtos);
		}
		
		return pageModelDto;
		
	}
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj,String str) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		List<String> ids = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		for (Role role : user.getRoles()) {
			ids.add(role.getId());
		}
		
		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		List<Task> tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
		tasks1.addAll(tasks2);
		
		List<String> taskIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			taskIds.add(processId);
		}
		if(!taskIds.isEmpty()){
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj,taskIds,str).stream().map((x) -> {
				return mapper.toDto(x);
			}).collect(Collectors.toList());
			
			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(shenBaoInfoDtos);
		}
		
		return pageModelDto;
		
	}
	
	/********************************************************-plan-******************************************************************/
	@Override
	@Transactional
	public Response getAssigneeByUserId_plan(String processId) {
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
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask3")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.KeZhang)){
					isShow = true;
					break root;
				}
			}
		}
		
		if((shenBaoInfo.get(0).getThisTaskName().equals("usertask4") || shenBaoInfo.get(0).getThisTaskName().equals("usertask5")) && !userList.isEmpty()){
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
	
	@SuppressWarnings({ "unchecked", "rawtypes", "unused" })
	@Override
	@Transactional
	public void taskComplete_plan(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		String str = (String) data.get("str");//具体操作
		List att = (List) data.get("att");//附件
		String nextUsers = (String) data.get("nextUsers");//下一经办人
		String isPass = (String) data.get("isPass");//下一经办人
		String isPass2 = (String) data.get("isPass2");//下一经办人
		double apPlanReach_ggys;
		double apPlanReach_gtzj;
	
		Integer c = (int)data.get("apPlanReach_ggys");
		apPlanReach_ggys = c.doubleValue();
		
		Integer a = (int)data.get("apPlanReach_gtzj");
		apPlanReach_gtzj = a.doubleValue(); 
		
		
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		Map<String, Object> variables = new HashMap<String, Object>();
		
		//判断具体操作
		if(isPass != "" && !str.equals("reback") && !str.equals("tuiwen")){//其他方式通过
			variables.put("isPass", isPass);
		}else if(str.equals("tuiwen")){
			variables.put("isPass", 3);
		}else if(str.equals("reback")){
			variables.put("isPass", 2);
		}else if((isPass == ""|| isPass ==null)&&"next".equals(str)){//正常通过
			variables.put("isPass", 1);
		} 
		
		variables.put("shenpi", 8);
		
		List<Org> findProjects = new ArrayList<>();
		Criterion criterion=Restrictions.eq(Org_.name.getName(), "投资科");
		Criterion criterion2=Restrictions.eq(Org_.name.getName(), "局领导");
		Criterion criterion3 = Restrictions.or(criterion,criterion2);
		
		findProjects = orgRepo.findByCriteria(criterion3);
	
		Set set = new HashSet<>();//同一用户如果有多个角色，同流程下会同时有多个任务，必须去重
		for (Org org : findProjects) {
			for (User user : org.getUsers()) {
				set.add(user.getId().trim());
			}
		}
		List<String> list1 = new ArrayList<String>(set);
		if(!list1.isEmpty()){//固定会签人员
			variables.put("userIds", list1);
		}
		
		if(!nextUsers.isEmpty()){//设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		}else if(shenBaoInfo.getThisTaskName().equals("usertask3") && nextUsers.isEmpty()&&"next".equals(str)){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}else if(shenBaoInfo.getThisTaskName().equals("usertask4") && nextUsers.isEmpty()&&"next".equals(str)){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}
		
		List<Task> task = null;
		
		//经办人转办模式
		if(shenBaoInfo.getThisTaskName().equals("usertask1") &&  isPass !="" || shenBaoInfo.getThisTaskName().equals("usertask2") &&  isPass !="" ){
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();
			
			Authentication.setAuthenticatedUserId(currentUser.getUserId());
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见："+msg);

			processEngine.getProcessEngineConfiguration().getTaskService().setAssignee(task.get(0).getId(), nextUsers);
			processEngine.getProcessEngineConfiguration().getTaskService().setVariable(task.get(0).getId(), "isPass", isPass);

		}else{
			//当前流程下，当前登录人员的任务--会签模式
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
			if(task.size() == 0 ){
				task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();
				
			}
			Authentication.setAuthenticatedUserId(currentUser.getUserId());
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(),  "批复意见："+msg);

			activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
			activitiService.taskComplete(task.get(0).getId(),variables);
		}
		
		//结束上一任务后，当前流程下产生的新任务
		List<Task> tasknew = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).orderByDueDate().desc().list();
		
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
		if(shenBaoInfo.getThisTaskName().equals("usertask5")){
			shenBaoInfo.setApPlanReach_gtzj(apPlanReach_gtzj);
			shenBaoInfo.setApPlanReach_ggys(apPlanReach_ggys);
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessStage("已办结");
			shenBaoInfo.setEndDate(new Date());
			shenBaoInfo.setPifuDate(new Date());
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setIsIncludLibrary(true);
			shenBaoInfo.setComplate(true);
		}else if(str.equals("tuiwen")){
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
			shenBaoInfo.setEndDate(new Date());
			shenBaoInfo.setComplate(true);
		}else{
		    
			shenBaoInfo.setThisTaskId(task.get(0).getId());
			shenBaoInfo.setThisTaskName(tasknew.get(0).getTaskDefinitionKey());
			shenBaoInfo.setProcessStage(tasknew.get(0).getName());
		}
		
		shenBaoInfoRepo.save(shenBaoInfo);

		logger.info(String.format("查询角色组已办结上线请求,用户名:%s", currentUser.getLoginName()));

	}
	/**************************************************************************************************************************/

	@Override
	@Transactional
	public Response getAssigneeByUserId(String processId) {
		return getAssigneeByUserId(processId, currentUser.getUserId());
	}

	@Override
	@Transactional
	public Response getAssigneeByUserId(String processId, String userId) {
		Response response = new Response();
		boolean isShow = false;
		Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), processId);
		List<ShenBaoInfo> shenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
		User loginUser = userRepo.findById(userId);
		
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
				if(role.getRoleName().equals(BasicDataConfig.KeZhang)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask10")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.PingShenRenYuan)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask12") || shenBaoInfo.get(0).getThisTaskName().equals("usertask18")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.msFenBanRole)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask14") || shenBaoInfo.get(0).getThisTaskName().equals("usertask20")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.msFaWenRole)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask13") || shenBaoInfo.get(0).getThisTaskName().equals("usertask21")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.JuZhang)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask17") || shenBaoInfo.get(0).getThisTaskName().equals("usertask19")){
			root:for (Role role : loginUser.getRoles()) {
				if(role.getRoleName().equals(BasicDataConfig.FuJuZhang)){
					isShow = true;
					break root;
				}
			}
		}
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask16") || shenBaoInfo.get(0).getThisTaskName().equals("usertask3")
				|| shenBaoInfo.get(0).getThisTaskName().equals("usertask22") ){
			List<HistoricActivityInstance> lists = activitiService.getHistoryInfoByActivity(processId);
			root:for (HistoricActivityInstance historicActivityInstance : lists) {
				if(("usertask3").equals(historicActivityInstance.getActivityId())&&(userId).equals(historicActivityInstance.getAssignee())){
					isShow = true;
					break root;
				}
			}
		}
		
		if(shenBaoInfo.get(0).getThisTaskName().equals("usertask3") && !userList.isEmpty()){
			root:for (Object object : userList) {
				if(userId.equals(object)){
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

	@Override
	@Transactional
	public List<HistoricActivityInstance> getUnfinished(String processId) {
		List<HistoricActivityInstance> haisNext = historyService.createHistoricActivityInstanceQuery().processInstanceId(processId).unfinished().list();//未完成的活动(任务) 
		if(!haisNext.isEmpty()){
		}
		return haisNext;
	}
	
	@SuppressWarnings({ "deprecation" })
	@Override
	@Transactional
	public List<Object> getHistoryInfo(String shenbaoInfoId) {
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);
		
		List<Object> hisList = new ArrayList<>();
//		List<HistoricActivityInstance> lists = activitiService.getHistoryInfoByActivity(shenBaoInfo.getZong_processId());
		List<HistoricProcessInstance> lists1 = activitiService.findHisProcessIntanceList(shenBaoInfo.getZong_processId());
		
		List<HistoricActivityInstance> hais = historyService.createHistoricActivityInstanceQuery().processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask").orderByHistoricActivityInstanceEndTime().asc().list();
		
		Calendar calendar = Calendar.getInstance();
	    calendar.clear();
	    
	    UserUnitInfoDto userUnitInfoDto1 = null;
		List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
		
	    
		for(HistoricProcessInstance list1 : lists1){
			User user = userRepo.findById(list1.getStartUserId());
			
			for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
				if(!userUnitInfoDto.getUserDtos().isEmpty()){
					for (UserDto user1 : userUnitInfoDto.getUserDtos()) {
						if(user1.getId().equals(user.getId())){
							userUnitInfoDto1 =userUnitInfoDto;
						}
					} 
				}
				
					
			}
			Map<String, String> map1 = new HashMap<>();
			map1.put("unit", userUnitInfoDto1.getUnitName());
			map1.put("name", "单位申报");
			map1.put("id", userUnitInfoDto1.getUnitName() +":"+ user.getDisplayName());
			map1.put("endTime", list1.getStartTime().toLocaleString());
			
			map1.put("msg", user.getDisplayName()+"：启动了项目<"+shenBaoInfo.getProjectName()+">的审批流程！");

			calendar.set(list1.getStartTime().getYear(),list1.getStartTime().getMonth(),list1.getStartTime().getDay(),list1.getStartTime().getHours(),list1.getStartTime().getMinutes(),list1.getStartTime().getSeconds());
		    long millis = calendar.getTimeInMillis();
		    map1.put("itemOrder",String.valueOf(millis));
		   
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
						
						map.put("endTime", com.getTime().toLocaleString());
//						map.put("dur", hai.getDurationInMillis().toString());
						map.put("msg", com.getFullMessage());
						
						User user = userRepo.findById(com.getUserId());
						
						for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
							if(!userUnitInfoDto.getUserDtos().isEmpty()){
								for (UserDto user1 : userUnitInfoDto.getUserDtos()) {
									if(user1.getId().equals(user.getId())){
										userUnitInfoDto1 =userUnitInfoDto;
									}
								} 
							}
							
								
						}
						if(user != null){
							if(!user.getRoles().isEmpty()){
								root:for (Role role : user.getRoles()) {
									if(role.getRoleName().equals("局长") || role.getRoleName().equals("副局长")){
										map.put("isJuzhang", "yes");
										break root;
									}
								}
							}
						}
						map.put("unit", userUnitInfoDto1.getUnitName());
						map.put("id",userUnitInfoDto1.getUnitName() +":"+ user.getDisplayName());
						calendar.set(com.getTime().getYear(),com.getTime().getMonth(),com.getTime().getDay(),com.getTime().getHours(),com.getTime().getMinutes(),com.getTime().getSeconds());
					    long millis = calendar.getTimeInMillis();
						map.put("itemOrder",String.valueOf(millis));
						hisList.add(map);
				}
				
			}
            }
		return hisList;
	}
	
	@SuppressWarnings({ "rawtypes" })
	@Override
	@Transactional
	public void yearPlanComplete(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		String str = (String) data.get("str");//具体操作
//		List att = (List) data.get("att");//附件
		String isPass = (String) data.get("isPass");//动作
		
		Map<String, Object> variables = new HashMap<String, Object>();
		if(isPass != ""){//其他方式通过
			variables.put("isPass", isPass);
		}else if(str.equals("tuiwen")){
			variables.put("isPass", 3);
		}else if(isPass == "" || isPass ==null){//正常通过
			variables.put("isPass", 1);
		} 
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);
		
		List<Task> task = null;
		
		//当前流程下，当前登录人员的任务
		task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		if(task.size() == 0 ){
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();
			
		}
		//设置批注的用户ID
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		//添加批注
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(),  "批复意见："+msg);
		
		//办结任务
		activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
		activitiService.taskComplete(task.get(0).getId());
		
		shenBaoInfo.setThisTaskId("00000");
		
		if(!("next").equals(str)){
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_tuiwen);
			shenBaoInfo.setProcessStage("已退文");
		}else{
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setProcessStage("已办结");
		}
		shenBaoInfo.setIsIncludLibrary(true);
		shenBaoInfo.setEndDate(new Date());
		shenBaoInfo.setQianshouDate(new Date());
		shenBaoInfo.setComplate(true);
		
		shenBaoInfoRepo.save(shenBaoInfo);
					
		logger.info(String.format("签收或办理下一年度计划,用户名:%s", currentUser.getLoginName()));
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
		
		if(isPass != "" && !str.equals("tuiwen") && !str.equals("reback")){//其他方式通过
			variables.put("isPass", isPass);
		}else if(str.equals("tuiwen")){
			variables.put("isPass", 3);
		}else if(str.equals("reback")){
			isPass = "2";
			variables.put("isPass", 2);
		}else if(str.equals("banjie")){
			isPass = "3";
			variables.put("isPass", 3);
		}else if((isPass == ""|| isPass ==null)&&"next".equals(str)){//正常通过
			variables.put("isPass", 1);
		} 
		
		variables.put("shenpi", 8);
		
		List<String> useridList = new ArrayList<String>();
		List<Org> findProjects = new ArrayList<>();
		Criterion criterion=Restrictions.eq(Org_.name.getName(), "投资科");
		Criterion criterion2=Restrictions.eq(Org_.name.getName(), "局领导");
		if(shenBaoInfo.getThisTaskName().equals("usertask6") || shenBaoInfo.getThisTaskName().equals("usertask7") || shenBaoInfo.getThisTaskName().equals("usertask21") || shenBaoInfo.getThisTaskName().equals("usertask13") || (shenBaoInfo.getThisTaskName().equals("usertask17")&&"5".equals(isPass))
				|| (shenBaoInfo.getThisTaskName().equals("usertask19")&&"5".equals(isPass))){
			Criterion criterion3=Restrictions.eq(Org_.name.getName(), "办公室");
			Criterion criterion4 = Restrictions.or(criterion,criterion2,criterion3);
			findProjects = orgRepo.findByCriteria(criterion4);
		}else if(shenBaoInfo.getThisTaskName().equals("usertask8")){
			Criterion criterion3=Restrictions.eq(Org_.name.getName(), "评审中心");
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
		Set<String> set = new HashSet<>();//同一用户如果有多个角色，同流程下会同时有多个任务，必须去重
		if(!useridList.isEmpty()){//固定会签人员
			if(shenBaoInfo.getThisTaskName().equals("usertask3") && ("5").equals(isPass2)){
				
				useridList.addAll(Arrays.asList(nextUsers.split(",")));
			}
			
			for (String id : useridList) {
				set.add(id);
			}
			
			List<String> list2 = new ArrayList<String> (set);  
			variables.put("userIds", list2);
		}
		
		if(!nextUsers.isEmpty()){//设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		}else if(shenBaoInfo.getThisTaskName().equals("usertask2") && nextUsers.isEmpty()&&"next".equals(str)){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}else if(shenBaoInfo.getThisTaskName().equals("usertask3")&& ("5").equals(isPass2) && nextUsers.isEmpty()){
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}
		
		List<Task> task = null;
		//当前流程下，当前登录人员的任务
		task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		if(task.size() == 0 ){
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();
			
		}
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见："+msg);
		
		if(shenBaoInfo.getThisTaskName().equals("usertask1") &&  isPass !="" || shenBaoInfo.getThisTaskName().equals("usertask5") &&  isPass !="" ){

			processEngine.getProcessEngineConfiguration().getTaskService().setAssignee(task.get(0).getId(), nextUsers);
			processEngine.getProcessEngineConfiguration().getTaskService().setVariable(task.get(0).getId(), "isPass", isPass);

		}else{

			activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
			activitiService.taskComplete(task.get(0).getId(),variables);
		}
		
		//结束上一任务后，当前流程下产生的新任务
		List<Task> tasknew = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).orderByDueDate().desc().list();
		
		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();

		String preTaskName = shenBaoInfo.getThisTaskName();

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
		if(shenBaoInfo.getThisTaskName().equals("usertask16") || str.equals("banjie")){
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setProcessStage("已办结");
			shenBaoInfo.setIsIncludLibrary(true);
			shenBaoInfo.setComplate(true);
			shenBaoInfo.setEndDate(new Date());
		}else if(str.equals("tuiwen")){
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
			shenBaoInfo.setEndDate(new Date());
		}else{
		    
//			shenBaoInfo.setThisTaskId(task.get(0).getId());
			shenBaoInfo.setThisTaskName(tasknew.get(0).getTaskDefinitionKey());
			shenBaoInfo.setProcessStage(tasknew.get(0).getName());
		}
		
		shenBaoInfoRepo.save(shenBaoInfo);

		logger.info(String.format("办结或阅批任务,用户名:%s", currentUser.getLoginName()));

		// 准备短信内容
		List<SendMsg> msgs = new ArrayList<>();
		// 从配置文件中拿到短信模板并替换其中的占位符，若不能根据preTaskName拿到模板，则使用default模板
		final String content = String.format(shenbaoSMSContent.get(preTaskName)==null?shenbaoSMSContent.get("default"):shenbaoSMSContent.get(preTaskName), shenBaoInfo.getProjectName());

		if ("usertask16".equalsIgnoreCase(preTaskName)) { // 到达最后一个节点的情况下，发送完结的短信给到编制单位负责人

			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), content));

		} else if ("tuiwen".equalsIgnoreCase(str)) { 	// 退文的情况下，发送推文短信给到编制单位负责人

			String tuiwenCont = String.format(shenbaoSMSContent.get("tuiwen"), shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), tuiwenCont));

		} else if(shenBaoInfo.getThisTaskName().equals("usertask1") &&  isPass !=""
				|| shenBaoInfo.getThisTaskName().equals("usertask5") &&  isPass !="" ) {	//

			User user = userService.findById(nextUsers);
			msgs.add(new SendMsg(user.getMobilePhone(), content));

		} else {
			msgs = set.stream()
					.filter(userId -> this.getAssigneeByUserId(shenBaoInfo.getZong_processId(), userId).isSuccess())	// 过滤出到达审批状态的用户
					.map(userId -> userService.findById(userId))												// 查询出用户对象
					.filter(user -> StringUtils.isNotBlank(user.getMobilePhone()))	// 过滤没有设置手机号的用户
					.map(user -> new SendMsg(user.getMobilePhone(), content))		// 将用户对象转换成SendMsg对象
					.collect(Collectors.toList());
		}

		// 开始发送短信通知
		try {
			smsService.insertDownSms(null, msgs.toArray(new SendMsg[]{}));
		} catch (SMSException e) {
			logger.error("发送短信异常：" + e.getMessage(), e);
		}

	}

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional
	public void taskPinglun(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		List att = (List) data.get("att");//附件
		
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		List<Task> task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId()).taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		
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
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "阅批意见："+msg);
		
		logger.info(String.format("填写批注,用户名:%s", currentUser.getLoginName()));


	}


	@SuppressWarnings({ })
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj,String str) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		Set<String> set = new HashSet<>();  
		List<HistoricTaskInstance> his = historyService.createHistoricTaskInstanceQuery().taskAssignee(currentUser.getUserId()).finished().list();
		for (HistoricTaskInstance hisTask : his) {
			set.add((String)hisTask.getProcessInstanceId());
		}
		List<String> ids2 = new ArrayList<>();
		ids2.addAll(set);
		List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj,ids2,str).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
		
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenBaoInfoDtos);
		
		return pageModelDto;
	}

	@Override
	public List<ShenBaoInfoDto> findByDto(ODataObj odataObj) {
		return null;
	}

}

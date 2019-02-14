package cs.service.impl;

import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.huasisoft.portal.model.Backlog;
import com.huasisoft.portal.util.HuasisoftUtil;
import com.sn.framework.common.IdWorker;
import com.sn.framework.common.ObjectUtils;
import com.sn.framework.common.StringUtil;
import com.sn.framework.odata.OdataFilter;
import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.TodoNumberUtil;
import cs.common.Util;
import cs.common.utils.WorkDayUtil;
import cs.domain.*;
import cs.domain.framework.Org;
import cs.domain.framework.Org_;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.DomainDto.*;
import cs.model.DtoMapper.IMapper;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.framework.OrgDto;
import cs.model.framework.UserDto;
import cs.repository.framework.OrgRepo;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.interfaces.WorkdayRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.common.BasicDataService;
import cs.service.framework.OrgService;
import cs.service.framework.UserService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;
import cs.service.sms.SmsService;
import cs.service.sms.exception.SMSException;
import junit.framework.Assert;

import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.*;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.formula.functions.WeekNum;
import org.hibernate.criterion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import javax.transaction.Transactional;
import java.text.SimpleDateFormat;

import java.util.*;
import java.util.stream.Collectors;

import static cs.common.BasicDataConfig.*;

/**
 * @Description: 审批流程服务层
 * @author: neo @Date：2018年4月10日 @version：0.1
 */
@Service
public class ProcessServiceImpl extends AbstractServiceImpl<ShenBaoInfoDto, ShenBaoInfo, String>
		implements ProcessService {
	private static Logger logger = Logger.getLogger(ProcessServiceImpl.class);

	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private ShenBaoInfoRepoImpl shenBaoInfoRepoImpl;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private ProcessEngine processEngine;
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
	@Autowired
	private SmsService smsService;
	@Resource
	private Map<String, String> shenbaoSMSContent;
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private OrgService orgService;
	@Autowired
	private WorkdayRepo workdayrepo;
	@Autowired
	private BasicDataService basicDataService;
    @Value("${projectShenBaoStage_JYS}")
    private String projectShenBaoStage_JYS;//申报阶段：建议书
    @Value("${projectShenBaoStage_KXXYJBG}")
    private String projectShenBaoStage_KXXYJBG;//申报阶段：可行性研究报告
    @Value("${projectShenBaoStage_CBSJYGS}")
    private String projectShenBaoStage_CBSJYGS;//申报阶段：初步设计与概算
    @Value("${projectShenBaoStage_ZJSQBG}")
    private String projectShenBaoStage_ZJSQBG;//申报阶段：资金申请报告
    @Value("${projectShenBaoStage_planReach}")
    private String projectShenBaoStage_planReach;//申报阶段：计划下达
    @Value("${projectShenBaoStage_2}")
    private String projectShenBaoStage_2;
    @Value("${projectShenBaoStage_3}")
    private String projectShenBaoStage_3;
    @Value("${projectShenBaoStage_4}")
    private String projectShenBaoStage_4;
    @Value("${projectShenBaoStage_6}")
    private String projectShenBaoStage_6;
    @Value("${projectShenBaoStage_7}")
    private String projectShenBaoStage_7;
    @Value("${sysPath}")
    private String sysPath;
	@Value("${isPushOA}")
	private Boolean isPushOA;



	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		logger.info("查询工作台任务数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str, String leixin) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		List<String> ids = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		for (Role role : user.getRoles()) {
			ids.add(role.getId());
		}

		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		List<Task> tasks2 = null;
		ODataObj odataObj2 = new ODataObj();
		ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
		filterItem.setField("name");
		filterItem.setOperator("eq");
		filterItem.setValue("投资科");
		odataObj2.getFilter().add(filterItem);
		PageModelDto<OrgDto> orgs = orgService.get(odataObj2);
		List<UserDto> users = orgs.getValue().get(0).getUserDtos();
		if ("geren".equals(leixin)) {
			tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
			tasks1.addAll(tasks2);
		} else {
			for (int i = 0; i < users.size(); i++) {
				UserDto array_element = users.get(i);
				tasks2 = activitiService.getPersonalTask(array_element.getId());
				tasks1.addAll(tasks2);
			}

		}

		List<String> taskIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			taskIds.add(processId);
		}
		odataObj.setTop(0);
		List<ShenBaoInfoDto> ourShenBaoInfoDtos = new ArrayList<>();
		if (!taskIds.isEmpty()) {
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj, taskIds, str).stream()
					.map(mapper::toDto).collect(Collectors.toList());
			//个人审批待办
			if ("geren".equals(leixin)) {
				for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
					ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
					if (("audit").equals(str)) {
						Response response = this.getAssigneeByUserId(array_element.getZong_processId());
						if (response.isSuccess() == true || ("usertask1").equals(array_element.getThisTaskName())
								|| ("usertask5").equals(array_element.getThisTaskName())) {
							ourShenBaoInfoDtos.add(array_element);
						}
					} else {
						Response response = this.getAssigneeByUserId_plan(array_element.getZong_processId());
						if (response.isSuccess() == true || ("usertask1").equals(array_element.getThisTaskName())
								|| ("usertask2").equals(array_element.getThisTaskName())) {
							ourShenBaoInfoDtos.add(array_element);
						}
					}

				}

			} else {
				for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
					ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
					ourShenBaoInfoDtos.add(array_element);

				}
			}

			pageModelDto.setCount(ourShenBaoInfoDtos.size());
			pageModelDto.setValue(ourShenBaoInfoDtos);
		}

		return pageModelDto;

	}

	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		List<String> ids = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		for (Role role : user.getRoles()) {
			ids.add(role.getId());
		}

		//查询候选组人员任务
		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		//查询登录人员任务
		List<Task> tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
		tasks1.addAll(tasks2);

		List<String> taskIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			taskIds.add(processId);
		}
		//根据任务ID查询待办申报信息
		if (!taskIds.isEmpty()) {
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj, taskIds, str).stream()
					.map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());

			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(shenBaoInfoDtos);
		}

		return pageModelDto;

	}

	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getToDo_yuepi(ODataObjNew odataObj) {
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
		odataObj.setTop(0);
		List<ShenBaoInfoDto> ourShenBaoInfoDtos = new ArrayList<>();
		if (!taskIds.isEmpty()) {
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata3(odataObj, taskIds).stream()
					.map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());

			//过滤出审批类
			for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
				ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
				if (array_element.getProjectShenBaoStage().equals(projectShenBaoStage_KXXYJBG)
						|| array_element.getProjectShenBaoStage().equals(projectShenBaoStage_XMJYS)
						|| array_element.getProjectShenBaoStage().equals(projectShenBaoStage_ZJSQBG)
						|| array_element.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS)
						||array_element.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)) {
					Response response = this.getAssigneeByUserId(array_element.getZong_processId());
					if (response.isSuccess() == false && !("usertask1").equals(array_element.getThisTaskName())
							&& !("usertask5").equals(array_element.getThisTaskName())) {
						ourShenBaoInfoDtos.add(array_element);
					}
				} else if (array_element.getProjectShenBaoStage()
						.equals(BasicDataConfig.projectShenBaoStage_planReach)) {
					Response response = this.getAssigneeByUserId_plan(array_element.getZong_processId());
					if (response.isSuccess() == false && !("usertask1").equals(array_element.getThisTaskName())
							&& !("usertask2").equals(array_element.getThisTaskName())) {
						ourShenBaoInfoDtos.add(array_element);
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
	public PageModelDto<ShenBaoInfoDto> getTodoTask_feedback(ODataObjNew odataObj) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();

		List<String> processInstIdList = new ArrayList<>();
		List<Task> taskList = taskService.createTaskQuery().processDefinitionKey("ShenpiMonitor_fjxm")
				.taskCandidateUser(currentUser.getUserId()).orderByTaskCreateTime().desc().list();
		List<Task> taskList2 = taskService.createTaskQuery().processDefinitionKey("ShenpiMonitor_fjxm")
				.taskAssignee(currentUser.getUserId()).orderByTaskCreateTime().desc().list();
		taskList.addAll(taskList2);
		//未完结登陆人员的流程ID
		taskList.forEach(x -> {
			String processId = x.getProcessInstanceId();
			if (StringUtil.isNotBlank(processId)) {
				processInstIdList.add(processId);
			}
		});

		if (!CollectionUtils.isEmpty(processInstIdList)) {
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl
					.getShenBaoInfoDtos_feedback(odataObj, processInstIdList).stream().map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());

			pageModelDto.setCount(shenBaoInfoDtos.size());
			pageModelDto.setValue(shenBaoInfoDtos);
		}

		return pageModelDto;
	}

	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getComplete_feedback(ODataObjNew odataObj) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();

		List<String> processInstIdList = new ArrayList<>();
		List<HistoricTaskInstance> taskList = historyService.createHistoricTaskInstanceQuery()
				.processDefinitionKey("ShenpiMonitor_fjxm").taskCandidateUser(currentUser.getUserId()).finished()
				.list();
		List<HistoricTaskInstance> taskList2 = historyService.createHistoricTaskInstanceQuery()
				.processDefinitionKey("ShenpiMonitor_fjxm").taskAssignee(currentUser.getUserId()).finished().list();
		taskList.addAll(taskList2);
		taskList.forEach(x -> {
			String processId = x.getProcessInstanceId();
			if (StringUtil.isNotBlank(processId)) {
				processInstIdList.add(processId);
			}
		});

		if (!CollectionUtils.isEmpty(processInstIdList)) {
			List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl
					.getShenBaoInfoDtos_feedback(odataObj, processInstIdList).stream().map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());

			pageModelDto.setCount(shenBaoInfoDtos.size());
			pageModelDto.setValue(shenBaoInfoDtos);
		}

		return pageModelDto;
	}

	/******************************************************** -plan- ******************************************************************/
	//弃用
	@Override
	@Transactional
	public Response getAssigneeByUserId_plan(String processId) {
		Response response = new Response();
		boolean isShow = false;
		Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), processId);
		List<ShenBaoInfo> shenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);

		List<Object> userList = new ArrayList<>();
		// if(shenBaoInfo.get(0).getThisTaskName().equals("usertask3")){
		// root:for (Role role : loginUser.getRoles()) {
		// if(role.getRoleName().equals(BasicDataConfig.KeZhang)){
		// isShow = true;
		// break root;
		// }
		// }
		// }

		if ((shenBaoInfo.get(0).getThisTaskName().equals("usertask4")
				|| shenBaoInfo.get(0).getThisTaskName().equals("usertask5")) && !userList.isEmpty()) {
			root: for (Object object : userList) {
				if (currentUser.getUserId().equals(object)) {
					isShow = true;
					break root;
				}
			}
		}

		if (isShow == true) {
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
		String str = (String) data.get("str");// 具体操作
		ShenBaoInfoDto shenbaoinfoDto = JSON.parseObject(JSON.toJSONString(data.get("shenbaoinfo")),
				ShenBaoInfoDto.class);
		String nextUsers = (String) data.get("nextUsers");// 下一经办人
		String isPass = (String) data.get("isPass");// 下一经办人
		String isPass2 = (String) data.get("isPass2");// 下一经办人
	
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		Map<String, Object> variables = new HashMap<String, Object>();

		// 判断具体操作
		if (isPass != "" && !str.equals("reback") && !str.equals("tuiwen")) {// 其他方式通过
			variables.put("isPass", isPass);
		} else if (str.equals("tuiwen")) {
			variables.put("isPass", 3);
		} else if (str.equals("reback")) {
			variables.put("isPass", 2);
		} else if ((isPass == "" || isPass == null) && "next".equals(str)) {// 正常通过
			variables.put("isPass", 1);
		}

		variables.put("shenpi", 8);
		Project project = projectRepo.findById(shenBaoInfo.getProjectId());
		
		List<String> taskUsers = Arrays.asList(nextUsers.split(","));
		
		if(shenBaoInfo.getThisTaskName().equals("usertask1") || str.equals("reback")){
			List<Org> findProjects = new ArrayList<>();
			Criterion criterion = Restrictions.eq(Org_.name.getName(), "投资科");
//			Criterion criterion2 = Restrictions.eq(Org_.name.getName(), "局领导");
			Criterion criterion3 = Restrictions.or(criterion);

			findProjects = orgRepo.findByCriteria(criterion3);
			Set set = new HashSet<>();// 同一用户如果有多个角色，同流程下会同时有多个任务，必须去重
			for (Org org : findProjects) {
				for (User user : org.getUsers()) {
					set.add(user.getId().trim());
				}
			}
			List<String> list1 = new ArrayList<String>(set);
			if (!list1.isEmpty()) {// 固定会签人员
				variables.put("userIds", list1);
				variables.put("nextUsers", list1);
				taskUsers = list1;
			}
			
		}else{
			if (!nextUsers.isEmpty()) {// 设置流程变量--下一任务处理人
				variables.put("userIds", taskUsers);
				variables.put("nextUsers", nextUsers);
			} else if (nextUsers.isEmpty() && shenBaoInfo.getThisTaskName().equals("usertask4") && "next".equals(str) ) {
				throw new IllegalArgumentException(String.format("请选择人员后提交！"));
			}
		}
		
		List<Task> task = null;

		// 当前流程下，当前登录人员的任务--会签模式
		task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		if (task.size() == 0) {
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();

		}
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		if (shenBaoInfo.getThisTaskName().equals("usertask5")&& str.equals("next")) {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "办结意见：" + msg);
		} else if (str.equals("tuiwen")) {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "退文意见：" + msg);
		} else {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);
		}
//		if(isPushOA){
//			//处理统一代办--查询--完成--删除
//			try {
//				String eventIds = (String) taskService.getVariable(shenBaoInfo.getThisTaskId(), "eventIds");
//				TodoNumberUtil.handleTodoMasg(eventIds);
//			} catch (Exception e) {
//				logger.info("task id not found");
//			}
//		}
		
		activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
		activitiService.taskComplete(task.get(0).getId(), variables);
	
		
		// 结束上一任务后，当前流程下产生的新任务
		List<Task> tasknew = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.orderByDueDate().desc().list();

		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();

		// 如果有附件
		shenBaoInfo.getAttachments().clear();
		if (shenbaoinfoDto.getAttachmentDtos().size() > 0) {
			shenbaoinfoDto.getAttachmentDtos().forEach(x -> {// 添加新附件
				Attachment attachment = new Attachment();
				attachmentMapper.buildEntity(x, attachment);
				attachment.setCreatedBy(shenBaoInfo.getCreatedBy());
				attachment.setModifiedBy(shenBaoInfo.getModifiedBy());
				shenBaoInfo.getAttachments().add(attachment);
			});
		}

		User user = userService.findById(nextUsers);
		String preTaskName = shenBaoInfo.getThisTaskName();
		String displayName = null;
		if(user != null) displayName = user.getDisplayName();
		// 准备短信内容
		List<SendMsg> msgs = new ArrayList<>();
		// 从配置文件中拿到短信模板并替换其中的占位符，若不能根据preTaskName拿到模板，则使用default模板
		final String content = String.format(shenbaoSMSContent.get(preTaskName) == null
				? shenbaoSMSContent.get("default") : shenbaoSMSContent.get(preTaskName), displayName,shenBaoInfo.getProjectName(),getStageType(shenBaoInfo.getProjectShenBaoStage()),shenBaoInfo.getProcessStage());

		if ("usertask5".equalsIgnoreCase(preTaskName) || str.equals("next")) { // 到达最后一个节点的情况下，发送完结的短信给到编制单位负责人
			String banjieContent = String.format(shenbaoSMSContent.get("usertask16"),shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), banjieContent));

		} else if ("tuiwen".equalsIgnoreCase(str)) { // 退文的情况下，发送推文短信给到编制单位负责人

			String tuiwenCont = String.format(shenbaoSMSContent.get("tuiwen"), shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), tuiwenCont));

		} else if (shenBaoInfo.getThisTaskName().equals("usertask1") && isPass != ""
				) { //
			msgs.add(new SendMsg(user.getMobilePhone(), content));

		} else {
			msgs = taskUsers.stream()
					//.filter(userId -> this.getAssigneeByUserId(shenBaoInfo.getZong_processId(), userId).isSuccess()) // 过滤出到达审批状态的用户
					.map(userId -> userService.findById(userId)) // 查询出用户对象
					.filter(user1 -> StringUtils.isNotBlank(user1.getMobilePhone())) // 过滤没有设置手机号的用户
					.map(user2 -> new SendMsg(user2.getMobilePhone(), content)) // 将用户对象转换成SendMsg对象
					.collect(Collectors.toList());
		}
		
		
		// 开始发送短信通知
		try {
			smsService.insertDownSms(null, msgs.toArray(new SendMsg[] {}));
		} catch (SMSException e) {
			logger.error("发送短信异常：" + e.getMessage(), e);
		}
		
		
		if (shenBaoInfo.getThisTaskName().equals("usertask5") && "next".equals(str) ) {
			shenBaoInfo.setXdPlanReach_gtzj(shenbaoinfoDto.getXdPlanReach_gtzj());
			shenBaoInfo.setXdPlanReach_ggys(shenbaoinfoDto.getXdPlanReach_ggys());
			//累计安排总资金累加
			shenBaoInfo.setApInvestSum(shenBaoInfo.getApInvestSum()+shenbaoinfoDto.getXdPlanReach_gtzj()+shenbaoinfoDto.getXdPlanReach_ggys());
			//累计安排 公共预算累加
			shenBaoInfo.setApPlanReach_ggys(shenBaoInfo.getApPlanReach_ggys()+shenbaoinfoDto.getXdPlanReach_ggys());
			//累计安排 国土资金累加
			shenBaoInfo.setApPlanReach_gtzj(shenBaoInfo.getApPlanReach_gtzj()+shenbaoinfoDto.getXdPlanReach_gtzj());
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setProcessStage("已办结");
//			shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
			shenBaoInfo.setPifuDate(new Date());
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			project.setIsIncludLibrary(true);
			
			Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenBaoInfo.getProjectId());
			Criterion criterion1 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_nextYearPlan);
			Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.planYear.getName(), shenBaoInfo.getPlanYear());
			Criterion criterion3 = Restrictions.and(criterion, criterion1,criterion2);
			List<ShenBaoInfo> nextyearplan = shenBaoInfoRepo.findByCriteria(criterion3);
			if(!CollectionUtils.isEmpty(nextyearplan)){
				nextyearplan.get(0).setApInvestSum(nextyearplan.get(0).getApInvestSum() +shenbaoinfoDto.getXdPlanReach_gtzj() +shenbaoinfoDto.getXdPlanReach_ggys());
				shenBaoInfoRepo.save(nextyearplan.get(0));
			}
		
		} else if (str.equals("tuiwen")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
//			shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
//			shenBaoInfo.setComplate(true);
		} else {

			shenBaoInfo.setThisTaskId(tasknew.get(0).getId());
			shenBaoInfo.setThisTaskName(tasknew.get(0).getTaskDefinitionKey());
			shenBaoInfo.setProcessStage(tasknew.get(0).getName());
			//对接OA工作圈
//			if(isPushOA){
//				System.out.println("=========1>"+isPushOA);
//				StringBuffer sb = new StringBuffer();
//				for (int i = 0; i < taskUsers.size(); i++) {
//					String array_element = taskUsers.get(i);
//					System.out.println("=========2>"+array_element);
//					Backlog bl = new Backlog();
//					bl.setEventId(UUID.randomUUID().toString());
//					bl.setBureauName("发展和财政局");
//					bl.setSendDeptName("投资科（重大项目办）");
//					bl.setBureauName("发展和财政局");
//					bl.setDeptName("投资科（重大项目办）");
//					sb.append(bl.getEventId()+",");
////					this.todoShenbaoInfo(shenBaoInfo ,array_element,bl);
//					System.out.println("=========3>"+array_element);
//				}
//				activitiService.setTaskProcessVariable(tasknew.get(0).getId(), "eventIds", sb.toString());
//			}
			
		}
		projectRepo.save(project);
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
		boolean isShow = true;
		// Criterion criterion =
		// Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), processId);
		// List<ShenBaoInfo> shenBaoInfo =
		// shenBaoInfoRepo.findByCriteria(criterion);
		// User loginUser = userRepo.findById(userId);
		//
		// List<HistoricVariableInstance> list =historyService
		// .createHistoricVariableInstanceQuery()//创建一个历史的流程变量查询对象
		// .variableName("nextUsers")
		// .processInstanceId(processId)
		// .list();
		// List<Object> userList = new ArrayList<>();
		// for (HistoricVariableInstance historicVariableInstance : list) {
		// userList =
		// Arrays.asList(historicVariableInstance.getValue().toString().split(","));
		// System.out.println(historicVariableInstance);
		// }
		//// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask2") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask6")
		//// || shenBaoInfo.get(0).getThisTaskName().equals("usertask7") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask8")) {
		//// root:
		//// for (Role role : loginUser.getRoles()) {
		//// if (role.getRoleName().equals(BasicDataConfig.KeZhang)) {
		//// isShow = true;
		//// break root;
		//// }
		//// }
		//// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask10")) {
		// root:
		// for (Role role : loginUser.getRoles()) {
		// if (role.getRoleName().equals(BasicDataConfig.PingShenRenYuan)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask12") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask18")) {
		// root:
		// for (Role role : loginUser.getRoles()) {
		// if (role.getRoleName().equals(BasicDataConfig.msFenBanRole)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask14") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask20")) {
		// root:
		// for (Role role : loginUser.getRoles()) {
		// if (role.getRoleName().equals(BasicDataConfig.msFaWenRole)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask13") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask21")) {
		// root:
		// for (Role role : loginUser.getRoles()) {
		// if (role.getRoleName().equals(BasicDataConfig.JuZhang)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask17") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask19")) {
		// root:
		// for (Role role : loginUser.getRoles()) {
		// if (role.getRoleName().equals(BasicDataConfig.FuJuZhang)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask16") ||
		// shenBaoInfo.get(0).getThisTaskName().equals("usertask3")
		// || shenBaoInfo.get(0).getThisTaskName().equals("usertask22")) {
		// List<HistoricActivityInstance> lists =
		// activitiService.getHistoryInfoByActivity(processId);
		// root:
		// for (HistoricActivityInstance historicActivityInstance : lists) {
		// if (("usertask3").equals(historicActivityInstance.getActivityId()) &&
		// (userId).equals(historicActivityInstance.getAssignee())) {
		// isShow = true;
		// break root;
		// }
		// }
		// }
		//
		// if (shenBaoInfo.get(0).getThisTaskName().equals("usertask3") &&
		// !userList.isEmpty()) {
		// root:
		// for (Object object : userList) {
		// if (userId.equals(object)) {
		// isShow = true;
		// break root;
		// }
		// }
		// }

		if (isShow == true) {
			response.setSuccess(true);
		}

		return response;
	}

	@Override
	@Transactional
	public List<HistoricActivityInstance> getUnfinished(String processId) {
		List<HistoricActivityInstance> haisNext = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(processId).unfinished().list();// 未完成的活动(任务)
		if (!haisNext.isEmpty()) {
		}
		return haisNext;
	}

	@SuppressWarnings({ "deprecation" })
	@Override
	@Transactional
	public List<Object> getHistoryInfo(String shenbaoInfoId) {
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		List<Object> hisList = new ArrayList<>();
		List<HistoricProcessInstance> lists1 = new ArrayList<HistoricProcessInstance>();
		List<HistoricActivityInstance> hais = new ArrayList<HistoricActivityInstance>();
		//查询活动历史及一般历史
		if(null != shenBaoInfo.getZong_processId()){
			lists1 = activitiService
					.findHisProcessIntanceList(shenBaoInfo.getZong_processId());
			hais = historyService.createHistoricActivityInstanceQuery()
					.processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask")
					.orderByHistoricActivityInstanceStartTime().asc().list();
		}

		//数据整形
		for (HistoricProcessInstance list1 : lists1) {
			UserUnitInfoDto userUnitInfo = userUnitInfoService.getByUserId(list1.getStartUserId());
			User user = userRepo.findById(list1.getStartUserId());
			Map<String, String> map1 = new HashMap<>();

			if (userUnitInfo != null) {
				map1.put("id", userUnitInfo.getUnitName() + ":" + user.getDisplayName());
			} else {
				map1.put("id", user.getDisplayName());
			}
			map1.put("name", "单位申报");
			map1.put("endTime", list1.getStartTime().toLocaleString());

			map1.put("msg", "发起申请");

			hisList.add(map1);
		}

		// 3）查询每个历史任务的批注
		for (HistoricActivityInstance hai : hais) {
			String historytaskId = hai.getTaskId();
			List<Comment> comments = taskService.getTaskComments(historytaskId);

			//按批注时间正序排列
			comments.sort(new Comparator<Comment>() {
				@Override
				public int compare(Comment o1, Comment o2) {
					Long d1 = o1.getTime().getTime();
					Long d2 = o2.getTime().getTime();
					return d1.intValue() - d2.intValue();
				}
			});

			// 4）如果当前任务有批注信息，添加到集合中
			if (comments != null && comments.size() > 0) {
				for (Comment com : comments) {
					Map<String, String> map = new HashMap<>();

					map.put("name", hai.getActivityName());

					map.put("endTime", com.getTime().toLocaleString());
					// map.put("dur", hai.getDurationInMillis().toString());
					map.put("msg", com.getFullMessage());
					
					List<Attachment> atts = new ArrayList<>();
					if(shenBaoInfo.getAttachments().size() >0 && !shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)
							&& !shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_planReach)){
						for (int i = 0; i < shenBaoInfo.getAttachments().size(); i++) {
							Attachment array_element = shenBaoInfo.getAttachments().get(i);
							if(com.getUserId().equals(array_element.getCreatedBy())){
								atts.add(array_element);
							}
						}
						
						map.put("atts", atts.toString());
					}
					
					//领导意见标识
					User user = userRepo.findById(com.getUserId());
					if (user != null) {
						if (!user.getRoles().isEmpty()) {
							root: for (Role role : user.getRoles()) {
								if (role.getRoleName().equals("局长") || role.getRoleName().equals("副局长")) {
									map.put("isJuzhang", "yes");
									break root;
								}
							}
						}
						if (!user.getRoles().isEmpty()) {
							root: for (Role role : user.getRoles()) {
								if (role.getRoleName().equals("评审中心评审人员")) {
									map.put("isPingshen", "yes");
									break root;
								}
							}
						}
					}
					if (user.getOrgs() != null && user.getOrgs().size() > 1) {
						StringBuffer sBuffer = new StringBuffer();
						for (int i = 0; i < user.getOrgs().size(); i++) {
							Org array_element = user.getOrgs().get(i);
							sBuffer.append(array_element.getName() + ":");
						}
						map.put("id", sBuffer + user.getDisplayName());
					} else if (user.getOrgs() != null && user.getOrgs().size() == 1) {
						map.put("id", user.getOrgs().get(0).getName() + ":" + user.getDisplayName());
					} else {
						map.put("id", user.getDisplayName());
					}

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
		String str = (String) data.get("str");// 具体操作
		// List att = (List) data.get("att");//附件
		String isPass = (String) data.get("isPass");// 动作

		Map<String, Object> variables = new HashMap<String, Object>();
		if (isPass != "") {// 其他方式通过
			variables.put("isPass", isPass);
		} else if (str.equals("tuiwen")) {
			variables.put("isPass", 3);
		} else if (isPass == "" || isPass == null) {// 正常通过
			variables.put("isPass", 1);
		}
		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		List<Task> task = null;

		// 当前流程下，当前登录人员的任务
		task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		if (task.size() == 0) {
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();

		}
		// 设置批注的用户ID
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		// 添加批注
//		if(isPushOA){
//			//处理统一代办--查询--完成--删除
//			try {
//				String eventIds = (String) taskService.getVariable(shenBaoInfo.getThisTaskId(), "eventIds");
//				TodoNumberUtil.handleTodoMasg(eventIds);
//			} catch (Exception e) {
//				logger.info("task id not found");
//			}
//		}
	
		shenBaoInfo.setThisTaskId("00000");
		shenBaoInfo.setQianshouDate(new Date());// 签收时间
		shenBaoInfo.setReceiver(currentUser.getUserId());// 签收人
		if (!("next").equals(str)) {
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_tuiwen);
			shenBaoInfo.setProcessStage("已退文");
			
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "退文意见：" + msg);
			// 退文时，撤销当前流程
//			runtimeService.deleteProcessInstance(shenBaoInfo.getZong_processId(), "已退文");
		} else {
			shenBaoInfo.setThisTaskName("已签收");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setProcessStage("已签收");
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);
			// 生成项目编码
			if (StringUtils.isBlank(shenBaoInfo.getProjectNumber())) {
				BasicData basicData = basicDataService.findById(shenBaoInfo.getProjectIndustry());
				int projectSequenceNum = projectService.getProjectSequenceNumberInYear(shenBaoInfo.getProjectId());
				String projectNumber = Util.getProjectNumber(shenBaoInfo.getProjectType(), basicData,
						projectSequenceNum);
				shenBaoInfo.setProjectNumber(projectNumber);

				projectService.updateProjectNumber(shenBaoInfo.getProjectId(), projectNumber);
			}

		}
		
		// 办结任务
		activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
		activitiService.taskComplete(task.get(0).getId());
		
		Project project = projectRepo.findById(shenBaoInfo.getProjectId());
		project.setIsIncludLibrary(true);
//		shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
		shenBaoInfo.setAuditState(BasicDataConfig.auditState_noAudit);
		shenBaoInfo.setQianshouDate(new Date());
//		shenBaoInfo.setComplate(true);
		projectRepo.save(project);
		shenBaoInfoRepo.save(shenBaoInfo);

		logger.info(String.format("签收或办理下一年度计划,用户名:%s", currentUser.getLoginName()));
	}

	@SuppressWarnings({ "rawtypes", "deprecation" })
	@Override
	@Transactional
	public void taskComplete(Map data) {
		String msg = (String) data.get("msg");
		String str = (String) data.get("str");// 具体操作
		ShenBaoInfoDto shenbaoinfoDto = JSON.parseObject(JSON.toJSONString(data.get("shenbaoinfo")),
				ShenBaoInfoDto.class);
		String nextUsers = (String) data.get("nextUsers");// 下一经办人
		String isPass = (String) data.get("isPass");// 下一经办人

		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoinfoDto.getId());
		ProjectDto projectDto = JSON.parseObject(JSON.toJSONString(data.get("project")),
				ProjectDto.class);

		Map<String, Object> variables = new HashMap<String, Object>();
		
		// 判断具体操作
		if (shenBaoInfo.getThisTaskName().equals("usertask23") && !("5").equals(isPass)) {
			String isOk = "1";
			variables.put("isOk", isOk);
		}

		if (isPass != "" && !str.equals("tuiwen") && !str.equals("reback")) {// 其他方式通过

		} else if (str.equals("tuiwen")) {
			isPass = "3";
		} else if (str.equals("reback")) {
			isPass = "2";
		} else if (str.equals("banjie")) {
			isPass = "3";
		}

		variables.put("shenpi", 8);

		List<String> useridList = new ArrayList<String>();

		Set<String> set = new HashSet<>();// 同一用户如果有多个角色，同流程下会同时有多个任务，必须去重
		if (str.equalsIgnoreCase("reback")) {
			List<HistoricActivityInstance> hais = historyService.createHistoricActivityInstanceQuery()
					.processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask")
					.orderByHistoricActivityInstanceEndTime().asc().list();
			if (shenbaoinfoDto.getThisTaskName().equals("usertask3") || shenbaoinfoDto.getThisTaskName().equals("usertask23")) {// 经办人退给1
				for (HistoricActivityInstance hai : hais) {
					if (hai.getActivityId().equals("usertask1")) {
						nextUsers = hai.getAssignee();
					}
				}
			}
			else if (shenbaoinfoDto.getThisTaskName().equals("usertask13") || shenbaoinfoDto.getThisTaskName().equals("usertask17") ||shenbaoinfoDto.getThisTaskName().equals("usertask19") || shenbaoinfoDto.getThisTaskName().equals("usertask21")) {// 局领导退给科员或者科长
				
				User user = userRepo.findById(nextUsers.toString());

				for (int i = 0; i < user.getRoles().size(); i++) {
					Role array_element = user.getRoles().get(i);
					if("科长".equals(array_element.getRoleName())){
						isPass = "7";
						break;
					}
				}
				
				
			}
			else {
				for (HistoricActivityInstance hai : hais) {
					if (hai.getActivityId().equals("usertask3")) {
						nextUsers = hai.getAssignee();
					}
				}
			}
		}

		variables.put("isPass", isPass);
		useridList.addAll(Arrays.asList(nextUsers.split(",")));

		for (String id : useridList) {
			set.add(id);
		}

		List<String> list2 = new ArrayList<String>(set);
		variables.put("userIds", list2);

		if (!nextUsers.isEmpty()) {// 设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		}
//		if(isPushOA){
//			//处理统一代办--查询--完成--删除
//			try {
//				String eventIds = (String) taskService.getVariable(shenBaoInfo.getThisTaskId(), "eventIds");
//				TodoNumberUtil.handleTodoMasg(eventIds);
//			} catch (Exception e) {
//				logger.info("task id not found");
//			}
//		}
		shenBaoInfo.setThisUser(nextUsers);
		List<Task> task = null;
		// 当前流程下，当前登录人员的任务
		task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
		if (task.size() == 0) {
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();

		}
		Authentication.setAuthenticatedUserId(currentUser.getUserId());

		Task monitorTask;
		if (StringUtil.isNoneBlank(shenBaoInfo.getMonitor_processId())) {
			monitorTask = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getMonitor_processId())
					.taskCandidateOrAssigned(currentUser.getUserId()).active().singleResult();
			if (ObjectUtils.isEmpty(monitorTask)) {
				List<Task> monitorTasks = taskService.createTaskQuery()
						.processInstanceId(shenBaoInfo.getMonitor_processId()).active().list();
				for (Task x : monitorTasks) {
					String assignee = x.getAssignee();
					if (StringUtil.isBlank(assignee)) {
						monitorTask = x;
					}
				}
			}
			if(ObjectUtils.isNoneEmpty(monitorTask)){
				activitiService.setTaskComment(monitorTask.getId(), shenBaoInfo.getMonitor_processId(), "批复意见：" + msg);
			}
		} else {
			monitorTask = null;
		}
		if (shenBaoInfo.getThisTaskName().equals("usertask16") || str.equals("banjie")) {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "办结意见：" + msg);
		} else if (str.equals("tuiwen")) {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "退文意见：" + msg);
		} else {
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);
		}
		
		if ((shenBaoInfo.getThisTaskName().equals("usertask1") || shenBaoInfo.getThisTaskName().equals("usertask5"))
				&& !"1".equals(isPass)) {
			shenBaoInfo.setQianshouDate(new Date());// 签收时间
			shenBaoInfo.setReceiver(currentUser.getUserId());// 签收人
			taskService.setAssignee(task.get(0).getId(), nextUsers);
			taskService.setVariable(task.get(0).getId(), "isPass", isPass);
		} else {

			activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
			activitiService.taskComplete(task.get(0).getId(), variables);

			// 结束监控流程中的项目计划书任务
			if (shenBaoInfo.getThisTaskName().equals("usertask3") && str.equals("banjie")
					&& StringUtil.isNoneBlank(shenBaoInfo.getMonitor_processId())
					&& ObjectUtils.isNoneEmpty(monitorTask)) {
				// 加签收会在历史任务实例中多出assignee
				// activitiService.claimTask(monitorTask.getId(),
				// currentUser.getUserId());
				activitiService.taskComplete(monitorTask.getId());
			}else if(shenBaoInfo.getThisTaskName().equals("usertask16") && StringUtil.isNoneBlank(shenBaoInfo.getMonitor_processId())
					&& ObjectUtils.isNoneEmpty(monitorTask)) {
				activitiService.taskComplete(monitorTask.getId());
			}
		}
		// 结束上一任务后，当前流程下产生的新任务
		List<Task> tasknew = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.orderByDueDate().desc().list();
		
		String preTaskName = shenBaoInfo.getThisTaskName();
		Project project = projectRepo.findById(shenBaoInfo.getProjectId());
		
		project.getAttachments().forEach(x -> {// 删除历史附件
			attachmentRepo.delete(x);
		});
		project.getAttachments().clear();
		for(AttachmentDto x : projectDto.getAttachmentDtos()) {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setId(IdWorker.get32UUID());
			attachment.setCreatedBy(project.getCreatedBy());
			attachment.setModifiedBy(project.getModifiedBy());
			if(StringUtil.isBlank(attachment.getBusinessType())) {
				attachment.setBusinessType("shenPi");
			}
			if(StringUtil.isBlank(attachment.getShenBaoAttType())) {
				if(ObjectUtils.isNoneEmpty(monitorTask)) {
					attachment.setShenBaoAttType(monitorTask.getTaskDefinitionKey());
				}
			}
			project.getAttachments().add(attachment);
		}
		shenBaoInfo.getAttachments().forEach(x -> {// 删除历史附件
			attachmentRepo.delete(x);
		});
		shenBaoInfo.getAttachments().clear();
		for(AttachmentDto x : shenbaoinfoDto.getAttachmentDtos()) {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setId(IdWorker.get32UUID());
			attachment.setCreatedBy(project.getCreatedBy());
			attachment.setModifiedBy(project.getModifiedBy());
			if(StringUtil.isBlank(attachment.getBusinessType())) {
				attachment.setBusinessType("shenPi");
			}
			if(StringUtil.isBlank(attachment.getShenBaoAttType())) {
				if(ObjectUtils.isNoneEmpty(monitorTask)) {
					attachment.setShenBaoAttType(monitorTask.getTaskDefinitionKey());
				}
			}
			
			if(x.getType().equals("zhengwenFile") && (x.getItemOrder() ==0 || "".equals(x.getItemOrder()))){
				attachment.setItemOrder(1);
				Attachment attachment2 = new Attachment();
				attachment2.setId(UUID.randomUUID().toString());
				attachment2.setCreatedBy(x.getCreatedBy());
				attachment2.setCreatedDate(new Date());
				attachment2.setName(x.getName());
				attachment2.setUrl(x.getUrl());
				attachment2.setBusinessType(x.getBusinessType());
				attachment2.setShenBaoAttType(x.getShenBaoAttType());
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_XMJYS)){
					attachment2.setType("JYS");
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)){
					attachment2.setType("KXXYJBG");
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS)){
					attachment2.setType("CBSJYGS");
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_ZJSQBG)){
					attachment2.setType("ZJSQBG");
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)){
					attachment2.setType("SCQQJFXD");
				}
				project.getAttachments().add(attachment2);
				
			}
			shenBaoInfo.getAttachments().add(attachment);
		}
		if ((shenBaoInfo.getThisTaskName().equals("usertask14") || shenBaoInfo.getThisTaskName().equals("usertask20")) && "1".equals(isPass)) {
			if (shenBaoInfo.getThisTaskName().equals("usertask14")) {
				Date date = new Date();
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_XMJYS)){
					if(projectDto.getPifuJYS_date() == null){
						project.setPifuJYS_date(date);
					}
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)){
					if(projectDto.getPifuKXXYJBG_date() == null){
						project.setPifuKXXYJBG_date(date);
					}
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS)){
					if(projectDto.getPifuCBSJYGS_date() == null){
						project.setPifuCBSJYGS_date(date);
					}
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_ZJSQBG)){
					if(projectDto.getPifuZJSQBG_date() == null){
						project.setPifuZJSQBG_date(date);
					}
				}
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)){
					if(projectDto.getPifuSCQQJFXD_date() == null){
						project.setPifuSCQQJFXD_date(date);
					}
				}
			}
			// 生成项目编码
			if (StringUtils.isBlank(shenBaoInfo.getProjectNumber())) {
				BasicData basicData = basicDataService.findById(shenBaoInfo.getProjectIndustry());
				int projectSequenceNum = projectService.getProjectSequenceNumberInYear(shenBaoInfo.getProjectId());
				String projectNumber = Util.getProjectNumber(shenBaoInfo.getProjectInvestmentType(), basicData,
						projectSequenceNum);
				shenBaoInfo.setProjectNumber(projectNumber);
	
				projectService.updateProjectNumber(shenBaoInfo.getProjectId(), projectNumber);
			}
		}
		projectService.handlePiFuFile(project);
	

		if (shenBaoInfo.getThisTaskName().equals("usertask16") || str.equals("banjie")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setPfProjectInvestSum(shenbaoinfoDto.getPfProjectInvestSum());
			shenBaoInfo.setProcessStage("已办结");
			project.setIsIncludLibrary(true);
//			shenBaoInfo.setComplate(true);
//			shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
		} else if (str.equals("tuiwen")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
//			shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
			// 退文时，撤销当前流程
//			runtimeService.deleteProcessInstance(shenBaoInfo.getZong_processId(), "已退文");
		} else {
			shenBaoInfo.setProcessState(BasicDataConfig.processState_jinxingzhong);
			shenBaoInfo.setIsLeaderHasRead(false);
			shenBaoInfo.setThisTaskName(tasknew.get(0).getTaskDefinitionKey());
			shenBaoInfo.setProcessStage(tasknew.get(0).getName());
			shenBaoInfo.setThisTaskId(tasknew.get(0).getId());
//			if(isPushOA){
//				StringBuffer sb = new StringBuffer();
//				Backlog bl = new Backlog();
//				bl.setEventId(UUID.randomUUID().toString());
//				sb.append(bl.getEventId()+",");
//				bl.setBureauName("发展和财政局");
////				bl.setSendDeptName("投资科（重大项目办）");
//				bl.setBureauName("发展和财政局");
////				bl.setDeptName("投资科（重大项目办）");
////				this.todoShenbaoInfo(shenBaoInfo ,nextUsers,bl);
//				activitiService.setTaskProcessVariable(tasknew.get(0).getId(), "eventIds", sb.toString());
//			}
		}
		
		shenBaoInfoRepo.save(shenBaoInfo);
		projectRepo.save(project);
		logger.info(String.format("办结或阅批任务,用户名:%s", currentUser.getLoginName()));

		User user = userService.findById(nextUsers);
		String displayName = null;
		if(user != null) displayName = user.getDisplayName();
		// 准备短信内容
		List<SendMsg> msgs = new ArrayList<>();
		// 从配置文件中拿到短信模板并替换其中的占位符，若不能根据preTaskName拿到模板，则使用default模板
		final String content = String.format(shenbaoSMSContent.get(preTaskName) == null
				? shenbaoSMSContent.get("default") : shenbaoSMSContent.get(preTaskName), displayName,shenBaoInfo.getProjectName(),getStageType(shenBaoInfo.getProjectShenBaoStage()),shenBaoInfo.getProcessStage());

		if ("usertask16".equalsIgnoreCase(preTaskName) || str.equals("banjie")) { // 到达最后一个节点的情况下，发送完结的短信给到编制单位负责人
			String banjieContent = String.format(shenbaoSMSContent.get("usertask16"),shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), banjieContent));

		} else if ("tuiwen".equalsIgnoreCase(str)) { // 退文的情况下，发送推文短信给到编制单位负责人

			String tuiwenCont = String.format(shenbaoSMSContent.get("tuiwen"), shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), tuiwenCont));

		} else if (shenBaoInfo.getThisTaskName().equals("usertask1") && isPass != ""
				|| shenBaoInfo.getThisTaskName().equals("usertask5") && isPass != "") { //

			
			msgs.add(new SendMsg(user.getMobilePhone(), content));

		} else {
			msgs = set.stream()
					//.filter(userId -> this.getAssigneeByUserId(shenBaoInfo.getZong_processId(), userId).isSuccess()) // 过滤出到达审批状态的用户
					.map(userId -> userService.findById(userId)) // 查询出用户对象
					.filter(user1 -> StringUtils.isNotBlank(user1.getMobilePhone())) // 过滤没有设置手机号的用户
					.map(user2 -> new SendMsg(user2.getMobilePhone(), content)) // 将用户对象转换成SendMsg对象
					.collect(Collectors.toList());
		}
		
		// 开始发送短信通知
		try {
			smsService.insertDownSms(null, msgs.toArray(new SendMsg[] {}));
		} catch (SMSException e) {
			logger.error("发送短信异常：" + e.getMessage(), e);
		}
	}

	@Override
	@Transactional	
	public void todoShenbaoInfo(ShenBaoInfo shenBaoInfo ,String nextUsers,Backlog bl) {
		// TODO Auto-generated method stub
		//推送待办数据到OA
		if(true){
			
			bl.setId(shenBaoInfo.getId());
		
			bl.setTitle(shenBaoInfo.getProjectName());
			bl.setUrgency(returnFileSet(shenBaoInfo.getUrgencyState()));
			bl.setSystemCode("GMZXXMGLXT");
			bl.setSystemName("光明区政府投资管理系统");
			bl.setUrl(sysPath);
			User user = userRepo.findById(nextUsers);
			if(user != null){
				bl.setPersonId(user.getOaId());
				bl.setPersonName(user.getDisplayName());
			}
			
			User user2 = userRepo.findById(currentUser.getUserId());
			bl.setSendPersonId(user2.getOaId());
			bl.setSendPersonName(user2.getDisplayName());
			bl.setSendTime(new Date());
			try {
				Integer effect = HuasisoftUtil.getBacklogManager().save(bl);
				if(effect == 101){
					System.out.println("=========success>"+"插入待办成功！");
					logger.info("插入待办成功！");
				}else if(effect == 103){
					System.out.println("=========log>"+"您在重复推送待办！");
				}
			} catch (Exception e) {
				
				System.out.println("=========log>"+"插入待办失败！");
				e.printStackTrace();
			}
		}
	}

	@SuppressWarnings({ "rawtypes" })
	@Override
	@Transactional
	public void taskPinglun(Map data,boolean b) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		ShenBaoInfoDto shenbaoinfoDto = JSON.parseObject(JSON.toJSONString(data.get("shenbaoinfo")),
				ShenBaoInfoDto.class);

		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		List<Task> task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.active().orderByDueDate().desc().list();

		if(shenbaoinfoDto != null){
			// 如果有附件
			shenBaoInfo.getAttachments().forEach(x -> {// 删除历史附件
				attachmentRepo.delete(x);
			});
			shenBaoInfo.getAttachments().clear();
			if (shenbaoinfoDto.getAttachmentDtos().size() > 0) {
				shenbaoinfoDto.getAttachmentDtos().forEach(x -> {// 添加新附件
					Attachment attachment = new Attachment();
					attachmentMapper.buildEntity(x, attachment);
					attachment.setCreatedBy(shenBaoInfo.getCreatedBy());
					attachment.setModifiedBy(shenBaoInfo.getModifiedBy());
					shenBaoInfo.getAttachments().add(attachment);
				});
			}
		}
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		if(b){
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "阅批意见：" + msg);
		}else{
			shenBaoInfo.setIsLeaderHasRead(true);
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "当前办理阶段，领导已阅");
		}
		shenBaoInfoRepo.save(shenBaoInfo);
		logger.info(String.format("填写批注,用户名:%s", currentUser.getLoginName()));

	}


    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public void handleFeedback(Map<String, Object> data) {
        String shenBaoInfoId = (String) data.get("shenBaoInfoId");
        String msg = (String) data.get("msg");
        String taskId = (String) data.get("taskId");
        List<Attachment> shenPiAtts = (List<Attachment>) data.get("shenPiAtts");//审批附件
        List<Attachment> shenBaoAtts = (List<Attachment>) data.get("shenBaoAtts");//申报附件
        if(!CollectionUtils.isEmpty(shenBaoAtts)) {
        	shenPiAtts.addAll(shenBaoAtts);
        }
        
        ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenBaoInfoId);
        Project project = projectRepo.findById(shenBaoInfo.getProjectId());

		/*List<Task> monitorTask = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getMonitor_processId())
				.taskCandidateUser(currentUser.getUserId()).active().list();
		List<Task> monitorTask2 = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getMonitor_processId())
				.taskAssignee(currentUser.getUserId()).active().list();

		monitorTask.addAll(monitorTask2);*/

		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();

        //如果有附件
        if (shenPiAtts != null) {
            for (int i = 0; i < shenPiAtts.toArray().length; i++) {
                map = gson.fromJson(shenPiAtts.toArray()[i].toString(), map.getClass());
                Attachment newatt = new Attachment();	
                newatt.setId(UUID.randomUUID().toString());
                newatt.setName(map.get("name").toString());
                newatt.setUrl(map.get("url").toString());
                newatt.setCreatedBy(currentUser.getUserId());
                newatt.setModifiedBy(currentUser.getUserId());
                newatt.setBusinessType(map.get("businessType").toString());
                newatt.setShenBaoAttType(map.get("shenBaoAttType").toString());
                project.getAttachments().add(newatt);
            }
        }
        
        Authentication.setAuthenticatedUserId(currentUser.getUserId());

		activitiService.setTaskComment(taskId, shenBaoInfo.getMonitor_processId(), "反馈意见：" + msg);

		taskService.complete(taskId);
	}

	@SuppressWarnings({})
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj, String str) {
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		Set<String> set = new HashSet<>();
		List<HistoricTaskInstance> his = historyService.createHistoricTaskInstanceQuery()
				.taskAssignee(currentUser.getUserId()).finished().list();
		for (HistoricTaskInstance hisTask : his) {
			set.add((String) hisTask.getProcessInstanceId());
		}
		List<String> ids2 = new ArrayList<>();
		ids2.addAll(set);
		List<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoRepoImpl.findByOdata2(odataObj, ids2, str).stream()
				.map((x) -> {
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

	@SuppressWarnings("unchecked")
	@Override
	@Transactional
	public void subShenBaoAtts(Map<String, Object> data) {
		String shenBaoInfoId = (String) data.get("shenBaoInfoId");
		List<Attachment> att = (List<Attachment>) data.get("shenBaoAtts");// 附件
		String taskId = (String) data.get("taskId");// 附件

		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenBaoInfoId);
		Project project = projectRepo.findById(shenBaoInfo.getProjectId());

		Gson gson = new Gson();
		Map<String, Object> map = new HashMap<String, Object>();

		// 如果有附件
		if (att != null) {
			for (int i = 0; i < att.toArray().length; i++) {
				map = gson.fromJson(att.toArray()[i].toString(), map.getClass());
				Attachment newatt = new Attachment();
				newatt.setId(UUID.randomUUID().toString());
				newatt.setName(map.get("name").toString());
				newatt.setUrl(map.get("url").toString());
				newatt.setCreatedBy(currentUser.getUserId());
				newatt.setModifiedBy(currentUser.getUserId());
				newatt.setBusinessType(map.get("businessType").toString());
				newatt.setShenBaoAttType(map.get("shenBaoAttType").toString());
				project.getAttachments().add(newatt);
			}
		}

		processEngine.getTaskService().setVariableLocal(taskId, "isSubShenBaoAtt", true);

	}

	@Override
	@Transactional
	public List<Attachment> getAllAtts(String shenBaoInfoId, String taskId, String taskKey, List<Attachment> list) {
		// 查询申报附件
		ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoService.getShenBaoInfoDtoById(shenBaoInfoId);
		Project project = projectRepo.findById(shenBaoInfoDto.getProjectId());
		if (ObjectUtils.isNoneEmpty(project)) {
			List<Attachment> attachments = project.getAttachments();
			if (!CollectionUtils.isEmpty(attachments)) {
				attachments.forEach(x -> {
					if (taskKey.equalsIgnoreCase(x.getShenBaoAttType())) {
						list.add(x);
					}
				});
			}
		}
		return list;
	}

	@SuppressWarnings("deprecation")
	@Override
	@Transactional
	public List<Object> getAllComments(String shenBaoInfoId, String taskId, String taskKey, List<Object> list) {
		// 查询审批记录
		Calendar calendar = Calendar.getInstance();
		List<Comment> comments = taskService.getTaskComments(taskId);

		for (Comment com : comments) {
			HistoricTaskInstance task = processEngine.getHistoryService().createHistoricTaskInstanceQuery()
					.taskId(com.getTaskId()).singleResult();
			Map<String, String> map = new HashMap<>();

			map.put("name", task.getName());

			map.put("endTime", com.getTime().toLocaleString());
			map.put("msg", com.getFullMessage());

			String userId2 = com.getUserId();
			if (StringUtil.isNotBlank(userId2)) {
				User user = userService.findById(userId2);

				map.put("id", user.getDisplayName());
			} else {
				map.put("id", "");
			}

			calendar.set(com.getTime().getYear(), com.getTime().getMonth(), com.getTime().getDay(),
					com.getTime().getHours(), com.getTime().getMinutes(), com.getTime().getSeconds());
			long millis = calendar.getTimeInMillis();
			map.put("itemOrder", String.valueOf(millis));
			list.add(map);
		}
		return list;
	}

	/*@Override
	@Transactional
	public Map<String, Object> getCurrentKeyIntoMap(String processInstanceId, Map<String, Object> map) {
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskCandidateUser(currentUser.getUserId()).active().list();
		List<Task> tasks2 = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskAssignee(currentUser.getUserId()).active().list();
		tasks.addAll(tasks2);

		if (CollectionUtils.isEmpty(tasks)) {
			HistoricProcessInstance instance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(processInstanceId).singleResult();
			String StartUserId = instance.getStartUserId();
			if (StartUserId.equalsIgnoreCase(currentUser.getUserId())) {
				map.put("currentKey", "Yes");
			} else {
				map.put("currentKey", "No");
			}
		} else {
			String taskKey = tasks.get(0).getTaskDefinitionKey();
			map.put("currentKey", taskKey);
		}

		return map;
	}*/
	
	@Override
	@Transactional
	public String getAuthorityForCurTask(String processInstanceId, String taskId, String taskKey) {
		String authorityForCurTask;
		List<Task> tasks = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskCandidateUser(currentUser.getUserId()).taskId(taskId).active().list();
		List<Task> tasks2 = taskService.createTaskQuery().processInstanceId(processInstanceId)
				.taskAssignee(currentUser.getUserId()).taskId(taskId).active().list();
		tasks.addAll(tasks2);
		
		if (CollectionUtils.isEmpty(tasks)) {
			HistoricProcessInstance instance = historyService.createHistoricProcessInstanceQuery()
					.processInstanceId(processInstanceId).singleResult();
			String StartUserId = instance.getStartUserId();
			if (StartUserId.equalsIgnoreCase(currentUser.getUserId())) {
				authorityForCurTask = "true";
			} else {
				authorityForCurTask = "false";
			}
		} else {
			String taskKey2 = tasks.get(0).getTaskDefinitionKey();
			if(taskKey.equalsIgnoreCase(taskKey2)) {
				authorityForCurTask = "true";
			}else {
				authorityForCurTask = "false";
			}
		}
		
		return authorityForCurTask;
	}

	@Override
	public List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata) {
		odata.addOrderby(ShenBaoInfo_.urgencyState.getName(),true); //文件缓急倒叙排列
		return shenBaoInfoRepoImpl.findRunByOdata(odata);
	}

	@Override
	public List<ShenBaoInfoDto> findRunByOdata(ODataObjNew odata, boolean isPerson, Criterion flowCriterion) {
		odata.addOrderby(ShenBaoInfo_.urgencyState.getName(),true); //文件缓急倒叙排列
		odata.setProcessQuery((criteria) -> {
			DetachedCriteria existsCriteria = DetachedCriteria.forClass(WorkflowRunTask.class, "f");
			if (isPerson) {
				existsCriteria.add(Restrictions.eq("f.transactor", currentUser.getUserId()));
			} else {
				DetachedCriteria orgCriteria = DetachedCriteria.forClass(Org.class, "o");
				orgCriteria.createAlias("users", "u");

				orgCriteria.add(Restrictions.eq("o.name", "投资科"));

				existsCriteria.add(
						Subqueries.propertyIn("f.transactor", orgCriteria.setProjection(Projections.property("u.id"))));
			}
			existsCriteria.add(Property.forName("f.processInstanceId").eqProperty("this.zong_processId"));
			if (null != flowCriterion) {
				existsCriteria.add(flowCriterion);
			}
			criteria.add(Subqueries.exists(existsCriteria.setProjection(Projections.property("f.id"))));
		});
		List<ShenBaoInfoDto> shenbaoinfo = null;
		try {
			shenbaoinfo =  shenBaoInfoRepoImpl.findRunByOdata2(odata).stream().map(mapper::toDto).collect(Collectors.toList());
		} catch (Exception e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		return shenbaoinfo;
	}

	@Override
	public List<ShenBaoInfoDto> findAuditRunByOdata(ODataObjNew odata, boolean isPerson) {
		odata.addOrFilter(ShenBaoInfo_.projectShenBaoStage.getName(), OdataFilter.Operate.EQ, projectShenBaoStage_XMJYS,
				projectShenBaoStage_KXXYJBG, projectShenBaoStage_ZJSQBG, projectShenBaoStage_CBSJGS,projectShenBaoStage_oncePlanReach);
		List<ShenBaoInfoDto> list = findRunByOdata(odata, isPerson, null);
		return list;
	}

	public void updateAuditTime() {
		logger.debug("查询审批剩余时间和评审剩余时间的定时任务开始!------------------");
		// TODO: 2018/9/14  部署生产环境删除
		System.out.println("查询审批剩余时间和评审剩余时间的定时任务开始!------------------");

		ODataObjNew odata = new ODataObjNew();
		//申报阶段为 可行性研究报告、初步设计概算、资金申请报告
		odata.addOrFilter(ShenBaoInfo_.projectShenBaoStage.getName(), OdataFilter.Operate.EQ,
				projectShenBaoStage_KXXYJBG, projectShenBaoStage_CBSJGS, projectShenBaoStage_ZJSQBG);
		//流程状态为 进行中、转办
		odata.addOrFilter(ShenBaoInfo_.processState.getName(), OdataFilter.Operate.EQ,
				processState_jinxingzhong, processState_zhuanban);
		//查询shenbaoinfo表
		List<ShenBaoInfo>  list = shenBaoInfoRepoImpl.findRunByOdata2(odata);

		boolean is_TZK_Signin_Task;//是否签收
		boolean is_PSZX_Task;      //是否已提交评审中心
		boolean is_PSZX_Audit_OK;  //是否评审完毕
		try {
			//遍历申报集合
			for(ShenBaoInfo shenbaoinfo : list) {
			    /*if(!shenbaoinfo.getProjectName().equals("光明消防大队附件上传")){
                    continue;
                }*/
				String processId = shenbaoinfo.getZong_processId();
				//查询历史任务表，userTaskId为usertask1，userTaskName为材料签收环节的数据
				HistoricTaskInstance signin_Historic = findHistroyForAuditTimeByProcessIdAndTaskId(processId, task_id_signin);
				//查询历史任务表，userTaskId为usertask10，userTaskName为评审人员评审环节的数据
				HistoricTaskInstance  pszx_Historic = findHistroyForAuditTimeByProcessIdAndTaskId(processId, task_id_pszx);

				//如果签收历史数据endtime不为空，则代表已签收
				if(signin_Historic.getEndTime()!=null){
					is_TZK_Signin_Task = true;
				}else{
					is_TZK_Signin_Task = false;
				}

				//如果评审中心评审历史数据starttime不为空，则代表已提交评审中心
				if(pszx_Historic !=null && pszx_Historic.getStartTime()!=null){
					is_PSZX_Task = true;
				}else{
					is_PSZX_Task = false;
				}

				//如果评审中心评审历史数据endtime不为空，则代表评审中心已评审完毕
				if(pszx_Historic !=null && pszx_Historic.getEndTime()!=null){
					is_PSZX_Audit_OK = true;
				}else{
					is_PSZX_Audit_OK = false;
				}

				Date nextTaskTime = pszx_Historic == null ? null : pszx_Historic.getEndTime();
				Date submitTaskTime = pszx_Historic == null ? null : pszx_Historic.getStartTime();
				Date signinTaskTime = signin_Historic == null ? null : signin_Historic.getStartTime();

				/*is_PSZX_Task = true;
				is_PSZX_Audit_OK = true;

				String a = "2018-08-25 10:20:30";
				String b = "2018-08-20 14:20:30";
				String c = "2018-08-16 15:20:30";
				SimpleDateFormat df = new SimpleDateFormat("yyyy-MM-dd hh:mm:ss");

				nextTaskTime = df.parse(a);
				submitTaskTime = df.parse(b);
				signinTaskTime = df.parse(c);*/

				List<int[]> blanceTimeList = getOverDay(is_TZK_Signin_Task,is_PSZX_Task,is_PSZX_Audit_OK,nextTaskTime,submitTaskTime,signinTaskTime);
				shenbaoinfo.setTzkBalanceTime(WorkDayUtil.getStringByIntList(blanceTimeList.get(0),0));
				shenbaoinfo.setPxzxBalanceTime(WorkDayUtil.getStringByIntList(blanceTimeList.get(1),0));
				shenBaoInfoRepoImpl.save(shenbaoinfo);
			}
		} catch (Exception e) {
			logger.error("查询审批剩余时间和评审剩余时间出错!================>"+e.getMessage());
		}
	}


	@Value("${task_id_pszx}")
	private String task_id_pszx;

	@Value("${task_id_signin}")
	private String task_id_signin;

	@Value("${auditTime_PSZX}")
	private Integer auditTime_PSZX;

	@Value("${auditTime_TZK}")
	private Integer auditTime_TZK;

	@Value("${upHour}")
	private Integer upHour;

	@Value("${downHour}")
	private Integer downHour;

	/**
	 * @param is_PSZX_Task        是否已提交评审中心
	 * @param is_PSZX_Audit_OK    是否评审结束
	 * @param is_TZK_Signin_Task  是否提交投资科签收
	 * @param endTaskTime         流程-评审中心评审结束时间
	 * @param submitTaskTime      流程-投资科提交评审中心时间
	 * @param signinTaskTime      流程-投资科签收时间
	 * @return
	 */
	private List<int[]> getOverDay(
			boolean is_TZK_Signin_Task
			,boolean is_PSZX_Task
			,boolean is_PSZX_Audit_OK
			,Date endTaskTime
			,Date submitTaskTime
			,Date signinTaskTime) throws  Exception{

		//数组是下标是4，分别代表:  0天，1小时，2分钟，3秒数
		int[] pszx_useTime = new int[4];       //评审中心已用时间
		int[] pszx_balance_Time = new int[4];  //评审中心剩余时间
		int[] tzk_useTime = new int[4];        //投资科已用时间
		int[] tzk_balance_Time = new int[4];   //投资科剩余时间
		int[] tzk_addTime = new int[4];        //投资科追加时间
		int[] tzk_psEnd_useTime = new int[4];  //投资科评审结束后所用时间

		//当前时间
		Date currentTime = new Date();
		//投资科审核总时间
		int[] auditTime_TZK_List = {auditTime_TZK,0,0,0};
		//评审中心审核总时间
		int[] auditTime_PSZX_List = {auditTime_PSZX,0,0,0};

		//获取时间段工作日,工作日管理时间，调休或者加班或节假日
		Calendar cl = Calendar.getInstance();
		cl.setTime(signinTaskTime);
		cl.add(Calendar.MONTH, 2);
		//查询工作日从签收时间开始，截止到两个月。
		List<Map<String, String>> workDayList = getWorkDay(signinTaskTime, cl.getTime());

		//投资科是否签收申报信息
		if(is_TZK_Signin_Task){
			//是否提交评审中
			if(is_PSZX_Task){
				//评审中心是否评审完毕
				if(is_PSZX_Audit_OK){
					//评审中心评审时间
					pszx_useTime  = WorkDayUtil.getUseWorkDayTime(submitTaskTime,endTaskTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
					//获取投资科从签收到提交评审中所用时间
					tzk_useTime = WorkDayUtil.getUseWorkDayTime(signinTaskTime,submitTaskTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
					//获取投资科在评审中心评审完毕后所用时间
					tzk_psEnd_useTime = WorkDayUtil.getUseWorkDayTime(endTaskTime,currentTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
					//获取评审未用完的时间追加给投资科
					tzk_addTime = WorkDayUtil.getDiffWorkDay(pszx_useTime,auditTime_PSZX_List,downHour-upHour);
				// 评审中心未评审完毕
				}else{
					//评审中心已用评审时间
					pszx_useTime  = WorkDayUtil.getUseWorkDayTime(submitTaskTime,currentTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
					//计算投资科已使用时间
					tzk_useTime = WorkDayUtil.getUseWorkDayTime(signinTaskTime,submitTaskTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
				}
			}else{
				//计算投资科已使用时间
				tzk_useTime = WorkDayUtil.getUseWorkDayTime(signinTaskTime,currentTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
			}
		//未签收
		}else{
			//计算投资科已使用时间
			tzk_useTime = WorkDayUtil.getUseWorkDayTime(signinTaskTime,currentTime,workDayList.get(0),workDayList.get(1),upHour,downHour);
		}

		//投资科剩余审核时间   = (审核总时间+评审未用完时间) - (提交评审中心所用时间+评审结束后所用时间)
		int[] auditTime_TZK_Balance_List = WorkDayUtil.getAddWorkDay(auditTime_TZK_List,tzk_addTime,downHour-upHour); //审核总时间+评审未用完时间
		tzk_useTime = WorkDayUtil.getAddWorkDay(tzk_useTime,tzk_psEnd_useTime,downHour-upHour); //提交评审中心所用时间+评审结束后所用时间
		tzk_balance_Time =  WorkDayUtil.getDiffWorkDay(tzk_useTime,auditTime_TZK_Balance_List,downHour-upHour);

		//评审剩余评审时间   =  评审总时间 - 评审所用时间
		pszx_balance_Time = WorkDayUtil.getDiffWorkDay(pszx_useTime,auditTime_PSZX_List,downHour-upHour);

		//评审中心评审完毕
		if(is_PSZX_Audit_OK){
			//重置评审剩余时间
			pszx_balance_Time = new int[]{0,0,0,0};
		}

		List<int[]> result = new ArrayList<int[]>();
		result.add(tzk_balance_Time);
		result.add(pszx_balance_Time);
		return result;
	}

	/**
	 * 根据流程id 和 任务 id查询act_hi_taskinst表历史信息
	 * @param processId
	 * @param userTaskId
	 * @return
	 */
	private HistoricTaskInstance findHistroyForAuditTimeByProcessIdAndTaskId(String processId,String userTaskId){
		logger.debug("processId:"+processId+"================================"+"userTaskId:"+userTaskId);
		HistoricTaskInstance  historictaskinstance = null;
		List<HistoricTaskInstance> list = historyService
				.createHistoricTaskInstanceQuery()
				.processInstanceId(processId)
				.taskDefinitionKey(userTaskId).orderByHistoricActivityInstanceId().desc().list();
		if(!list.isEmpty() && list.size()>0) historictaskinstance = list.get(0);
		return historictaskinstance;
	}

	/**
	 * 获取指定时间段 节假日或者特殊加班日期
	 * @param startDate 开始日期
	 * @param endDate   结束日期
	 * @return
	 */
	private List<Map<String,String>> getWorkDay(Date startDate,Date endDate) throws Exception{
		List<Map<String,String>> List = new ArrayList<Map<String,String>>();
		Map<String,String> sleepMaps = new HashMap<String,String>();
		Map<String,String> workMaps = new HashMap<String,String>();
		//格式化日期
		String start = WorkDayUtil.getFormatDateTime("yyyy-MM-dd",startDate);
		String end = WorkDayUtil.getFormatDateTime("yyyy-MM-dd",endDate);
		List<Workday> workdayList =  workdayrepo.findWorkDay(start,end);
		if(!workdayList.isEmpty() && workdayList.size()>0){
			for (Workday workday : workdayList){
				String status = workday.getStatus();
				String date = WorkDayUtil.getFormatDateTime("yyyy-MM-dd",workday.getDates());
				if(status.equals("1")){
					sleepMaps.put(date,null);
				}else if(status.equals("2")){
					workMaps.put(date,null);
				}
			}
		}
		List.add(workMaps);
		List.add(sleepMaps);
		return List;
	}


	@Override
	public List<ShenBaoInfoDto> findYearPlanRunByOdata(ODataObjNew odata, boolean isPerson) {
		odata.addEQFilter(ShenBaoInfo_.projectShenBaoStage.getName(), projectShenBaoStage_nextYearPlan);
		return findRunByOdata(odata, isPerson, null);
	}

	@Override
	public List<ShenBaoInfoDto> findPlanRunByOdata(ODataObjNew odata, boolean isPerson) {
		odata.addEQFilter(ShenBaoInfo_.projectShenBaoStage.getName(), projectShenBaoStage_planReach);
		return findRunByOdata(odata, isPerson, null);
		// Restrictions.or(
		// Restrictions.eq("f.taskDefinitionKey", "usertask1"),
		// Restrictions.eq("f.taskDefinitionKey", "usertask2")
		// )
	}

	@Override
	@Transactional
	public List<ShenBaoInfoDto> findYuepiByOdata(ODataObjNew odataObj, boolean b) {
		User user = userRepo.findById(currentUser.getUserId());
		loop: for (int i = 0; i < user.getRoles().size(); i++) {
			Role role = user.getRoles().get(i);
			if (role.getRoleName().equals("局长") || role.getRoleName().equals("副局长")) {
				odataObj.addOrFilter(ShenBaoInfo_.thisTaskName.getName(),OdataFilter.Operate.EQ,"usertask2","usertask3","usertask6","usertask12","usertask13","usertask14","usertask16","usertask17","usertask23","usertask7","usertask18","usertask19","usertask20","usertask21","usertask22");
				break loop;
			} else if (role.getRoleName().equals("办公室主任")) {
				odataObj.addOrFilter(ShenBaoInfo_.thisTaskName.getName(), OdataFilter.Operate.EQ, "usertask12","usertask18");
//				odataObj.addEQFilter(ShenBaoInfo_.thisTaskName.getName(), "usertask12");
				break loop;
			}

		}
		return shenBaoInfoRepoImpl.findRunByOdata2(odataObj).stream().map(mapper::toDto).collect(Collectors.toList());
	}


	@Override
	@Transactional
	public List<ShenBaoInfoDto>  findAuditKeshi(ODataObjNew odata) {
		odata.addOrFilter(ShenBaoInfo_.thisTaskName.getName(), OdataFilter.Operate.EQ, "usertask2","usertask3","usertask6","usertask12","usertask13","usertask14","usertask16","usertask17","usertask23","usertask7","usertask18","usertask19","usertask20","usertask21","usertask22");
		odata.addOrderby(ShenBaoInfo_.urgencyState.getName(),true);
		return shenBaoInfoRepoImpl.findRunByOdata2(odata).stream().map(mapper::toDto).collect(Collectors.toList());
	}

	@Override
	public int findAllTodoTaskNumber(String id) {
		boolean isPerson = true;
		ODataObjNew odata = new ODataObjNew();
		ODataObjNew odata2 = new ODataObjNew();
		currentUser.setUserId(id);
		odata.addAndFilter(ShenBaoInfo_.thisUser.getName(), OdataFilter.Operate.EQ,id);
		List<ShenBaoInfoDto> list = this.findAuditRunByOdata(odata, isPerson);
		List<ShenBaoInfoDto> list2 = this.findYearPlanRunByOdata(odata2, isPerson);
		List<ShenBaoInfoDto> list3 = this.findPlanRunByOdata(odata2,isPerson);
		list2.addAll(list);
		list2.addAll(list3);
		System.out.println("待办数字========>"+list2.size());
		return list2.size();
	}
	 private String getStageType(String shenbaoStage) {
        if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)) {//如果是下一年度计划
            return projectShenBaoStage_7;
        }  else if (shenbaoStage.equals(projectShenBaoStage_KXXYJBG)) {//如果申报阶段：是可行性研究报告
            return  projectShenBaoStage_2;
        } else if (shenbaoStage.equals(projectShenBaoStage_CBSJYGS)) {//如果申报阶段：是初步概算与设计
            return projectShenBaoStage_3;
        } else if (shenbaoStage.equals(projectShenBaoStage_ZJSQBG)) {//如果申报阶段：是资金申请报告
            return projectShenBaoStage_4;
        } else if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)) {//如果申报阶段：是计划下达
            return projectShenBaoStage_6;
        }
        return "";
    }

	 public int returnFileSet(String fileSet){
		 int num = 0;
		 if(fileSet != null && fileSet != ""){
			 if(fileSet.equals(BasicDataConfig.fileSet_pingjian)){
				 num = 1;
			 }else if(fileSet.equals(BasicDataConfig.fileSet_jiaji)){
				 num = 2;
			 }else if(fileSet.equals(BasicDataConfig.fileSet_teji)){
				 num = 3;
			 }else{
				 num = 4;
			 }
		 }
		 return num;
	 }
	 
	@Override
	public void todoShenbaoInfo(ShenBaoInfo entity, String configValue) {
		// TODO Auto-generated method stub
		
	}
}

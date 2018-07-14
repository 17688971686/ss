package cs.service.impl;

import com.alibaba.fastjson.JSON;
import com.google.gson.Gson;
import com.sn.framework.common.ObjectUtils;
import com.sn.framework.common.StringUtil;
import com.sn.framework.odata.OdataFilter;
import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.Util;
import cs.domain.*;
import cs.domain.framework.Org;
import cs.domain.framework.Org_;
import cs.domain.framework.Role;
import cs.domain.framework.Role_;
import cs.domain.framework.User;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.framework.OrgDto;
import cs.model.framework.UserDto;
import cs.repository.framework.OrgRepo;
import cs.repository.framework.RoleRepo;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.interfaces.IRepository;
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
import org.activiti.engine.HistoryService;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.history.HistoricActivityInstance;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.history.HistoricVariableInstance;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.task.Comment;
import org.activiti.engine.task.Task;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.hibernate.criterion.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.Resource;
import javax.transaction.Transactional;
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
	private RoleRepo roleRepo;
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
	private BasicDataService basicDataService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private OrgService orgService;
	@Autowired
	private RuntimeService runtimeService;

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

		List<Task> tasks1 = activitiService.getCandidateGroupInTask(ids);
		List<Task> tasks2 = activitiService.getPersonalTask(currentUser.getUserId());
		tasks1.addAll(tasks2);

		List<String> taskIds = new ArrayList<>();
		for (Task task : tasks1) {
			String processId = task.getProcessInstanceId();
			taskIds.add(processId);
		}
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

			for (int i = 0; i < shenBaoInfoDtos.size(); i++) {
				ShenBaoInfoDto array_element = shenBaoInfoDtos.get(i);
				if (array_element.getProjectShenBaoStage().equals(projectShenBaoStage_KXXYJBG)
						|| array_element.getProjectShenBaoStage().equals(projectShenBaoStage_XMJYS)
						|| array_element.getProjectShenBaoStage().equals(projectShenBaoStage_ZJSQBG)
						|| array_element.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS)) {
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
	@Override
	@Transactional
	public Response getAssigneeByUserId_plan(String processId) {
		Response response = new Response();
		boolean isShow = false;
		Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), processId);
		List<ShenBaoInfo> shenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
		User loginUser = userRepo.findById(currentUser.getUserId());

		List<HistoricVariableInstance> list = historyService.createHistoricVariableInstanceQuery()// 创建一个历史的流程变量查询对象
				.variableName("nextUsers").processInstanceId(processId).list();
		List<Object> userList = new ArrayList<>();
		for (HistoricVariableInstance historicVariableInstance : list) {
			userList = Arrays.asList(historicVariableInstance.getValue().toString().split(","));
			System.out.println(historicVariableInstance);
		}
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
		double apPlanReach_ggys;
		double apPlanReach_gtzj;

		Integer c = (int) data.get("apPlanReach_ggys");
		apPlanReach_ggys = c.doubleValue();

		Integer a = (int) data.get("apPlanReach_gtzj");
		apPlanReach_gtzj = a.doubleValue();

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

		List<Org> findProjects = new ArrayList<>();
		Criterion criterion = Restrictions.eq(Org_.name.getName(), "投资科");
		Criterion criterion2 = Restrictions.eq(Org_.name.getName(), "局领导");
		Criterion criterion3 = Restrictions.or(criterion, criterion2);

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
		}

		if (!nextUsers.isEmpty()) {// 设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		} else if (shenBaoInfo.getThisTaskName().equals("usertask4") && nextUsers.isEmpty() && "next".equals(str)) {
			throw new IllegalArgumentException(String.format("请选择人员后提交！"));
		}

		List<Task> task = null;

		// 经办人转办模式
		if (shenBaoInfo.getThisTaskName().equals("usertask1") && !"1".equals(isPass)
				|| shenBaoInfo.getThisTaskName().equals("usertask2") && !"1".equals(isPass)) {
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();
			shenBaoInfo.setQianshouDate(new Date());// 签收时间
			shenBaoInfo.setReceiver(currentUser.getUserId());// 签收人
			Authentication.setAuthenticatedUserId(currentUser.getUserId());
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);

			taskService.setAssignee(task.get(0).getId(), nextUsers);
			taskService.setVariable(task.get(0).getId(), "isPass", isPass);

		} else {
			// 当前流程下，当前登录人员的任务--会签模式
			task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
			if (task.size() == 0) {
				task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
						.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();

			}
			Authentication.setAuthenticatedUserId(currentUser.getUserId());
			activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);

			activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
			activitiService.taskComplete(task.get(0).getId(), variables);
		}

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

		if (shenBaoInfo.getThisTaskName().equals("usertask5")) {
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
		} else if (str.equals("tuiwen")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
			shenBaoInfo.setEndDate(new Date());
			shenBaoInfo.setComplate(true);
		} else {

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
		List<HistoricProcessInstance> lists1 = activitiService
				.findHisProcessIntanceList(shenBaoInfo.getZong_processId());
		List<HistoricActivityInstance> hais = historyService.createHistoricActivityInstanceQuery()
				.processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask")
				.orderByHistoricActivityInstanceEndTime().asc().list();
		List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
		for (HistoricProcessInstance list1 : lists1) {
			User user = userRepo.findById(list1.getStartUserId());
			UserUnitInfoDto userUnitInfoDto1 = null;
			for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
				if (!userUnitInfoDto.getUserDtos().isEmpty()) {
					for (UserDto user1 : userUnitInfoDto.getUserDtos()) {
						if (user1.getId().equals(user.getId())) {
							userUnitInfoDto1 = userUnitInfoDto;
						}
					}
				}

			}
			Map<String, String> map1 = new HashMap<>();

			if (userUnitInfoDto1 != null) {
				map1.put("id", userUnitInfoDto1.getUnitName() + ":" + user.getDisplayName());
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
			// 4）如果当前任务有批注信息，添加到集合中
			if (comments != null && comments.size() > 0) {
				for (Comment com : comments) {
					Map<String, String> map = new HashMap<>();

					map.put("name", hai.getActivityName());

					map.put("endTime", com.getTime().toLocaleString());
					// map.put("dur", hai.getDurationInMillis().toString());
					map.put("msg", com.getFullMessage());

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
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);

		// 办结任务
		activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
		activitiService.taskComplete(task.get(0).getId());

		shenBaoInfo.setThisTaskId("00000");
		shenBaoInfo.setQianshouDate(new Date());// 签收时间
		shenBaoInfo.setReceiver(currentUser.getUserId());// 签收人
		if (!("next").equals(str)) {
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_tuiwen);
			shenBaoInfo.setProcessStage("已退文");
			shenBaoInfo.setAuditState(BasicDataConfig.auditState_noAudit);
			// 退文时，撤销当前流程
			runtimeService.deleteProcessInstance(shenBaoInfo.getZong_processId(), "已退文");
		} else {
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setProcessStage("已办结");
			shenBaoInfo.setAuditState(BasicDataConfig.auditState_auditPass);

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
		shenBaoInfo.setIsIncludLibrary(true);
		shenBaoInfo.setEndDate(new Date());
		shenBaoInfo.setQianshouDate(new Date());
		shenBaoInfo.setComplate(true);

		shenBaoInfoRepo.save(shenBaoInfo);

		logger.info(String.format("签收或办理下一年度计划,用户名:%s", currentUser.getLoginName()));
	}

	@SuppressWarnings({ "rawtypes" })
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

		Map<String, Object> variables = new HashMap<String, Object>();

		// 判断具体操作
		if (shenBaoInfo.getThisTaskName().equals("usertask23") && !("5").equals(isPass)) {
			String isOk = "1";
			variables.put("isOk", isOk);
		}

		if (isPass != "" && !str.equals("tuiwen") && !str.equals("reback")) {// 其他方式通过
			variables.put("isPass", isPass);
		} else if (str.equals("tuiwen")) {
			variables.put("isPass", 3);
		} else if (str.equals("reback")) {
			isPass = "2";
			variables.put("isPass", 2);
		} else if (str.equals("banjie")) {
			isPass = "3";
			variables.put("isPass", 3);
		}

		variables.put("shenpi", 8);

		List<String> useridList = new ArrayList<String>();

		List<Role> findProjects = new ArrayList<>();
		Criterion criterion = null;
		Criterion criterion2 = null;
		if (shenBaoInfo.getThisTaskName().equals("usertask6")) {
			criterion = Restrictions.eq(Role_.roleName.getName(), "办公室主任");
			findProjects = roleRepo.findByCriteria(criterion);
		} else if (((shenBaoInfo.getThisTaskName().equals("usertask1")
				|| shenBaoInfo.getThisTaskName().equals("usertask5")) && "1".equals(isPass))
				|| (shenBaoInfo.getThisTaskName().equals("usertask2")
						|| shenBaoInfo.getThisTaskName().equals("usertask23")) && "2".equals(isPass)) {
			criterion = Restrictions.eq(Role_.roleName.getName(), "局领导");
			criterion2 = Restrictions.eq(Role_.roleName.getName(), "科长");
			findProjects = roleRepo.findByCriteria(Restrictions.or(criterion, criterion2));
		}

		for (Role role : findProjects) {
			for (User user : role.getUsers()) {
				useridList.add(user.getId().trim());
			}
		}
		Set<String> set = new HashSet<>();// 同一用户如果有多个角色，同流程下会同时有多个任务，必须去重
		if (str.equalsIgnoreCase("reback")) {
			List<HistoricActivityInstance> hais = historyService.createHistoricActivityInstanceQuery()
					.processInstanceId(shenBaoInfo.getZong_processId()).activityType("userTask")
					.orderByHistoricActivityInstanceEndTime().asc().list();
			if (shenbaoinfoDto.getThisTaskName().equals("usertask3")) {// 经办人退给1
				for (HistoricActivityInstance hai : hais) {
					if (hai.getActivityId().equals("usertask1")) {
						nextUsers = hai.getAssignee();
					}
				}
			}else {
				for (HistoricActivityInstance hai : hais) {
					if (hai.getActivityId().equals("usertask3")) {
						nextUsers = hai.getAssignee();
					}
				}
			}
		}
		useridList.addAll(Arrays.asList(nextUsers.split(",")));

		for (String id : useridList) {
			set.add(id);
		}

		List<String> list2 = new ArrayList<String>(set);
		variables.put("userIds", list2);

		if (!nextUsers.isEmpty()) {// 设置流程变量--下一任务处理人
			variables.put("nextUsers", nextUsers);
		}

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
			activitiService.setTaskComment(monitorTask.getId(), shenBaoInfo.getMonitor_processId(), "批复意见：" + msg);
		} else {
			monitorTask = null;
		}

		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + msg);

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
		shenbaoinfoDto.getAttachmentDtos().forEach(x -> {// 添加新附件
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(project.getCreatedBy());
			attachment.setModifiedBy(project.getModifiedBy());
			project.getAttachments().add(attachment);
		});
		project.setPifuCBSJYGS_date(shenbaoinfoDto.getPifuCBSJYGS_date());
		project.setPifuKXXYJBG_date(shenbaoinfoDto.getPifuKXXYJBG_date());
		project.setPifuJYS_date(shenbaoinfoDto.getPifuJYS_date());
		project.setPifuCBSJYGS_wenhao(shenbaoinfoDto.getPifuCBSJYGS_wenhao());
		project.setPifuKXXYJBG_wenhao(shenbaoinfoDto.getPifuKXXYJBG_wenhao());
		project.setPifuJYS_wenhao(shenbaoinfoDto.getPifuJYS_wenhao());
		project.setPifuZJSQBG_date(shenbaoinfoDto.getPifuZJSQBG_date());
		project.setPifuZJSQBG_wenhao(shenbaoinfoDto.getPifuZJSQBG_wenhao());

		shenBaoInfo.setPifuCBSJYGS_date(shenbaoinfoDto.getPifuCBSJYGS_date());
		shenBaoInfo.setPifuKXXYJBG_date(shenbaoinfoDto.getPifuKXXYJBG_date());
		shenBaoInfo.setPifuJYS_date(shenbaoinfoDto.getPifuJYS_date());
		shenBaoInfo.setPifuCBSJYGS_wenhao(shenbaoinfoDto.getPifuCBSJYGS_wenhao());
		shenBaoInfo.setPifuKXXYJBG_wenhao(shenbaoinfoDto.getPifuKXXYJBG_wenhao());
		shenBaoInfo.setPifuJYS_wenhao(shenbaoinfoDto.getPifuJYS_wenhao());
		shenBaoInfo.setPifuZJSQBG_date(shenbaoinfoDto.getPifuZJSQBG_date());
		shenBaoInfo.setPifuZJSQBG_wenhao(shenbaoinfoDto.getPifuZJSQBG_wenhao());

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
		projectRepo.save(project);

		if (shenBaoInfo.getThisTaskName().equals("usertask16") || str.equals("banjie")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已办结");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
			shenBaoInfo.setProcessStage("已办结");
			shenBaoInfo.setIsIncludLibrary(true);
			shenBaoInfo.setComplate(true);
			shenBaoInfo.setEndDate(new Date());

			// 生成项目编码
			if (StringUtils.isBlank(shenBaoInfo.getProjectNumber())) {
				BasicData basicData = basicDataService.findById(shenBaoInfo.getProjectIndustry());
				int projectSequenceNum = projectService.getProjectSequenceNumberInYear(shenBaoInfo.getProjectId());
				String projectNumber = Util.getProjectNumber(shenBaoInfo.getProjectInvestmentType(), basicData,
						projectSequenceNum);
				shenBaoInfo.setProjectNumber(projectNumber);

				projectService.updateProjectNumber(shenBaoInfo.getProjectId(), projectNumber);
			}

		} else if (str.equals("tuiwen")) {
			shenBaoInfo.setThisTaskId("00000");
			shenBaoInfo.setThisTaskName("已退文");
			shenBaoInfo.setProcessState(BasicDataConfig.processState_notpass);
			shenBaoInfo.setProcessStage("已退文");
			shenBaoInfo.setEndDate(new Date());
			// 退文时，撤销当前流程
			runtimeService.deleteProcessInstance(shenBaoInfo.getZong_processId(), "已退文");
		} else {

			shenBaoInfo.setThisTaskName(tasknew.get(0).getTaskDefinitionKey());
			shenBaoInfo.setProcessStage(tasknew.get(0).getName());
		}

		shenBaoInfoRepo.save(shenBaoInfo);

		logger.info(String.format("办结或阅批任务,用户名:%s", currentUser.getLoginName()));

		// 准备短信内容
		List<SendMsg> msgs = new ArrayList<>();
		// 从配置文件中拿到短信模板并替换其中的占位符，若不能根据preTaskName拿到模板，则使用default模板
		final String content = String.format(shenbaoSMSContent.get(preTaskName) == null
				? shenbaoSMSContent.get("default") : shenbaoSMSContent.get(preTaskName), shenBaoInfo.getProjectName());

		if ("usertask16".equalsIgnoreCase(preTaskName) || str.equals("banjie")) { // 到达最后一个节点的情况下，发送完结的短信给到编制单位负责人

			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), content));

		} else if ("tuiwen".equalsIgnoreCase(str)) { // 退文的情况下，发送推文短信给到编制单位负责人

			String tuiwenCont = String.format(shenbaoSMSContent.get("tuiwen"), shenBaoInfo.getProjectName());
			msgs.add(new SendMsg(shenBaoInfo.getBianZhiUnitInfo().getResPersonMobile(), tuiwenCont));

		} else if (shenBaoInfo.getThisTaskName().equals("usertask1") && isPass != ""
				|| shenBaoInfo.getThisTaskName().equals("usertask5") && isPass != "") { //

			User user = userService.findById(nextUsers);
			msgs.add(new SendMsg(user.getMobilePhone(), content));

		} else {
			msgs = set.stream()
					.filter(userId -> this.getAssigneeByUserId(shenBaoInfo.getZong_processId(), userId).isSuccess()) // 过滤出到达审批状态的用户
					.map(userId -> userService.findById(userId)) // 查询出用户对象
					.filter(user -> StringUtils.isNotBlank(user.getMobilePhone())) // 过滤没有设置手机号的用户
					.map(user -> new SendMsg(user.getMobilePhone(), content)) // 将用户对象转换成SendMsg对象
					.collect(Collectors.toList());
		}

		// 开始发送短信通知
		try {
			smsService.insertDownSms(null, msgs.toArray(new SendMsg[] {}));
		} catch (SMSException e) {
			logger.error("发送短信异常：" + e.getMessage(), e);
		}

	}

	@SuppressWarnings({ "rawtypes" })
	@Override
	@Transactional
	public void taskPinglun(Map data) {
		String shenbaoInfoId = (String) data.get("id");
		String msg = (String) data.get("msg");
		ShenBaoInfoDto shenbaoinfoDto = JSON.parseObject(JSON.toJSONString(data.get("shenbaoinfo")),
				ShenBaoInfoDto.class);

		ShenBaoInfo shenBaoInfo = shenBaoInfoRepo.findById(shenbaoInfoId);

		List<Task> task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
				.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();

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
		shenBaoInfoRepo.save(shenBaoInfo);
		Authentication.setAuthenticatedUserId(currentUser.getUserId());
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "阅批意见：" + msg);

		logger.info(String.format("填写批注,用户名:%s", currentUser.getLoginName()));

	}


    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public void handleFeedback(Map<String, Object> data) {
        String shenBaoInfoId = (String) data.get("shenBaoInfoId");
        String msg = (String) data.get("msg");
        String taskId = (String) data.get("taskId");
        List<Attachment> att = (List<Attachment>) data.get("att");//附件
        
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

		processEngine.getTaskService().setVariableLocal(taskId, "isSubShenBaoAtt", "true");

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

	@Override
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
	}

	@Override
	public List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata) {
		return shenBaoInfoRepoImpl.findRunByOdata(odata);
	}

	@Override
	public List<ShenBaoInfoDto> findRunByOdata(ODataObjNew odata, boolean isPerson, Criterion flowCriterion) {
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
		return shenBaoInfoRepoImpl.findRunByOdata2(odata).stream().map(mapper::toDto).collect(Collectors.toList());
	}

	@Override
	public List<ShenBaoInfoDto> findAuditRunByOdata(ODataObjNew odata, boolean isPerson) {
		odata.addOrFilter(ShenBaoInfo_.projectShenBaoStage.getName(), OdataFilter.Operate.EQ, projectShenBaoStage_XMJYS,
				projectShenBaoStage_KXXYJBG, projectShenBaoStage_ZJSQBG, projectShenBaoStage_CBSJGS);
		return findRunByOdata(odata, isPerson, null);
		// Restrictions.or(
		// Restrictions.eq("f.taskDefinitionKey", "usertask1"),
		// Restrictions.eq("f.taskDefinitionKey", "usertask5")
		// )
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
				odataObj.addEQFilter(ShenBaoInfo_.thisTaskName.getName(), "usertask2");
				break loop;
			} else if (role.getRoleName().equals("办公室主任")) {
				odataObj.addEQFilter(ShenBaoInfo_.thisTaskName.getName(), "usertask12");
				break loop;
			}

		}
		return shenBaoInfoRepoImpl.findRunByOdata2(odataObj).stream().map(mapper::toDto).collect(Collectors.toList());
	}

	@Override
	@Transactional
	public void taskYuepi(String id) {
		ShenBaoInfo entity = shenBaoInfoRepo.findById(id);
		entity.setIsLeaderHasRead(true);
		shenBaoInfoRepo.save(entity);
	}

}

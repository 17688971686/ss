package cs.service.impl;


import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.MonthReport;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.domain.framework.Role;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.impl.TaskHeadRepoImpl;
import cs.repository.impl.TaskRecordRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.SysService;
import cs.service.framework.UserService;
import cs.service.interfaces.TaskHeadService;
/**
 * @Description: 任务信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class TaskHeadServiceImpl extends AbstractServiceImpl<TaskHeadDto, TaskHead, String> implements TaskHeadService {
	private static Logger logger = Logger.getLogger(TaskHeadServiceImpl.class);
	
	@Autowired
	private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;	
	@Autowired
	private IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IRepository<SysConfig, String> sysConfigRepo;
	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private UserService userService;
	@Autowired
	private SysService sysService;
	@Autowired
	private TaskHeadRepoImpl taskHeadRepoImpl;
	
	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> get(ODataObj odataObj) {	
		logger.info("查询工作台任务数据");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> getTask_yearPlan(ODataObj odataObj) {
//		ODataFilterItem filter = new ODataFilterItem();
//		filter.setField("taskType");
//		filter.setOperator("eq");
//		filter.setValue(BasicDataConfig.taskType_nextYearPlan);
//		
//		odataObj.getFilter().add(filter);
		logger.info("查询下一年度计划个人待办数据");
		return super.get(odataObj);
	}



	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> getToDo_Plan(ODataObj odataObj) {
		//条件一：下一个处理人为当前登录用户
				//条件二：下一处理角色为当前登录用户所拥有的角色
				//判断：如果当前登录用户为秘书科分办人员
				User user = userService.findById(currentUser.getUserId());
				List<Role> roles = user.getRoles();
				Boolean haveRole = false;
				String roleId = "";
				Boolean plan = true;
				for(Role role:roles){
					//当角色含有秘书科分办人员
					if(role.getRoleName().equals(BasicDataConfig.msFenBanRole) || role.getRoleName().equals(BasicDataConfig.msFaWenRole))	{
						haveRole = true;
						roleId = role.getId();
						break;
					}
				}
				if(haveRole){
					
					List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata2(odataObj,roleId,plan).stream().map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());
					
					
					PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
					pageModelDto.setCount(odataObj.getCount());
					pageModelDto.setValue(dtos);
					logger.info("查询审批类个人待办数据");
					return pageModelDto;
				}else{
					String userId = currentUser.getUserId();
					List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata3(odataObj,userId,plan).stream().map((x) -> {
						return mapper.toDto(x);
					}).collect(Collectors.toList());
					
					
					PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
					pageModelDto.setCount(odataObj.getCount());
					pageModelDto.setValue(dtos);
					logger.info("查询审批类个人待办数据");
					return pageModelDto;
				}
	}

	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> getTask_audit(ODataObj odataObj) {
		//条件一：下一个处理人为当前登录用户
		//条件二：下一处理角色为当前登录用户所拥有的角色
		//判断：如果当前登录用户为秘书科分办人员
		User user = userService.findById(currentUser.getUserId());
		List<Role> roles = user.getRoles();
		Boolean haveRole = false;
		String roleId = "";
		Boolean plan = false;
		for(Role role:roles){
			//当角色含有秘书科分办人员
			if(role.getRoleName().equals(BasicDataConfig.msFenBanRole) || role.getRoleName().equals(BasicDataConfig.msFaWenRole))	{
				haveRole = true;
				roleId = role.getId();
				break;
			}
		}
		if(haveRole){
			
			List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata2(odataObj,roleId, plan).stream().map((x) -> {
				return mapper.toDto(x);
			}).collect(Collectors.toList());
			
			
			PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(dtos);
			logger.info("查询审批类个人待办数据");
			return pageModelDto;
		}else{
			String userId = currentUser.getUserId();
			List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata3(odataObj,userId,plan).stream().map((x) -> {
				return mapper.toDto(x);
			}).collect(Collectors.toList());
			
			
			PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(dtos);
			logger.info("查询审批类个人待办数据");
			return pageModelDto;
		}
	}



	@Override
	@Transactional
	public TaskHead create(TaskHeadDto dto) {
		TaskHead entity=super.create(dto);
		//关联信息流程记录
		dto.getTaskRecordDtos().forEach(x->{
			TaskRecord taskRecord=new TaskRecord();
			taskRecordMapper.buildEntity(x, taskRecord);
			entity.getTaskRecords().add(taskRecord);
		});
						
		super.repository.save(entity);
		logger.info(String.format("创建任务信息,任务标题 %s",dto.getTitle()));	
		return entity;
	}


	@Override
	@Transactional
	public void handle(String taskId, TaskRecordDto dto) {
		//查询系统配置是否需要发送短信
		Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), BasicDataConfig.taskType_sendMesg);
		SysConfig entityQuery = sysConfigRepo.findByCriteria(criterion).stream().findFirst().get();
		Boolean isSendMesg = false;
		if(entityQuery.getEnable()){
			isSendMesg = true;
		}
				
		TaskHead taskHead=super.repository.findById(taskId);
		
		if(taskHead!=null){
			
			//判断任务是否完成
			String processState = dto.getProcessState();
			if(isComplete(processState)){//如果已完成
				taskHead.setComplete(true);		
				//dto.setNextUser(taskHead.getCreatedBy());//设置流程的下一处理人为之前任务的创建人
			}else{//如果没有完成 TODO
				
			}
			
			//更新任务
			taskHead.setOperator(dto.getOperator());
			taskHead.setModifiedDate(new Date());
			taskHead.setProcessState(processState);//状态
			taskHead.setNextProcess(dto.getNextProcess());//下一状态
			taskHead.setProcessRole(dto.getProcessRole());
			taskHead.setNextUser(dto.getNextUser());//下一流程处理人
			taskHead.setProcessSuggestion(dto.getProcessSuggestion());//处理意见
			taskHead.setItemOrder(taskHead.getItemOrder() +1);
			
			//新增一条处理流程记录
			TaskRecord entity=new TaskRecord();
			dto.setRelId(taskHead.getRelId());
			dto.setTaskId(taskHead.getId());//设置任务Id
			dto.setTaskType(taskHead.getTaskType());
			dto.setTitle(taskHead.getTitle());
			dto.setUnitName(taskHead.getUnitName());
			dto.setProjectIndustry(taskHead.getProjectIndustry());
			dto.setCreatedBy(currentUser.getUserId());
			dto.setModifiedBy(currentUser.getUserId());
			dto.setModifiedDate(new Date());
			dto.setItemOrder(taskHead.getItemOrder());
		
			taskRecordMapper.buildEntity(dto, entity);			
			taskHead.getTaskRecords().add(entity);
			
			//设置相应信息的状态
			String taskType=dto.getTaskType();
			String relId=dto.getRelId();
			if(taskType.equals(BasicDataConfig.taskType_monthReport)){//月报
				if(relId!=null&&!relId.isEmpty()){
					MonthReport monthReport=monthReportRepo.findById(relId);
					if(monthReport!=null){
						monthReport.setProcessState(processState);
						monthReportRepo.save(monthReport);
						if(isSendMesg){
							//发送短信
							SendMsg sendMsg = new SendMsg();
							sendMsg.setMobile(monthReport.getFillMobile());
							String content = dto.getTitle()+":"+basicDataService.getDescriptionById(processState);
							if(processState.equals(BasicDataConfig.processState_tuiWen)){//如果为退文
								content += ";处理意见："+dto.getProcessSuggestion();
							}
							sendMsg.setContent(content);
							Util.sendShortMessage(sendMsg);
						}
					}
				}
				
			}else{//申报
				if(relId!=null&&!relId.isEmpty()){
					ShenBaoInfo shenBaoInfo=shenBaoInfoRepo.findById(relId);
					if(shenBaoInfo!=null){
						shenBaoInfo.setProcessState(processState);
						if(processState.equals(BasicDataConfig.processState_qianShou)){//如果为签收
							shenBaoInfo.setReceiver(currentUser.getUserId());//设置签收人
						}
						shenBaoInfoRepo.save(shenBaoInfo);
						if(isSendMesg){
							//发送短信
							SendMsg sendMsg = new SendMsg();
							sendMsg.setMobile(shenBaoInfo.getProjectRepMobile());
							String content = dto.getTitle()+":"+basicDataService.getDescriptionById(processState);
							if(processState.equals(BasicDataConfig.processState_tuiWen)){//如果为退文
								content += ";处理意见："+dto.getProcessSuggestion();
							}
							sendMsg.setContent(content);
							Util.sendShortMessage(sendMsg);
						}		
					}
				}
			}
			super.repository.save(taskHead);
		}
	}
	private Boolean isComplete(String processState){
		if(BasicDataConfig.processState_qianShou.equals(processState)||
				BasicDataConfig.processState_tuiWen.equals(processState)||
				BasicDataConfig.processState_banJie.equals(processState)||
				BasicDataConfig.processState_jieShuShenPi.equals(processState)
				){
			return true;
		}else{
			return false;
		}
	}
}

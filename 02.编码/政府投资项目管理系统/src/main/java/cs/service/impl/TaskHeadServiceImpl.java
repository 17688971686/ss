package cs.service.impl;


import java.util.Date;
import java.util.List;
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
import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.impl.TaskHeadRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
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
	private IRepository<SysConfig, String> sysConfigRepo;
	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private BasicDataService basicDataService;
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
		logger.info("查询下一年度计划个人待办数据");
		return super.get(odataObj);
	}



	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> getToDo_Plan(ODataObj odataObj) {
		//条件一：下一个处理人为当前登录用户
		//条件二：任务类型为：计划下达
		//条件三：任务未完成
		String userId = currentUser.getUserId();
		List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata3(odataObj,userId,true).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
		
		PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("查询审批类个人待办数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> getTask_audit(ODataObj odataObj) {
		//条件一：任务的当前处理人为当前登录用户
		//条件二：任务类型为：项目建议书、可行性研究报告、初步设计概算、资金申请报告
		//条件三：任务未完成
		String userId = currentUser.getUserId();
		List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata3(odataObj,userId,false).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
			
		PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("查询审批类个人待办数据");
		return pageModelDto;
	
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
		Boolean isSendMesg = entityQuery.getEnable()?true:false;
				
		TaskHead taskHead=super.repository.findById(taskId);
		if(taskHead!=null){
			//判断任务是否完成
			String processStage = dto.getThisProcess();
			int processState = dto.getThisProcessState();
			if(isComplete(processStage,processState) || taskHead.getTaskType().equals(BasicDataConfig.taskType_nextYearPlan)){//如果已完成
				taskHead.setIsComplete(true);
			}
			//更新任务
			taskHead.setLastProcess(dto.getThisProcess());
			taskHead.setLastProcessState(dto.getThisProcessState());
			taskHead.setLastRole(dto.getThisRole());
			if(taskHead.getTaskType().equals(BasicDataConfig.taskType_nextYearPlan) && processState==BasicDataConfig.processState_pass){//如果是下一年度计划且签收
				taskHead.setThisProcess(dto.getThisProcess());
				taskHead.setThisProcessState(dto.getThisProcessState());
			}else{
				taskHead.setThisProcess(dto.getNextProcess());
				taskHead.setThisProcessState(BasicDataConfig.processState_jinxingzhong);
			}
			taskHead.setThisUser(dto.getNextUser());
			taskHead.setThisRole(dto.getNextRole());
			taskHead.setModifiedDate(new Date());
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
			dto.setItemOrder(taskHead.getItemOrder());
			
			//设置相应信息的状态
			String relId=dto.getRelId();

			if(relId!=null&&!relId.isEmpty()){
				ShenBaoInfo shenBaoInfo=shenBaoInfoRepo.findById(relId);
				if(shenBaoInfo!=null){
					if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)){//如果申报是下一年度计划
						shenBaoInfo.setProcessState(dto.getThisProcessState());//设置申报信息状态（签收或者退文）
						if(processStage.equals(BasicDataConfig.processStage_qianshou)){//如果为投资科签收
							shenBaoInfo.setReceiver(currentUser.getUserId());//设置签收人
							shenBaoInfo.setQianshouDate(new Date());//设置签收时间
							dto.setThisUser(currentUser.getUserId());
						}
					}else{
						shenBaoInfo.setProcessStage(taskHead.getThisProcess());
						shenBaoInfo.setProcessState(taskHead.getThisProcessState());
						if(processStage.equals(BasicDataConfig.processStage_qianshou) && processState == BasicDataConfig.processState_pass){//如果为投资科签收且通过
							shenBaoInfo.setReceiver(dto.getThisUser());//设置签收人
							shenBaoInfo.setQianshouDate(new Date());//设置签收时间
						}else if((processStage.equals(BasicDataConfig.processStage_weituopishen) && processState == BasicDataConfig.processState_pass) || 
								(processStage.equals(BasicDataConfig.processState_niwendengji) && processState == BasicDataConfig.processState_pass)){//如果是发文拟稿通过或者委托评审通过
							//TODO 这一块的判断条件在对接OA之后需要修改为OA返回结果的时间
							shenBaoInfo.setPifuDate(new Date());//设置批复时间
						}
					}
				}
				shenBaoInfoRepo.save(shenBaoInfo);
				if(isSendMesg){
					//发送短信
					SendMsg sendMsg = new SendMsg();
					sendMsg.setMobile(shenBaoInfo.getProjectRepMobile());
					String content = dto.getTitle()+":"+basicDataService.getDescriptionById(processStage);
					if(processState == BasicDataConfig.processState_notpass){//如果为退文
						content += ";处理意见："+dto.getProcessSuggestion();
					}
					sendMsg.setContent(content);
					Util.sendShortMessage(sendMsg);
				}		
			}
			taskRecordMapper.buildEntity(dto, entity);
			//附件信息转换
			taskHead.setLastUser(dto.getThisUser());
			dto.getAttachmentDtos().stream().forEach(x->{
				Attachment att = new Attachment();
				attachmentMapper.buildEntity(x, att);
				att.setCreatedBy(currentUser.getUserId());
				att.setModifiedBy(currentUser.getUserId());
				entity.getAttachments().add(att);
			});
			taskHead.getTaskRecords().add(entity);
		}
			super.repository.save(taskHead);
	}

	private Boolean isComplete(String processStage,int processState){
		//委托评审科长确认通过、拟文登记科长审核通过或年度计划审核通过
		if(BasicDataConfig.processStage_weituopishen.equals(processStage) && processState == BasicDataConfig.processState_pass||
				BasicDataConfig.processState_niwendengji.equals(processStage) && processState == BasicDataConfig.processState_pass)
		{
			return true;
		}else{
			return false;
		}
	}
}

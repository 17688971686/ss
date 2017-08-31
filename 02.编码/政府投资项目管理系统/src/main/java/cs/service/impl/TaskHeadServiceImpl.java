package cs.service.impl;


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
import cs.domain.MonthReport;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.impl.ProjectRepoImpl;
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
	private IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IRepository<TaskHead, String> TaskHeadRepo;
	@Autowired
	private IRepository<SysConfig, String> sysConfigRepo;
	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	@Autowired
	private IMapper<TaskHeadDto, TaskHead> taskHeadMapper;
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
	public PageModelDto<TaskHeadDto> getTask(ODataObj odataObj) {
		
		List<TaskHeadDto> dtos = taskHeadRepoImpl.findByOdata2(odataObj).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());
		
		
		PageModelDto<TaskHeadDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("建设单位查询项目数据");
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
		Boolean isSendMesg = false;
		if(entityQuery.getEnable()){
			isSendMesg = true;
		}
				
		TaskHead taskHead=super.repository.findById(taskId);
		if(taskHead!=null){
			//新增一条处理流程记录
			TaskRecord entity=new TaskRecord();
			dto.setRelId(taskHead.getRelId());
			dto.setTaskId(taskHead.getId());//设置任务Id
			dto.setTaskType(taskHead.getTaskType());
			dto.setTitle(taskHead.getTitle());
			dto.setUnitName(taskHead.getUnitName());
			dto.setProjectIndustry(taskHead.getProjectIndustry());
			dto.setCreatedBy(currentUser.getLoginName());//设置创建人(这是重点)
			dto.setModifiedBy(currentUser.getLoginName());
			//判断任务是否完成
			String processState = dto.getProcessState();
			if(isComplete(processState)){//如果已完成
				taskHead.setComplete(true);		
				//dto.setNextUser(taskHead.getCreatedBy());//设置流程的下一处理人为之前任务的创建人
			}else{//如果没有完成 TODO
				
			}
			taskRecordMapper.buildEntity(dto, entity);			
			taskHead.getTaskRecords().add(entity);
			//更新任务
			taskHead.setProcessState(processState);//状态
			taskHead.setNextUser(dto.getNextUser());
			taskHead.setProcessSuggestion(dto.getProcessSuggestion());//处理意见
			
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
				BasicDataConfig.processState_banJie.equals(processState)
				){
			return true;
		}else{
			return false;
		}
	}
}

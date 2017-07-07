package cs.service.impl;

import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.MonthReport;
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.TaskHeadService;

@Service
public class TaskHeadServiceImpl extends AbstractServiceImpl<TaskHeadDto, TaskHead, String> implements TaskHeadService {
	private static Logger logger = Logger.getLogger(TaskHeadServiceImpl.class);
	
	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;	
	@Autowired
	private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;	
	@Autowired
	private IRepository<MonthReport, String> monthReportRepo;	
	@Autowired
	private ICurrentUser currentUser;	
	
	@Override
	@Transactional
	public PageModelDto<TaskHeadDto> get(ODataObj odataObj) {		
		logger.info("查询工作台任务数据");
		return super.get(odataObj);
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
		TaskHead taskHead=super.repository.findById(taskId);
		if(taskHead!=null){
			//新增一条处理流程记录
			TaskRecord entity=new TaskRecord();
			dto.setRelId(taskHead.getRelId());
			dto.setTaskId(taskHead.getId());//设置任务Id
			dto.setTaskType(taskHead.getTaskType());
			dto.setTitle(taskHead.getTitle());
			dto.setCreatedBy(currentUser.getLoginName());//设置创建人
			dto.setModifiedBy(currentUser.getLoginName());
			//判断任务是否完成
			String processState = dto.getProcessState();
			if(isComplete(processState)){//如果已完成
				taskHead.setComplete(true);		
				dto.setNextUser(taskHead.getCreatedBy());//设置流程的下一处理人为之前任务的创建人
			}else{//如果没有完成 TODO
				
			}
			taskRecordMapper.buildEntity(dto, entity);			
			taskHead.getTaskRecords().add(entity);
			//更新任务
			taskHead.setProcessState(processState);//状态
			taskHead.setProcessSuggestion(dto.getProcessSuggestion());//处理意见
			
			//设置shenbaoInfo状态
			String taskType=dto.getTaskType();
			String relId=dto.getRelId();
			if(taskType.equals(BasicDataConfig.taskType_monthReport)){//月报
				if(relId!=null&&!relId.isEmpty()){
					MonthReport monthReport=monthReportRepo.findById(relId);
					if(monthReport!=null){
						monthReport.setProcessState(processState);
						monthReportRepo.save(monthReport);
					}
				}
				
			}else{//申报
				
				if(relId!=null&&!relId.isEmpty()){
					ShenBaoInfo shenBaoInfo=shenBaoInfoRepo.findById(relId);
					if(shenBaoInfo!=null){
						shenBaoInfo.setProcessState(processState);
						shenBaoInfoRepo.save(shenBaoInfo);
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

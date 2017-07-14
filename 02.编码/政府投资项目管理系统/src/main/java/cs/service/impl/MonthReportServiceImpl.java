package cs.service.impl;

import java.util.Date;
import java.util.Optional;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.domain.MonthReport_;
import cs.domain.Project;
import cs.domain.TaskHead;
import cs.domain.TaskHead_;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.MonthReportProblemDto;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.framework.SysService;
import cs.service.framework.UserServiceImpl;
import cs.service.interfaces.MonthReportService;
/**
 * @Description: 月报服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class MonthReportServiceImpl extends AbstractServiceImpl<MonthReportDto, MonthReport, String> implements MonthReportService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private  IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<TaskHead, String> taskHeadRepo;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IRepository<MonthReportProblem, String> monthReportProblemRepo;
	@Autowired
	private IMapper<MonthReportDto, MonthReport> monthReportMapper;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IMapper<MonthReportProblemDto, MonthReportProblem> monthReportProblemMapper;
	@Autowired
	private SysService sysService;
	@Autowired
	private ICurrentUser currentUser;
	
	
	@Override
	@Transactional
	public PageModelDto<MonthReportDto> get(ODataObj odataObj) {
		logger.info("查询月报数据");
		return super.get(odataObj);		
	}

	@Override
	@Transactional
	public void saveMonthReport(MonthReportDto monthReportDto) {
		// 判断数据库是否存在月报		
		Criterion criterion1 = Restrictions.eq(MonthReport_.projectId.getName(), monthReportDto.getProjectId());
		Criterion criterion2 = Restrictions.eq(MonthReport_.submitYear.getName(), monthReportDto.getSubmitYear());
		Criterion criterion3 = Restrictions.eq(MonthReport_.submitMonth.getName(), monthReportDto.getSubmitMonth());
		
		Optional<MonthReport> monthReportQuery = super.repository
				.findByCriteria(criterion1, criterion2,criterion3)
				.stream()
				.findFirst();
		if (!monthReportQuery.isPresent()) {// 不存在则创建
			createMonthReport(monthReportDto);
		}else {//存在则更新
			updateMonthReport(monthReportDto);
		}
	}

	private void createMonthReport(MonthReportDto monthReportDto) {
		MonthReport monthReport = super.create(monthReportDto);
		
		//关联信息
		//附件
		monthReportDto.getAttachmentDtos().forEach(x -> {//添加新附件
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(monthReportDto.getFillName());
			attachment.setModifiedBy(monthReportDto.getFillName());
			monthReport.getAttachments().add(attachment);
		});
		//问题
		monthReportDto.getMonthReportProblemDtos().forEach(x -> {//添加新问题
			MonthReportProblem monthReportProblem = new MonthReportProblem();
			monthReportProblemMapper.buildEntity(x, monthReportProblem);
			monthReportProblem.setCreatedBy(monthReportDto.getFillName());
			monthReportProblem.setModifiedBy(monthReportDto.getFillName());
			monthReportProblem.setMonthReport(monthReport);//月报问题与月报之间为多对一关系
			monthReport.getMonthReportProblems().add(monthReportProblem);
		});
		//设置月报的状态
		monthReport.setProcessState(BasicDataConfig.processState_tianBao);
		
		//从项目表进行保存
		Project project = projectRepo.findById(monthReportDto.getProjectId());
		project.getMonthReports().add(monthReport);
		
		projectRepo.save(project);
		
		//初始化工作流(暂时不需要流)
		//initWorkFlow(project,monthReport);

		logger.info("创建月报数据");
	}

	private void updateMonthReport(MonthReportDto monthReportDto) {
		MonthReport monthReport = super.update(monthReportDto, monthReportDto.getId());
		//更新月报信息
		//关联信息
		//附件
		monthReport.getAttachments().forEach(x -> {//删除历史附件
			attachmentRepo.delete(x);
		});
		monthReport.getAttachments().clear();
		monthReportDto.getAttachmentDtos().forEach(x -> {//添加新附件
			Attachment attachment = new Attachment();
			attachment.setCreatedBy(monthReport.getFillName());
			attachment.setModifiedBy(monthReport.getFillName());
			monthReport.getAttachments().add(attachmentMapper.buildEntity(x, attachment));
		});
		//问题
		monthReport.getMonthReportProblems().forEach(x -> {//删除历史月报问题
			monthReportProblemRepo.delete(x);
		});
		monthReport.getMonthReportProblems().clear();
		monthReportDto.getMonthReportProblemDtos().forEach(x -> {
			MonthReportProblem monthReportProblem = new MonthReportProblem();
			monthReportProblem.setCreatedBy(monthReport.getFillName());
			monthReportProblem.setModifiedBy(monthReport.getFillName());
			monthReportProblem.setMonthReport(monthReport);//月报问题与月报之间为多对一关系
			monthReport.getMonthReportProblems().add(monthReportProblemMapper.buildEntity(x, monthReportProblem));
		});
		//设置月报的状态
		monthReport.setProcessState(BasicDataConfig.processState_tianBao);
		monthReportRepo.save(monthReport);
		//更新工作流（暂时不需要）
//		updateWorkFlow(monthReport);
		
		logger.info("更新月报数据");
	}
	
	@Override
	@Transactional
	public void changeMonthReport(MonthReportDto monthReportDto) {		
		Criterion criterion1 = Restrictions.eq(MonthReport_.projectId.getName(), monthReportDto.getProjectId());
		Criterion criterion2 = Restrictions.eq(MonthReport_.submitYear.getName(), monthReportDto.getSubmitYear());
		Criterion criterion3 = Restrictions.eq(MonthReport_.submitMonth.getName(), monthReportDto.getSubmitMonth());
		MonthReport monthReport;
		Object[] monthReportQuery = super.repository
				.findByCriteria(criterion1, criterion2,criterion3)
				.stream()
				.toArray();
		
		Project project = projectRepo.findById(monthReportDto.getProjectId());
		if(monthReportQuery.length == 1){//只有一条数据修改时，新增一条
			Optional<MonthReport> monthReportQuerys = super.repository
					.findByCriteria(criterion1, criterion2,criterion3)
					.stream()
					.findFirst();
			//begin#修改
			monthReport = monthReportQuerys.get();
			monthReport.setIsLatestVersion(false);
					
			super.repository.save(monthReport);
			
			//begin#新增
			createMonthReport(monthReportDto);
			
			//end#修改上条数据
		}else{//再次点击修改时
			updateMonthReport(monthReportDto);
		}
	}
	
	private void initWorkFlow(Project project,MonthReport monthReport){
		//获取系统配置中工作流类型的第一处理人
	   String startUser="";
	  Optional<SysConfigDto> systemConfigDto=sysService.getSysConfigs().stream().filter((x)->
	  			BasicDataConfig.taskType.equals(x.getConfigType())		
	  			&&BasicDataConfig.taskType_monthReport.equals(x.getConfigName())
				).findFirst();
	  
	   if(systemConfigDto.isPresent()){
		   startUser=systemConfigDto.get().getConfigValue();
	   }
		
				
		//创建工作流
		TaskHead taskHead=new TaskHead();		
		taskHead.setNextUser(startUser);//设置下一处理人
		taskHead.setCreatedBy(currentUser.getLoginName());
		taskHead.setModifiedBy(currentUser.getLoginName());
		taskHead.setRelId(monthReport.getId());
		taskHead.setTitle("项目月报-"+project.getProjectName()+"("+monthReport.getSubmitYear()+"-"+monthReport.getSubmitMonth()+")");
		taskHead.setProcessSuggestion("材料填报");
		taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态
		taskHead.setTaskType(BasicDataConfig.taskType_monthReport);//设置工作流的类型
		taskHead.setId(UUID.randomUUID().toString());
				
		//record
		TaskRecord taskRecord=new TaskRecord();
		taskRecord.setNextUser(startUser);//设置下一处理人
		taskRecord.setCreatedBy(currentUser.getLoginName());
		taskRecord.setModifiedBy(currentUser.getLoginName());
		taskRecord.setRelId(monthReport.getId());
		taskRecord.setTaskId(taskHead.getId());//设置任务Id
		taskRecord.setTitle("项目月报："+project.getProjectName());
		taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
		taskRecord.setTaskType(BasicDataConfig.taskType_monthReport);
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setProcessSuggestion("材料填报");

		taskHead.getTaskRecords().add(taskRecord);
		taskHeadRepo.save(taskHead);
	}
	
	private void updateWorkFlow(MonthReport monthReport){
		//查找到对应的任务
				Criterion criterion = Restrictions.eq(TaskHead_.relId.getName(), monthReport.getId());
				TaskHead taskHead = taskHeadRepo.findByCriteria(criterion).stream().findFirst().get();
				
				//添加一条流转记录
				//获取系统配置中工作流类型的第一处理人
				   String startUser="";
				  Optional<SysConfigDto> systemConfigDto=sysService.getSysConfigs().stream().filter((x)->
				  			BasicDataConfig.taskType.equals(x.getConfigType())		
				  			&&BasicDataConfig.taskType_monthReport.equals(x.getConfigName())
							).findFirst();
				  
				  if(systemConfigDto.isPresent()){
					   startUser=systemConfigDto.get().getConfigValue();
				   }
				
				TaskRecord taskRecord=new TaskRecord();
				taskRecord.setNextUser(startUser);//设置下一处理人
				taskRecord.setCreatedBy(currentUser.getLoginName());
				taskRecord.setModifiedBy(currentUser.getLoginName());
				taskRecord.setRelId(monthReport.getId());
				taskRecord.setTaskId(taskHead.getId());//设置任务Id
				taskRecord.setTitle(taskHead.getTitle());
				taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
				taskRecord.setTaskType(BasicDataConfig.taskType_monthReport);
				taskRecord.setId(UUID.randomUUID().toString());
				taskRecord.setProcessSuggestion("材料填报");
				
				taskHead.getTaskRecords().add(taskRecord);
				//更新任务的状态以及是否完成
				taskHead.setComplete(false);
				taskHead.setProcessState(BasicDataConfig.processState_tianBao);
				taskHeadRepo.save(taskHead);
	}
}

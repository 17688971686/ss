package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
import cs.domain.MonthReport;
import cs.domain.MonthReport_;
import cs.domain.Project;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.framework.SysService;
import cs.service.framework.UserServiceImpl;
import cs.service.interfaces.MonthReportService;

@Service
public class MonthReportServiceImpl extends AbstractServiceImpl<MonthReportDto, MonthReport, String> implements MonthReportService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private  IRepository<MonthReport, String> monthReportRepo;

	@Autowired
	private SysService sysService;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<TaskHead, String> taskHeadRepo;
	@Autowired
	private ICurrentUser currentUser;
	
	@Autowired
	IMapper<MonthReportDto, MonthReport> monthReportMapper;

	/**
	 * 分页查询月报数据
	 */
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
		MonthReport monthReport;
		Optional<MonthReport> monthReportQuery = super.repository
				.findByCriteria(criterion1, criterion2,criterion3)
				.stream()
				.findFirst();
		if (!monthReportQuery.isPresent()) {// 不存在则创建
			monthReport = new MonthReport();
			createMonthReport(monthReportDto, monthReport);
		} else {
			monthReport = monthReportQuery.get();
			updateMonthReport(monthReportDto, monthReport);
		}

	}

	private void createMonthReport(MonthReportDto monthReportDto, MonthReport monthReport) {
		monthReportMapper.buildEntity(monthReportDto, monthReport);
		monthReport.setCreatedBy(currentUser.getLoginName());
		monthReport.setModifiedBy(currentUser.getLoginName());
		monthReport.setCreatedDate(new Date());

		// 从项目表进行保存
		Project project = projectRepo.findById(monthReportDto.getProjectId());
		project.getMonthReports().add(monthReport);
		projectRepo.save(project);
		
		//初始化工作流
		initWorkFlow(project,monthReport);

		logger.info("创建月报数据");
	}

	private void updateMonthReport(MonthReportDto monthReportDto, MonthReport monthReport) {
		monthReport.getAttachments().clear();
		monthReport.getMonthReportProblems().clear();

		monthReportMapper.buildEntity(monthReportDto, monthReport);
		monthReportRepo.save(monthReport);
		logger.info("更新月报数据");
	}
	
	private void initWorkFlow(Project project,MonthReport monthReport){
		//获取系统配置中工作流类型的第一处理人
	   String startUser="";
	  Optional<SysConfigDto> systemConfigDto=	sysService.getSysConfigs().stream().filter((x)->
	  			BasicDataConfig.taskType.equals(x.getConfigType())		
	  			&&BasicDataConfig.taskType_monthReport.equals(x.getConfigName())
				).findFirst();
	  
	   if(systemConfigDto.isPresent()){
		   startUser=systemConfigDto.get().getConfigValue();
	   }
		
				
		//创建工作流
		TaskHead taskHead=new TaskHead();		
		taskHead.setUserName(startUser);//设置下一处理人
		taskHead.setCreatedBy(currentUser.getLoginName());
		taskHead.setModifiedBy(currentUser.getLoginName());
		taskHead.setRelId(monthReport.getId());
		taskHead.setTitle("项目月报："+project.getProjectName());
		taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态
		taskHead.setTaskType(BasicDataConfig.taskType_monthReport);//设置工作流的类型
		taskHead.setId(UUID.randomUUID().toString());
				
		//record
		TaskRecord taskRecord=new TaskRecord();
		taskRecord.setUserName(currentUser.getLoginName());
		taskRecord.setCreatedBy(currentUser.getLoginName());
		taskRecord.setModifiedBy(currentUser.getLoginName());
		taskRecord.setRelId(monthReport.getId());
		taskRecord.setTitle("项目月报："+project.getProjectName());
		taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
		taskRecord.setTaskType(BasicDataConfig.taskType_monthReport);
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setProcessSuggestion("材料填报");

		taskHead.getTaskRecords().add(taskRecord);
		taskHeadRepo.save(taskHead);
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
					
			monthReportRepo.save(monthReport);
			
			//begin#新增
			monthReport = new MonthReport();
			monthReportDto.setIsLatestVersion(true);
			monthReportMapper.buildEntity(monthReportDto, monthReport);
			monthReport.setCreatedBy(currentUser.getLoginName());
			monthReport.setModifiedBy(currentUser.getLoginName());
			monthReport.setCreatedDate(new Date());

			// 从项目表进行保存
	
			project.getMonthReports().add(monthReport);
			projectRepo.save(project);
			
			//end#修改上条数据
		}else{                                 //再次点击修改时，有两条数据，修改状态为1的
			project.getMonthReports().forEach(x->{
				if(x.getIsLatestVersion() == true 
						&& x.getProjectId().equals(monthReportDto.getProjectId()) 
						&& x.getSubmitYear().equals(monthReportDto.getSubmitYear())
						&&x.getSubmitMonth().equals(monthReportDto.getSubmitMonth())
						&&project.getIsLatestVersion() ==true)
				{
					x.getAttachments().clear();
					x.getMonthReportProblems().clear();

					monthReportMapper.buildEntity(monthReportDto, x);
					monthReportRepo.save(x);
				}
			});
		}
	}
}

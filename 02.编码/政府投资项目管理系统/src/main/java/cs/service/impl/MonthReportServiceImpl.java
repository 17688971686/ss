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
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DtoMapper.MonthReportMapper;
import cs.repository.interfaces.MonthReportRepo;
import cs.repository.interfaces.ProjectRepo;
import cs.repository.interfaces.TaskHeadRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.SysService;
import cs.service.framework.UserServiceImpl;
import cs.service.interfaces.MonthReportService;

@Service
public class MonthReportServiceImpl implements MonthReportService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private MonthReportRepo monthReportRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private SysService sysService;
	@Autowired
	private ProjectRepo projectRepo;
	@Autowired
	private TaskHeadRepo taskHeadRepo;
	@Autowired
	private ICurrentUser currentUser;

	/**
	 * 分页查询月报数据
	 */
	@Override
	@Transactional
	public PageModelDto<MonthReportDto> get(ODataObj odataObj) {
		List<MonthReport> monthReportList = monthReportRepo.findByOdata(odataObj);
		List<MonthReportDto> monthReportDtoList = new ArrayList<MonthReportDto>();

		monthReportList.forEach(monthReport -> {
			MonthReportDto monthReportDto = MonthReportMapper.toDto(monthReport);			
			//获取相关类型的名称
			monthReportDto.setSelfReviewDesc(basicDataService.getDescriptionById(monthReport.getSelfReview()));
			// begin#关联信息
			// 项目
			//ProjectInfo projectInfo = projectInfoRepo.findById(monthReport.getProjectId());
			//monthReportDto.setProjectName(projectInfo.getProjectName());

			// end#关联信息
	

			monthReportDtoList.add(monthReportDto);

		});

		PageModelDto<MonthReportDto> pageModelDto = new PageModelDto<MonthReportDto>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(monthReportDtoList);

		logger.info("查询月报数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void saveMonthReport(MonthReportDto monthReportDto) {
		// 判断数据库是否存在月报
		
		Criterion criterion1 = Restrictions.eq(MonthReport_.projectId.getName(), monthReportDto.getProjectId());
		Criterion criterion2 = Restrictions.eq(MonthReport_.submitYear.getName(), monthReportDto.getSubmitYear());
		Criterion criterion3 = Restrictions.eq(MonthReport_.submitMonth.getName(), monthReportDto.getSubmitMonth());
		MonthReport monthReport;
		Optional<MonthReport> monthReportQuery = monthReportRepo
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
		MonthReportMapper.buildEntity(monthReportDto, monthReport);
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

		MonthReportMapper.buildEntity(monthReportDto, monthReport);
		monthReportRepo.save(monthReport);
		logger.info("更新月报数据");
	}
	
	private void initWorkFlow(Project project,MonthReport monthReport){
		//获取系统配置中工作流类型的第一处理人
		String configValue = sysService.getConfigValue(BasicDataConfig.taskType_monthReport).getConfigValue();
				
		//创建工作流
		TaskHead taskHead=new TaskHead();		
		taskHead.setUserName(configValue);//设置下一处理人
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
		taskRecord.setTitle("项目申报："+project.getProjectName());
		taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
		taskRecord.setTaskType(BasicDataConfig.taskType_monthReport);
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setProcessSuggestion("材料填报");

		taskHead.getTaskRecords().add(taskRecord);
		taskHeadRepo.save(taskHead);
	}
}

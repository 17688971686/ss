package cs.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;

import cs.common.BasicDataConfig;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.domain.MonthReport_;
import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.MonthReportProblemDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
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
	@Autowired
	private  IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IRepository<MonthReportProblem, String> monthReportProblemRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IMapper<MonthReportProblemDto, MonthReportProblem> monthReportProblemMapper;
	
	
	@Override
	@Transactional
	public PageModelDto<MonthReportDto> get(ODataObj odataObj) {
		logger.info("查询月报数据");
		return super.get(odataObj);		
	}

	@Override
	public List<MonthReportDto> findByDto(ODataObj odataObj) {
		return null;
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
		monthReport.setModifiedDate(new Date());
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
		monthReport.setProcessState(BasicDataConfig.monthReport_type_tianbao);
		
		//从项目表进行保存
		Project project = projectRepo.findById(monthReportDto.getProjectId());
		project.getMonthReports().add(monthReport);
		
		projectRepo.save(project);
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
		monthReport.setProcessState(BasicDataConfig.monthReport_type_tianbao);
		monthReportRepo.save(monthReport);
		
		logger.info("更新月报数据");
	}
	
	@Override
	@Transactional
	public void changeMonthReport(MonthReportDto monthReportDto) {		
		Criterion criterion1 = Restrictions.eq(MonthReport_.projectId.getName(), monthReportDto.getProjectId());
		Criterion criterion2 = Restrictions.eq(MonthReport_.submitYear.getName(), monthReportDto.getSubmitYear());
		Criterion criterion3 = Restrictions.eq(MonthReport_.submitMonth.getName(), monthReportDto.getSubmitMonth());
		MonthReport monthReport;
	
		List<MonthReport> monthReportQuery = super.repository
				.findByCriteria(criterion1, criterion2,criterion3);
				
		if(monthReportQuery.size() == 1){//只有一条数据修改时，新增一条
			//begin#修改
			monthReport = monthReportQuery.get(0);
			monthReport.setIsLatestVersion(false);
			super.repository.save(monthReport);
			//end#修改上条数据
			
			//begin#新增一条数据
			createMonthReport(monthReportDto);
			
		}else if(monthReportQuery.size() > 1){//再次点击修改时
			updateMonthReport(monthReportDto);
		}
	}
}

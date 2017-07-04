package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.domain.MonthReport;
import cs.domain.Project;
import cs.domain.Project_;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;

@Service
public class ProjectServiceImpl extends AbstractServiceImpl<ProjectDto, Project, String> implements ProjectService {
	private static Logger logger = Logger.getLogger(ProjectServiceImpl.class);
	
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IMapper<MonthReportDto, MonthReport> monthReportMapper;
	@Autowired
	private IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IMapper<ProjectDto, Project> projectMapper;
	@Autowired
	private IRepository<BasicData, String> basicDataRepo;

	
	@Override
	@Transactional
	public PageModelDto<ProjectDto> get(ODataObj odataObj) {
		logger.info("查询项目数据");
		return super.get(odataObj);		
	}

	@Override
	@Transactional
	public Project update(ProjectDto projectDto,String id) {		
		Project project = super.update(projectDto,id);		
		//处理关联信息
		//附件
		project.getAttachments().forEach(x -> {//删除历史附件
			attachmentRepo.delete(x);
		});
		project.getAttachments().clear();
		projectDto.getAttachmentDtos().forEach(x -> {//添加新附件
			project.getAttachments().add(attachmentMapper.buildEntity(x, new Attachment()));
		});
		//月报
		project.getMonthReports().forEach(x -> {//删除历史月报
			monthReportRepo.delete(x);
		});
		project.getMonthReports().clear();
		projectDto.getMonthReportDtos().forEach(x -> {//添加新月报
			project.getMonthReports().add(monthReportMapper.buildEntity(x, new MonthReport()));
		});
		
		//保存数据
		super.repository.save(project);
		logger.info(String.format("编辑项目,项目名称 %s",projectDto.getProjectName()));
		return project;		
	}
	

	@Override
	@Transactional
	public void updateProjectByIsMonthReport(ProjectDto projectDto) {		
		Project project = super.repository.findById(projectDto.getId());
		project.setIsMonthReport(projectDto.getIsMonthReport());
		//设置修改人
		String longinName = currentUser.getLoginName();
		project.setModifiedBy(longinName);
		project.setModifiedDate(new Date());
		//保存数据
		super.repository.save(project);
		logger.info(String.format("修改项目是否月报,项目名称 %s",project.getProjectName()));
	}

	@Override
	@Transactional
	public Project create(ProjectDto projectDto) {
			//生成项目代码
			if(projectDto.getProjectNumber() == null || projectDto.getProjectNumber().isEmpty()){
				//根据基础数据id查询出基础数据
				BasicData basicData = basicDataRepo.findById(projectDto.getProjectIndustry());
				String number = Util.getProjectNumber(projectDto.getProjectInvestmentType(), basicData);
				projectDto.setProjectNumber(number);
				//行业项目统计累加
				basicData.setCount(basicData.getCount()+1);
			}
			Project project = super.create(projectDto);		
			//处理关联信息
			projectDto.getAttachmentDtos().forEach(x -> {//添加新附件
				project.getAttachments().add(attachmentMapper.buildEntity(x, new Attachment()));
			});
			//月报
			projectDto.getMonthReportDtos().forEach(x -> {//添加新月报
				project.getMonthReports().add(monthReportMapper.buildEntity(x, new MonthReport()));
			});			
			//保存数据
			super.repository.save(project);
			logger.info(String.format("创建项目,项目名称 %s",projectDto.getProjectName()));
			return project;	
	}
	
	@Override
	@Transactional
	public List<ProjectDto> getProjectByNumber(String number) {
		//根据项目代码来获取项目信息
		Criterion criterion=Restrictions.eq(Project_.projectNumber.getName(), number);
		List<Project> findProjects = super.repository.findByCriteria(criterion);
		List<ProjectDto> projectDtos = new ArrayList<>();
		findProjects.stream().forEach(x->{
			ProjectDto dto = new ProjectDto();
			projectMapper.buildEntity(dto, x);
			projectDtos.add(dto);
		});
		return projectDtos;
	}
	 
}

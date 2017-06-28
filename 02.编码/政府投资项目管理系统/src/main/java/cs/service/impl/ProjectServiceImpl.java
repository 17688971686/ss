package cs.service.impl;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.Attachment;
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
		Criterion criterion=Restrictions.eq(Project_.projectNumber.getName(), projectDto.getProjectNumber());
		Optional<Project> findProject = super.repository.findByCriteria(criterion).stream().findFirst();
		if(findProject.isPresent()){
			throw new IllegalArgumentException(String.format("项目代码：%s 已经存在,请重新输入！", projectDto.getProjectNumber()));
		}else{			
			Project project = super.create(projectDto);		
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
			logger.info(String.format("创建项目,项目名称 %s",projectDto.getProjectName()));
			return project;		
		}	
	}
	 
}

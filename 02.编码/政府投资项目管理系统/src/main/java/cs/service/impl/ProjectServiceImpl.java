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

import cs.common.ICurrentUser;
import cs.domain.Project;
import cs.domain.Project_;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DtoMapper.AttachmentMapper;
import cs.model.DtoMapper.ProjectMapper;
import cs.repository.interfaces.ProjectRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ProjectService;

@Service
public class ProjectServiceImpl implements ProjectService {
	private static Logger logger = Logger.getLogger(ProjectServiceImpl.class);
	
	@Autowired
	private ProjectRepo projectRepo;
	@Autowired
	private BasicDataService basicDataService;
	
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<ProjectDto> get(ODataObj odataObj) {
		List<ProjectDto> projectDtos=new ArrayList<>();
		projectRepo.findByOdata(odataObj).forEach(x->{
			
			ProjectDto projectDto=ProjectMapper.toDto(x);
			projectDto.setProjectStageDesc(basicDataService.getDescriptionById(x.getProjectStage()));
			projectDto.setProjectTypeDesc(basicDataService.getDescriptionById(x.getProjectType()));
			projectDto.setProjectIndustryDesc(basicDataService.getDescriptionById(x.getProjectIndustry()));
			projectDto.setProjectClassifyDesc(basicDataService.getDescriptionById(x.getProjectClassify()));
			//获取月报中项目进度的名称
			projectDto.getMonthReportDtos().forEach(y->{
				y.setSelfReviewDesc(basicDataService.getDescriptionById(y.getSelfReview()));
			});
						
			projectDtos.add(projectDto);	
			
		});
		PageModelDto<ProjectDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(projectDtos);
		return pageModelDto;	
	}

	@Override
	@Transactional
	public void deleteProject(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void deleteProjects(String[] ids) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void updateProject(ProjectDto projectDto) {
		Project project = projectRepo.findById(projectDto.getId());
		//进行数据转换
		project.getAttachments().clear();
		ProjectMapper.buildEntity(projectDto,project);
		//设置修改人
		String longinName = currentUser.getLoginName();
		project.setModifiedBy(longinName);
		project.setModifiedDate(new Date());
		//保存数据
		projectRepo.save(project);
		logger.info(String.format("编辑项目,项目名称 %s",projectDto.getProjectName()));
				
	}

	@Override
	@Transactional
	public void createProject(ProjectDto projectDto) {		
		Criterion criterion=Restrictions.eq(Project_.projectNumber.getName(), projectDto.getProjectNumber());
		Optional<Project> findProject = projectRepo.findByCriteria(criterion).stream().findFirst();
		if(findProject.isPresent()){
			throw new IllegalArgumentException(String.format("项目代码：%s 已经存在,请重新输入！", projectDto.getProjectNumber()));
		}else{
			Project project = new Project();
			//进行数据转换
			ProjectMapper.buildEntity(projectDto,project);
			
			//设置创建人和修改人
			String longinName = currentUser.getLoginName();
			project.setCreatedBy(longinName);
			project.setModifiedBy(longinName);
			//保存数据
			projectRepo.save(project);
			logger.info(String.format("创建项目,项目名称 %s",projectDto.getProjectName()));
		}
		
	}

	@Override
	@Transactional
	public PageModelDto<ProjectDto> getUnitProject(ODataObj odataObj) {
		//获取当前登录用户（单位）
		String longinName = currentUser.getLoginName();
		//添加一个过滤，只获取当前单位所拥有的项目
		List<ODataFilterItem> filters = odataObj.getFilter();
		ODataFilterItem filter = new ODataFilterItem();
		filter.setField("unitName");
		filter.setOperator("eq");
		filter.setValue(longinName);
		filters.add(filter);
		odataObj.setFilter(filters);
		PageModelDto<ProjectDto> pageModelDto = this.get(odataObj);
		return pageModelDto;
	}

	@Override
	@Transactional
	public void updateUnitProject(ProjectDto projectDto) {
		this.updateProject(projectDto);	
	}

	@Override
	@Transactional
	public void createUnitProject(ProjectDto projectDto) {
		this.createProject(projectDto);	
		
	}


	 
}

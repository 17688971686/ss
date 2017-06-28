package cs.service.impl;

import java.util.Date;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

import cs.domain.Project;
import cs.domain.Project_;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;

@Service
public class ProjectServiceImpl extends AbstractServiceImpl<ProjectDto, Project, String> implements ProjectService {
	private static Logger logger = Logger.getLogger(ProjectServiceImpl.class);
	
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
		//todo
		
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
			//todo
			
			//保存数据
			super.repository.save(project);
			logger.info(String.format("创建项目,项目名称 %s",projectDto.getProjectName()));
			return project;		
		}	
	}
	 
}

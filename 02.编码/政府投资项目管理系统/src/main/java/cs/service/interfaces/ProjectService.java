package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;

public interface ProjectService {
	PageModelDto<ProjectDto> get(ODataObj odataObj);
	
	void deleteProject(String id);

	void deleteProjects(String[] ids);
	
	void updateProject(ProjectDto projectDto);
	
	void createProject(ProjectDto projectDto);
	
	//begin#单位相关操作
	void updateUnitProject(ProjectDto projectDto);	
	void createUnitProject(ProjectDto projectDto);
}

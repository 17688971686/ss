package cs.service.interfaces;

import java.util.List;
import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;


public interface ProjectService extends IService<ProjectDto, Project, String> {		
	void updateProjectByIsMonthReport(ProjectDto projectDto);//更新项目是否月报
	
	List<ProjectDto> getProjectByNumber(String number);//根据项目代码查询项目
	
	void updateVersion(String id,Boolean isLatestVersion);//更新项目的版本
	
	PageModelDto<ProjectDto> Get(ODataObj odataObj);//分页查询带有单位名的项目
	
	PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter);//分页查询带有单位名且包含所有已纳入项目库的项目
}

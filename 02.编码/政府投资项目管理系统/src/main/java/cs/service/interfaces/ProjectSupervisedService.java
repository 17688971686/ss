package cs.service.interfaces;

import java.util.List;

import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataObj;

/**
 * @author Administrator
 *项目信息服务层
 */
public interface ProjectSupervisedService extends IService<ProjectDto, Project, String>{
	/**
	 * 更新项目是否月报
	 * @param projectDto
	 */
	void updateProjectByIsMonthReport(ProjectDto projectDto);
	
	/**
	 * 根据项目代码查询项目
	 * @param number
	 * @return
	 */
	List<ProjectDto> getProjectByNumber(String number);
	
	/**
	 * 更新项目的版本
	 * @param id
	 * @param isLatestVersion
	 */
	void updateVersion(String id,Boolean isLatestVersion);
	
	/**
	 * 分页查询带有单位名的项目
	 * @param odataObj
	 * @return
	 */
	PageModelDto<ProjectDto> Get(ODataObj odataObj);
	/**
	 * 查询单位所有项目
	 * @param odataObj
	 * @param isFilters
	 * @param hasUnitFilter
	 * @param isUnitFilter
	 * @return
	 */
	PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter);//分页查询带有单位名且包含所有已纳入项目库的项目
}

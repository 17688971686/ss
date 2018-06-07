package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.Statistics.sttisticsData;
import cs.model.Statistics.ProjectStageData;
import cs.model.Statistics.ProjectStatisticsBean;
import cs.repository.odata.ODataObj;


public interface ProjectService extends IService<ProjectDto, Project, String> {		
	
	void updateProjectByIsMonthReport(String id,Boolean isMonthReport);//更新项目是否月报
	
	List<ProjectDto> getProjectByNumber(String number);//根据项目代码查询项目
	
	void updateVersion(String id,Boolean isLatestVersion);//更新项目的版本
	
	PageModelDto<ProjectDto> Get(ODataObj odataObj);//分页查询带有单位名的项目
	
	PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter);//分页查询带有单位名且包含所有已纳入项目库的项目

	/*******以下方法用于项目统计************/
	List<ProjectStageData> getStageProjects();

	List<ProjectStageData> getMonthReportProjects();

	List<ProjectStageData> getIndustryProjects();

	List<sttisticsData> getprojectByHYData();
	
	List<sttisticsData> getprojectInvestSourceData();
	
	List<ProjectStatisticsBean> getProjectStatistics(String type,String isIncludLibrary);//固定模板项目统计
	
//	List<ProjectStatisticsBean> getProjectStatisticsByCustom(List<String> industrySelected,List<String> stageSelected,List<String> categorySelected,
//																List<String> unitSelected,Double investSumBegin,Double investSumEnd);//自定义条件项目统计
	List<ProjectStatisticsBean> getProjectStatisticsByCustom(String[] industrySelected,String[] stageSelected,String[] categorySelected,
			String[] unitSelected,Double investSumBegin,Double investSumEnd,String projectName);//自定义条件项目统计
}

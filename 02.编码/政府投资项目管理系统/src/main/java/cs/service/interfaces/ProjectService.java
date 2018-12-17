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


/**
 * @author Administrator
 *项目管理服务层
 */
public interface ProjectService extends IService<ProjectDto, Project, String> {		
	
	/**
	 * 更新项目是否月报
	 * @param id
	 * @param isMonthReport
	 */
	void updateProjectByIsMonthReport(String id,Boolean isMonthReport);
	
	/**
	 * 根据项目代码查询项目
	 *
	 */
	List<ProjectDto> getProjectByNumber(String number);
	
	/**
	 * 更新项目的版本
	 * @param id PROJECT ID 
	 * @param isLatestVersion 当前版本
	 */
	void updateVersion(String id,Boolean isLatestVersion);
	
	/**
	 * 分页查询带有单位名的项目
	 * @param odataObj
	 * @return
	 */
	PageModelDto<ProjectDto> Get(ODataObj odataObj);
	
	/**
	 * 查询单位所有项目信息
	 * @param odataObj
	 * @param isFilters
	 * @param hasUnitFilter
	 * @param isUnitFilter
	 * @return
	 */
	PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter);//分页查询带有单位名且包含所有已纳入项目库的项目

	/*******以下方法用于项目统计************/
	/**
	 * 根据状态查询项目
	 * @return
	 */
	List<ProjectStageData> getStageProjects();
	/**
	 * 根据月报查询项目
	 * @return
	 */
	List<ProjectStageData> getMonthReportProjects();
	/**
	 * 根据类型查询项目
	 * @return
	 */
	List<ProjectStageData> getIndustryProjects();
	/**
	 * 根据类型查询项目
	 * @return
	 */
	List<sttisticsData> getprojectByHYData();
	/**
	 * 根据类型查询项目
	 * @return
	 */
	List<sttisticsData> getprojectInvestSourceData();
	
	/**
	 * 固定模板项目统计
	 * @param type
	 * @param isIncludLibrary 是否加入项目库
	 * @return
	 */
	List<ProjectStatisticsBean> getProjectStatistics(String type,String isIncludLibrary);

	/**
	 * 项目资金统计
	 * @param isIncludLibrary
	 * @param stageSelected 项目状态
	 * @param projectStageSelected 流程状态
	 * @param projectName 项目名
	 * @param unitSelected 单位信息
	 * @param industrySelected 类型
	 * @param categorySelected
	 * @return
	 */
	List<ProjectStatisticsBean> getMoneyStatistics(String isIncludLibrary,String[] stageSelected,String[] projectStageSelected,String projectName,
			 String[] unitSelected,String[] industrySelected,String[] categorySelected);
	
	/**
	 * 自定义条件项目统计
	 * @param industrySelected
	 * @param stageSelected
	 * @param categorySelected
	 * @param unitSelected
	 * @param investSumBegin
	 * @param investSumEnd
	 * @param projectName
	 * @return
	 */
	List<ProjectStatisticsBean> getProjectStatisticsByCustom(String[] industrySelected,String[] stageSelected,String[] categorySelected,
			String[] unitSelected,Double investSumBegin,Double investSumEnd,String projectName);//自定义条件项目统计

	 /**
     * 根据上传的Excel更新已拨付数
     *
     * @param filePath
     */
	Map<String, Object> updateAlreadyDisbursedByExcel(String filePath);

	/**
	 * 查询项目编号
	 * @param projectNumber
	 * @param ignoreProject
	 * @return
	 */
	boolean projectNumberExists(String projectNumber, String ignoreProject);

	/**
	 * 更新项目编号
	 * @param projectId
	 * @param projectNumber
	 */
	void updateProjectNumber(String projectId, String projectNumber);

	/**
	 * 获取项目序列号
	 * @param projectId
	 * @return
	 */
	int getProjectSequenceNumberInYear(String projectId);

	/**
	 * 处理批复文件
	 * @param project
	 */
	void handlePiFuFile(Project project);

}

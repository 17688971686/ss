package cs.service.interfaces;

import java.util.List;

import cs.domain.YearPlan;
import cs.model.DomainDto.ProjectDto;
import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.Statistics.sttisticsData;
import cs.model.exportExcel.ExcelDataDWTJ;
import cs.model.exportExcel.ExcelDataHYTJ;
import cs.model.exportExcel.ExcelDataLBTJ;
import cs.model.exportExcel.ExcelDataYS;
import cs.model.exportExcel.YearPlanStatistics;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;

/**
 * @author Administrator
 *年度计划管理服务层
 */
public interface YearPlanService extends IService<YearPlanDto, YearPlan, String>{
	/**
	 * 查询年度计划申报信息
	 * @param planId 年度计划ID
	 * @param odataObj
	 * @param exclude
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId, ODataObjNew odataObj, boolean exclude);
	/**
	 * 添加年度计划资金
	 * @param planId
	 * @param ids
	 */
	void addYearPlanCapitals(String planId,String[] ids);
	/**
	 * 添加年度计划资金
	 * @param planId
	 * @param shenBaoId
	 */
	void addYearPlanCapital(String planId,String shenBaoId);
	/**
	 * 删除年度计划资金安排
	 * @param planId
	 * @param yearPlanCapitalId
	 */
	void removeYearPlanCapital(String planId,String[] yearPlanCapitalId);
	/**
	 * 查询年度计划
	 * @param planId
	 * @return
	 */
	List<YearPlanStatistics> getStatistics(String planId);
	/**
	 * 根据项目类别统计
	 * @param planId
	 * @return
	 */
	List<ExcelDataLBTJ> getYearPlanShenBaoInfoByLBTJ(String planId);
	/**
	 * 根据项目行业统计
	 * @param planId
	 * @return
	 */
	List<ExcelDataHYTJ> getYearPlanShenBaoInfoByHYTJ(String planId);
	/**
	 * 根据建设单位统计
	 * @param planId
	 * @return
	 */
	List<ExcelDataDWTJ> getYearPlanShenBaoInfoByDWTJ(String planId);
	/**
	 * 印刷版统计
	 * @param planId
	 * @return
	 */
	List<ExcelDataYS> getYearPlanShenBaoInfoByYS(String planId);
	
	List<sttisticsData> getyearPlanByHYData();
	
	List<sttisticsData> getyearPlanInvestSourceData();
	/**
	 * 根据建设单位id查找，包含本建设单位的打包计划
	 * @param unitId 单位ID
	 * @param odataObj
	 * @return
	 */
	PageModelDto<YearPlanDto> getYearPlanAllocationCapital(String unitId,ODataObj odataObj);
	/**
	 * 查询年度计划打包信息
	 * @param planId 年度计划ID
	 * @param odataObj
	 * @return
	 */
	PageModelDto<PackPlanDto> getYearPlanPack(String planId,ODataObj odataObj);
	/**
	 * 年度计划添加打包信息
	 * @param planId 年度计划ID
	 * @param ids 打包信息ID 集合
	 */
	void addYearPlanPacks(String planId,String[] ids);
	/**
	 * 年度计划添加打包信息
	 * @param planId
	 * @param ids
	 */
	void addYearPlanPack(String planId,String packId);
	/**
	 * 删除年度计划打包信息
	 * @param planId 年度计划ID
	 * @param yearPlanPackId 打包信息ID
	 */
	void removeYearPlanPack(String planId,String[] yearPlanPackId);

	/**
	 * 主动计划下达
	 * @param odataObj
	 * @param dto
	 */
	void activeRelease(ODataObjNew odataObj,ShenBaoInfoDto dto);

	void activeReleasePack(ODataObjNew odataObj,ShenBaoInfoDto dto);


	ShenBaoInfoDto getShenBaoInfoById(String id);

	ShenBaoInfoDto getProjectInfoById(String id);
}
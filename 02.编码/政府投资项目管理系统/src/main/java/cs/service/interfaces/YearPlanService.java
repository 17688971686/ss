package cs.service.interfaces;

import java.util.List;

import cs.domain.YearPlan;
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

public interface YearPlanService extends IService<YearPlanDto, YearPlan, String>{
	PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId, ODataObjNew odataObj, boolean exclude);
	
	void addYearPlanCapitals(String planId,String[] ids);
	
	void addYearPlanCapital(String planId,String shenBaoId);
	
	void removeYearPlanCapital(String planId,String[] yearPlanCapitalId);
	
	List<YearPlanStatistics> getStatistics(String planId);
	
	List<ExcelDataLBTJ> getYearPlanShenBaoInfoByLBTJ(String planId);//根据项目类别统计
	
	List<ExcelDataHYTJ> getYearPlanShenBaoInfoByHYTJ(String planId);//根据项目行业统计
	
	List<ExcelDataDWTJ> getYearPlanShenBaoInfoByDWTJ(String planId);//根据建设单位统计
	
	List<ExcelDataYS> getYearPlanShenBaoInfoByYS(String planId);//印刷版统计
	
	List<sttisticsData> getyearPlanByHYData();
	
	List<sttisticsData> getyearPlanInvestSourceData();
	
	PageModelDto<YearPlanDto> getYearPlanAllocationCapital(String unitId,ODataObj odataObj);//根据建设单位id查找，包含本建设单位的打包计划
	
	PageModelDto<PackPlanDto> getYearPlanPack(String planId,ODataObj odataObj);
	
	void addYearPlanPacks(String planId,String[] ids);
	
	void addYearPlanPack(String planId,String packId);
	
	void removeYearPlanPack(String planId,String[] yearPlanPackId);
}
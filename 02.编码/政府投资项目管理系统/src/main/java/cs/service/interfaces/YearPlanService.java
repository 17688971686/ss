package cs.service.interfaces;

import java.util.List;

import cs.domain.YearPlan;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.exportExcel.ExcelDataDWTJ;
import cs.model.exportExcel.ExcelDataHYTJ;
import cs.model.exportExcel.ExcelDataLBTJ;
import cs.model.exportExcel.ExcelDataYS;
import cs.model.exportExcel.YearPlanStatistics;
import cs.repository.odata.ODataObj;

public interface YearPlanService extends IService<YearPlanDto, YearPlan, String>{
	PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId,ODataObj odataObj);
	
	void addYearPlanCapitals(String planId,String[] ids);
	
	void addYearPlanCapital(String planId,String shenBaoId);
	
	void removeYearPlanCapital(String planId,String[] yearPlanCapitalId);
	
	List<YearPlanStatistics> getStatistics(String planId);
	
	List<ExcelDataLBTJ> getYearPlanShenBaoInfoByLBTJ(String planId);//根据项目类别统计
	
	List<ExcelDataHYTJ> getYearPlanShenBaoInfoByHYTJ(String planId);//根据项目行业统计
	
	List<ExcelDataDWTJ> getYearPlanShenBaoInfoByDWTJ(String planId);//根据建设单位统计
	
	List<ExcelDataYS> getYearPlanShenBaoInfoByYS(String planId);//印刷版统计
}
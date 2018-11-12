package cs.service.interfaces;

import cs.common.Response;
import cs.domain.PlanReachApproval;
import cs.model.DomainDto.ExcelReportPlanReachDto;
import cs.model.DomainDto.PlanReachApprovalDto;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

public interface PlanReachApprovalService extends IService<PlanReachApprovalDto, PlanReachApproval, String>{

	void create(Map dto) throws ParseException;

	void update(Map data) throws ParseException;

	void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney);

	void endProcess(String id);

	void endProcesss(String id);

	Response checkIsOnlys(String idstr,String planID);

	//根据计划下达id查询项目信息
	List<ExcelReportPlanReachDto> findBySql(String id);

}

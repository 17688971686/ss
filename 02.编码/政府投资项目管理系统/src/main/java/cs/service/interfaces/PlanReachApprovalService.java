package cs.service.interfaces;

import cs.common.Response;
import cs.domain.PlanReachApproval;
import cs.model.DomainDto.ExcelReportPlanReachDto;
import cs.model.DomainDto.PlanReachApprovalDto;

import java.text.ParseException;
import java.util.List;
import java.util.Map;

/**
 * @author Administrator
 *计划下达批复服务层
 */
public interface PlanReachApprovalService extends IService<PlanReachApprovalDto, PlanReachApproval, String>{

	/**
	 * 创建批复下达信息
	 * @param dto
	 * @throws ParseException
	 */
	void create(Map dto) throws ParseException;

	/**
	 * 更新批复下达信息
	 * @param data
	 * @throws ParseException
	 */
	void update(Map data) throws ParseException;

	/**
	 * 确认批复资金
	 * @param shenbaoId 申报信息ID
	 * @param ggmoney 批复公共资金
	 * @param gtmoney 批复国土资金
	 */
	void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney);

	/**
	 * 结束流程
	 * @param id 计划下达ID
	 */
	void endProcess(String id);

	void endProcesss(String id);

	/**
	 * 检查申报信息是否已加入计划下达
	 * @param idstr ID 集合
	 * @param planID 计划下达ID
	 * @return
	 */
	Response checkIsOnlys(String idstr,String planID);

	/**
	 * 根据计划下达id查询项目信息
	 * @param id 计划下达ID
	 * @return
	 */
	List<ExcelReportPlanReachDto> findBySql(String id);

}

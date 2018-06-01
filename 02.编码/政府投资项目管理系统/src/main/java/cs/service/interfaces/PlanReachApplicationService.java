package cs.service.interfaces;

import cs.domain.PlanReachApplication;
import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;

public interface PlanReachApplicationService extends IService<PlanReachApplicationDto, PlanReachApplication, String>{
	//根据计划下达id，获取计划下达中的申报数据
	PageModelDto<ShenBaoInfoDto> getShenBaoInfo(String planReachId,ODataObj odataObj);
	//根据计划下达id，获取计划下达中的打包数据
	PageModelDto<PackPlanDto> getPackPlan(String planReachId,ODataObj odataObj);
	//为计划下达批量添加申报数据
	void addShenBaoInfos(String planReachId,String[] ids);
	//为计划下达添加申报数据
	void addShenBaoInfo(String planReachId, String[] ids);
	//为计划下达添加打包数据
	void addPackPlan(String planReachId,String packPlanId);
	//为计划下达批量添加申报数据
	void addPackPlans(String planReachId,String[] ids);
	//根据打包id，获取计划下达打包类中的申报数据
	PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(String packId,ODataObj odataObj);
	void addShenBaoInfoToPacks(String packId, String[] ids);
	void addShenBaoInfoToPack(String packId, String shenbaoInfoId);
	void startProcess(String packId);
	PageModelDto<PackPlanDto> getPackPlan(ODataObj odataObj);
	void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney);
	

}

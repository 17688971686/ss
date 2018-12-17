package cs.service.interfaces;

import java.util.List;

import cs.domain.PlanReachApplication;
import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;

/**
 * @author Administrator
 *计划下达服务层
 */
public interface PlanReachApplicationService extends IService<PlanReachApplicationDto, PlanReachApplication, String> {
    /**
     * 根据计划下达id，获取计划下达中的申报数据
     * @param planReachId 计划下达ID
     * @param odataObj
     * @return pagemnodel
     */
    PageModelDto<ShenBaoInfoDto> getShenBaoInfo(String planReachId, ODataObj odataObj);

    /**
     * 根据计划下达id，获取计划下达中的打包数据
     * @param planReachId id 
     * @param odataObj
     * @return pagemodel
     */
    PageModelDto<PackPlanDto> getPackPlan(String planReachId, ODataObj odataObj);

    /**
     * 为计划下达批量添加申报数据
     * @param planReachId 计划下达ID
     * @param ids
     */
    void addShenBaoInfos(String planReachId, String[] ids);

    /**
     * 为计划下达添加打包数据
     * @param planReachId 计划下达ID
     * @param packPlanId 包ID
     */
    void addPackPlan(String planReachId, String packPlanId);

    /**
     * 为计划下达批量添加申报数据
     * @param planReachId 计划下达ID
     * @param ids
     */
    void addPackPlans(String planReachId, String[] ids);

    /**
     * 根据打包id，获取计划下达打包类中的申报数据
     * @param packId 包ID
     * @param odataObj
     * @return
     */
    PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(String packId, ODataObj odataObj);

    /**
     * 打包类中添加申报信息
     * @param packId
     * @param ids
     */
    void addShenBaoInfoToPacks(String packId, String[] ids);

    /**
     * 
     * @param packId
     * @param shenbaoInfoId
     */
    void addShenBaoInfoToPack(String packId, String shenbaoInfoId);

    /**
     * 开始计划流程
     * @param packId
     */
    void startProcess(String packId);

    /**
     * 查询打包类
     * @param odataObj
     * @return
     */
    PageModelDto<PackPlanDto> getPackPlan(ODataObj odataObj);

    /**
     * 添加申请资金
     * @param shenbaoId
     * @param ggmoney
     * @param gtmoney
     */
    void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney);

    /**
     * 删除计划下达中的申报信息
     * @param packPlanId
     * @param ids
     */
    void deleteShenBaoInfos(String packPlanId, String[] ids);

    /**
     * 
     * @param packPlanId
     * @param shenbaoId
     */
    void deleteShenBaoInfo(String packPlanId, String shenbaoId);

    /**
     * 删除打包类
     * @param packPlanId
     * @param ids
     */
    void deletePacks(String packPlanId, String[] ids);

    /**
     * 
     * @param packPlanId
     * @param shenbaoId
     */
    void deletePack(String packPlanId, String shenbaoId);

    /**
     * 删除申报信息
     * @param packPlanId
     * @param ids
     */
    void deletePlanShenBaoInfos(String packPlanId, String[] ids);

    void deletePlanShenBaoInfo(String packPlanId, String shenbaoId);

    /**
     * 获取年度计划的项目
     * @param odataObj
     * @return
     */
    PageModelDto<ShenBaoInfoDto> getShenbaoInfoFromYearplan(ODataObjNew odataObj);

    /**
     * 计划下达添加申报信息
     * @param planReachId
     * @param id
     */
    void addShenBaoInfo(String planReachId, String id);

    /**
     * 撤销流程
     * @param string
     */
    void deleteProcessOne(String string);

    /**
     * 判断计划下达是否在计划下达中
     * @param odataObj
     * @param planReachId 计划下达ID
     * @param b
     * @return pagemodel
     */
	PageModelDto<ShenBaoInfoDto> getShenBaoInfoOutOfPlanReach(ODataObj odataObj, String planReachId, boolean b);

}

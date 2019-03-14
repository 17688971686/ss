package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.Statistics.ProjectStatisticsBean;

/**
 * @author Administrator
 *项目信息管理服务层
 */
public interface ShenBaoInfoService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {
    /**
     * 后台管理--项目纳入项目库
     *
     * @param shenbaoInfoId
     */
    void addProjectToLibrary(String shenbaoInfoId);

    /**
     * 后台管理--项目纳出项目库
     * @param shenbaoInfoId
     */
    void outProjectToLibrary(String shenbaoInfoId);

    /**
     * 后台管理--更新项目基础信息
     *
     * @param dto
     */
    void updateProjectBasic(ShenBaoInfoDto dto);

    /**
     * 后台管理--年度项目库中退文
     *
     * @param dto
     */
    void updateShenBaoInfoState(ShenBaoInfoDto dto);

    /**
     * 更新项目信息
     * @param dto
     * @param isAdminUpdate 前后端用户区分
     */
    void updateShenBaoInfo(ShenBaoInfoDto dto, Boolean isAdminUpdate);

    ShenBaoInfo create(ShenBaoInfoDto dto, Boolean isAdminCreate);

    /**
     * 创建申报信息
     * @param dto
     * @param isAdminCreate
     * @return
     */
    ShenBaoInfo createShenBaoInfo(ShenBaoInfoDto dto, Boolean isAdminCreate);

    /**
     * 确认计划下达申请(安排)资金
     *
     * @param map
     * @param isManage
     */
    void comfirmPlanReach(Map map, Boolean isManage);

    /**
     * 固定模板审批类统计
     *
     * @param type
     * @param pifuDate
     * @return
     */
    List<ProjectStatisticsBean> getApprovalStatistics(String type, int pifuDate);

    /**
     * 自定义条件审批类统计
     *
     * @param pifuDateBegin
     * @param pifuDateEnd
     * @param industrySelected
     * @param stageSelected
     * @param unitSelected
     * @param investSumBegin
     * @param investSumEnd
     * @param projectName
     * @return
     */
    List<ProjectStatisticsBean> getApprovalStatisticsByCustom(Integer pifuDateBegin, Integer pifuDateEnd, String[] industrySelected,
                                                              String[] stageSelected, String[] unitSelected, Double investSumBegin, Double investSumEnd, String projectName);

    /**
     * 计划类分类统计
     *
     * @param type
     * @param planYear
     * @return
     */
    List<ProjectStatisticsBean> getPlanStatistics(String type, int planYear);

    /**
     * 自定义条件计划类统计
     *
     * @param planYearBegin
     * @param planYearEnd
     * @param industrySelected
     * @param stageSelected
     * @param unitSelected
     * @param investSumBegin
     * @param investSumEnd
     * @param apPlanReachSumBegin
     * @param apPlanReachSumEnd
     * @param projectName
     * @return
     */
    List<ProjectStatisticsBean> getPlanStatisticsByCustom(Integer planYearBegin, Integer planYearEnd, String[] industrySelected,
                                                          String[] stageSelected, String[] unitSelected, Double investSumBegin,
                                                          Double investSumEnd, Double apPlanReachSumBegin,
                                                          Double apPlanReachSumEnd, String projectName);

    /**
     * 撤回审批
     * @param pricessId
     */
    void reback(String pricessId);

    /**
     * 开始审批
     * @param processDefinitionKey
     * @param id
     */
    void startProcessShenbao(String processDefinitionKey, String id);

    /**
     * 根据ID查询项目信息
     * @param shenbaoInfoId 申报信息ID
     * @return
     */
    ShenBaoInfoDto getShenBaoInfoDtoById(String shenbaoInfoId);

    /**
     * 查询申报信息是否审批结束
     * @param dto
     * @return
     */
	Map isRecords(ShenBaoInfoDto dto);
}

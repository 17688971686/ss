package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.Statistics.ProjectStatisticsBean;

public interface ShenBaoInfoService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {
    /**
     * 后台管理--项目纳入项目库
     *
     * @param shenbaoInfoId
     */
    void addProjectToLibrary(String shenbaoInfoId);

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
    void updateShenBaoInfoState(TaskRecordDto dto);

    void updateShenBaoInfo(ShenBaoInfoDto dto, Boolean isAdminUpdate);

    ShenBaoInfo create(ShenBaoInfoDto dto, Boolean isAdminCreate);

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

    void reback(String pricessId);

    void startProcessShenbao(String processDefinitionKey, String id);

    ShenBaoInfoDto getShenBaoInfoDtoById(String shenbaoInfoId);

	Map isRecords(ShenBaoInfoDto dto);
}

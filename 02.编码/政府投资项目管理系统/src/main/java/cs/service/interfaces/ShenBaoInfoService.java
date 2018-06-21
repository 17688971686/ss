package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.Statistics.ProjectStatisticsBean;

public interface ShenBaoInfoService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {
	public void addProjectToLibrary(String shenbaoInfoId);//后台管理--项目纳入项目库
	public void updateProjectBasic(ShenBaoInfoDto dto);//后台管理--更新项目基础信息
	public void updateShenBaoInfoState(TaskRecordDto dto);//后台管理--年度项目库中退文
	public void updateShenBaoInfo(ShenBaoInfoDto dto,Boolean isAdminUpdate);
	public ShenBaoInfo createShenBaoInfo(ShenBaoInfoDto dto,Boolean isAdminCreate);
	@SuppressWarnings("rawtypes")
	public void comfirmPlanReach(Map map,Boolean isManage);//确认计划下达申请(安排)资金
	
	List<ProjectStatisticsBean> getApprovalStatistics(String type,int pifuDate);//固定模板审批类统计
	List<ProjectStatisticsBean> getApprovalStatisticsByCustom(Integer pifuDateBegin,Integer pifuDateEnd,String[] industrySelected,
			String[] stageSelected,String[] unitSelected,Double investSumBegin,Double investSumEnd,String projectName);//自定义条件审批类统计
	
	List<ProjectStatisticsBean> getPlanStatistics(String type,int planYear);//计划类分类统计	
	List<ProjectStatisticsBean> getPlanStatisticsByCustom(Integer planYearBegin,Integer planYearEnd,String[] industrySelected,
			String[] stageSelected,String[] unitSelected,Double investSumBegin,Double investSumEnd,Double apPlanReachSumBegin,Double apPlanReachSumEnd,String projectName);//自定义条件计划类统计
	void reback(String pricessId);
	void startProcessShenbao(String processDefinitionKey, String id);
	public ShenBaoInfoDto getShenBaoInfoDtoById(String shenbaoInfoId);
}

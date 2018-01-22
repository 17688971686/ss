package cs.service.interfaces;

import java.util.Map;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;

public interface ShenBaoInfoService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {
	public void addProjectToLibrary(String shenbaoInfoId);//后台管理--项目纳入项目库
	public void updateProjectBasic(ShenBaoInfoDto dto);//后台管理--更新项目基础信息
	public void updateShenBaoInfoState(TaskRecordDto dto);//后台管理--年度项目库中退文
	public void updateShenBaoInfo(ShenBaoInfoDto dto,Boolean isAdminUpdate);
	public void createShenBaoInfo(ShenBaoInfoDto dto,Boolean isAdminCreate);
	@SuppressWarnings("rawtypes")
	public void comfirmPlanReach(Map map);//确认计划下达申请资金
}

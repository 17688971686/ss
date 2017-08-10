package cs.service.interfaces;

import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.TaskRecordDto;

public interface ShenBaoInfoService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {
	public void updateShenBaoInfoState(TaskRecordDto dto);//后台管理--年度项目库中退文
	public void updateShenBaoInfoAuditState(String id,String auditState);//后台管理--更新申报信息的审核状态
	public void updateShenBaoInfo(ShenBaoInfoDto dto);
}

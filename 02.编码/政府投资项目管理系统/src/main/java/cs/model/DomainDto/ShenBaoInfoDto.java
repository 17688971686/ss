package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.ShenBaoInfo;

public class ShenBaoInfoDto extends ShenBaoInfo {
	private ShenBaoUnitInfoDto bianZhiUnitInfoDto=new ShenBaoUnitInfoDto();
	private ShenBaoUnitInfoDto shenBaoUnitInfoDto=new ShenBaoUnitInfoDto();
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	public ShenBaoUnitInfoDto getBianZhiUnitInfoDto() {
		return bianZhiUnitInfoDto;
	}
	public void setBianZhiUnitInfoDto(ShenBaoUnitInfoDto bianZhiUnitInfoDto) {
		this.bianZhiUnitInfoDto = bianZhiUnitInfoDto;
	}
	public ShenBaoUnitInfoDto getShenBaoUnitInfoDto() {
		return shenBaoUnitInfoDto;
	}
	public void setShenBaoUnitInfoDto(ShenBaoUnitInfoDto shenBaoUnitInfoDto) {
		this.shenBaoUnitInfoDto = shenBaoUnitInfoDto;
	}
	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}
	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}
}

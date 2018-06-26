package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.PlanReachApproval;

public class PlanReachApprovalDto extends PlanReachApproval{
	private List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();

	public List<ShenBaoInfoDto> getShenBaoInfoDtos() {
		return shenBaoInfoDtos;
	}

	public void setShenBaoInfoDtos(List<ShenBaoInfoDto> shenBaoInfoDtos) {
		this.shenBaoInfoDtos = shenBaoInfoDtos;
	}
}

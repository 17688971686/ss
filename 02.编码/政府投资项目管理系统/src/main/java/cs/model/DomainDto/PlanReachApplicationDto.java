package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.PlanReachApplication;

public class PlanReachApplicationDto extends PlanReachApplication{
	private List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();

	public List<ShenBaoInfoDto> getShenBaoInfoDtos() {
		return shenBaoInfoDtos;
	}

	public void setShenBaoInfoDtos(List<ShenBaoInfoDto> shenBaoInfoDtos) {
		this.shenBaoInfoDtos = shenBaoInfoDtos;
	}
	
}

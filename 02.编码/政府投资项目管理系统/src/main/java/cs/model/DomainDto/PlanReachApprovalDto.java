package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.PlanReachApproval;
/**
 * @author cx
 * @ClassName: planReachApproval
 * @Description: 计划下达批复实体表
 * @date 2018年3月12日 下午3:45:45
 */
public class PlanReachApprovalDto extends PlanReachApproval{
	private List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();

	public List<ShenBaoInfoDto> getShenBaoInfoDtos() {
		return shenBaoInfoDtos;
	}

	public void setShenBaoInfoDtos(List<ShenBaoInfoDto> shenBaoInfoDtos) {
		this.shenBaoInfoDtos = shenBaoInfoDtos;
	}
}

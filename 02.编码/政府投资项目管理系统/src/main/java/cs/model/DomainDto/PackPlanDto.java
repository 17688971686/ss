package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.PackPlan;

/**
 * @Description: 年度打包计划实体类
 * @author wxy
 * @Date: 2018年04月26日
 */
public class PackPlanDto extends PackPlan{
	
	List<AllocationCapitalDto> allocationCapitalDtos = new ArrayList<>();
	
	List<ShenBaoInfoDto> shenBaoInfoDtos = new ArrayList<>();

	public List<AllocationCapitalDto> getAllocationCapitalDtos() {
		return allocationCapitalDtos;
	}

	public void setAllocationCapitalDtos(List<AllocationCapitalDto> allocationCapitalDtos) {
		this.allocationCapitalDtos = allocationCapitalDtos;
	}

	public List<ShenBaoInfoDto> getShenBaoInfoDtos() {
		return shenBaoInfoDtos;
	}

	public void setShenBaoInfoDtos(List<ShenBaoInfoDto> shenBaoInfoDtos) {
		this.shenBaoInfoDtos = shenBaoInfoDtos;
	}
	
}

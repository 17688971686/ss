package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.AllocationCapital;

/**
 * @description: 打包类 资金编制实体类
 * @author Administrator
 * @Date: 2017/04/16
 */
public class AllocationCapitalDto extends AllocationCapital{
	List<AllocationCapitalDto> allocationCapitalDtos = new ArrayList<>();

	public List<AllocationCapitalDto> getAllocationCapitalDtos() {
		return allocationCapitalDtos;
	}

	public void setAllocationCapitalDtos(List<AllocationCapitalDto> allocationCapitalDtos) {
		this.allocationCapitalDtos = allocationCapitalDtos;
	}
	
	
}

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

	private double sumggys;
	private double sumgtzj;
	private double sumggys_surplus;
	private double sumgtzj_surplus;

	public double getSumggys_surplus() {
		return sumggys_surplus;
	}

	public void setSumggys_surplus(double sumggys_surplus) {
		this.sumggys_surplus = sumggys_surplus;
	}

	public double getSumgtzj_surplus() {
		return sumgtzj_surplus;
	}

	public void setSumgtzj_surplus(double sumgtzj_surplus) {
		this.sumgtzj_surplus = sumgtzj_surplus;
	}

	List<AllocationCapitalDto> allocationCapitalDtos = new ArrayList<>();

	public List<AllocationCapitalDto> getAllocationCapitalDtos() {
		return allocationCapitalDtos;
	}

	public void setAllocationCapitalDtos(List<AllocationCapitalDto> allocationCapitalDtos) {
		this.allocationCapitalDtos = allocationCapitalDtos;
	}
	public double getSumggys() {
		return sumggys;
	}

	public void setSumggys(double sumggys) {
		this.sumggys = sumggys;
	}

	public double getSumgtzj() {
		return sumgtzj;
	}

	public void setSumgtzj(double sumgtzj) {
		this.sumgtzj = sumgtzj;
	}
	
}

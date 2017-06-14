package cs.model.DomainDto;

import cs.domain.ShenBaoUnitInfo;

public class ShenBaoUnitInfoDto extends ShenBaoUnitInfo {
	private String unitPropertyDesc;
	private String divisionDesc;

	public String getUnitPropertyDesc() {
		return unitPropertyDesc;
	}

	public void setUnitPropertyDesc(String unitPropertyDesc) {
		this.unitPropertyDesc = unitPropertyDesc;
	}

	public String getDivisionDesc() {
		return divisionDesc;
	}

	public void setDivisionDesc(String divisionDesc) {
		this.divisionDesc = divisionDesc;
	}
}

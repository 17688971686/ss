package cs.model.DomainDto;

import cs.domain.UserUnitInfo;

public class UserUnitInfoDto extends UserUnitInfo {
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

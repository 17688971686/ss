package cs.model.DomainDto;

import cs.domain.UserUnitInfo;

public class UserUnitInfoDto extends UserUnitInfo {
	private String unitPropertyDesc;

	public String getUnitPropertyDesc() {
		return unitPropertyDesc;
	}

	public void setUnitPropertyDesc(String unitPropertyDesc) {
		this.unitPropertyDesc = unitPropertyDesc;
	}

}

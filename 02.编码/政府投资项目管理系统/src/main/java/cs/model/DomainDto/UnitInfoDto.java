package cs.model.DomainDto;

import cs.domain.ShenBaoUnitInfo;

public class UnitInfoDto extends ShenBaoUnitInfo{
	private String unitPropertyValue;//单位性质（名称）

	public String getUnitPropertyValue() {
		return unitPropertyValue;
	}

	public void setUnitPropertyValue(String unitPropertyValue) {
		this.unitPropertyValue = unitPropertyValue;
	}
	
}

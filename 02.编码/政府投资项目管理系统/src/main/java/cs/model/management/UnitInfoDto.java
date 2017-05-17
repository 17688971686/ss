package cs.model.management;

import cs.domain.UnitInfo;

public class UnitInfoDto extends UnitInfo{
	private String unitPropertyValue;//单位性质（名称）

	public String getUnitPropertyValue() {
		return unitPropertyValue;
	}

	public void setUnitPropertyValue(String unitPropertyValue) {
		this.unitPropertyValue = unitPropertyValue;
	}
	
}

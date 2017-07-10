package cs.model.DomainDto;

import cs.domain.ShenBaoUnitInfo;
/**
 * @Description: 单位信息实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class UnitInfoDto extends ShenBaoUnitInfo{
	private String unitPropertyValue;//单位性质（名称）

	public String getUnitPropertyValue() {
		return unitPropertyValue;
	}

	public void setUnitPropertyValue(String unitPropertyValue) {
		this.unitPropertyValue = unitPropertyValue;
	}
	
}

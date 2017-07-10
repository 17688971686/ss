package cs.model.DomainDto;

import cs.domain.ShenBaoUnitInfo;
/**
 * @Description: 申报信息单位实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
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

package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * @Description： 打包类资金编制表
 * @author： wxy
 * @Dete: 2018/04/16
 */
@Entity
@Table(name="cs_allocationCapital")
public class AllocationCapital extends BaseEntity{
	
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位ID'")
	private String unitId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位名称'")
	private String unitName;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金设置-公共预算'")
	private Double capital_ggys=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金设置-国土资金'")
	private Double capital_gtzj=0.0;

	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '剩余资金-公共预算'")
	private Double capital_ggys_surplus=0.0;

	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '剩余资金-国土资金'")
	private Double capital_gtzj_surplus=0.0;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUnitId() {
		return unitId;
	}

	public void setUnitId(String unitId) {
		this.unitId = unitId;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public Double getCapital_ggys() {
		return capital_ggys;
	}

	public void setCapital_ggys(Double capital_ggys) {
		this.capital_ggys = capital_ggys;
	}

	public Double getCapital_gtzj() {
		return capital_gtzj;
	}

	public void setCapital_gtzj(Double capital_gtzj) {
		this.capital_gtzj = capital_gtzj;
	}

	public Double getCapital_ggys_surplus() {
		return capital_ggys_surplus;
	}

	public void setCapital_ggys_surplus(Double capital_ggys_surplus) {
		this.capital_ggys_surplus = capital_ggys_surplus;
	}

	public Double getCapital_gtzj_surplus() {
		return capital_gtzj_surplus;
	}

	public void setCapital_gtzj_surplus(Double capital_gtzj_surplus) {
		this.capital_gtzj_surplus = capital_gtzj_surplus;
	}


}

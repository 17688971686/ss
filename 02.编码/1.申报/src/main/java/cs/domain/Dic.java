package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 字典表(下拉列表)
 * @author Administrator
 *
 */
@Entity
@Table(name="cs-dic")
public class Dic {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(columnDefinition="int(4) COMMENT '字典值'")
	private Integer dicValue;
	@Column(columnDefinition="varchar(225) COMMENT '字典名称'")
	private String dicName;
	@Column(columnDefinition="int(4) NOT NULL COMMENT '是否启用'")
	private Integer isEnabled;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public Integer getDicValue() {
		return dicValue;
	}
	public void setDicValue(Integer dicValue) {
		this.dicValue = dicValue;
	}
	public String getDicName() {
		return dicName;
	}
	public void setDicName(String dicName) {
		this.dicName = dicName;
	}
	public Integer getIsEnabled() {
		return isEnabled;
	}
	public void setIsEnabled(Integer isEnabled) {
		this.isEnabled = isEnabled;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	
}

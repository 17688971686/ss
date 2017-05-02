package cs.model;

/**
 * 字典表(下拉列表)
 * @author Administrator
 *
 */

public class DicDto {

	private long id;
	private Integer dicValue;//字典值
	private String dicName;//字典名称
	private Integer isEnabled = 1;//是否启用   1:启用  0:不启用
	private String remark;//备注
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
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public Integer getIsEnabled() {
		return isEnabled;
	}
	public void setIsEnabled(Integer isEnabled) {
		this.isEnabled = isEnabled;
	}
	
	
}

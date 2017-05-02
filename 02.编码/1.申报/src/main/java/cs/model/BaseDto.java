package cs.model;

import java.util.Date;

import cs.common.Util;

public class BaseDto {
	private String createdDate;//创建时间
	private String createdBy;//创建人
	private String modifiedDate;//修改时间
	private String modifiedBy;//修改人
	public String getCreatedDate() {
		return createdDate;
	}
	public void setCreatedDate(Date createdDate) {
		this.createdDate = Util.formatDate(createdDate);
	}
	public String getCreatedBy() {
		return createdBy;
	}
	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}
	public String getModifiedDate() {
		return modifiedDate;
	}
	public void setModifiedDate(Date modifiedDate) {
		this.modifiedDate = Util.formatDate(modifiedDate);
	}
	public String getModifiedBy() {
		return modifiedBy;
	}
	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}
}

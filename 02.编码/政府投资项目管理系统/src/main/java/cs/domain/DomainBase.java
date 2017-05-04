package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;



@MappedSuperclass
public abstract class DomainBase {
	@Temporal(TemporalType.TIMESTAMP)	
	@Column(updatable=false,nullable=false,columnDefinition="datetime  COMMENT '创建时间'")
	private Date createdDate=new Date();
	@Column(updatable=false,nullable=false,columnDefinition="varchar(255)  COMMENT '创建者'")
	private String createdBy="";
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(nullable=false,columnDefinition="datetime  COMMENT '更新时间'")
	private Date modifiedDate=new Date();
	@Column(nullable=false,columnDefinition="varchar(255)  COMMENT '更新者'")
	private String modifiedBy="";
	
	@Column(columnDefinition="int(11)  COMMENT '排序'")
	private Integer itemOrder;
	
	public Date getModifiedDate() {
		return modifiedDate;
	}

	public void setModifiedDate(Date modifiedDate) {		
		this.modifiedDate =  modifiedDate;
	}	

	public Date getCreatedDate() {
		return createdDate;
	}

	public void setCreatedDate(Date createdDate) {
		this.createdDate = createdDate;
	}

	public String getCreatedBy() {
		return createdBy;
	}

	public void setCreatedBy(String createdBy) {
		this.createdBy = createdBy;
	}

	public String getModifiedBy() {
		return modifiedBy;
	}

	public void setModifiedBy(String modifiedBy) {
		this.modifiedBy = modifiedBy;
	}

	public Integer getItemOrder() {
		return itemOrder;
	}

	public void setItemOrder(Integer itemOrder) {
		this.itemOrder = itemOrder;
	}

	

	
	
	
}

package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/*
 * 
 * 审批单位
 */
@Entity
@Table(name="cs_shenpiunit")
public class ShenPiUnit  extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '审批单位名称'")
	private String shenpiUnitName;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '审批单位地址'")
	private String  shenpiUnitAddress;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '主要联系人'")
	private String contacts;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '主要联系人电话'")
	private String contactsTel;
	
	@Column(columnDefinition="varchar(255) COMMENT '主要联系人邮箱'")
	private String email;
	
	@Column(columnDefinition="varchar(255) COMMENT '主要联系人传真'")
	private String fax;
	
	@Column(columnDefinition="varchar(255)  COMMENT '审批单位介绍'")
	private String introduce;
	
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getShenpiUnitName() {
		return shenpiUnitName;
	}

	public void setShenpiUnitName(String shenpiUnitName) {
		this.shenpiUnitName = shenpiUnitName;
	}

	public String getShenpiUnitAddress() {
		return shenpiUnitAddress;
	}

	public void setShenpiUnitAddress(String shenpiUnitAddress) {
		this.shenpiUnitAddress = shenpiUnitAddress;
	}

	public String getContacts() {
		return contacts;
	}

	public void setContacts(String contacts) {
		this.contacts = contacts;
	}

	public String getContactsTel() {
		return contactsTel;
	}

	public void setContactsTel(String contactsTel) {
		this.contactsTel = contactsTel;
	}

	public String getEmail() {
		return email;
	}

	public void setEmail(String email) {
		this.email = email;
	}

	public String getFax() {
		return fax;
	}

	public void setFax(String fax) {
		this.fax = fax;
	}

	public String getIntroduce() {
		return introduce;
	}

	public void setIntroduce(String introduce) {
		this.introduce = introduce;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
}

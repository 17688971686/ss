package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cs_userUnitInfo")
public class UserUnitInfo extends DomainBase {
	@Id
	private String id;	
	
	@Column(columnDefinition="varchar(255)  COMMENT '和单位信息关联的用户名'")
	private String userName;
	//begin#单位基本信息
	@Column(columnDefinition="varchar(255)  COMMENT '单位名称'")
	private String unitName;
	@Column(columnDefinition="varchar(255)  COMMENT '组织机构代码'")
	private String orgCode;	
	@Column(columnDefinition="varchar(50) COMMENT '单位性质'")
	private String unitProperty;
	@Column(columnDefinition="varchar(50) COMMENT '电话号码'")
	private String unitTel;
	@Column(columnDefinition="varchar(50) COMMENT '电子邮箱'")
	private String unitEmail;
	@Column(columnDefinition="varchar(50) COMMENT '传真号码'")
	private String unitFax;
	@Column(columnDefinition="varchar(255) COMMENT '所属行政区划'")
	private String divisionId;
	@Column(columnDefinition="varchar(255) COMMENT '单位地址'")
	private String unitAddress;

	//begin#联系人信息
	@Column(columnDefinition="varchar(255) COMMENT '单位负责人名称'")
	private String unitResPerson;
	@Column(columnDefinition="varchar(225) COMMENT '单位联系人名称'")
	private String unitContactPerson;
	@Column(columnDefinition="varchar(50) COMMENT '负责人电话'")
	private String resPersonTel;
	@Column(columnDefinition="varchar(50) COMMENT '负责人手机'")
	private String resPersonMobile;
	@Column(columnDefinition="varchar(50) COMMENT '负责人邮箱'")
	private String resPersonEmail;
	@Column(columnDefinition="varchar(50) COMMENT '负责人传真'")
	private String resPersonFax;
	@Column(columnDefinition="varchar(50) COMMENT '联系人电话'")
	private String contactPersonTel;
	@Column(columnDefinition="varchar(50) COMMENT '联系人手机'")
	private String contactPersonMobile;
	@Column(columnDefinition="varchar(50) COMMENT '联系人邮箱'")
	private String contactPersonEmail;
	@Column(columnDefinition="varchar(50) COMMENT '联系人传真'")
	private String contactPersonFax;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
	public String getOrgCode() {
		return orgCode;
	}
	public void setOrgCode(String orgCode) {
		this.orgCode = orgCode;
	}
	public String getUnitProperty() {
		return unitProperty;
	}
	public void setUnitProperty(String unitProperty) {
		this.unitProperty = unitProperty;
	}
	public String getUnitTel() {
		return unitTel;
	}
	public void setUnitTel(String unitTel) {
		this.unitTel = unitTel;
	}
	public String getUnitEmail() {
		return unitEmail;
	}
	public void setUnitEmail(String unitEmail) {
		this.unitEmail = unitEmail;
	}
	public String getUnitFax() {
		return unitFax;
	}
	public void setUnitFax(String unitFax) {
		this.unitFax = unitFax;
	}
	public String getDivisionId() {
		return divisionId;
	}
	public void setDivisionId(String divisionId) {
		this.divisionId = divisionId;
	}
	public String getUnitAddress() {
		return unitAddress;
	}
	public void setUnitAddress(String unitAddress) {
		this.unitAddress = unitAddress;
	}
	public String getUnitResPerson() {
		return unitResPerson;
	}
	public void setUnitResPerson(String unitResPerson) {
		this.unitResPerson = unitResPerson;
	}
	public String getUnitContactPerson() {
		return unitContactPerson;
	}
	public void setUnitContactPerson(String unitContactPerson) {
		this.unitContactPerson = unitContactPerson;
	}
	public String getResPersonTel() {
		return resPersonTel;
	}
	public void setResPersonTel(String resPersonTel) {
		this.resPersonTel = resPersonTel;
	}
	public String getResPersonMobile() {
		return resPersonMobile;
	}
	public void setResPersonMobile(String resPersonMobile) {
		this.resPersonMobile = resPersonMobile;
	}
	public String getResPersonEmail() {
		return resPersonEmail;
	}
	public void setResPersonEmail(String resPersonEmail) {
		this.resPersonEmail = resPersonEmail;
	}
	public String getResPersonFax() {
		return resPersonFax;
	}
	public void setResPersonFax(String resPersonFax) {
		this.resPersonFax = resPersonFax;
	}
	public String getContactPersonTel() {
		return contactPersonTel;
	}
	public void setContactPersonTel(String contactPersonTel) {
		this.contactPersonTel = contactPersonTel;
	}
	public String getContactPersonMobile() {
		return contactPersonMobile;
	}
	public void setContactPersonMobile(String contactPersonMobile) {
		this.contactPersonMobile = contactPersonMobile;
	}
	public String getContactPersonEmail() {
		return contactPersonEmail;
	}
	public void setContactPersonEmail(String contactPersonEmail) {
		this.contactPersonEmail = contactPersonEmail;
	}
	public String getContactPersonFax() {
		return contactPersonFax;
	}
	public void setContactPersonFax(String contactPersonFax) {
		this.contactPersonFax = contactPersonFax;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public String getUserName() {
		return userName;
	}
	public void setUserName(String userName) {
		this.userName = userName;
	}
	
}

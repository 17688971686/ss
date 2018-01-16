package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

/*
 * 中介信息表
 * 
 */
@Entity
@Table(name="cs_mediationUnit")
public class MediationUnit extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构名称'")
	private String mediationUnitName;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构地址'")
	private String mediationUnitAddress;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构法人证照类型'")
	private String credentialsType;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构法人证照号'")
	private String credentialsNum;

	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构资质'")
	private String credentialsAptitude;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '中介机构经营范围'")
	private String businessScope;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '主要联系人'")
	private String contacts;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '主要联系人电话'")
	private String contactsTel;
	
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	
	@ManyToMany(mappedBy="mediationUnits")
	private List<AssistReview> assistReviews=new ArrayList<AssistReview>();

	
	public List<AssistReview> getAssistReviews() {
		return assistReviews;
	}

	public void setAssistReviews(List<AssistReview> assistReviews) {
		this.assistReviews = assistReviews;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getMediationUnitName() {
		return mediationUnitName;
	}

	public void setMediationUnitName(String mediationUnitName) {
		this.mediationUnitName = mediationUnitName;
	}

	public String getMediationUnitAddress() {
		return mediationUnitAddress;
	}

	public void setMediationUnitAddress(String mediationUnitAddress) {
		this.mediationUnitAddress = mediationUnitAddress;
	}

	public String getCredentialsType() {
		return credentialsType;
	}

	public void setCredentialsType(String credentialsType) {
		this.credentialsType = credentialsType;
	}

	public String getCredentialsNum() {
		return credentialsNum;
	}

	public void setCredentialsNum(String credentialsNum) {
		this.credentialsNum = credentialsNum;
	}

	public String getCredentialsAptitude() {
		return credentialsAptitude;
	}

	public void setCredentialsAptitude(String credentialsAptitude) {
		this.credentialsAptitude = credentialsAptitude;
	}

	public String getBusinessScope() {
		return businessScope;
	}

	public void setBusinessScope(String businessScope) {
		this.businessScope = businessScope;
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

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
	
}

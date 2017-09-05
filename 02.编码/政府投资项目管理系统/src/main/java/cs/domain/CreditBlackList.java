package cs.domain;

import java.util.Date;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @description: 黑名单信息表
 * @author: wxy
 * @createDate: 2017年9月1日
 * @version:
 */

@Entity
@Table(name="cs_blackList")
public class CreditBlackList extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目代码'")
	private String projectNumber;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '申报单位名称'")
	private String unitName;
	
	@Column(columnDefinition="date NULL COMMENT '申报日期'")
	private Date shenbaoDate;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '监管部门'")
	private String departmentName;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '监管部门区划代码'")
	private String divisionCode;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '法人单位名称'")
	private String enterpriseName;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '法人证件类型'")
	private String legalRepCertType;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '法人证件编码'")
	private String legalRepCertNumber;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '列入黑名单原因'")
	private String blackReason;
	
	@Column(columnDefinition="date NULL COMMENT '黑名单产生的时间'")
	private Date blackDate;
	
	@Column(columnDefinition="varchar(2) NULL COMMENT '有效标识'")
	private String validityFlag;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectNumber() {
		return projectNumber;
	}

	public void setProjectNumber(String projectNumber) {
		this.projectNumber = projectNumber;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public Date getShenbaoDate() {
		return shenbaoDate;
	}

	public void setShenbaoDate(Date shenbaoDate) {
		this.shenbaoDate = shenbaoDate;
	}

	public String getDepartmentName() {
		return departmentName;
	}

	public void setDepartmentName(String departmentName) {
		this.departmentName = departmentName;
	}

	public String getDivisionCode() {
		return divisionCode;
	}

	public void setDivisionCode(String divisionCode) {
		this.divisionCode = divisionCode;
	}

	public String getEnterpriseName() {
		return enterpriseName;
	}

	public void setEnterpriseName(String enterpriseName) {
		this.enterpriseName = enterpriseName;
	}

	public String getLegalRepCertType() {
		return legalRepCertType;
	}

	public void setLegalRepCertType(String legalRepCertType) {
		this.legalRepCertType = legalRepCertType;
	}

	public String getLegalRepCertNumber() {
		return legalRepCertNumber;
	}

	public void setLegalRepCertNumber(String legalRepCertNumber) {
		this.legalRepCertNumber = legalRepCertNumber;
	}

	public String getBlackReason() {
		return blackReason;
	}

	public void setBlackReason(String blackReason) {
		this.blackReason = blackReason;
	}

	public Date getBlackDate() {
		return blackDate;
	}

	public void setBlackDate(Date blackDate) {
		this.blackDate = blackDate;
	}

	public String getValidityFlag() {
		return validityFlag;
	}

	public void setValidityFlag(String validityFlag) {
		this.validityFlag = validityFlag;
	}
	
	
	
	
}

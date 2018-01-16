package cs.domain;


import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 项目异常名录信息表
 * @author: wxy
 * @Date：2017年8月30日
 * @version：
 */
@Entity
@Table(name="cs_illegalName")
public class CreditIllegalName extends BaseEntity{
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
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '异常情形代码'")
	private String illegalType;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '异常级别'")
	private String illegalLevel;
	
	@Column(columnDefinition="varchar(1024) NULL COMMENT '异常级别'")
	private String illegalContent;
	
	@Column(columnDefinition="date NULL COMMENT '记录异常日期'")
	private Date illegalDate;
	
	@Column(columnDefinition="varchar(2) NULL COMMENT '有效标识'")
	private String validityFlag;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '申报信息Id'")
	private String shenBaoInfoId;

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

	public String getIllegalType() {
		return illegalType;
	}

	public void setIllegalType(String illegalType) {
		this.illegalType = illegalType;
	}

	public String getIllegalLevel() {
		return illegalLevel;
	}

	public void setIllegalLevel(String illegalLevel) {
		this.illegalLevel = illegalLevel;
	}

	public String getIllegalContent() {
		return illegalContent;
	}

	public void setIllegalContent(String illegalContent) {
		this.illegalContent = illegalContent;
	}

	public Date getIllegalDate() {
		return illegalDate;
	}

	public void setIllegalDate(Date illegalDate) {
		this.illegalDate = illegalDate;
	}

	public String getValidityFlag() {
		return validityFlag;
	}

	public void setValidityFlag(String validityFlag) {
		this.validityFlag = validityFlag;
	}

	public String getShenBaoInfoId() {
		return shenBaoInfoId;
	}

	public void setShenBaoInfoId(String shenBaoInfoId) {
		this.shenBaoInfoId = shenBaoInfoId;
	}
	
	

}

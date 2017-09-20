package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description：项目异常信息表
 * @author：wxy
 * @createDate:2017年9月5日
 * @version:
 */

@Entity
@Table(name="cs_projectAnomaly")
public class CreditProjectAnomaly extends BaseEntity{
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
	
	@Column(columnDefinition="varchar(2) NULL COMMENT '是否为异常名录'")
	private String isIllegalName;
	
	@Column(columnDefinition="varchar(2) NULL COMMENT '是否为黑名单'")
	private String isBlackList;
	
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

	public String getIsIllegalName() {
		return isIllegalName;
	}

	public void setIsIllegalName(String isIllegalName) {
		this.isIllegalName = isIllegalName;
	}

	public String getIsBlackList() {
		return isBlackList;
	}

	public void setIsBlackList(String isBlackList) {
		this.isBlackList = isBlackList;
	}

	public String getShenBaoInfoId() {
		return shenBaoInfoId;
	}

	public void setShenBaoInfoId(String shenBaoInfoId) {
		this.shenBaoInfoId = shenBaoInfoId;
	}
	
	
}

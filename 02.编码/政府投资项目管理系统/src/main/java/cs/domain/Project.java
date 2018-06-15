package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * @Description: 项目信息表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_project")
public class Project extends BaseProject {
	@Id
	private String id;
	
	@Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否需要填报'")
	private Boolean isMonthReport = false;
	
	@Column(columnDefinition="bit(1) DEFAULT b'1' COMMENT '是否是最新的版本'")
	private Boolean isLatestVersion = true;
	
	@Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否纳入项目库'")
	private Boolean isIncludLibrary = false;

	@Column(columnDefinition = "double(11,4) NULL COMMENT '已拨付资金'")
	private Double alreadyDisbursed;

	//begin#关联信息
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<MonthReport> monthReports=new ArrayList<>();	
	//end#关联信息

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}

	public List<MonthReport> getMonthReports() {
		return monthReports;
	}

	public void setMonthReports(List<MonthReport> monthReports) {
		this.monthReports = monthReports;
	}
	
	public Boolean getIsMonthReport() {
		return isMonthReport;
	}

	public void setIsMonthReport(Boolean isMonthReport) {
		this.isMonthReport = isMonthReport;
	}

	public Boolean getIsLatestVersion() {
		return isLatestVersion;
	}

	public void setIsLatestVersion(Boolean isLatestVersion) {
		this.isLatestVersion = isLatestVersion;
	}

	public Boolean getIsIncludLibrary() {
		return isIncludLibrary;
	}

	public void setIsIncludLibrary(Boolean isIncludLibrary) {
		this.isIncludLibrary = isIncludLibrary;
	}

	public Double getAlreadyDisbursed() {
		return alreadyDisbursed;
	}

	public void setAlreadyDisbursed(Double alreadyDisbursed) {
		this.alreadyDisbursed = alreadyDisbursed;
	}
}

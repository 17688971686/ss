package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

@Entity
@Table(name="cs_project")
public class Project extends BaseProject {
	@Id
	private String id;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '是否需要填报'")
	private Boolean isMonthReport = true;

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
	

}

package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/*
 * 审批事项表
 */
@Entity
@Table(name="cs_shenpiitems")
public class ShenPiItems extends BaseEntity{
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '审批名称'")
	private String shenpiName;
	@Column(columnDefinition="varchar(255)  COMMENT '审批项目id'")
	private String projectId;
	@Column(columnDefinition="varchar(255)  COMMENT '审批单位id'")
	private String shenpiUnitId;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '审批内容'")
	private String shenpiDetails;
	@Column(columnDefinition="date NOT NULL COMMENT '审批开始时间'")
	private String shenpiBeginDate;
	@Column(columnDefinition="date NOT NULL COMMENT '审批结束时间'")
	private String shenpiEndDate;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '审批状态'")
	private String shenpiState;
	@Column(columnDefinition="varchar(255)  COMMENT '项目名称'")
	private String projectName;
	@Column(columnDefinition="varchar(255)  COMMENT '审批单位名称'")
	private String shenpiUnitName;
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getShenpiUnitName() {
		return shenpiUnitName;
	}
	public void setShenpiUnitName(String shenpiUnitName) {
		this.shenpiUnitName = shenpiUnitName;
	}
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getShenpiName() {
		return shenpiName;
	}
	public void setShenpiName(String shenpiName) {
		this.shenpiName = shenpiName;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getShenpiUnitId() {
		return shenpiUnitId;
	}
	public void setShenpiUnitId(String shenpiUnitId) {
		this.shenpiUnitId = shenpiUnitId;
	}
	public String getShenpiDetails() {
		return shenpiDetails;
	}
	public void setShenpiDetails(String shenpiDetails) {
		this.shenpiDetails = shenpiDetails;
	}
	public String getShenpiBeginDate() {
		return shenpiBeginDate;
	}
	public void setShenpiBeginDate(String shenpiBeginDate) {
		this.shenpiBeginDate = shenpiBeginDate;
	}

	public String getShenpiEndDate() {
		return shenpiEndDate;
	}
	public void setShenpiEndDate(String shenpiEndDate) {
		this.shenpiEndDate = shenpiEndDate;
	}
	public String getShenpiState() {
		return shenpiState;
	}
	public void setShenpiState(String shenpiState) {
		this.shenpiState = shenpiState;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}

	
}

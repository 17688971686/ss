package cs.domain;

import java.util.*;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

/*
 * 协审活动
 */
@Entity
@Table(name="cs_assistreview")
public class AssistReview extends BaseEntity{
	@Id	
	private String id;
	@Column(columnDefinition="datetime  NULL COMMENT '协审开始时间'")
	private Date assistReviewBeginDate =new Date();
	@Column(columnDefinition="datetime  NULL COMMENT '协审结束时间'")
	private Date assistReviewEndDate  =new Date();
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '协审地点'")
	private String assistReviewAddress;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '协审名称'")
	private String assistReviewName;
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	@Column(columnDefinition="varchar(255)  COMMENT '协审项目id'")
	private String projectId;
	@ManyToMany
	private List<MediationUnit> mediationUnits=new ArrayList<MediationUnit>();
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public Date getAssistReviewBeginDate() {
		return assistReviewBeginDate;
	}
	public void setAssistReviewBeginDate(Date assistReviewBeginDate) {
		this.assistReviewBeginDate = assistReviewBeginDate;
	}
	public Date getAssistReviewEndDate() {
		return assistReviewEndDate;
	}
	public void setAssistReviewEndDate(Date assistReviewEndDate) {
		this.assistReviewEndDate = assistReviewEndDate;
	}
	public String getAssistReviewAddress() {
		return assistReviewAddress;
	}
	public void setAssistReviewAddress(String assistReviewAddress) {
		this.assistReviewAddress = assistReviewAddress;
	}
	public String getAssistReviewName() {
		return assistReviewName;
	}
	public void setAssistReviewName(String assistReviewName) {
		this.assistReviewName = assistReviewName;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public List<MediationUnit> getMediationUnits() {
		return mediationUnits;
	}
	public void setMediationUnits(List<MediationUnit> mediationUnits) {
		this.mediationUnits = mediationUnits;
	}
	
	

}

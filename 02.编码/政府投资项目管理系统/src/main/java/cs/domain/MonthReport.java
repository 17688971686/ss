package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * @Description: 月报表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_monthReport")
public class MonthReport extends BaseEntity{

	@Id
	private String id;
	@Column(columnDefinition="varchar(255)  COMMENT '项目ID'")
	private String projectId;
	
	@Column(columnDefinition="varchar(125)  COMMENT '关联项目代码'")
	private String projectNumber;
	
	@Column(columnDefinition="bit(1) NULL COMMENT '是否是最新的版本'")
	private Boolean isLatestVersion = true;
	
	//begin#联系人信息

	@Column(columnDefinition="varchar(50) COMMENT '填报人姓名'")
	private String fillName;
	@Column(columnDefinition="varchar(50) COMMENT '填报人手机号'")
	private String fillMobile;
	@Column(columnDefinition="varchar(50) COMMENT '项目负责人姓名'")
	private String projectRepName;
	@Column(columnDefinition="varchar(50) COMMENT '项目负责人手机号'")
	private String projectRepMobile;
	//end#联系人信息
	
	//begin#开工时间
	@Column(columnDefinition="date COMMENT '预计开工日期'")
	private Date beginDate;
	
	@Column(columnDefinition="date COMMENT '预计竣工日期'")
	private Date endDate;
	//end#开工时间
	
	//begin#投资情况
	@Column(columnDefinition="double(11,4) COMMENT '计划总投资'")
	private Double invertPlanTotal=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '截止上年底累计下达计划'")
	private Double releasePlanTotal=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '本年度安排计划投资'")
	private Double thisYearPlanInvestment=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '本年度已下达计划'")
	private Double thisYearPlanHasInvestment=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '实际完成投资'")
	private Double actuallyFinishiInvestment=0.0;	

	@Column(columnDefinition="double(11,4) COMMENT '本年度累计完成投资'")
	private Double thisYearAccumulatedInvestment=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '本月计划完成投资'")
	private Double thisMonthPlanInvestTotal=0.0;
	
	@Column(columnDefinition="double(11,4) COMMENT '本月完成投资'")
	private Double thisMonthInvestTotal=0.0;

	@Column(columnDefinition="bit  COMMENT '是否完工'")
	private Boolean isCompletion;
	//end#投资情况
	
	
	//begin#进度情况
	@Column(columnDefinition="varchar(500) COMMENT '项目审批进度'")
	private String projectApprovalProgress;
	@Column(columnDefinition="varchar(500) COMMENT '工程形象进度或项目进展情况'")
	private String projectImageProgress;
	@Column(columnDefinition="varchar(125) COMMENT '项目进度'")
	private String selfReview;
	@Column(columnDefinition="double(11,4) COMMENT '预计第一季度完成投资'")
	private Double firstQuarCompInvestment=0.0;
	@Column(columnDefinition="double(11,4) COMMENT '预计第二季度完成投资'")
	private Double secondQuarCompInvestment=0.0;
	@Column(columnDefinition="double(11,4) COMMENT '预计第三季度完成投资'")
	private Double thirdQuarCompInvestment=0.0;
	@Column(columnDefinition="double(11,4) COMMENT '预计第四季度完成投资'")
	private Double fourthQuarCompInvestment=0.0;	
	@Column(columnDefinition="varchar(500) COMMENT '工作目标'")
	private String workTargets;	
	//end#进度情况
	

	
	@Column(columnDefinition="varchar(50) COMMENT '提交年份'")
	private Integer submitYear;
	
	@Column(columnDefinition="varchar(50) COMMENT '提交月份'")
	private Integer submitMonth;
	@Column(columnDefinition="datetime COMMENT '提交日期'")
	private Date submitDate;
	
	@Column(columnDefinition="varchar(500) COMMENT '备注'")
	private String remark;
	
	//begin#审批相关
	@Column(columnDefinition="varchar(125) NULL COMMENT '审批状态'")
	private String processState;
	//end
	
	//begin#关联信息
	//月报问题
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="monthReport_id")
	private List<MonthReportProblem> monthReportProblems=new ArrayList<>();
	
	//月报附件
	@OneToMany(cascade=CascadeType.ALL)	
	private List<Attachment> attachments=new ArrayList<>();
	//end#关联信息

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectNumber() {
		return projectNumber;
	}

	public void setProjectNumber(String projectNumber) {
		this.projectNumber = projectNumber;
	}

	public String getFillName() {
		return fillName;
	}

	public void setFillName(String fillName) {
		this.fillName = fillName;
	}

	public String getFillMobile() {
		return fillMobile;
	}

	public void setFillMobile(String fillMobile) {
		this.fillMobile = fillMobile;
	}
	
	public String getProjectRepName() {
		return projectRepName;
	}

	public void setProjectRepName(String projectRepName) {
		this.projectRepName = projectRepName;
	}

	public String getProjectRepMobile() {
		return projectRepMobile;
	}

	public void setProjectRepMobile(String projectRepMobile) {
		this.projectRepMobile = projectRepMobile;
	}

	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public Date getEndDate() {
		return endDate;
	}

	public void setEndDate(Date endDate) {
		this.endDate = endDate;
	}

	public Double getInvertPlanTotal() {
		return invertPlanTotal;
	}

	public void setInvertPlanTotal(Double invertPlanTotal) {
		this.invertPlanTotal = invertPlanTotal;
	}

	public Double getActuallyFinishiInvestment() {
		return actuallyFinishiInvestment;
	}

	public void setActuallyFinishiInvestment(Double actuallyFinishiInvestment) {
		this.actuallyFinishiInvestment = actuallyFinishiInvestment;
	}

	public Double getThisYearPlanInvestment() {
		return thisYearPlanInvestment;
	}

	public void setThisYearPlanInvestment(Double thisYearPlanInvestment) {
		this.thisYearPlanInvestment = thisYearPlanInvestment;
	}

	public Double getThisYearAccumulatedInvestment() {
		return thisYearAccumulatedInvestment;
	}

	public void setThisYearAccumulatedInvestment(Double thisYearAccumulatedInvestment) {
		this.thisYearAccumulatedInvestment = thisYearAccumulatedInvestment;
	}

	public Double getThisMonthInvestTotal() {
		return thisMonthInvestTotal;
	}

	public void setThisMonthInvestTotal(Double thisMonthInvestTotal) {
		this.thisMonthInvestTotal = thisMonthInvestTotal;
	}

	public Boolean getIsCompletion() {
		return isCompletion;
	}

	public void setIsCompletion(Boolean isCompletion) {
		this.isCompletion = isCompletion;
	}

	public String getProjectApprovalProgress() {
		return projectApprovalProgress;
	}

	public void setProjectApprovalProgress(String projectApprovalProgress) {
		this.projectApprovalProgress = projectApprovalProgress;
	}

	public String getProjectImageProgress() {
		return projectImageProgress;
	}

	public void setProjectImageProgress(String projectImageProgress) {
		this.projectImageProgress = projectImageProgress;
	}

	public String getSelfReview() {
		return selfReview;
	}

	public void setSelfReview(String selfReview) {
		this.selfReview = selfReview;
	}

	public Double getFirstQuarCompInvestment() {
		return firstQuarCompInvestment;
	}

	public void setFirstQuarCompInvestment(Double firstQuarCompInvestment) {
		this.firstQuarCompInvestment = firstQuarCompInvestment;
	}

	public Double getSecondQuarCompInvestment() {
		return secondQuarCompInvestment;
	}

	public void setSecondQuarCompInvestment(Double secondQuarCompInvestment) {
		this.secondQuarCompInvestment = secondQuarCompInvestment;
	}

	public Double getThirdQuarCompInvestment() {
		return thirdQuarCompInvestment;
	}

	public void setThirdQuarCompInvestment(Double thirdQuarCompInvestment) {
		this.thirdQuarCompInvestment = thirdQuarCompInvestment;
	}

	public Double getFourthQuarCompInvestment() {
		return fourthQuarCompInvestment;
	}

	public void setFourthQuarCompInvestment(Double fourthQuarCompInvestment) {
		this.fourthQuarCompInvestment = fourthQuarCompInvestment;
	}

	public String getWorkTargets() {
		return workTargets;
	}

	public void setWorkTargets(String workTargets) {
		this.workTargets = workTargets;
	}

	public Integer getSubmitYear() {
		return submitYear;
	}

	public void setSubmitYear(Integer submitYear) {
		this.submitYear = submitYear;
	}

	public Integer getSubmitMonth() {
		return submitMonth;
	}

	public void setSubmitMonth(Integer submitMonth) {
		this.submitMonth = submitMonth;
	}

	public Date getSubmitDate() {
		return submitDate;
	}

	public void setSubmitDate(Date submitDate) {
		this.submitDate = submitDate;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public List<MonthReportProblem> getMonthReportProblems() {
		return monthReportProblems;
	}

	public void setMonthReportProblems(List<MonthReportProblem> monthReportProblems) {
		this.monthReportProblems = monthReportProblems;
	}

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getProcessState() {
		return processState;
	}

	public void setProcessState(String processState) {
		this.processState = processState;
	}

	//end#关联信息

	public Double getReleasePlanTotal() {
		return releasePlanTotal;
	}

	public void setReleasePlanTotal(Double releasePlanTotal) {
		this.releasePlanTotal = releasePlanTotal;
	}

	public Double getThisYearPlanHasInvestment() {
		return thisYearPlanHasInvestment;
	}

	public void setThisYearPlanHasInvestment(Double thisYearPlanHasInvestment) {
		this.thisYearPlanHasInvestment = thisYearPlanHasInvestment;
	}

	public Double getThisMonthPlanInvestTotal() {
		return thisMonthPlanInvestTotal;
	}

	public void setThisMonthPlanInvestTotal(Double thisMonthPlanInvestTotal) {
		this.thisMonthPlanInvestTotal = thisMonthPlanInvestTotal;
	}	
	public Boolean getIsLatestVersion() {
		return isLatestVersion;
	}

	public void setIsLatestVersion(Boolean isLatestVersion) {
		this.isLatestVersion = isLatestVersion;
	}

}
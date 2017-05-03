package cs.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * 月报表
 *
 *
 */
@Entity
@Table(name="cs_monthReport")
public class MonthReport extends DomainBase{

	@Id
	private String id;	
	@Column(columnDefinition="varchar(255)  COMMENT '关联项目代码'")
	private String projectId;
	
	//begin#联系人信息

	@Column(columnDefinition="varchar(255) COMMENT '填报人姓名'")
	private String fillName;
	@Column(columnDefinition="varchar(50) COMMENT '填报人手机号'")
	private String fillMobile;
	@Column(columnDefinition="varchar(255) COMMENT '月报负责人姓名'")
	private String monRepManagerName;
	@Column(columnDefinition="varchar(50) COMMENT '月报负责人手机号'")
	private String monRepManagerTel;
	@Column(columnDefinition="varchar(50) COMMENT '月报负责人传真号'")
	private String monRepManagerFax;
	@Column(columnDefinition="varchar(255) COMMENT '月报负责单位名称'")
	private String monRepManagUnitName;
	@Column(columnDefinition="varchar(255) COMMENT '责任单位负责人名称'")
	private String respUnitManagerName;
	@Column(columnDefinition="varchar(50) COMMENT '责任单位负责人电话'")
	private String respUnitManagerTel;
	
	//end#联系人信息
	
	//begin#批文日期和文号
	//日期
	@Column(columnDefinition="datetime COMMENT '项目建议书批复日期'")
	private Date proposalsReplyDate;
	@Column(columnDefinition="datetime COMMENT '可行性研究报告批复日期'")
	private Date feaStyRepoReplyDate;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复日期'")
	private Date allEstimateReplyDate;
	@Column(columnDefinition="datetime COMMENT '前期工作计划批复日期'")
	private Date prePlanReplyDate;
	
	//文号
	@Column(columnDefinition="varchar(50) COMMENT '项目建议书批复类型'")
	private Integer proposalsType;
	@Column(columnDefinition="datetime COMMENT '项目建议书批复年份'")
	private Date proposalsYear;
	@Column(columnDefinition="varchar(50) COMMENT '项目建议书批复文号'")
	private String proposalsNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '可行性研究报告批复类型'")
	private Integer reportType;
	@Column(columnDefinition="datetime  COMMENT '可行性研究报告批复年份'")
	private Date reportYear;
	@Column(columnDefinition="varchar(50) COMMENT '可行性研究报告批复文号'")
	private String reportNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '项目总概算批复类型'")
	private Integer allEstimateType;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复年份'")
	private Date allEstimateYear;
	@Column(columnDefinition="varchar(50) COMMENT '项目总概算批复文号'")
	private String allEstimateNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '前期工作计划批复类型'")
	private Integer prePlanType;
	@Column(columnDefinition="datetime COMMENT '前期工作计划批复年份'")
	private Date prePlanYear;
	@Column(columnDefinition="varchar(50) COMMENT '前期工作计划批复文号'")
	private String prePlanNum;
	//end#批文日期和文号
	
	//begin#开工时间
	@Column(columnDefinition="datetime COMMENT '预计开工日期'")
	private Date commencementDate;
	@Column(columnDefinition="datetime COMMENT '实际开工日期'")
	private Date actuallyDate;
	@Column(columnDefinition="datetime COMMENT '竣工日期'")
	private Date completedDate;
	//end#开工时间
	
	//begin#投资情况
	@Column(columnDefinition="decimal(9,2) COMMENT '计划总投资'")
	private BigDecimal invertPlanTotal;
	@Column(columnDefinition="decimal(9,2) COMMENT '实际完成投资'")
	private BigDecimal actuallyFinishiInvestment;	
	@Column(columnDefinition="decimal(9,2) COMMENT '自开工至上年底完成投资'")
	private BigDecimal sinceLastYearCompletInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '本年计划投资'")
	private BigDecimal thisYearPlanInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '本月完成投资'")
	private BigDecimal thisMonthInvestTotal;
	@Column(columnDefinition="decimal(9,2) COMMENT '建筑安装工程投资'")
	private BigDecimal buildAndInstallInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '设备投资'")
	private BigDecimal equipmentInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '其他投资'")
	private BigDecimal otherInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '本年度累计完成投资'")
	private BigDecimal thisYearAccumulatedInvestment;
	//end#投资情况
	
	
	//begin#进度情况
	@Column(columnDefinition="varchar(2000) COMMENT '项目审批进度'")
	private String projectApprovalProgress;
	@Column(columnDefinition="varchar(2000) COMMENT '工程形象进度或项目进展情况'")
	private String projectImageProgress;
	@Column(columnDefinition="varchar(50) COMMENT '项目进度'")
	private Integer selfReview;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第一季度完成投资'")
	private BigDecimal firstQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第二季度完成投资'")
	private BigDecimal secondQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第三季度完成投资'")
	private BigDecimal thirdQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第四季度完成投资'")
	private BigDecimal fourthQuarCompInvestment;	
	@Column(columnDefinition="varchar(2000) COMMENT '工作目标'")
	private String workTargets;
	
	//end#进度情况
	
	//begin#拆迁情况
	@Column(columnDefinition="decimal(9,6) COMMENT '征用土地面积'")
	private BigDecimal requisitionLandArea;
	@Column(columnDefinition="decimal(9,6) COMMENT '拆迁面积'")
	private BigDecimal demolitionArea;
	//end#拆迁情况
	
	
	@Column(columnDefinition="datetime COMMENT '提交月'")
	private Date submitMonth;
	@Column(columnDefinition="datetime COMMENT '提交日期'")
	private Date submitDate;
	@Column(columnDefinition="datetime COMMENT '立项日期'")
	private Date approvalDate;	
	
	@Column(columnDefinition="bit(1)  COMMENT '是否完工'")
	private Integer isCompletion;
	@Column(columnDefinition="varchar(255) COMMENT '备注'")
	private String remark;
	
	//begin#关联信息
	//月报问题
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="monthReport_id",nullable=false)
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

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
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

	public String getMonRepManagerName() {
		return monRepManagerName;
	}

	public void setMonRepManagerName(String monRepManagerName) {
		this.monRepManagerName = monRepManagerName;
	}

	public String getMonRepManagerTel() {
		return monRepManagerTel;
	}

	public void setMonRepManagerTel(String monRepManagerTel) {
		this.monRepManagerTel = monRepManagerTel;
	}

	public String getMonRepManagerFax() {
		return monRepManagerFax;
	}

	public void setMonRepManagerFax(String monRepManagerFax) {
		this.monRepManagerFax = monRepManagerFax;
	}

	public String getMonRepManagUnitName() {
		return monRepManagUnitName;
	}

	public void setMonRepManagUnitName(String monRepManagUnitName) {
		this.monRepManagUnitName = monRepManagUnitName;
	}

	public String getRespUnitManagerName() {
		return respUnitManagerName;
	}

	public void setRespUnitManagerName(String respUnitManagerName) {
		this.respUnitManagerName = respUnitManagerName;
	}

	public String getRespUnitManagerTel() {
		return respUnitManagerTel;
	}

	public void setRespUnitManagerTel(String respUnitManagerTel) {
		this.respUnitManagerTel = respUnitManagerTel;
	}

	public Date getProposalsReplyDate() {
		return proposalsReplyDate;
	}

	public void setProposalsReplyDate(Date proposalsReplyDate) {
		this.proposalsReplyDate = proposalsReplyDate;
	}

	public Date getFeaStyRepoReplyDate() {
		return feaStyRepoReplyDate;
	}

	public void setFeaStyRepoReplyDate(Date feaStyRepoReplyDate) {
		this.feaStyRepoReplyDate = feaStyRepoReplyDate;
	}

	public Date getAllEstimateReplyDate() {
		return allEstimateReplyDate;
	}

	public void setAllEstimateReplyDate(Date allEstimateReplyDate) {
		this.allEstimateReplyDate = allEstimateReplyDate;
	}

	public Date getPrePlanReplyDate() {
		return prePlanReplyDate;
	}

	public void setPrePlanReplyDate(Date prePlanReplyDate) {
		this.prePlanReplyDate = prePlanReplyDate;
	}

	public Integer getProposalsType() {
		return proposalsType;
	}

	public void setProposalsType(Integer proposalsType) {
		this.proposalsType = proposalsType;
	}

	public Date getProposalsYear() {
		return proposalsYear;
	}

	public void setProposalsYear(Date proposalsYear) {
		this.proposalsYear = proposalsYear;
	}

	public String getProposalsNum() {
		return proposalsNum;
	}

	public void setProposalsNum(String proposalsNum) {
		this.proposalsNum = proposalsNum;
	}

	public Integer getReportType() {
		return reportType;
	}

	public void setReportType(Integer reportType) {
		this.reportType = reportType;
	}

	public Date getReportYear() {
		return reportYear;
	}

	public void setReportYear(Date reportYear) {
		this.reportYear = reportYear;
	}

	public String getReportNum() {
		return reportNum;
	}

	public void setReportNum(String reportNum) {
		this.reportNum = reportNum;
	}

	public Integer getAllEstimateType() {
		return allEstimateType;
	}

	public void setAllEstimateType(Integer allEstimateType) {
		this.allEstimateType = allEstimateType;
	}

	public Date getAllEstimateYear() {
		return allEstimateYear;
	}

	public void setAllEstimateYear(Date allEstimateYear) {
		this.allEstimateYear = allEstimateYear;
	}

	public String getAllEstimateNum() {
		return allEstimateNum;
	}

	public void setAllEstimateNum(String allEstimateNum) {
		this.allEstimateNum = allEstimateNum;
	}

	public Integer getPrePlanType() {
		return prePlanType;
	}

	public void setPrePlanType(Integer prePlanType) {
		this.prePlanType = prePlanType;
	}

	public Date getPrePlanYear() {
		return prePlanYear;
	}

	public void setPrePlanYear(Date prePlanYear) {
		this.prePlanYear = prePlanYear;
	}

	public String getPrePlanNum() {
		return prePlanNum;
	}

	public void setPrePlanNum(String prePlanNum) {
		this.prePlanNum = prePlanNum;
	}

	public Date getCommencementDate() {
		return commencementDate;
	}

	public void setCommencementDate(Date commencementDate) {
		this.commencementDate = commencementDate;
	}

	public Date getActuallyDate() {
		return actuallyDate;
	}

	public void setActuallyDate(Date actuallyDate) {
		this.actuallyDate = actuallyDate;
	}

	public Date getCompletedDate() {
		return completedDate;
	}

	public void setCompletedDate(Date completedDate) {
		this.completedDate = completedDate;
	}

	public BigDecimal getInvertPlanTotal() {
		return invertPlanTotal;
	}

	public void setInvertPlanTotal(BigDecimal invertPlanTotal) {
		this.invertPlanTotal = invertPlanTotal;
	}

	public BigDecimal getActuallyFinishiInvestment() {
		return actuallyFinishiInvestment;
	}

	public void setActuallyFinishiInvestment(BigDecimal actuallyFinishiInvestment) {
		this.actuallyFinishiInvestment = actuallyFinishiInvestment;
	}

	public BigDecimal getSinceLastYearCompletInvestment() {
		return sinceLastYearCompletInvestment;
	}

	public void setSinceLastYearCompletInvestment(BigDecimal sinceLastYearCompletInvestment) {
		this.sinceLastYearCompletInvestment = sinceLastYearCompletInvestment;
	}

	public BigDecimal getThisYearPlanInvestment() {
		return thisYearPlanInvestment;
	}

	public void setThisYearPlanInvestment(BigDecimal thisYearPlanInvestment) {
		this.thisYearPlanInvestment = thisYearPlanInvestment;
	}

	public BigDecimal getThisMonthInvestTotal() {
		return thisMonthInvestTotal;
	}

	public void setThisMonthInvestTotal(BigDecimal thisMonthInvestTotal) {
		this.thisMonthInvestTotal = thisMonthInvestTotal;
	}

	public BigDecimal getBuildAndInstallInvest() {
		return buildAndInstallInvest;
	}

	public void setBuildAndInstallInvest(BigDecimal buildAndInstallInvest) {
		this.buildAndInstallInvest = buildAndInstallInvest;
	}

	public BigDecimal getEquipmentInvest() {
		return equipmentInvest;
	}

	public void setEquipmentInvest(BigDecimal equipmentInvest) {
		this.equipmentInvest = equipmentInvest;
	}

	public BigDecimal getOtherInvest() {
		return otherInvest;
	}

	public void setOtherInvest(BigDecimal otherInvest) {
		this.otherInvest = otherInvest;
	}

	public BigDecimal getThisYearAccumulatedInvestment() {
		return thisYearAccumulatedInvestment;
	}

	public void setThisYearAccumulatedInvestment(BigDecimal thisYearAccumulatedInvestment) {
		this.thisYearAccumulatedInvestment = thisYearAccumulatedInvestment;
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

	public Integer getSelfReview() {
		return selfReview;
	}

	public void setSelfReview(Integer selfReview) {
		this.selfReview = selfReview;
	}

	public BigDecimal getFirstQuarCompInvestment() {
		return firstQuarCompInvestment;
	}

	public void setFirstQuarCompInvestment(BigDecimal firstQuarCompInvestment) {
		this.firstQuarCompInvestment = firstQuarCompInvestment;
	}

	public BigDecimal getSecondQuarCompInvestment() {
		return secondQuarCompInvestment;
	}

	public void setSecondQuarCompInvestment(BigDecimal secondQuarCompInvestment) {
		this.secondQuarCompInvestment = secondQuarCompInvestment;
	}

	public BigDecimal getThirdQuarCompInvestment() {
		return thirdQuarCompInvestment;
	}

	public void setThirdQuarCompInvestment(BigDecimal thirdQuarCompInvestment) {
		this.thirdQuarCompInvestment = thirdQuarCompInvestment;
	}

	public BigDecimal getFourthQuarCompInvestment() {
		return fourthQuarCompInvestment;
	}

	public void setFourthQuarCompInvestment(BigDecimal fourthQuarCompInvestment) {
		this.fourthQuarCompInvestment = fourthQuarCompInvestment;
	}

	public String getWorkTargets() {
		return workTargets;
	}

	public void setWorkTargets(String workTargets) {
		this.workTargets = workTargets;
	}

	public BigDecimal getRequisitionLandArea() {
		return requisitionLandArea;
	}

	public void setRequisitionLandArea(BigDecimal requisitionLandArea) {
		this.requisitionLandArea = requisitionLandArea;
	}

	public BigDecimal getDemolitionArea() {
		return demolitionArea;
	}

	public void setDemolitionArea(BigDecimal demolitionArea) {
		this.demolitionArea = demolitionArea;
	}

	public Date getSubmitMonth() {
		return submitMonth;
	}

	public void setSubmitMonth(Date submitMonth) {
		this.submitMonth = submitMonth;
	}

	public Date getSubmitDate() {
		return submitDate;
	}

	public void setSubmitDate(Date submitDate) {
		this.submitDate = submitDate;
	}

	public Date getApprovalDate() {
		return approvalDate;
	}

	public void setApprovalDate(Date approvalDate) {
		this.approvalDate = approvalDate;
	}

	public Integer getIsCompletion() {
		return isCompletion;
	}

	public void setIsCompletion(Integer isCompletion) {
		this.isCompletion = isCompletion;
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
}
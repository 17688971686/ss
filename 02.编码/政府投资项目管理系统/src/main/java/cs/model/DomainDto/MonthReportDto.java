package cs.model.DomainDto;
/**
 * 月报实体类
 * @author cx
 * @Date 2017-05-03
 */
import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import cs.model.BaseDto;

public class MonthReportDto extends BaseDto{
	private String id;
	private String projectId;//关联项目代码
	private String projectName;
	
	//begin#联系人信息
	private String fillName;//填报人姓名
	private String fillMobile;//填报人手机号
	private String monRepManagerName;//月报负责人姓名
	private String monRepManagerTel;//月报负责人手机号
	private String monRepManagerFax;//月报负责人传真号
	private String monRepManagUnitName;//月报负责单位名称
	private String respUnitManagerName;//责任单位负责人名称
	private String respUnitManagerTel;//责任单位负责人电话
	//end#联系人信息
	
	//begin#批文日期和文号
	//日期
	private Date proposalsReplyDate;//项目建议书批复日期
	private Date feaStyRepoReplyDate;//可行性研究报告批复日期
	private Date allEstimateReplyDate;//项目总概算批复日期
	private Date prePlanReplyDate;//前期工作计划批复日期
	
	//文号
	private String proposalsType;//项目建议书批复类型
	private String proposalsTypeDisplay;//项目建议书批复类型
	private Date proposalsYear;//项目建议书批复年份
	private String proposalsNum;//项目建议书批复文号
	
	private String reportType;//可行性研究报告批复类型
	private String reportTypeDisplay;//可行性研究报告批复类型
	private Date reportYear;//可行性研究报告批复年份
	private String reportNum;//可行性研究报告批复文号
	
	private String allEstimateType;//项目总概算批复类型
	private String allEstimateTypeDisplay;//可行性研究报告批复类型
	private Date allEstimateYear;//项目总概算批复年份
	private String allEstimateNum;//项目总概算批复文号
	
	private String prePlanType;//前期工作计划批复类型
	private String prePlanTypeDisplay;//前期工作计划批复类型
	private Date prePlanYear;//前期工作计划批复年份
	private String prePlanNum;//前期工作计划批复文号
	//end#批文日期和文号
	
	//begin#开工时间
	private Date commencementDate;//预计开工日期
	private Date actuallyDate;//实际开工日期
	private Date completedDate;//竣工日期
	//end#开工时间
	
	//begin#投资情况
	private BigDecimal invertPlanTotal;//计划总投资
	private BigDecimal actuallyFinishiInvestment;//实际完成投资	
	private BigDecimal sinceLastYearCompletInvestment;//自开工至上年底完成投资
	private BigDecimal thisYearPlanInvestment;//本年计划投资
	private BigDecimal thisMonthInvestTotal;//本月完成投资
	private BigDecimal buildAndInstallInvest;//建筑安装工程投资
	private BigDecimal equipmentInvest;//设备投资
	private BigDecimal otherInvest;//其他投资
	private BigDecimal thisYearAccumulatedInvestment;//本年度累计完成投资
	//end#投资情况
	
	
	//begin#进度情况
	private String projectApprovalProgress;//项目审批进度
	private String projectImageProgress;//工程形象进度或项目进展情况
	private String selfReview;//项目进度
	private String selfReviewDisplay;//项目进度
	private BigDecimal firstQuarCompInvestment;//预计第一季度完成投资
	private BigDecimal secondQuarCompInvestment;//预计第二季度完成投资
	private BigDecimal thirdQuarCompInvestment;//预计第三季度完成投资
	private BigDecimal fourthQuarCompInvestment;//预计第四季度完成投资	
	private String workTargets;//工作目标
	
	//end#进度情况
	
	//begin#拆迁情况
	private BigDecimal requisitionLandArea;//征用土地面积
	private BigDecimal demolitionArea;//拆迁面积
	//end#拆迁情况
	
	
	private String submitMonth;//提交月
	private String submitYear;//提交月
	private Date submitDate;//提交日期
	private Date approvalDate;//立项日期	
	
	private Integer isCompletion;//是否完工
	private String remark;//备注
	
	//begin#工程结算情况
	private Date firstAccountReportSendAuditDate;//第一份结算报告送审计日期
	private Date firstAccountReportAuditDate;//第一份结算报告审计日期
	private Date newestAccountReportSendAuditDate;//最新结算报告送审计日期
	private Date newestAccountReportAuditDate;//最新结算报告审计日期
	private BigDecimal completedAuditAccountAuthorizedAmount;//已完成审计的结算审定金额
	//End#工程结算情况
		
		
	//begin#竣工决算情况	
	private Date accountReportSendAuditDate;//决算报告送审日期
	private Date completeAccountAuditDate;//完成决算审计日期
	private BigDecimal accountAuthorizedAmount;//决算审定金额
	//End#竣工决算情况
	
	//begin#项目信息
	private String projectBuildStage;//项目建设阶段
	//end#项目信息
	
	//begin#关联信息
	//月报问题
	private List<MonthReportProblemDto> monthReportProblems=new ArrayList<>();
	
	//月报附件
	private List<AttachmentDto> attachments=new ArrayList<>();
	
	
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

	public String getReportType() {
		return reportType;
	}

	public void setReportType(String reportType) {
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

	public String getSubmitMonth() {
		return submitMonth;
	}

	public void setSubmitMonth(String submitMonth) {
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

	public List<MonthReportProblemDto> getMonthReportProblems() {
		return monthReportProblems;
	}

	public void setMonthReportProblems(List<MonthReportProblemDto> monthReportProblems) {
		this.monthReportProblems = monthReportProblems;
	}

	public List<AttachmentDto> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<AttachmentDto> attachments) {
		this.attachments = attachments;
	}

	/*public ProjectInfoDto getProjectInfoDto() {
		return ProjectInfoDto;
	}

	public void setProjectInfoDto(ProjectInfoDto projectInfoDto) {
		ProjectInfoDto = projectInfoDto;
	}*/

	public Date getFirstAccountReportSendAuditDate() {
		return firstAccountReportSendAuditDate;
	}

	public void setFirstAccountReportSendAuditDate(Date firstAccountReportSendAuditDate) {
		this.firstAccountReportSendAuditDate = firstAccountReportSendAuditDate;
	}

	public Date getFirstAccountReportAuditDate() {
		return firstAccountReportAuditDate;
	}

	public void setFirstAccountReportAuditDate(Date firstAccountReportAuditDate) {
		this.firstAccountReportAuditDate = firstAccountReportAuditDate;
	}

	public Date getNewestAccountReportSendAuditDate() {
		return newestAccountReportSendAuditDate;
	}

	public void setNewestAccountReportSendAuditDate(Date newestAccountReportSendAuditDate) {
		this.newestAccountReportSendAuditDate = newestAccountReportSendAuditDate;
	}

	public Date getNewestAccountReportAuditDate() {
		return newestAccountReportAuditDate;
	}

	public void setNewestAccountReportAuditDate(Date newestAccountReportAuditDate) {
		this.newestAccountReportAuditDate = newestAccountReportAuditDate;
	}

	public BigDecimal getCompletedAuditAccountAuthorizedAmount() {
		return completedAuditAccountAuthorizedAmount;
	}

	public void setCompletedAuditAccountAuthorizedAmount(BigDecimal completedAuditAccountAuthorizedAmount) {
		this.completedAuditAccountAuthorizedAmount = completedAuditAccountAuthorizedAmount;
	}

	public Date getAccountReportSendAuditDate() {
		return accountReportSendAuditDate;
	}

	public void setAccountReportSendAuditDate(Date accountReportSendAuditDate) {
		this.accountReportSendAuditDate = accountReportSendAuditDate;
	}

	public Date getCompleteAccountAuditDate() {
		return completeAccountAuditDate;
	}

	public void setCompleteAccountAuditDate(Date completeAccountAuditDate) {
		this.completeAccountAuditDate = completeAccountAuditDate;
	}

	public BigDecimal getAccountAuthorizedAmount() {
		return accountAuthorizedAmount;
	}

	public void setAccountAuthorizedAmount(BigDecimal accountAuthorizedAmount) {
		this.accountAuthorizedAmount = accountAuthorizedAmount;
	}

	public String getProjectBuildStage() {
		return projectBuildStage;
	}

	public void setProjectBuildStage(String projectBuildStage) {
		this.projectBuildStage = projectBuildStage;
	}

	public String getProposalsType() {
		return proposalsType;
	}

	public void setProposalsType(String proposalsType) {
		this.proposalsType = proposalsType;
	}

	public String getAllEstimateType() {
		return allEstimateType;
	}

	public void setAllEstimateType(String allEstimateType) {
		this.allEstimateType = allEstimateType;
	}

	public String getPrePlanType() {
		return prePlanType;
	}

	public void setPrePlanType(String prePlanType) {
		this.prePlanType = prePlanType;
	}

	public String getSelfReview() {
		return selfReview;
	}

	public void setSelfReview(String selfReview) {
		this.selfReview = selfReview;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProposalsTypeDisplay() {
		return proposalsTypeDisplay;
	}

	public void setProposalsTypeDisplay(String proposalsTypeDisplay) {
		this.proposalsTypeDisplay = proposalsTypeDisplay;
	}

	public String getReportTypeDisplay() {
		return reportTypeDisplay;
	}

	public void setReportTypeDisplay(String reportTypeDisplay) {
		this.reportTypeDisplay = reportTypeDisplay;
	}

	

	public String getPrePlanTypeDisplay() {
		return prePlanTypeDisplay;
	}

	public void setPrePlanTypeDisplay(String prePlanTypeDisplay) {
		this.prePlanTypeDisplay = prePlanTypeDisplay;
	}

	public String getAllEstimateTypeDisplay() {
		return allEstimateTypeDisplay;
	}

	public void setAllEstimateTypeDisplay(String allEstimateTypeDisplay) {
		this.allEstimateTypeDisplay = allEstimateTypeDisplay;
	}

	public String getSelfReviewDisplay() {
		return selfReviewDisplay;
	}

	public void setSelfReviewDisplay(String selfReviewDisplay) {
		this.selfReviewDisplay = selfReviewDisplay;
	}

	public String getSubmitYear() {
		return submitYear;
	}

	public void setSubmitYear(String submitYear) {
		this.submitYear = submitYear;
	}

	
	
	
	
	
}

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
 * 月报表
 *
 *
 */
@Entity
@Table(name="cs_monthReport")
public class MonthReport extends BaseEntity{

	@Id
	private String id;	
	@Column(columnDefinition="varchar(255)  COMMENT '项目ID'")
	private String projectId;
	
	@Column(columnDefinition="varchar(255)  COMMENT '关联项目代码'")
	private String projectNumber;
	
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
	@Column(columnDefinition="date NULL COMMENT '批复-项目建议书-时间'")
	private Date pifuJYS_date;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '批复-项目建议书-文号'")
	private String pifuJYS_wenhao;
	
	@Column(columnDefinition="date NULL COMMENT '批复-可行性研究报告-时间'")
	private Date pifuKXXYJBG_date;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '批复-可行性研究报告-文号'")
	private String pifuKXXYJBG_wenhao;
	
	@Column(columnDefinition="date NULL COMMENT '批复-初步设计与概算-时间'")
	private Date pifuCBSJYGS_date;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '批复-初步设计与概算-文号'")
	private String pifuCBSJYGS_wenhao;
	
	//end#批文日期和文号
	
	//begin#开工时间
	@Column(columnDefinition="date COMMENT '预计开工日期'")
	private Date beginDate;
	
	@Column(columnDefinition="date COMMENT '预计竣工日期'")
	private Date endDate;
	//end#开工时间
	
	//begin#投资情况
	@Column(columnDefinition="double(10,2) COMMENT '计划总投资'")
	private Double invertPlanTotal;
	@Column(columnDefinition="double(10,2) COMMENT '实际完成投资'")
	private Double actuallyFinishiInvestment;	

	@Column(columnDefinition="double(10,2) COMMENT '本年计划投资'")
	private Double thisYearPlanInvestment;
	@Column(columnDefinition="double(10,2) COMMENT '本年度累计完成投资'")
	private Double thisYearAccumulatedInvestment;
	@Column(columnDefinition="double(10,2) COMMENT '本月完成投资'")
	private Double thisMonthInvestTotal;

	@Column(columnDefinition="bit  COMMENT '是否完工'")
	private boolean isCompletion;

	//end#投资情况
	
	
	//begin#进度情况
	@Column(columnDefinition="varchar(2000) COMMENT '项目审批进度'")
	private String projectApprovalProgress;
	@Column(columnDefinition="varchar(2000) COMMENT '工程形象进度或项目进展情况'")
	private String projectImageProgress;
	@Column(columnDefinition="varchar(50) COMMENT '项目进度'")
	private String selfReview;
	@Column(columnDefinition="double(10,2) COMMENT '预计第一季度完成投资'")
	private Double firstQuarCompInvestment;
	@Column(columnDefinition="double(10,2) COMMENT '预计第二季度完成投资'")
	private Double secondQuarCompInvestment;
	@Column(columnDefinition="double(10,2) COMMENT '预计第三季度完成投资'")
	private Double thirdQuarCompInvestment;
	@Column(columnDefinition="double(10,2) COMMENT '预计第四季度完成投资'")
	private Double fourthQuarCompInvestment;	
	@Column(columnDefinition="varchar(2000) COMMENT '工作目标'")
	private String workTargets;
	
	//end#进度情况
	

	
	@Column(columnDefinition="varchar(50) COMMENT '提交年份'")
	private Integer submitYear;
	
	@Column(columnDefinition="varchar(50) COMMENT '提交月份'")
	private Integer submitMonth;
	@Column(columnDefinition="datetime COMMENT '提交日期'")
	private Date submitDate;
	
	@Column(columnDefinition="varchar(255) COMMENT '备注'")
	private String remark;
	
	
	
	//begin#关联信息
	//月报问题
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="monthReport_id")
	private List<MonthReportProblem> monthReportProblems=new ArrayList<>();
	
	//月报附件
	@OneToMany(cascade=CascadeType.ALL)	
	private List<Attachment> attachments=new ArrayList<>();

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

	public Date getPifuJYS_date() {
		return pifuJYS_date;
	}

	public void setPifuJYS_date(Date pifuJYS_date) {
		this.pifuJYS_date = pifuJYS_date;
	}

	public String getPifuJYS_wenhao() {
		return pifuJYS_wenhao;
	}

	public void setPifuJYS_wenhao(String pifuJYS_wenhao) {
		this.pifuJYS_wenhao = pifuJYS_wenhao;
	}

	public Date getPifuKXXYJBG_date() {
		return pifuKXXYJBG_date;
	}

	public void setPifuKXXYJBG_date(Date pifuKXXYJBG_date) {
		this.pifuKXXYJBG_date = pifuKXXYJBG_date;
	}

	public String getPifuKXXYJBG_wenhao() {
		return pifuKXXYJBG_wenhao;
	}

	public void setPifuKXXYJBG_wenhao(String pifuKXXYJBG_wenhao) {
		this.pifuKXXYJBG_wenhao = pifuKXXYJBG_wenhao;
	}

	public Date getPifuCBSJYGS_date() {
		return pifuCBSJYGS_date;
	}

	public void setPifuCBSJYGS_date(Date pifuCBSJYGS_date) {
		this.pifuCBSJYGS_date = pifuCBSJYGS_date;
	}

	public String getPifuCBSJYGS_wenhao() {
		return pifuCBSJYGS_wenhao;
	}

	public void setPifuCBSJYGS_wenhao(String pifuCBSJYGS_wenhao) {
		this.pifuCBSJYGS_wenhao = pifuCBSJYGS_wenhao;
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

	public boolean isCompletion() {
		return isCompletion;
	}

	public void setCompletion(boolean isCompletion) {
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
	
	
	//end#关联信息

	
	
	
	
}
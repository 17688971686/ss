package cs.model.Statistics;

import java.io.Serializable;
import java.util.Date;

/**
 * 
 * @ClassName: ProjectStatisticsBean 
 * @Description: 项目统计分析数据封装Bean
 * @author cx
 * @date 2018年1月24日 下午3:47:53 
 *
 */
public class ProjectStatisticsBean implements Serializable{

	/** 
	* @Fields serialVersionUID : 用于序列化使用（暂时没用）
	*/
	private static final long serialVersionUID = 1L;
	
	private String projectName;//项目名称
	private String classDesc;//分类标识
	private String unitName;//单位名称
	private String projectStageDesc;//项目阶段
	private String projectIndustryDesc;//项目行业
	private String projectGuiMo;//项目建设内容
	private Integer projectNumbers;//项目数量
	private Integer prereserveNumbers;//前期储备阶段项目数
	private Integer preNumbers;//前期阶段项目数
	private Integer constructionNumbers;//施工阶段项目数
	private Integer shutdownNumbers;//停工阶段项目数
	private Integer completedNumbers;//竣工阶段项目数
	private Integer fixedAssetsNumbers;//固定资产登记阶段项目数
	private Double projectInvestSum;//项目总投资
	private Double projectInvestAccuSum;//项目已拨付资金
	//审批专用
	private Integer approvalStageXMJYSNumbers;//立项数量
	private Integer approvalStageKXXYJBGNumbers;//可研数量
	private Integer approvalStageCBSJGSNumbers;//概算数量
	private Integer approvalStageZJSQBGNumbers;//资金申请报告数量
	//计划专用
	private Double apPlanReachTheYear;//本年度拨付金额
	private String projectConstrCharDesc;//项目建设性质
	private Double apInvestSum;//累计安排投资
	private Double yearInvestApproval;//本年度拨款
	private Double apPlanReach_ggys;//本年度计划下达安排——公共预算
	private Double apPlanReach_gtzj;//本年度计划下达安排——国土基金
	private String yearConstructionContent;//本年度建设内容
	private String yearConstructionContentShenBao;//备注
	private String beginDate;//开始时间
	private String endDate;//结束时间
	
	public String getProjectName() {
		return projectName;
	}
	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	public String getClassDesc() {
		return classDesc;
	}
	public void setClassDesc(String classDesc) {
		this.classDesc = classDesc;
	}
	public String getUnitName() {
		return unitName;
	}
	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}
	public String getProjectStageDesc() {
		return projectStageDesc;
	}
	public void setProjectStageDesc(String projectStageDesc) {
		this.projectStageDesc = projectStageDesc;
	}
	public String getProjectIndustryDesc() {
		return projectIndustryDesc;
	}
	public void setProjectIndustryDesc(String projectIndustryDesc) {
		this.projectIndustryDesc = projectIndustryDesc;
	}
	public String getProjectGuiMo() {
		return projectGuiMo;
	}
	public void setProjectGuiMo(String projectGuiMo) {
		this.projectGuiMo = projectGuiMo;
	}
	public Integer getProjectNumbers() {
		return projectNumbers;
	}
	public void setProjectNumbers(Integer projectNumbers) {
		this.projectNumbers = projectNumbers;
	}
	public Integer getPrereserveNumbers() {
		return prereserveNumbers;
	}
	public void setPrereserveNumbers(Integer prereserveNumbers) {
		this.prereserveNumbers = prereserveNumbers;
	}
	public Integer getPreNumbers() {
		return preNumbers;
	}
	public void setPreNumbers(Integer preNumbers) {
		this.preNumbers = preNumbers;
	}
	public Integer getConstructionNumbers() {
		return constructionNumbers;
	}
	public void setConstructionNumbers(Integer constructionNumbers) {
		this.constructionNumbers = constructionNumbers;
	}
	public Integer getShutdownNumbers() {
		return shutdownNumbers;
	}
	public void setShutdownNumbers(Integer shutdownNumbers) {
		this.shutdownNumbers = shutdownNumbers;
	}
	public Integer getCompletedNumbers() {
		return completedNumbers;
	}
	public void setCompletedNumbers(Integer completedNumbers) {
		this.completedNumbers = completedNumbers;
	}
	public Integer getFixedAssetsNumbers() {
		return fixedAssetsNumbers;
	}
	public void setFixedAssetsNumbers(Integer fixedAssetsNumbers) {
		this.fixedAssetsNumbers = fixedAssetsNumbers;
	}
	public Double getProjectInvestSum() {
		return projectInvestSum;
	}
	public void setProjectInvestSum(Double projectInvestSum) {
		this.projectInvestSum = projectInvestSum;
	}
	public Double getProjectInvestAccuSum() {
		return projectInvestAccuSum;
	}
	public void setProjectInvestAccuSum(Double projectInvestAccuSum) {
		this.projectInvestAccuSum = projectInvestAccuSum;
	}
	public static long getSerialversionuid() {
		return serialVersionUID;
	}
	public Integer getApprovalStageXMJYSNumbers() {
		return approvalStageXMJYSNumbers;
	}
	public void setApprovalStageXMJYSNumbers(Integer approvalStageXMJYSNumbers) {
		this.approvalStageXMJYSNumbers = approvalStageXMJYSNumbers;
	}
	public Integer getApprovalStageKXXYJBGNumbers() {
		return approvalStageKXXYJBGNumbers;
	}
	public void setApprovalStageKXXYJBGNumbers(Integer approvalStageKXXYJBGNumbers) {
		this.approvalStageKXXYJBGNumbers = approvalStageKXXYJBGNumbers;
	}
	public Integer getApprovalStageCBSJGSNumbers() {
		return approvalStageCBSJGSNumbers;
	}
	public void setApprovalStageCBSJGSNumbers(Integer approvalStageCBSJGSNumbers) {
		this.approvalStageCBSJGSNumbers = approvalStageCBSJGSNumbers;
	}
	public Integer getApprovalStageZJSQBGNumbers() {
		return approvalStageZJSQBGNumbers;
	}
	public void setApprovalStageZJSQBGNumbers(Integer approvalStageZJSQBGNumbers) {
		this.approvalStageZJSQBGNumbers = approvalStageZJSQBGNumbers;
	}
	public Double getApPlanReachTheYear() {
		return apPlanReachTheYear;
	}
	public void setApPlanReachTheYear(Double apPlanReachTheYear) {
		this.apPlanReachTheYear = apPlanReachTheYear;
	}
	public String getProjectConstrCharDesc() {
		return projectConstrCharDesc;
	}
	public void setProjectConstrCharDesc(String projectConstrCharDesc) {
		this.projectConstrCharDesc = projectConstrCharDesc;
	}
	public Double getApInvestSum() {
		return apInvestSum;
	}
	public void setApInvestSum(Double apInvestSum) {
		this.apInvestSum = apInvestSum;
	}
	public String getBeginDate() {
		return beginDate;
	}
	public void setBeginDate(String beginDate) {
		this.beginDate = beginDate;
	}
	public String getEndDate() {
		return endDate;
	}
	public void setEndDate(String endDate) {
		this.endDate = endDate;
	}
	public Double getYearInvestApproval() {
		return yearInvestApproval;
	}
	public void setYearInvestApproval(Double yearInvestApproval) {
		this.yearInvestApproval = yearInvestApproval;
	}
	public Double getApPlanReach_ggys() {
		return apPlanReach_ggys;
	}
	public void setApPlanReach_ggys(Double apPlanReach_ggys) {
		this.apPlanReach_ggys = apPlanReach_ggys;
	}
	public Double getApPlanReach_gtzj() {
		return apPlanReach_gtzj;
	}
	public void setApPlanReach_gtzj(Double apPlanReach_gtzj) {
		this.apPlanReach_gtzj = apPlanReach_gtzj;
	}
	public String getYearConstructionContent() {
		return yearConstructionContent;
	}
	public void setYearConstructionContent(String yearConstructionContent) {
		this.yearConstructionContent = yearConstructionContent;
	}
	public String getYearConstructionContentShenBao() {
		return yearConstructionContentShenBao;
	}
	public void setYearConstructionContentShenBao(String yearConstructionContentShenBao) {
		this.yearConstructionContentShenBao = yearConstructionContentShenBao;
	}
	
	
}

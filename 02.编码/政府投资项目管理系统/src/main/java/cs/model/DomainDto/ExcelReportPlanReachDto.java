package cs.model.DomainDto;

import java.io.Serializable;

/**
 * @Description: 申报信息实体类
 * @author: lx
 * @Date：2018年8月21日
 * @version：0.1
 */
public class ExcelReportPlanReachDto implements Serializable {
	private static final long serialVersionUID = 1L;

    /** excel填充pojo需要的字段 */
    //编号
    private String rowNum;
	//建设单位
	private String constructionUnit;
	//项目名称
	private String projectName;
	//项目类别id
	private String projectCategory;
	//项目类别名称desc
	private String projectCategoryDesc;
	//项目行业归口id
	private String projectIndustry;
	//项目行业归口名称desc
	private String projectIndustryDesc;
	//项目类别父类id
	private String pId;
	//单位性质
	private String	projectConstrChar;
	//建设规模
	private String projectGuiMo;
	//总投资
	private Double projectInvestSum;
	//累计安排
	private Double apInvestSum;
	//安排-国土
	private Double apPlanReach_ggys;
	//安排-公共预算
	private  Double apPlanReach_gtzj;
	//申请-国土
	private Double sqPlanReach_ggys;
	//申请-公共预算
	private  Double sqPlanReach_gtzj;
	//建设内容
	private  String planReachConstructionContent;
	//备注
	private  String yearPlanRemark;
	//资金出处
	private  String planName;

	//文号
	private  String plan_wenhao;
	/** 业务处理需要的字段 */
    //排序号
    private Integer orderNum;


	public ExcelReportPlanReachDto() {
	}

	public ExcelReportPlanReachDto(Double projectInvestSum, Double apInvestSum, Double apPlanReach_ggys, Double apPlanReach_gtzj) {
		this.projectInvestSum = projectInvestSum;
		this.apInvestSum = apInvestSum;
		this.apPlanReach_ggys = apPlanReach_ggys;
		this.apPlanReach_gtzj = apPlanReach_gtzj;
	}

	public Integer getOrderNum() {
		return orderNum;
	}

	public void setOrderNum(Integer orderNum) {
		this.orderNum = orderNum;
	}

	public String getConstructionUnit() {
		return constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectCategory() {
		return projectCategory;
	}

	public void setProjectCategory(String projectCategory) {
		this.projectCategory = projectCategory;
	}

	public String getpId() {
		return pId;
	}

	public void setpId(String pId) {
		this.pId = pId;
	}

	public String getProjectCategoryDesc() {
		return projectCategoryDesc;
	}

	public void setProjectCategoryDesc(String projectCategoryDesc) {
		this.projectCategoryDesc = projectCategoryDesc;
	}

	public String getProjectConstrChar() {
		return projectConstrChar;
	}

	public void setProjectConstrChar(String projectConstrChar) {
		this.projectConstrChar = projectConstrChar;
	}

	public String getProjectGuiMo() {
		return projectGuiMo;
	}

	public void setProjectGuiMo(String projectGuiMo) {
		this.projectGuiMo = projectGuiMo;
	}

	public Double getProjectInvestSum() {
		return projectInvestSum;
	}

	public void setProjectInvestSum(Double projectInvestSum) {
		this.projectInvestSum = projectInvestSum;
	}

	public Double getApInvestSum() {
		return apInvestSum;
	}

	public void setApInvestSum(Double apInvestSum) {
		this.apInvestSum = apInvestSum;
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

	public String getPlanReachConstructionContent() {
		return planReachConstructionContent;
	}

	public void setPlanReachConstructionContent(String planReachConstructionContent) {
		this.planReachConstructionContent = planReachConstructionContent;
	}

	public String getYearPlanRemark() {
		return yearPlanRemark;
	}

	public void setYearPlanRemark(String yearPlanRemark) {
		this.yearPlanRemark = yearPlanRemark;
	}

	public String getRowNum() {
		return rowNum;
	}

	public void setRowNum(String rowNum) {
		this.rowNum = rowNum;
	}

	public String getProjectIndustry() {
		return projectIndustry;
	}

	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
	}

	public String getProjectIndustryDesc() {
		return projectIndustryDesc;
	}

	public void setProjectIndustryDesc(String projectIndustryDesc) {
		this.projectIndustryDesc = projectIndustryDesc;
	}
	public String getPlan_wenhao() {
		return plan_wenhao;
	}

	public void setPlan_wenhao(String plan_wenhao) {
		this.plan_wenhao = plan_wenhao;
	}

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public Double getSqPlanReach_ggys() {
		return sqPlanReach_ggys;
	}

	public void setSqPlanReach_ggys(Double sqPlanReach_ggys) {
		this.sqPlanReach_ggys = sqPlanReach_ggys;
	}

	public Double getSqPlanReach_gtzj() {
		return sqPlanReach_gtzj;
	}

	public void setSqPlanReach_gtzj(Double sqPlanReach_gtzj) {
		this.sqPlanReach_gtzj = sqPlanReach_gtzj;
	}
}

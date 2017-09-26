package cs.model.exportExcel;
/**
* @ClassName: ExcelDataHYTJ
* @Description: 导出年度计划项目行业统计Excel数据实体类 
* @author cx
* @date 2017年9月11日 上午09:26:13 
*
 */
public class ExcelDataHYTJ {
	private Integer planYear;//计划年度
	private String projectIndustry;//项目行业
	private Integer projectSum;//行业项目个数合计
	private Integer projectCategory_ASum;//A类数量
	private Integer projectCategory_BSum;//B类数量
	private Integer projectCategory_CSum;//C类数量
	private Integer projectCategory_DSum;//D类数量
	private double investSum;//总投资
	private double investAccuSum;//拨付资金（完成投资）累计
	private double apInvestSum;//下达计划（安排资金）累计
	private double sqInvestSum;//申请资金累计
	private double yearAp_ggysSum;//年度预安排资金--公共预算
	private double yearAp_gtjjSum;//年度预安排资金--国土基金
	private double yearAp_qitaSum;//年度预安排资金--其他
	private double yearApSum;//年度预安排资金--合计
	private String remark;//备注
	
	public Integer getPlanYear() {
		return planYear;
	}
	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}
	public String getProjectIndustry() {
		return projectIndustry;
	}
	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
	}
	public Integer getProjectSum() {
		return projectSum;
	}
	public void setProjectSum(Integer projectSum) {
		this.projectSum = projectSum;
	}
	public Integer getProjectCategory_ASum() {
		return projectCategory_ASum;
	}
	public void setProjectCategory_ASum(Integer projectCategory_ASum) {
		this.projectCategory_ASum = projectCategory_ASum;
	}
	public Integer getProjectCategory_BSum() {
		return projectCategory_BSum;
	}
	public void setProjectCategory_BSum(Integer projectCategory_BSum) {
		this.projectCategory_BSum = projectCategory_BSum;
	}
	public Integer getProjectCategory_CSum() {
		return projectCategory_CSum;
	}
	public void setProjectCategory_CSum(Integer projectCategory_CSum) {
		this.projectCategory_CSum = projectCategory_CSum;
	}
	public Integer getProjectCategory_DSum() {
		return projectCategory_DSum;
	}
	public void setProjectCategory_DSum(Integer projectCategory_DSum) {
		this.projectCategory_DSum = projectCategory_DSum;
	}
	public double getInvestSum() {
		return investSum;
	}
	public void setInvestSum(double investSum) {
		this.investSum = investSum;
	}
	public double getInvestAccuSum() {
		return investAccuSum;
	}
	public void setInvestAccuSum(double investAccuSum) {
		this.investAccuSum = investAccuSum;
	}
	public double getApInvestSum() {
		return apInvestSum;
	}
	public void setApInvestSum(double apInvestSum) {
		this.apInvestSum = apInvestSum;
	}
	public double getYearAp_ggysSum() {
		return yearAp_ggysSum;
	}
	public void setYearAp_ggysSum(double yearAp_ggysSum) {
		this.yearAp_ggysSum = yearAp_ggysSum;
	}
	public double getYearAp_gtjjSum() {
		return yearAp_gtjjSum;
	}
	public void setYearAp_gtjjSum(double yearAp_gtjjSum) {
		this.yearAp_gtjjSum = yearAp_gtjjSum;
	}
	public double getYearAp_qitaSum() {
		return yearAp_qitaSum;
	}
	public void setYearAp_qitaSum(double yearAp_qitaSum) {
		this.yearAp_qitaSum = yearAp_qitaSum;
	}
	public double getYearApSum() {
		return yearApSum;
	}
	public void setYearApSum(double yearApSum) {
		this.yearApSum = yearApSum;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	public double getSqInvestSum() {
		return sqInvestSum;
	}
	public void setSqInvestSum(double sqInvestSum) {
		this.sqInvestSum = sqInvestSum;
	}
}

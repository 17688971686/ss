package cs.model.exportExcel;
/**
* @ClassName: ExcelDataLBTJ
* @Description: 导出年度计划项目类别统计Excel数据实体类 
* @author cx
* @date 2017年9月5日 上午10:26:13 
*
 */
public class ExcelDataLBTJ {
	private Integer planYear;//计划年度
	private String projectCategory;//项目类别
	private Integer projectSum;//项目总数
	private double investSum;//总投资累计
	private double investAccuSum;//拨付资金（完成投资）累计
	private double apInvestSum;//下达计划（安排资金）累计
	private double yearInvestApprovalSum;//年度预安排资金累计
	
	public Integer getPlanYear() {
		return planYear;
	}
	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}
	public String getProjectCategory() {
		return projectCategory;
	}
	public void setProjectCategory(String projectCategory) {
		this.projectCategory = projectCategory;
	}
	public Integer getProjectSum() {
		return projectSum;
	}
	public void setProjectSum(Integer projectSum) {
		this.projectSum = projectSum;
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
	public double getYearInvestApprovalSum() {
		return yearInvestApprovalSum;
	}
	public void setYearInvestApprovalSum(double yearInvestApprovalSum) {
		this.yearInvestApprovalSum = yearInvestApprovalSum;
	}
}

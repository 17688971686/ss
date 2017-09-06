package cs.model.exportExcel;
/**
* @ClassName: ExcelDataTJ
* @Description: 导出年度计划项目类别统计Excel数据实体类 
* @author cx
* @date 2017年9月5日 上午10:26:13 
*
 */
public class ExcelDataLBTJ {
	private String projectCategory;//项目类别
	private String projectSum;//项目总数
	private String investSum;//总投资累计
	private String investAccuSum;//下达计划（完成投资）累计
	private String apInvestSum;//拨付资金（安排资金）累计
	private String yearInvestApprovalSum;//年度预安排资金累计
	public String getProjectCategory() {
		return projectCategory;
	}
	public void setProjectCategory(String projectCategory) {
		this.projectCategory = projectCategory;
	}
	public String getProjectSum() {
		return projectSum;
	}
	public void setProjectSum(String projectSum) {
		this.projectSum = projectSum;
	}
	public String getInvestSum() {
		return investSum;
	}
	public void setInvestSum(String investSum) {
		this.investSum = investSum;
	}
	public String getInvestAccuSum() {
		return investAccuSum;
	}
	public void setInvestAccuSum(String investAccuSum) {
		this.investAccuSum = investAccuSum;
	}
	public String getApInvestSum() {
		return apInvestSum;
	}
	public void setApInvestSum(String apInvestSum) {
		this.apInvestSum = apInvestSum;
	}
	public String getYearInvestApprovalSum() {
		return yearInvestApprovalSum;
	}
	public void setYearInvestApprovalSum(String yearInvestApprovalSum) {
		this.yearInvestApprovalSum = yearInvestApprovalSum;
	}
}

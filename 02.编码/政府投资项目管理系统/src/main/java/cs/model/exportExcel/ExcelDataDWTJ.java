package cs.model.exportExcel;
/**
* @ClassName: ExcelDataDWTJ
* @Description: 导出年度计划建设单位统计Excel数据实体类 
* @author cx
* @date 2017年9月11日 上午15:14:13 
*
 */
public class ExcelDataDWTJ {
	private String constrctionUnit;//建设单位
	private double yearApSum;//安排资金--合计
	private double yearAp_danLie;//安排资金--单列项目
	private double yearAp_jieSunKuan;//安排资金--结算款
	private double yearAp_weiLiXYuLiu;//安排资金--未立项项目预留
	public String getConstrctionUnit() {
		return constrctionUnit;
	}
	public void setConstrctionUnit(String constrctionUnit) {
		this.constrctionUnit = constrctionUnit;
	}
	public double getYearApSum() {
		return yearApSum;
	}
	public void setYearApSum(double yearApSum) {
		this.yearApSum = yearApSum;
	}
	public double getYearAp_danLie() {
		return yearAp_danLie;
	}
	public void setYearAp_danLie(double yearAp_danLie) {
		this.yearAp_danLie = yearAp_danLie;
	}
	public double getYearAp_jieSunKuan() {
		return yearAp_jieSunKuan;
	}
	public void setYearAp_jieSunKuan(double yearAp_jieSunKuan) {
		this.yearAp_jieSunKuan = yearAp_jieSunKuan;
	}
	public double getYearAp_weiLiXYuLiu() {
		return yearAp_weiLiXYuLiu;
	}
	public void setYearAp_weiLiXYuLiu(double yearAp_weiLiXYuLiu) {
		this.yearAp_weiLiXYuLiu = yearAp_weiLiXYuLiu;
	}
}

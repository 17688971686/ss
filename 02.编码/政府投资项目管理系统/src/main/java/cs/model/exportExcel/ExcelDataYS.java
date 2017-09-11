package cs.model.exportExcel;

/**
* @ClassName: ExcelData
* @Description: 导出年度计划印刷版Excel数据实体类 
* @author cx
* @date 2017年9月5日 上午10:26:13 
*
 */
public class ExcelDataYS {
	private String ConstructionUnit;//建设单位
    private String ProjectName;//项目名称
    private String ProjectCode;//项目代码
    private String ProjectType;//项目类别
    private String ConstructionScale;//建设规模
    private String ConstructionType;//建设性质
    private String ConstructionDate;//建设起止日期
    private double TotalInvest;//总投资
    private double apInvestSum;//累计安排
    private double applyYearInvest;//本年度申请资金
    private double capitalAP_gtzj_TheYear;//本年度安排资金_国土
    private double capitalAP_ggys_TheYear;//本年度安排资金_公共预算
    private String ConstructionContent;//主要建设内容
    private  String Remark;//备注
	public String getConstructionUnit() {
		return ConstructionUnit;
	}
	public void setConstructionUnit(String constructionUnit) {
		ConstructionUnit = constructionUnit;
	}
	public String getProjectName() {
		return ProjectName;
	}
	public void setProjectName(String projectName) {
		ProjectName = projectName;
	}
	public String getProjectCode() {
		return ProjectCode;
	}
	public void setProjectCode(String projectCode) {
		ProjectCode = projectCode;
	}
	public String getProjectType() {
		return ProjectType;
	}
	public void setProjectType(String projectType) {
		ProjectType = projectType;
	}
	public String getConstructionScale() {
		return ConstructionScale;
	}
	public void setConstructionScale(String constructionScale) {
		ConstructionScale = constructionScale;
	}
	public String getConstructionType() {
		return ConstructionType;
	}
	public void setConstructionType(String constructionType) {
		ConstructionType = constructionType;
	}
	public String getConstructionDate() {
		return ConstructionDate;
	}
	public void setConstructionDate(String constructionDate) {
		ConstructionDate = constructionDate;
	}
	public double getTotalInvest() {
		return TotalInvest;
	}
	public void setTotalInvest(double totalInvest) {
		TotalInvest = totalInvest;
	}
	public double getApInvestSum() {
		return apInvestSum;
	}
	public void setApInvestSum(double apInvestSum) {
		this.apInvestSum = apInvestSum;
	}
	public double getApplyYearInvest() {
		return applyYearInvest;
	}
	public void setApplyYearInvest(double applyYearInvest) {
		this.applyYearInvest = applyYearInvest;
	}
	public double getCapitalAP_gtzj_TheYear() {
		return capitalAP_gtzj_TheYear;
	}
	public void setCapitalAP_gtzj_TheYear(double capitalAP_gtzj_TheYear) {
		this.capitalAP_gtzj_TheYear = capitalAP_gtzj_TheYear;
	}
	public double getCapitalAP_ggys_TheYear() {
		return capitalAP_ggys_TheYear;
	}
	public void setCapitalAP_ggys_TheYear(double capitalAP_ggys_TheYear) {
		this.capitalAP_ggys_TheYear = capitalAP_ggys_TheYear;
	}
	public String getConstructionContent() {
		return ConstructionContent;
	}
	public void setConstructionContent(String constructionContent) {
		ConstructionContent = constructionContent;
	}
	public String getRemark() {
		return Remark;
	}
	public void setRemark(String remark) {
		Remark = remark;
	}
}

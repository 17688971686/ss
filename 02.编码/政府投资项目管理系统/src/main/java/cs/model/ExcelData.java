package cs.model;
/**
* @ClassName: ExcelData
* @Description: 导出Excel数据实体类 
* @author cx
* @date 2017年9月5日 上午10:26:13 
*
 */
public class ExcelData {
	private String ConstructionUnit;//建设单位
    private String ProjectName;//项目名称
    private String ProjectCode;//项目代码
    private String ProjectType;//项目类别
    private String ConstructionScale;//建设规模
    private String ConstructionType;//建设性质
    private String ConstructionDate;//建设起止日期
    private String TotalInvest;//总投资
    private String AccumulatedInvest;//累计拨款
    private String ArrangeInvest;//安排资金
    private String Invest_GuoTu;//投资来源_国土
    private  String Invest_GongGongYuSuan;//投资来源_公共预算
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
	public String getTotalInvest() {
		return TotalInvest;
	}
	public void setTotalInvest(String totalInvest) {
		TotalInvest = totalInvest;
	}
	public String getAccumulatedInvest() {
		return AccumulatedInvest;
	}
	public void setAccumulatedInvest(String accumulatedInvest) {
		AccumulatedInvest = accumulatedInvest;
	}
	public String getArrangeInvest() {
		return ArrangeInvest;
	}
	public void setArrangeInvest(String arrangeInvest) {
		ArrangeInvest = arrangeInvest;
	}
	public String getInvest_GuoTu() {
		return Invest_GuoTu;
	}
	public void setInvest_GuoTu(String invest_GuoTu) {
		Invest_GuoTu = invest_GuoTu;
	}
	public String getInvest_GongGongYuSuan() {
		return Invest_GongGongYuSuan;
	}
	public void setInvest_GongGongYuSuan(String invest_GongGongYuSuan) {
		Invest_GongGongYuSuan = invest_GongGongYuSuan;
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

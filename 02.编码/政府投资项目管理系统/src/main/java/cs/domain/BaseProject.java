package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
/**
 * @Description: 项目的基础信息
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@MappedSuperclass
public class BaseProject extends BaseEntity
{
	@Column(columnDefinition="varchar(255) NULL COMMENT '现阶段责任单位名'")
	private String unitName;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '项目代码'")
	private String projectNumber;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '国家代码'")
	private String countryNumber;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '项目投资类型'")
	private String projectInvestmentType ;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '项目阶段'")
	private String projectStage;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '项目类型'")
	private String projectType;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '项目类别'")
	private String projectCategory;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '项目所属行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '国民经济行业分类'")
	private String nationalIndustry;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目负责人姓名'")
	private String projectRepName;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目负责人电话'")
	private String projectRepMobile;
	
	@Column(columnDefinition="varchar(20) NULL COMMENT '开工日期'")
	private String beginDate;
	
	@Column(columnDefinition="varchar(20) COMMENT '竣工日期'")
	private String endDate;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '项目建设区域'")
	private String divisionId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目建设地址'")
	private String projectAddress;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '项目总投资'")
	private Double projectInvestSum=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '项目累计完成投资'")
	private Double projectInvestAccuSum=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-市财政-公共预算'")
	private Double capitalSCZ_ggys=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-市财政-国土资金'")
	private Double capitalSCZ_gtzj=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-市财政-专项资金'")
	private Double capitalSCZ_zxzj=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-区财政-公共预算'")
	private Double capitalQCZ_ggys=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-区财政-国土资金'")
	private Double capitalQCZ_gtzj=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-中央预算'")
	private Double capitalZYYS=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-社会投资'")
	private Double capitalSHTZ=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '资金来源方案-其它'")
	private Double capitalOther=0.0;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '资金来源方案-其它来源类型'")
	private String capitalOtherType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '资金来源方案-其它-说明'")
	private String capitalOtherDescription;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目简介'")
	private String projectIntro;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设规模及内容'")
	private String projectGuiMo;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '备注'")
	private String remark;
	
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
	
	@Column(columnDefinition="date NULL COMMENT '批复-初步设计与概算-时间'")
	private Date pifuZJSQBG_date;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '批复-初步设计与概算-文号'")
	private String pifuZJSQBG_wenhao;
	
	@Column(columnDefinition="date NULL COMMENT '批复-首次前期经费下达-时间'")
	private Date pifuSCQQJFXD_date;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '批复-首次前期经费下达-文号'")
	private String pifuSCQQJFXD_wenhao;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设周期'")
	private String constructionCycle;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '决算金额'")
	private Double finalAmount=0.0;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '财政项目代码'")
	private String financeProjectNumber;
	//begin#社会投资项目单独字段
	@Column(columnDefinition="varchar(255) NULL COMMENT '企业名称'")
	private String companyName;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '责任单位联系人姓名'")
	private String repUnitRepName;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '责任单位联系人电话'")
	private String repUnitRepMobile;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设用地情况（社投）'")
	private String constructionLand;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '投入使用后的效益（社投）'")
	private String useBenefits;
	
	@Column(columnDefinition="varchar(125) NULL COMMENT '核准/备案批准文号（社投）'")
	private String approval_pzwh;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '总投资--地价（社投）'")
	private Double landPrice=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '总投资--设备投资（社投）'")
	private Double equipmentInvestment=0.0;
	
	@Column(columnDefinition="double(11,4) DEFAULT 0 COMMENT '总投资--建安投资（社投）'")
	private Double buidSafeInvestment=0.0;
	//end
	@Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否已纳入年度计划'")
	private Boolean isIncludYearPlan=false;
	
//	@Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否已申请下达资金'")
//	private Boolean isPlanReach=false;

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getProjectNumber() {
		return projectNumber;
	}

	public void setProjectNumber(String projectNumber) {
		this.projectNumber = projectNumber;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectStage() {
		return projectStage;
	}

	public void setProjectStage(String projectStage) {
		this.projectStage = projectStage;
	}

	public String getProjectType() {
		return projectType;
	}

	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}

	public String getProjectIndustry() {
		return projectIndustry;
	}

	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
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

	public String getProjectAddress() {
		return projectAddress;
	}

	public void setProjectAddress(String projectAddress) {
		this.projectAddress = projectAddress;
	}

	public Double getProjectInvestSum() {
		return projectInvestSum;
	}

	public void setProjectInvestSum(Double projectInvestSum) {
		this.projectInvestSum = projectInvestSum;
	}

	public Double getCapitalSCZ_ggys() {
		return capitalSCZ_ggys;
	}

	public void setCapitalSCZ_ggys(Double capitalSCZ_ggys) {
		this.capitalSCZ_ggys = capitalSCZ_ggys;
	}

	public Double getCapitalSCZ_gtzj() {
		return capitalSCZ_gtzj;
	}

	public void setCapitalSCZ_gtzj(Double capitalSCZ_gtzj) {
		this.capitalSCZ_gtzj = capitalSCZ_gtzj;
	}

	public Double getCapitalSCZ_zxzj() {
		return capitalSCZ_zxzj;
	}

	public void setCapitalSCZ_zxzj(Double capitalSCZ_zxzj) {
		this.capitalSCZ_zxzj = capitalSCZ_zxzj;
	}

	public Double getCapitalQCZ_ggys() {
		return capitalQCZ_ggys;
	}

	public void setCapitalQCZ_ggys(Double capitalQCZ_ggys) {
		this.capitalQCZ_ggys = capitalQCZ_ggys;
	}

	public Double getCapitalQCZ_gtzj() {
		return capitalQCZ_gtzj;
	}

	public void setCapitalQCZ_gtzj(Double capitalQCZ_gtzj) {
		this.capitalQCZ_gtzj = capitalQCZ_gtzj;
	}
	
	public Double getCapitalZYYS() {
		return capitalZYYS;
	}

	public void setCapitalZYYS(Double capitalZYYS) {
		this.capitalZYYS = capitalZYYS;
	}

	public Double getCapitalSHTZ() {
		return capitalSHTZ;
	}

	public void setCapitalSHTZ(Double capitalSHTZ) {
		this.capitalSHTZ = capitalSHTZ;
	}

	public Double getCapitalOther() {
		return capitalOther;
	}

	public void setCapitalOther(Double capitalOther) {
		this.capitalOther = capitalOther;
	}

	public String getCapitalOtherDescription() {
		return capitalOtherDescription;
	}

	public void setCapitalOtherDescription(String capitalOtherDescription) {
		this.capitalOtherDescription = capitalOtherDescription;
	}

	public String getProjectIntro() {
		return projectIntro;
	}

	public void setProjectIntro(String projectIntro) {
		this.projectIntro = projectIntro;
	}

	public String getProjectGuiMo() {
		return projectGuiMo;
	}

	public void setProjectGuiMo(String projectGuiMo) {
		this.projectGuiMo = projectGuiMo;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
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

	public Double getProjectInvestAccuSum() {
		return projectInvestAccuSum;
	}

	public void setProjectInvestAccuSum(Double projectInvestAccuSum) {
		this.projectInvestAccuSum = projectInvestAccuSum;
	}

	public String getCapitalOtherType() {
		return capitalOtherType;
	}

	public void setCapitalOtherType(String capitalOtherType) {
		this.capitalOtherType = capitalOtherType;
	}

	public String getProjectCategory() {
		return projectCategory;
	}

	public void setProjectCategory(String projectCategory) {
		this.projectCategory = projectCategory;
	}

	public String getProjectInvestmentType() {
		return projectInvestmentType;
	}

	public void setProjectInvestmentType(String projectInvestmentType) {
		this.projectInvestmentType = projectInvestmentType;
	}

	public String getProjectRepName() {
		return projectRepName;
	}

	public void setProjectRepName(String projectRepName) {
		this.projectRepName = projectRepName;
	}

	public String getProjectRepMobile() {
		return projectRepMobile;
	}

	public void setProjectRepMobile(String projectRepMobile) {
		this.projectRepMobile = projectRepMobile;
	}

	public String getDivisionId() {
		return divisionId;
	}

	public void setDivisionId(String divisionId) {
		this.divisionId = divisionId;
	}

	public String getConstructionCycle() {
		return constructionCycle;
	}

	public void setConstructionCycle(String constructionCycle) {
		this.constructionCycle = constructionCycle;
	}

	public Double getFinalAmount() {
		return finalAmount;
	}

	public void setFinalAmount(Double finalAmount) {
		this.finalAmount = finalAmount;
	}

	public String getFinanceProjectNumber() {
		return financeProjectNumber;
	}

	public void setFinanceProjectNumber(String financeProjectNumber) {
		this.financeProjectNumber = financeProjectNumber;
	}

	public String getConstructionLand() {
		return constructionLand;
	}

	public void setConstructionLand(String constructionLand) {
		this.constructionLand = constructionLand;
	}

	public String getUseBenefits() {
		return useBenefits;
	}

	public void setUseBenefits(String useBenefits) {
		this.useBenefits = useBenefits;
	}

	public String getApproval_pzwh() {
		return approval_pzwh;
	}

	public void setApproval_pzwh(String approval_pzwh) {
		this.approval_pzwh = approval_pzwh;
	}

	public String getRepUnitRepName() {
		return repUnitRepName;
	}

	public void setRepUnitRepName(String repUnitRepName) {
		this.repUnitRepName = repUnitRepName;
	}

	public String getRepUnitRepMobile() {
		return repUnitRepMobile;
	}

	public void setRepUnitRepMobile(String repUnitRepMobile) {
		this.repUnitRepMobile = repUnitRepMobile;
	}

	public String getCompanyName() {
		return companyName;
	}

	public void setCompanyName(String companyName) {
		this.companyName = companyName;
	}

	public Double getLandPrice() {
		return landPrice;
	}

	public void setLandPrice(Double landPrice) {
		this.landPrice = landPrice;
	}

	public Double getEquipmentInvestment() {
		return equipmentInvestment;
	}

	public void setEquipmentInvestment(Double equipmentInvestment) {
		this.equipmentInvestment = equipmentInvestment;
	}

	public Double getBuidSafeInvestment() {
		return buidSafeInvestment;
	}

	public void setBuidSafeInvestment(Double buidSafeInvestment) {
		this.buidSafeInvestment = buidSafeInvestment;
	}

	public Boolean getIsIncludYearPlan() {
		return isIncludYearPlan;
	}

	public void setIsIncludYearPlan(Boolean isIncludYearPlan) {
		this.isIncludYearPlan = isIncludYearPlan;
	}

//	public Boolean getIsPlanReach() {
//		return isPlanReach;
//	}
//
//	public void setIsPlanReach(Boolean isPlanReach) {
//		this.isPlanReach = isPlanReach;
//	}

	public String getNationalIndustry() {
		return nationalIndustry;
	}

	public void setNationalIndustry(String nationalIndustry) {
		this.nationalIndustry = nationalIndustry;
	}

	public Date getPifuZJSQBG_date() {
		return pifuZJSQBG_date;
	}

	public void setPifuZJSQBG_date(Date pifuZJSQBG_date) {
		this.pifuZJSQBG_date = pifuZJSQBG_date;
	}

	public String getPifuZJSQBG_wenhao() {
		return pifuZJSQBG_wenhao;
	}

	public void setPifuZJSQBG_wenhao(String pifuZJSQBG_wenhao) {
		this.pifuZJSQBG_wenhao = pifuZJSQBG_wenhao;
	}

	public Date getPifuSCQQJFXD_date() {
		return pifuSCQQJFXD_date;
	}

	public void setPifuSCQQJFXD_date(Date pifuSCQQJFXD_date) {
		this.pifuSCQQJFXD_date = pifuSCQQJFXD_date;
	}

	public String getPifuSCQQJFXD_wenhao() {
		return pifuSCQQJFXD_wenhao;
	}

	public void setPifuSCQQJFXD_wenhao(String pifuSCQQJFXD_wenhao) {
		this.pifuSCQQJFXD_wenhao = pifuSCQQJFXD_wenhao;
	}

	public String getCountryNumber() {
		return countryNumber;
	}

	public void setCountryNumber(String countryNumber) {
		this.countryNumber = countryNumber;
	}
	
	
	
}

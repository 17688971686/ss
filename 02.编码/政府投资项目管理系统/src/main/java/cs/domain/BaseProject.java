package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.MappedSuperclass;
@MappedSuperclass
public class BaseProject extends BaseEntity
{
	@Column(columnDefinition="varchar(255) NULL COMMENT '单位名'")
	private String unitName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目代码'")
	private String projectNumber;	
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目投资类型'")
	private String projectInvestmentType ;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '功能分类科目'")
	private String projectFunctionClassify;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '政府经济分类科目'")
	private String projectGoverEconClassify;

	@Column(columnDefinition="varchar(255) NULL COMMENT '项目阶段'")
	private String projectStage;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目类型'")
	private String projectType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目类别'")
	private String projectCategory;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目所属行业'")
	private String projectIndustry;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目负责人姓名'")
	private String projectRepName;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目负责人电话'")
	private String projectRepMobile;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目分类'")
	private String projectClassify;
	
	@Column(columnDefinition="date NULL COMMENT '开工日期'")
	private Date beginDate;
	
	@Column(columnDefinition="date NULL COMMENT '竣工日期'")
	private Date endDate;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设地址'")
	private String projectAddress;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '项目总投资'")
	private Double projectInvestSum;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '项目累计投资'")
	private Double projectInvestAccuSum;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-公共预算'")
	private Double capitalSCZ_ggys;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-国土资金'")
	private Double capitalSCZ_gtzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-专项资金'")
	private Double capitalSCZ_zxzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-区财政-公共预算'")
	private Double capitalQCZ_ggys;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-区财政-国土资金'")
	private Double capitalQCZ_gtzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-社会投资'")
	private Double capitalSHTZ;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-其它'")
	private Double capitalOther;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '资金筹措方案-其它来源类型'")
	private String capitalOtherType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '资金筹措方案-其它-说明'")
	private String capitalOtherDescription;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目简介'")
	private String projectIntro;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设规模'")
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

	public String getProjectClassify() {
		return projectClassify;
	}

	public void setProjectClassify(String projectClassify) {
		this.projectClassify = projectClassify;
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

	public String getProjectFunctionClassify() {
		return projectFunctionClassify;
	}

	public void setProjectFunctionClassify(String projectFunctionClassify) {
		this.projectFunctionClassify = projectFunctionClassify;
	}

	public String getProjectGoverEconClassify() {
		return projectGoverEconClassify;
	}

	public void setProjectGoverEconClassify(String projectGoverEconClassify) {
		this.projectGoverEconClassify = projectGoverEconClassify;
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
	
}

package cs.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;

/**
 * 项目表
 * 
 *
 */
@Entity
@Table(name="cs_projectInfo")
public class ProjectInfo extends DomainBase{
	@Id
	private String id;
	
	//begin#项目基本信息
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目阶段'")
	private String projectStage;
	@Column(columnDefinition="int(10) NULL COMMENT '申报年度'")
	private Integer shenBaoYear;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目名称'")
	private String projectName;
	@Column(columnDefinition="varchar(50) NULL COMMENT '投资类型'")
	private String investType;
	@Column(columnDefinition="varchar(50) NULL COMMENT '申报单位名称'")
	private String unitName;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目分类'")
	private String projectClassify;
	@Column(columnDefinition="varchar(50) NULL COMMENT '国民经济行业分类'")
	private String industry;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目行业归口'")
	private String projectIndustry;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目类型'")
	private String projectType;
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目建设地址'")
	private String projectAddress;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目坐标'")
	private String projectLocation;
	@Column(columnDefinition="varchar(50) NULL COMMENT '项目状态'")//未提交、已提交、收件
	private String projectStatus;
	@Column(columnDefinition="varchar(50) NULL COMMENT '建设阶段'")//前期、在建、决算
	private String projectBuildStage;
	//end#项目基本信息
	
	//begin#项目投资信息	
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '项目总投资'")
	private BigDecimal investSum;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '项目总投资-建安费'")
	private BigDecimal investJianAnFei;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '项目总投资-工程建设其他费'")
	private BigDecimal investGongChengJianSheQiTaFei;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '项目总投资-基本预备费'")
	private BigDecimal investJiBenYuBeiFei;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-市财政'")
	private BigDecimal capitalShiCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-区财政'")
	private BigDecimal capitalQuCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-社会投资'")
	private BigDecimal capitalSheHuiTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-国土资金'")
	private BigDecimal capitalGuoTuZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-专项资金'")
	private BigDecimal capitalZhuanXiangZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-中央投资'")
	private BigDecimal capitalZhongYangTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-部省'")
	private BigDecimal capitalShengBu;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-自筹'")
	private BigDecimal capitalZiChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-政府统筹'")
	private BigDecimal capitalZhengFuTongChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-教育费附加'")
	private BigDecimal capitalJiaoYuFuJia;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '资金筹措方案-其他'")
	private BigDecimal capitalOther;
	@Column(columnDefinition="varchar(500) NULL COMMENT '资金筹措方案（其他） 的来源途径说明'")
	private String capitalOtherExplain;
	//end#项目投资信息	
	
	//begin#项目描述	
	@Column(columnDefinition="varchar(1000) NULL COMMENT '项目简介'")
	private String projectSummary;
	@Column(columnDefinition="varchar(500) NULL COMMENT '建设规模'")
	private String ProjectGuiMo;
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目必要性和依据'")
	private String ProjectBiYaoXingAndYiJu;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '推荐方案介绍'")
	private String ProjectTuiJianFangAnJieShao;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '社会及经济效益评价'")
	private String ProjectSheHuiJingJiXiaoYiPingGu;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '备注'")
	private String remark;
	//end#项目描述	
	
	//begin#资金申请
	@Column(columnDefinition="date NULL COMMENT '开工日期'")
	private String projectStartDate;
	@Column(columnDefinition="date NULL COMMENT '竣工日期'")
	private String projectCompleteDate;
	
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '申报经费'")
	private String shenBaoJingFei;
	
	@Column(columnDefinition="int(10) NULL COMMENT '计划年度'")
	private Integer planYear;
	
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-市财政'")
	private BigDecimal capital2ShiCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-区财政'")
	private BigDecimal capital2QuCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-社会投资'")
	private BigDecimal capital2SheHuiTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-国土资金'")
	private BigDecimal capital2GuoTuZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-专项资金'")
	private BigDecimal capital2ZhuanXiangZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-中央投资'")
	private BigDecimal capital2ZhongYangTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-部省'")
	private BigDecimal capital2ShengBu;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-自筹'")
	private BigDecimal capital2ZiChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-政府统筹'")
	private BigDecimal capital2ZhengFuTongChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-教育费附加'")
	private BigDecimal capital2JiaoYuFuJia;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至上年底累计下达-其他'")
	private BigDecimal capital2Other;
	@Column(columnDefinition="varchar(500) NULL COMMENT '至上年底累计下达（其他） 的来源途径说明'")
	private String capital2OtherExplain;
	

	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-市财政'")
	private BigDecimal capital3ShiCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-区财政'")
	private BigDecimal capital3QuCaiZheng;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-社会投资'")
	private BigDecimal capital3SheHuiTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-国土资金'")
	private BigDecimal capital3GuoTuZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-专项资金'")
	private BigDecimal capital3ZhuanXiangZiJin;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-中央投资'")
	private BigDecimal capital3ZhongYangTouZi;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-部省'")
	private BigDecimal capital3ShengBu;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-自筹'")
	private BigDecimal capital3ZiChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-政府统筹'")
	private BigDecimal capital3ZhengFuTongChou;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-教育费附加'")
	private BigDecimal capital3JiaoYuFuJia;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '年度投资计划-其他'")
	private BigDecimal capital3Other;
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度投资计划（其他） 的来源途径说明'")
	private String capital3OtherExplain;
	
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '本年度主要建设内容'")
	private String currentYearMainBuild;	
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '上年度项目形象进度'")
	private String lastYearXingXiangJinDu;
	@Column(columnDefinition="varchar(500) NULL COMMENT '形象进度'")
	private String XingXiangJinDu;
	
	//end#资金申请
	
	//begin#下一年度计划	
	@Column(columnDefinition="varchar(50) NULL COMMENT '建设性质'")
	private String JianSheXingZhi;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '总概算批复文号'")
	private String GaiSuanPiWenNum;
	
	@Column(columnDefinition="varchar(50) NULL COMMENT '最近一次资金计划下达文号'")
	private String recentCapitalXiaDaPiWenNum;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '至年底前还可拨付资金'")
	private BigDecimal NianDiQianHaiKeBoFuZiJing ;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '累计安排投资'")
	private BigDecimal LeiJiAnPaiTouZi ;
	@Column(columnDefinition="decimal(9,2) NULL COMMENT '申请年度投资'")
	private BigDecimal ShenQingNianDuTouZi ;	
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目涉及总拆迁面积及拆迁资金估算'")
	private String ZongChaiQianMianJiAndCapital;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度拆迁面积及资金需求'")
	private String NianDuChaiQianMianJiAndCapitalXuQiu;
	//end#下一年度计划	
	
	//begin#委托审计
	@Column(columnDefinition="varchar(500) NULL COMMENT '委托审计-标题'")
	private String auditTitle;
	@Column(columnDefinition="varchar(500) NULL COMMENT '委托审计-内容'")
	private String auditContent;
	@Column(columnDefinition="varchar(500) NULL COMMENT '委托审计-送审造价'")
	private String auditSongShenZaoJia;
	//end#委托审计
	
	//begin#关联信息
	
	//附件
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	
	//申报单位
	@OneToOne(cascade=CascadeType.ALL)
	private UnitInfo shenBaoUnit=new UnitInfo();
	
	//编制单位
	@OneToOne(cascade=CascadeType.ALL)
	private UnitInfo BianZhiUnit=new UnitInfo();
	
	//项目月报
	@OneToMany(cascade=CascadeType.ALL)
//	@JoinColumn(name="projectInfo_Id",nullable=false)
	private List<MonthReport> monthReports = new ArrayList<>();
	
	//end#关联信息

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectStage() {
		return projectStage;
	}

	public void setProjectStage(String projectStage) {
		this.projectStage = projectStage;
	}

	public Integer getShenBaoYear() {
		return shenBaoYear;
	}

	public void setShenBaoYear(Integer shenBaoYear) {
		this.shenBaoYear = shenBaoYear;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getInvestType() {
		return investType;
	}

	public void setInvestType(String investType) {
		this.investType = investType;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getProjectClassify() {
		return projectClassify;
	}

	public void setProjectClassify(String projectClassify) {
		this.projectClassify = projectClassify;
	}

	public String getIndustry() {
		return industry;
	}

	public void setIndustry(String industry) {
		this.industry = industry;
	}

	public String getProjectIndustry() {
		return projectIndustry;
	}

	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
	}

	public String getProjectType() {
		return projectType;
	}

	public void setProjectType(String projectType) {
		this.projectType = projectType;
	}

	public String getProjectAddress() {
		return projectAddress;
	}

	public void setProjectAddress(String projectAddress) {
		this.projectAddress = projectAddress;
	}

	public String getProjectLocation() {
		return projectLocation;
	}

	public void setProjectLocation(String projectLocation) {
		this.projectLocation = projectLocation;
	}

	public BigDecimal getInvestSum() {
		return investSum;
	}

	public void setInvestSum(BigDecimal investSum) {
		this.investSum = investSum;
	}

	public BigDecimal getInvestJianAnFei() {
		return investJianAnFei;
	}

	public void setInvestJianAnFei(BigDecimal investJianAnFei) {
		this.investJianAnFei = investJianAnFei;
	}

	public BigDecimal getInvestGongChengJianSheQiTaFei() {
		return investGongChengJianSheQiTaFei;
	}

	public void setInvestGongChengJianSheQiTaFei(BigDecimal investGongChengJianSheQiTaFei) {
		this.investGongChengJianSheQiTaFei = investGongChengJianSheQiTaFei;
	}

	public BigDecimal getInvestJiBenYuBeiFei() {
		return investJiBenYuBeiFei;
	}

	public void setInvestJiBenYuBeiFei(BigDecimal investJiBenYuBeiFei) {
		this.investJiBenYuBeiFei = investJiBenYuBeiFei;
	}

	public BigDecimal getCapitalShiCaiZheng() {
		return capitalShiCaiZheng;
	}

	public void setCapitalShiCaiZheng(BigDecimal capitalShiCaiZheng) {
		this.capitalShiCaiZheng = capitalShiCaiZheng;
	}

	public BigDecimal getCapitalQuCaiZheng() {
		return capitalQuCaiZheng;
	}

	public void setCapitalQuCaiZheng(BigDecimal capitalQuCaiZheng) {
		this.capitalQuCaiZheng = capitalQuCaiZheng;
	}

	public BigDecimal getCapitalSheHuiTouZi() {
		return capitalSheHuiTouZi;
	}

	public void setCapitalSheHuiTouZi(BigDecimal capitalSheHuiTouZi) {
		this.capitalSheHuiTouZi = capitalSheHuiTouZi;
	}

	public BigDecimal getCapitalGuoTuZiJin() {
		return capitalGuoTuZiJin;
	}

	public void setCapitalGuoTuZiJin(BigDecimal capitalGuoTuZiJin) {
		this.capitalGuoTuZiJin = capitalGuoTuZiJin;
	}

	public BigDecimal getCapitalZhuanXiangZiJin() {
		return capitalZhuanXiangZiJin;
	}

	public void setCapitalZhuanXiangZiJin(BigDecimal capitalZhuanXiangZiJin) {
		this.capitalZhuanXiangZiJin = capitalZhuanXiangZiJin;
	}

	public BigDecimal getCapitalZhongYangTouZi() {
		return capitalZhongYangTouZi;
	}

	public void setCapitalZhongYangTouZi(BigDecimal capitalZhongYangTouZi) {
		this.capitalZhongYangTouZi = capitalZhongYangTouZi;
	}

	public BigDecimal getCapitalShengBu() {
		return capitalShengBu;
	}

	public void setCapitalShengBu(BigDecimal capitalShengBu) {
		this.capitalShengBu = capitalShengBu;
	}

	public BigDecimal getCapitalZiChou() {
		return capitalZiChou;
	}

	public void setCapitalZiChou(BigDecimal capitalZiChou) {
		this.capitalZiChou = capitalZiChou;
	}

	public BigDecimal getCapitalZhengFuTongChou() {
		return capitalZhengFuTongChou;
	}

	public void setCapitalZhengFuTongChou(BigDecimal capitalZhengFuTongChou) {
		this.capitalZhengFuTongChou = capitalZhengFuTongChou;
	}

	public BigDecimal getCapitalJiaoYuFuJia() {
		return capitalJiaoYuFuJia;
	}

	public void setCapitalJiaoYuFuJia(BigDecimal capitalJiaoYuFuJia) {
		this.capitalJiaoYuFuJia = capitalJiaoYuFuJia;
	}

	public BigDecimal getCapitalOther() {
		return capitalOther;
	}

	public void setCapitalOther(BigDecimal capitalOther) {
		this.capitalOther = capitalOther;
	}

	public String getCapitalOtherExplain() {
		return capitalOtherExplain;
	}

	public void setCapitalOtherExplain(String capitalOtherExplain) {
		this.capitalOtherExplain = capitalOtherExplain;
	}

	public String getProjectSummary() {
		return projectSummary;
	}

	public void setProjectSummary(String projectSummary) {
		this.projectSummary = projectSummary;
	}

	public String getProjectGuiMo() {
		return ProjectGuiMo;
	}

	public void setProjectGuiMo(String projectGuiMo) {
		this.ProjectGuiMo = projectGuiMo;
	}

	public String getProjectBiYaoXingAndYiJu() {
		return ProjectBiYaoXingAndYiJu;
	}

	public void setProjectBiYaoXingAndYiJu(String projectBiYaoXingAndYiJu) {
		this.ProjectBiYaoXingAndYiJu = projectBiYaoXingAndYiJu;
	}

	public String getProjectTuiJianFangAnJieShao() {
		return ProjectTuiJianFangAnJieShao;
	}

	public void setProjectTuiJianFangAnJieShao(String projectTuiJianFangAnJieShao) {
		this.ProjectTuiJianFangAnJieShao = projectTuiJianFangAnJieShao;
	}

	public String getProjectSheHuiJingJiXiaoYiPingGu() {
		return ProjectSheHuiJingJiXiaoYiPingGu;
	}

	public void setProjectSheHuiJingJiXiaoYiPingGu(String projectSheHuiJingJiXiaoYiPingGu) {
		this.ProjectSheHuiJingJiXiaoYiPingGu = projectSheHuiJingJiXiaoYiPingGu;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public String getProjectStartDate() {
		return projectStartDate;
	}

	public void setProjectStartDate(String projectStartDate) {
		this.projectStartDate = projectStartDate;
	}

	public String getProjectCompleteDate() {
		return projectCompleteDate;
	}

	public void setProjectCompleteDate(String projectCompleteDate) {
		this.projectCompleteDate = projectCompleteDate;
	}

	public String getShenBaoJingFei() {
		return shenBaoJingFei;
	}

	public void setShenBaoJingFei(String shenBaoJingFei) {
		this.shenBaoJingFei = shenBaoJingFei;
	}

	public Integer getPlanYear() {
		return planYear;
	}

	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}

	public BigDecimal getCapital2ShiCaiZheng() {
		return capital2ShiCaiZheng;
	}

	public void setCapital2ShiCaiZheng(BigDecimal capital2ShiCaiZheng) {
		this.capital2ShiCaiZheng = capital2ShiCaiZheng;
	}

	public BigDecimal getCapital2QuCaiZheng() {
		return capital2QuCaiZheng;
	}

	public void setCapital2QuCaiZheng(BigDecimal capital2QuCaiZheng) {
		this.capital2QuCaiZheng = capital2QuCaiZheng;
	}

	public BigDecimal getCapital2SheHuiTouZi() {
		return capital2SheHuiTouZi;
	}

	public void setCapital2SheHuiTouZi(BigDecimal capital2SheHuiTouZi) {
		this.capital2SheHuiTouZi = capital2SheHuiTouZi;
	}

	public BigDecimal getCapital2GuoTuZiJin() {
		return capital2GuoTuZiJin;
	}

	public void setCapital2GuoTuZiJin(BigDecimal capital2GuoTuZiJin) {
		this.capital2GuoTuZiJin = capital2GuoTuZiJin;
	}

	public BigDecimal getCapital2ZhuanXiangZiJin() {
		return capital2ZhuanXiangZiJin;
	}

	public void setCapital2ZhuanXiangZiJin(BigDecimal capital2ZhuanXiangZiJin) {
		this.capital2ZhuanXiangZiJin = capital2ZhuanXiangZiJin;
	}

	public BigDecimal getCapital2ZhongYangTouZi() {
		return capital2ZhongYangTouZi;
	}

	public void setCapital2ZhongYangTouZi(BigDecimal capital2ZhongYangTouZi) {
		this.capital2ZhongYangTouZi = capital2ZhongYangTouZi;
	}

	public BigDecimal getCapital2ShengBu() {
		return capital2ShengBu;
	}

	public void setCapital2ShengBu(BigDecimal capital2ShengBu) {
		this.capital2ShengBu = capital2ShengBu;
	}

	public BigDecimal getCapital2ZiChou() {
		return capital2ZiChou;
	}

	public void setCapital2ZiChou(BigDecimal capital2ZiChou) {
		this.capital2ZiChou = capital2ZiChou;
	}

	public BigDecimal getCapital2ZhengFuTongChou() {
		return capital2ZhengFuTongChou;
	}

	public void setCapital2ZhengFuTongChou(BigDecimal capital2ZhengFuTongChou) {
		this.capital2ZhengFuTongChou = capital2ZhengFuTongChou;
	}

	public BigDecimal getCapital2JiaoYuFuJia() {
		return capital2JiaoYuFuJia;
	}

	public void setCapital2JiaoYuFuJia(BigDecimal capital2JiaoYuFuJia) {
		this.capital2JiaoYuFuJia = capital2JiaoYuFuJia;
	}

	public BigDecimal getCapital2Other() {
		return capital2Other;
	}

	public void setCapital2Other(BigDecimal capital2Other) {
		this.capital2Other = capital2Other;
	}

	public String getCapital2OtherExplain() {
		return capital2OtherExplain;
	}

	public void setCapital2OtherExplain(String capital2OtherExplain) {
		this.capital2OtherExplain = capital2OtherExplain;
	}

	public BigDecimal getCapital3ShiCaiZheng() {
		return capital3ShiCaiZheng;
	}

	public void setCapital3ShiCaiZheng(BigDecimal capital3ShiCaiZheng) {
		this.capital3ShiCaiZheng = capital3ShiCaiZheng;
	}

	public BigDecimal getCapital3QuCaiZheng() {
		return capital3QuCaiZheng;
	}

	public void setCapital3QuCaiZheng(BigDecimal capital3QuCaiZheng) {
		this.capital3QuCaiZheng = capital3QuCaiZheng;
	}

	public BigDecimal getCapital3SheHuiTouZi() {
		return capital3SheHuiTouZi;
	}

	public void setCapital3SheHuiTouZi(BigDecimal capital3SheHuiTouZi) {
		this.capital3SheHuiTouZi = capital3SheHuiTouZi;
	}

	public BigDecimal getCapital3GuoTuZiJin() {
		return capital3GuoTuZiJin;
	}

	public void setCapital3GuoTuZiJin(BigDecimal capital3GuoTuZiJin) {
		this.capital3GuoTuZiJin = capital3GuoTuZiJin;
	}

	public BigDecimal getCapital3ZhuanXiangZiJin() {
		return capital3ZhuanXiangZiJin;
	}

	public void setCapital3ZhuanXiangZiJin(BigDecimal capital3ZhuanXiangZiJin) {
		this.capital3ZhuanXiangZiJin = capital3ZhuanXiangZiJin;
	}

	public BigDecimal getCapital3ZhongYangTouZi() {
		return capital3ZhongYangTouZi;
	}

	public void setCapital3ZhongYangTouZi(BigDecimal capital3ZhongYangTouZi) {
		this.capital3ZhongYangTouZi = capital3ZhongYangTouZi;
	}

	public BigDecimal getCapital3ShengBu() {
		return capital3ShengBu;
	}

	public void setCapital3ShengBu(BigDecimal capital3ShengBu) {
		this.capital3ShengBu = capital3ShengBu;
	}

	public BigDecimal getCapital3ZiChou() {
		return capital3ZiChou;
	}

	public void setCapital3ZiChou(BigDecimal capital3ZiChou) {
		this.capital3ZiChou = capital3ZiChou;
	}

	public BigDecimal getCapital3ZhengFuTongChou() {
		return capital3ZhengFuTongChou;
	}

	public void setCapital3ZhengFuTongChou(BigDecimal capital3ZhengFuTongChou) {
		this.capital3ZhengFuTongChou = capital3ZhengFuTongChou;
	}

	public BigDecimal getCapital3JiaoYuFuJia() {
		return capital3JiaoYuFuJia;
	}

	public void setCapital3JiaoYuFuJia(BigDecimal capital3JiaoYuFuJia) {
		this.capital3JiaoYuFuJia = capital3JiaoYuFuJia;
	}

	public BigDecimal getCapital3Other() {
		return capital3Other;
	}

	public void setCapital3Other(BigDecimal capital3Other) {
		this.capital3Other = capital3Other;
	}

	public String getCapital3OtherExplain() {
		return capital3OtherExplain;
	}

	public void setCapital3OtherExplain(String capital3OtherExplain) {
		this.capital3OtherExplain = capital3OtherExplain;
	}

	public String getCurrentYearMainBuild() {
		return currentYearMainBuild;
	}

	public void setCurrentYearMainBuild(String currentYearMainBuild) {
		this.currentYearMainBuild = currentYearMainBuild;
	}

	public String getLastYearXingXiangJinDu() {
		return lastYearXingXiangJinDu;
	}

	public void setLastYearXingXiangJinDu(String lastYearXingXiangJinDu) {
		this.lastYearXingXiangJinDu = lastYearXingXiangJinDu;
	}

	public String getXingXiangJinDu() {
		return XingXiangJinDu;
	}

	public void setXingXiangJinDu(String xingXiangJinDu) {
		XingXiangJinDu = xingXiangJinDu;
	}

	public String getJianSheXingZhi() {
		return JianSheXingZhi;
	}

	public void setJianSheXingZhi(String jianSheXingZhi) {
		JianSheXingZhi = jianSheXingZhi;
	}

	public String getGaiSuanPiWenNum() {
		return GaiSuanPiWenNum;
	}

	public void setGaiSuanPiWenNum(String gaiSuanPiWenNum) {
		GaiSuanPiWenNum = gaiSuanPiWenNum;
	}

	public String getRecentCapitalXiaDaPiWenNum() {
		return recentCapitalXiaDaPiWenNum;
	}

	public void setRecentCapitalXiaDaPiWenNum(String recentCapitalXiaDaPiWenNum) {
		this.recentCapitalXiaDaPiWenNum = recentCapitalXiaDaPiWenNum;
	}

	public BigDecimal getNianDiQianHaiKeBoFuZiJing() {
		return NianDiQianHaiKeBoFuZiJing;
	}

	public void setNianDiQianHaiKeBoFuZiJing(BigDecimal nianDiQianHaiKeBoFuZiJing) {
		NianDiQianHaiKeBoFuZiJing = nianDiQianHaiKeBoFuZiJing;
	}

	public BigDecimal getLeiJiAnPaiTouZi() {
		return LeiJiAnPaiTouZi;
	}

	public void setLeiJiAnPaiTouZi(BigDecimal leiJiAnPaiTouZi) {
		LeiJiAnPaiTouZi = leiJiAnPaiTouZi;
	}

	public BigDecimal getShenQingNianDuTouZi() {
		return ShenQingNianDuTouZi;
	}

	public void setShenQingNianDuTouZi(BigDecimal shenQingNianDuTouZi) {
		ShenQingNianDuTouZi = shenQingNianDuTouZi;
	}

	public String getZongChaiQianMianJiAndCapital() {
		return ZongChaiQianMianJiAndCapital;
	}

	public void setZongChaiQianMianJiAndCapital(String zongChaiQianMianJiAndCapital) {
		ZongChaiQianMianJiAndCapital = zongChaiQianMianJiAndCapital;
	}

	public String getNianDuChaiQianMianJiAndCapitalXuQiu() {
		return NianDuChaiQianMianJiAndCapitalXuQiu;
	}

	public void setNianDuChaiQianMianJiAndCapitalXuQiu(String nianDuChaiQianMianJiAndCapitalXuQiu) {
		NianDuChaiQianMianJiAndCapitalXuQiu = nianDuChaiQianMianJiAndCapitalXuQiu;
	}

	public String getAuditTitle() {
		return auditTitle;
	}

	public void setAuditTitle(String auditTitle) {
		this.auditTitle = auditTitle;
	}

	public String getAuditContent() {
		return auditContent;
	}

	public void setAuditContent(String auditContent) {
		this.auditContent = auditContent;
	}

	public String getAuditSongShenZaoJia() {
		return auditSongShenZaoJia;
	}

	public void setAuditSongShenZaoJia(String auditSongShenZaoJia) {
		this.auditSongShenZaoJia = auditSongShenZaoJia;
	}

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}

	public List<MonthReport> getMonthReports() {
		return monthReports;
	}

	public void setMonthReports(List<MonthReport> monthReports) {
		this.monthReports = monthReports;
	}

	public UnitInfo getShenBaoUnit() {
		return shenBaoUnit;
	}

	public void setShenBaoUnit(UnitInfo shenBaoUnit) {
		this.shenBaoUnit = shenBaoUnit;
	}

	public UnitInfo getBianZhiUnit() {
		return BianZhiUnit;
	}

	public void setBianZhiUnit(UnitInfo bianZhiUnit) {
		BianZhiUnit = bianZhiUnit;
	}

	public String getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(String projectStatus) {
		this.projectStatus = projectStatus;
	}

	public String getProjectBuildStage() {
		return projectBuildStage;
	}

	public void setProjectBuildStage(String projectBuildStage) {
		this.projectBuildStage = projectBuildStage;
	}
	
	
}

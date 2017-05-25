package cs.model.DomainDto;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

import cs.domain.MonthReport;
import cs.domain.UnitInfo;
import cs.model.BaseDto;

/**
 * 项目信息实体类
 * @author cx
 * @Date 2017-05-04
 */
public class ProjectInfoDto extends BaseDto{
	private String id;
	
	//begin#项目基本信息
	private String projectNumber; //项目代码
	private String projectStage;//项目阶段(代码)
	private String projectStageValue;//项目阶段(名称)
	private Integer shenBaoYear;//申报年度
	private String projectName;//项目名称
	private String investType;//投资类型(代码)
	private String investTypeValue;//投资类型(名称)
	private String unitName;//申报单位名称
	private String projectClassify;//项目分类(代码)
	private String projectClassifyValue;//项目分类(名称)
	private String industry;//国民经济行业分类(代码)
	private String industryValue;//国民经济行业分类(名称)
	private String projectIndustry;//项目行业归口(代码)
	private String projectIndustryValue;//项目行业归口(名称)
	private String projectType;//项目类型(代码)
	private String projectTypeValue;//项目类型(名称)
	private String projectAddress;//项目建设地址
	private String projectLocation;//项目坐标
	private String projectStatus;//项目状态(代码)
	private String projectStatusValue;//项目状态(名称)
	private String projectBuildStage;
	//end#项目基本信息
	
	//begin#项目投资信息	
	private BigDecimal investSum;//项目总投资
	private BigDecimal investJianAnFei;//项目总投资-建安费
	private BigDecimal investGongChengJianSheQiTaFei;//项目总投资-工程建设其他费
	private BigDecimal investJiBenYuBeiFei;//项目总投资-基本预备费
	private BigDecimal capitalShiCaiZheng;//资金筹措方案-市财政
	private BigDecimal capitalQuCaiZheng;//资金筹措方案-区财政
	private BigDecimal capitalSheHuiTouZi;//资金筹措方案-社会投资
	private BigDecimal capitalGuoTuZiJin;//资金筹措方案-国土资金
	private BigDecimal capitalZhuanXiangZiJin;//资金筹措方案-专项资金
	private BigDecimal capitalZhongYangTouZi;//资金筹措方案-中央投资
	private BigDecimal capitalShengBu;//资金筹措方案-部省
	private BigDecimal capitalZiChou;//资金筹措方案-自筹
	private BigDecimal capitalZhengFuTongChou;//资金筹措方案-政府统筹
	private BigDecimal capitalJiaoYuFuJia;//资金筹措方案-教育费附加
	private BigDecimal capitalOther;//资金筹措方案-其他
	private String capitalOtherExplain;//资金筹措方案（其他） 的来源途径说明
	//end#项目投资信息	
	
	//begin#项目描述	
	private String 	projectSummary;//项目简介
	private String ProjectGuiMo;//建设规模
	private String ProjectBiYaoXingAndYiJu;//项目必要性和依据
	
	private String ProjectTuiJianFangAnJieShao;//推荐方案介绍
	
	private String ProjectSheHuiJingJiXiaoYiPingGu;//社会及经济效益评价
	
	private String remark;//备注
	//end#项目描述	
	
	//begin#资金申请
	private String projectStartDate;//开工日期
	private String projectCompleteDate;//竣工日期
	
	private String shenBaoJingFei;//申报经费
	
	private Integer planYear;//计划年度
	
	private BigDecimal capital2ShiCaiZheng;//至上年底累计下达-市财政
	private BigDecimal capital2QuCaiZheng;//至上年底累计下达-区财政
	private BigDecimal capital2SheHuiTouZi;//至上年底累计下达-社会投资
	private BigDecimal capital2GuoTuZiJin;//至上年底累计下达-国土资金
	private BigDecimal capital2ZhuanXiangZiJin;//至上年底累计下达-专项资金
	private BigDecimal capital2ZhongYangTouZi;//至上年底累计下达-中央投资
	private BigDecimal capital2ShengBu;//至上年底累计下达-部省
	private BigDecimal capital2ZiChou;//至上年底累计下达-自筹
	private BigDecimal capital2ZhengFuTongChou;//至上年底累计下达-政府统筹
	private BigDecimal capital2JiaoYuFuJia;//至上年底累计下达-教育费附加
	private BigDecimal capital2Other;//至上年底累计下达-其他
	private String capital2OtherExplain;//至上年底累计下达（其他） 的来源途径说明
	

	private BigDecimal capital3ShiCaiZheng;//年度投资计划-市财政
	private BigDecimal capital3QuCaiZheng;//年度投资计划-区财政
	private BigDecimal capital3SheHuiTouZi;//年度投资计划-社会投资
	private BigDecimal capital3GuoTuZiJin;//年度投资计划-国土资金
	private BigDecimal capital3ZhuanXiangZiJin;//年度投资计划-专项资金
	private BigDecimal capital3ZhongYangTouZi;//年度投资计划-中央投资
	private BigDecimal capital3ShengBu;//年度投资计划-部省
	private BigDecimal capital3ZiChou;//年度投资计划-自筹
	private BigDecimal capital3ZhengFuTongChou;//年度投资计划-政府统筹
	private BigDecimal capital3JiaoYuFuJia;//年度投资计划-教育费附加
	private BigDecimal capital3Other;//年度投资计划-其他
	private String capital3OtherExplain;//年度投资计划（其他） 的来源途径说明
	
	
	private String currentYearMainBuild;//本年度主要建设内容
	
	private String lastYearXingXiangJinDu;//上年度项目形象进度
	private String XingXiangJinDu;//形象进度
	
	//end#资金申请
	
	//begin#下一年度计划	
	private String JianSheXingZhi;//建设性质（代码）
	private String JianSheXingZhiValue;//建设性质（名称）
	
	private String GaiSuanPiWenNum;//总概算批复文号
	
	private String recentCapitalXiaDaPiWenNum;//最近一次资金计划下达文号
	private BigDecimal NianDiQianHaiKeBoFuZiJing ;//至年底前还可拨付资金
	private BigDecimal LeiJiAnPaiTouZi ;//累计安排投资
	private BigDecimal ShenQingNianDuTouZi ;//申请年度投资
	
	private String ZongChaiQianMianJiAndCapital;//项目涉及总拆迁面积及拆迁资金估算
	
	private String NianDuChaiQianMianJiAndCapitalXuQiu;//年度拆迁面积及资金需求
	//end#下一年度计划	
	
	//begin#委托审计
	private String auditTitle;//委托审计-标题
	private String auditContent;//委托审计-内容
	private String auditSongShenZaoJia;//委托审计-送审造价
	//end#委托审计
	
	//begin#关联信息
	
	//附件
	
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	
	private UnitInfoDto shenBaoUnit=new UnitInfoDto();//申报单位
	
	private UnitInfoDto BianZhiUnit=new UnitInfoDto();
	
	private List<MonthReportDto> monthReportDtos = new ArrayList<>();
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

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachments) {
		this.attachmentDtos = attachments;
	}

	

	public List<MonthReportDto> getMonthReportDtos() {
		return monthReportDtos;
	}

	public void setMonthReportDtos(List<MonthReportDto> monthReportDtos) {
		this.monthReportDtos = monthReportDtos;
	}

	public String getInvestTypeValue() {
		return investTypeValue;
	}

	public void setInvestTypeValue(String investTypeValue) {
		this.investTypeValue = investTypeValue;
	}

	public String getProjectClassifyValue() {
		return projectClassifyValue;
	}

	public void setProjectClassifyValue(String projectClassifyValue) {
		this.projectClassifyValue = projectClassifyValue;
	}

	public String getIndustryValue() {
		return industryValue;
	}

	public void setIndustryValue(String industryValue) {
		this.industryValue = industryValue;
	}

	public String getProjectIndustryValue() {
		return projectIndustryValue;
	}

	public void setProjectIndustryValue(String projectIndustryValue) {
		this.projectIndustryValue = projectIndustryValue;
	}

	public String getProjectTypeValue() {
		return projectTypeValue;
	}

	public void setProjectTypeValue(String projectTypeValue) {
		this.projectTypeValue = projectTypeValue;
	}

	public String getProjectStageValue() {
		return projectStageValue;
	}

	public void setProjectStageValue(String projectStageValue) {
		this.projectStageValue = projectStageValue;
	}

	public String getJianSheXingZhiValue() {
		return JianSheXingZhiValue;
	}

	public void setJianSheXingZhiValue(String jianSheXingZhiValue) {
		JianSheXingZhiValue = jianSheXingZhiValue;
	}

	public String getProjectStatus() {
		return projectStatus;
	}

	public void setProjectStatus(String projectStatus) {
		this.projectStatus = projectStatus;
	}

	public String getProjectStatusValue() {
		return projectStatusValue;
	}

	public void setProjectStatusValue(String projectStatusValue) {
		this.projectStatusValue = projectStatusValue;
	}

	public String getProjectBuildStage() {
		return projectBuildStage;
	}

	public void setProjectBuildStage(String projectBuildStage) {
		this.projectBuildStage = projectBuildStage;
	}

	public UnitInfoDto getShenBaoUnit() {
		return shenBaoUnit;
	}

	public void setShenBaoUnit(UnitInfoDto shenBaoUnit) {
		this.shenBaoUnit = shenBaoUnit;
	}

	public UnitInfoDto getBianZhiUnit() {
		return BianZhiUnit;
	}

	public void setBianZhiUnit(UnitInfoDto bianZhiUnit) {
		BianZhiUnit = bianZhiUnit;
	}

	public String getProjectNumber() {
		return projectNumber;
	}

	public void setProjectNumber(String projectNumber) {
		this.projectNumber = projectNumber;
	}
	
	
	
	

}

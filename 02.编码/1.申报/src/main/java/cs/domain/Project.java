package cs.domain;

import java.math.BigDecimal;
import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 申报项目信息表
 * @author Administrator
 *
 */
@Entity
@Table(name="project")
public class Project extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private String id;
	
	@Column(columnDefinition="varchar(225) COMMENT '关联申报项目代码'")
	private String refProjectId;
	@Column(columnDefinition=" NOT NULL COMMENT '单位编号'")
	private long unitId;
	@Column(columnDefinition="int(4) COMMENT '投资分类'")
	private Integer investClassify;
	@Column(columnDefinition="int(4)  COMMENT '项目分类'")
	private Integer projectClassify;
	@Column(columnDefinition="int(4)  COMMENT '项目类型'")
	private Integer projectType;
	@Column(columnDefinition="int(4)  COMMENT '国民经济行业分类'")
	private Integer nationalEconIndustryClassify;
	@Column(columnDefinition="int(4)  COMMENT '项目行业归口'")
	private Integer projectIndustryCharge;
	@Column(columnDefinition="varchar(225) COMMENT '项目编号'")
	private String projectNo;
	@Column(columnDefinition="varchar(225) COMMENT '打印流水号'")
	private String printSerialNo;
	@Column(columnDefinition="varchar(225) COMMENT '项目名称'")
	private String projectName;
	@Column(columnDefinition="datetime COMMENT '申报年份'")
	private Date declareYear;
	@Column(columnDefinition="int(4) COMMENT '申报类型'")
	private String declareType;
	@Column(columnDefinition="varchar(225) COMMENT '项目代码'")
	private String projectCode;
	@Column(columnDefinition="varchar(225) COMMENT '建设详细地址'")
	private String constructionAddress;
	@Column(columnDefinition="float(8) COMMENT '项目X坐标'")
	private Float X;
	@Column(columnDefinition="float(8) COMMENT '项目Y坐标'")
	private Float Y;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位名称'")
	private String declareUnitName;
	@Column(columnDefinition="datetime COMMENT '开工日期'")
	private Date startDate;
	@Column(columnDefinition="datetime COMMENT '竣工日期'")
	private Date endDate;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位地址'")
	private String declareUnitAddress;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位负责人名字'")
	private String declareUnitResPersonName;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位负责人电话'")
	private String declareUnitResPersonTel;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位负责人手机'")
	private String declareUnitResPersonMobile;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位负责人邮箱'")
	private String declareUnitResPersonEmail;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位负责人传真'")
	private String declareUnitResPersonFax;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位联系人名字'")
	private String declareUnitContactPersonName;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位联系人电话'")
	private String declareUnitContactPersonTel;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位联系人手机'")
	private String declareUnitContactPersonMobile;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位联系人邮箱'")
	private String declareUnitContactPersonEmail;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位联系人传真'")
	private String declareUnitContactPersonFax;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位负责人姓名'")
	private String compilationUnitResPersonName;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位负责人电话'")
	private String compilationUnitResPersonTel;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位负责人手机'")
	private String compilationUnitResPersonMobile;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位负责人邮箱'")
	private String compilationUnitResPersonEmail;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位负责人传真'")
	private String compilationUnitResPersonFax;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位联系人姓名'")
	private String compilationUnitContactName;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位联系人电话'")
	private String compilationUnitContactTel;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位联系人手机'")
	private String compilationUnitContactMobile;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位联系人邮箱'")
	private String compilationUnitContactEmail;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位联系人传真'")
	private String compilationUnitContactFax;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位名称'")
	private String compilationUnitNam;
	@Column(columnDefinition="varchar(225) COMMENT '编制单位资质等级'")
	private String compilationUnitLeve;
	@Column(columnDefinition="varchar(225) COMMENT '建设街道地址'")
	private String cityArea;
	@Column(columnDefinition="varchar(2000) COMMENT '本年度建设内容'")
	private String constructionContent;
	@Column(columnDefinition="varchar(2000) COMMENT '建设规模'")
	private String constructionScale;
	@Column(columnDefinition="varchar(5000) COMMENT '社会及经济效益评价'")
	private String theBenefitOfAfterUse ;
	@Column(columnDefinition="varchar(5000) COMMENT '项目简介'")
	private String project_General ;
	@Column(columnDefinition="varchar(2000) COMMENT '项目必要性和依据'")
	private String constructionNecessity ;
	@Column(columnDefinition="varchar(2000) COMMENT '推荐方案介绍'")
	private String recommendedProgram ;
	@Column(columnDefinition="int(1) COMMENT '基本信息是否完成'")
	private Integer baseInfoIsFinish ;
	@Column(columnDefinition="decimal(9) COMMENT '项目总投资总计'")
	private BigDecimal investTotal ;
	@Column(columnDefinition="decimal(9) COMMENT '工程建设其他费'")
	private BigDecimal investOtherCosts ;
	@Column(columnDefinition="decimal(9) COMMENT '设备投资'")
	private BigDecimal investBasePrepareCosts ;
	@Column(columnDefinition="decimal(9) COMMENT '建安投资'")
	private BigDecimal investFabrication ;
	@Column(columnDefinition="decimal(9) COMMENT '年度投资总资金'")
	private BigDecimal investAnnualSourceTotal ;
	@Column(columnDefinition="decimal(9) COMMENT '年度部省投资'")
	private BigDecimal investAnnualProvince ;
	@Column(columnDefinition="decimal(9) COMMENT '年度市财政投资'")
	private BigDecimal investAnnualCity ;
	@Column(columnDefinition="decimal(9) COMMENT '年度区财政投资'")
	private BigDecimal investAnnualArea ;
	@Column(columnDefinition="decimal(9) COMMENT '年度自筹资金投资'")
	private BigDecimal investAnnualSelf ;
	@Column(columnDefinition="decimal(9) COMMENT '年度国土资金'")
	private BigDecimal investAnnualLandCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '年度专项资金'")
	private BigDecimal investAnnualSpecialCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '年度中央投资'")
	private BigDecimal investAnnualCenter ;
	@Column(columnDefinition="decimal(9) COMMENT '年度其他资金'")
	private BigDecimal investAnnualOther ;
	@Column(columnDefinition="varchar(225) COMMENT '年度其他资金来源说明'")
	private String investAnnualSourceExplain ;
	@Column(columnDefinition="decimal(9) COMMENT '总投资资金来源总计'")
	private BigDecimal investSourceTotal ;
	@Column(columnDefinition="decimal(9) COMMENT '部省投资'")
	private BigDecimal investProvince ;
	@Column(columnDefinition="decimal(9) COMMENT '市财政投资'")
	private BigDecimal investCity ;
	@Column(columnDefinition="decimal(9) COMMENT '区财政投资'")
	private BigDecimal investArea ;
	@Column(columnDefinition="decimal(9) COMMENT '自筹资金'")
	private BigDecimal investSelf ;
	@Column(columnDefinition="decimal(9) COMMENT '国土资金'")
	private BigDecimal investLandCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '专项资金'")
	private BigDecimal investSpecialCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '中央投资'")
	private BigDecimal investCenter ;
	@Column(columnDefinition="decimal(9) COMMENT '其它投资'")
	private BigDecimal investOther ;
	@Column(columnDefinition="varchar(225) COMMENT '资金筹措方案其他资金来源说明'")
	private String investSourceExplain ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底累计资金总计'")
	private BigDecimal investPreviousYearSourceTotal ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底部省累计完成'")
	private BigDecimal investPreviousYearProvince ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底市财政累计完成'")
	private BigDecimal investPreviousYearCity ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底区财政累计完成'")
	private BigDecimal investPreviousYearArea ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底自筹累计完成'")
	private BigDecimal investPreviousYearSelf ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底国土资金累计完成'")
	private BigDecimal investPreviousYearLandCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底专项资金累计完成'")
	private BigDecimal investPreviousYearSpecialCapital ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底中央投资累计完成'")
	private BigDecimal investPreviousYearCenter ;
	@Column(columnDefinition="decimal(9) COMMENT '至上年底其他累计完成'")
	private BigDecimal investPreviousYearOther ;
	@Column(columnDefinition="varchar(225) COMMENT '至上年度累计其他资金来源说明'")
	private String investPreviousYearSourceExplain ;
	@Column(columnDefinition="varchar(2000) COMMENT '上年度项目形象进度'")
	private String previousYearProjectProgress ;
	@Column(columnDefinition="varchar(2000) COMMENT '报告期工程期形象进度'")
	private String reportPeriodProjectProgress;
	@Column(columnDefinition="int(1) COMMENT '项目单位信息是否完成'")
	private Integer unitInfoIsFinish;
	@Column(columnDefinition="int(1) COMMENT '申报材料清单是否填写完成'")
	private Integer attachmentIsFinish;
	@Column(columnDefinition="int(1) COMMENT '项目状态'")
	private Integer projectStatus;
	@Column(columnDefinition="datetime COMMENT '提交时间'")
	private Date submitTime;
	@Column(columnDefinition="datetime COMMENT '收件时间'")
	private Date recivePaperTime;
	@Column(columnDefinition="int(1) COMMENT '是否跨区'")
	private Integer isCrossRegion;
	
	//--------------------意思不是跟明确-----------------------
	@Column(columnDefinition="int(4) COMMENT '资金申请报告生成'")
	private Integer reportStatus;
	@Column(columnDefinition="int(4) COMMENT '          '")
	private Integer dataSource;
	@Column(columnDefinition="int(4) COMMENT '关联城市项目编号'")
	private Integer refCityProjectId;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位名称'")
	private String reportUnitName;
	@Column(columnDefinition="varchar(225) COMMENT '申报单位组织机构代码'")
	private String reportUnitCode;
	@Column(columnDefinition="int(4) COMMENT '申报单位性质'")
	private Integer reportUnitProperty;
	@Column(columnDefinition="int(1) COMMENT '项目关联信息是否完成'")
	private Integer relationInfoIsFinish;
	@Column(columnDefinition="int(4) COMMENT '项目处理步骤状态'")
	private Integer projectStep;
	//-------------------------------------------
	
	@Column(columnDefinition="varchar(225) COMMENT '收文编号'")
	private String receiptNumber;
	@Column(columnDefinition="int(1) COMMENT '是否中止'")
	private Integer isPause;
	@Column(columnDefinition="datetime COMMENT '中止开始时间'")
	private Date pauseStartTime;
	@Column(columnDefinition="datetime COMMENT '中止结束时间'")
	private Date pauseEndTime;
	@Column(columnDefinition="int(4) COMMENT '项目实际工作日'")
	private Integer workingDays;
	@Column(columnDefinition="varchar(2000) COMMENT '项目建设依据'")
	private String projectConstructionNec;
	@Column(columnDefinition="varchar(2000) COMMENT '项目建设内容'")
	private String projectContent;
	@Column(columnDefinition="varchar(2000) COMMENT '项目投资概算及资金来'")
	private String projectEstAndCapitalSource;
	@Column(columnDefinition="varchar(2000) COMMENT '项目其他'")
	private String projectOther;
	@Column(columnDefinition="int(4) COMMENT '拟稿状态'")
	private Integer drafteStatus;
	@Column(columnDefinition="varchar(225) COMMENT '发文文号'")
	private String fatSymbol;
	@Column(columnDefinition="varchar(2000) COMMENT '项目相关'")
	private String projectAbout;
	@Column(columnDefinition="int(1) COMMENT '是否有月报'")
	private Integer isMonthReport;
	@Column(columnDefinition="decimal(9) COMMENT '审定金额'")
	private BigDecimal authorizeMoney ;
	@Column(columnDefinition="decimal(9) COMMENT '批复金额'")
	private BigDecimal replyMoney ;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
	@Column(columnDefinition="int(1) COMMENT '是否进入年度计划'")
	private String isPassed;
	@Column(columnDefinition="varchar(225) COMMENT '项目类别'")
	private String projectClass;
	@Column(columnDefinition="varchar(225) COMMENT '最近一次资金计划下达文号'")
	private String recentCapitalNumber;
	@Column(columnDefinition="varchar(2000) COMMENT '项目涉及总拆迁资金估算'")
	private String demolitionTotalInvestAndArea;
	@Column(columnDefinition="varchar(2000) COMMENT '年度项目涉及拆迁资金需求'")
	private String yearDemolitionlInvestAndArea;
	@Column(columnDefinition="varchar(225) COMMENT '总概算批复文号'")
	private String allEstimateProjectNumber;
	@Column(columnDefinition="int(4) COMMENT '建设性质'")
	private Integer constructionProperty;
	@Column(columnDefinition="int(4) COMMENT '年度报告'")
	private Integer reportYear;
	@Column(columnDefinition="int(1) COMMENT '是否为额外项目'")
	private Integer extraProject;
	@Column(columnDefinition="datetime COMMENT '发文日期'")
	private Integer fatSymbolDate;
	@Column(columnDefinition="int(4) COMMENT '父项目节点'")//类型没有确定
	private Integer pId;
	
}

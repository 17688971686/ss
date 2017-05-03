package cs.domain;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * 月报表
 *
 *
 */
@Entity
@Table(name="cs_monthReport")
public class MonthReport extends DomainBase{

	@Id
	private String id;	
	@Column(columnDefinition="varchar(255)  COMMENT '关联项目代码'")
	private String projectId;
	
	//begin#联系人信息

	@Column(columnDefinition="varchar(255) COMMENT '填报人姓名'")
	private String fillName;
	@Column(columnDefinition="varchar(50) COMMENT '填报人手机号'")
	private String fillMobile;
	@Column(columnDefinition="varchar(255) COMMENT '月报负责人姓名'")
	private String monRepManagerName;
	@Column(columnDefinition="varchar(50) COMMENT '月报负责人手机号'")
	private String monRepManagerTel;
	@Column(columnDefinition="varchar(50) COMMENT '月报负责人传真号'")
	private String monRepManagerFax;
	@Column(columnDefinition="varchar(255) COMMENT '月报负责单位名称'")
	private String monRepManagUnitName;
	@Column(columnDefinition="varchar(255) COMMENT '责任单位负责人名称'")
	private String respUnitManagerName;
	@Column(columnDefinition="varchar(50) COMMENT '责任单位负责人电话'")
	private String respUnitManagerTel;
	
	//end#联系人信息
	
	//begin#批文日期和文号
	//日期
	@Column(columnDefinition="datetime COMMENT '项目建议书批复日期'")
	private Date proposalsReplyDate;
	@Column(columnDefinition="datetime COMMENT '可行性研究报告批复日期'")
	private Date feaStyRepoReplyDate;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复日期'")
	private Date allEstimateReplyDate;
	@Column(columnDefinition="datetime COMMENT '前期工作计划批复日期'")
	private Date prePlanReplyDate;
	
	//文号
	@Column(columnDefinition="varchar(50) COMMENT '项目建议书批复类型'")
	private Integer proposalsType;
	@Column(columnDefinition="datetime COMMENT '项目建议书批复年份'")
	private Date proposalsYear;
	@Column(columnDefinition="varchar(50) COMMENT '项目建议书批复文号'")
	private String proposalsNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '可行性研究报告批复类型'")
	private Integer reportType;
	@Column(columnDefinition="datetime  COMMENT '可行性研究报告批复年份'")
	private Date reportYear;
	@Column(columnDefinition="varchar(50) COMMENT '可行性研究报告批复文号'")
	private String reportNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '项目总概算批复类型'")
	private Integer allEstimateType;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复年份'")
	private Date allEstimateYear;
	@Column(columnDefinition="varchar(50) COMMENT '项目总概算批复文号'")
	private String allEstimateNum;
	
	@Column(columnDefinition="varchar(50) COMMENT '前期工作计划批复类型'")
	private Integer prePlanType;
	@Column(columnDefinition="datetime COMMENT '前期工作计划批复年份'")
	private Date prePlanYear;
	@Column(columnDefinition="varchar(50) COMMENT '前期工作计划批复文号'")
	private String prePlanNum;
	//end#批文日期和文号
	
	//begin#开工时间
	@Column(columnDefinition="datetime COMMENT '预计开工日期'")
	private Date commencementDate;
	@Column(columnDefinition="datetime COMMENT '实际开工日期'")
	private Date actuallyDate;
	@Column(columnDefinition="datetime COMMENT '竣工日期'")
	private Date completedDate;
	//end#开工时间
	
	//begin#投资情况
	@Column(columnDefinition="decimal(9,2) COMMENT '计划总投资'")
	private BigDecimal invertPlanTotal;
	@Column(columnDefinition="decimal(9,2) COMMENT '实际完成投资'")
	private BigDecimal actuallyFinishiInvestment;	
	@Column(columnDefinition="decimal(9,2) COMMENT '自开工至上年底完成投资'")
	private BigDecimal sinceLastYearCompletInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '本年计划投资'")
	private BigDecimal thisYearPlanInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '本月完成投资'")
	private BigDecimal thisMonthInvestTotal;
	@Column(columnDefinition="decimal(9,2) COMMENT '建筑安装工程投资'")
	private BigDecimal buildAndInstallInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '设备投资'")
	private BigDecimal equipmentInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '其他投资'")
	private BigDecimal otherInvest;
	@Column(columnDefinition="decimal(9,2) COMMENT '本年度累计完成投资'")
	private BigDecimal thisYearAccumulatedInvestment;
	//end#投资情况
	
	
	//begin#进度情况
	@Column(columnDefinition="varchar(2000) COMMENT '项目审批进度'")
	private String projectApprovalProgress;
	@Column(columnDefinition="varchar(2000) COMMENT '工程形象进度或项目进展情况'")
	private String projectImageProgress;
	@Column(columnDefinition="varchar(50) COMMENT '项目进度'")
	private Integer selfReview;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第一季度完成投资'")
	private BigDecimal firstQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第二季度完成投资'")
	private BigDecimal secondQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第三季度完成投资'")
	private BigDecimal thirdQuarCompInvestment;
	@Column(columnDefinition="decimal(9,2) COMMENT '预计第四季度完成投资'")
	private BigDecimal fourthQuarCompInvestment;	
	@Column(columnDefinition="varchar(2000) COMMENT '工作目标'")
	private String workTargets;
	
	//end#进度情况
	
	//begin#拆迁情况
	@Column(columnDefinition="decimal(9,6) COMMENT '征用土地面积'")
	private BigDecimal requisitionLandArea;
	@Column(columnDefinition="decimal(9,6) COMMENT '拆迁面积'")
	private BigDecimal demolitionArea;
	//end#拆迁情况
	
	
	@Column(columnDefinition="datetime COMMENT '提交月'")
	private Date submitMonth;
	@Column(columnDefinition="datetime COMMENT '提交日期'")
	private Date submitDate;
	@Column(columnDefinition="datetime COMMENT '立项日期'")
	private Date approvalDate;	
	
	@Column(columnDefinition="bit(1)  COMMENT '是否完工'")
	private Integer isCompletion;
	@Column(columnDefinition="varchar(255) COMMENT '备注'")
	private String remark;
	
	//begin#关联信息
	//月报问题
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="monthReport_id",nullable=false)
	private List<MonthReportProblem> monthReportProblems=new ArrayList<>();
	
	//月报附件
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	//end#关联信息
}
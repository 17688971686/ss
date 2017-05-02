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
 * 月报表
 * @author Administrator
 *
 */
@Entity
@Table(name="cs-monthReport")
public class MonthReport extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(columnDefinition="varchar(225) NOT NULL COMMENT '关联项目代码'")
	private String projectId;
	@Column(columnDefinition="varchar(225) COMMENT '填报人姓名'")
	private String fileName;
	@Column(columnDefinition="varchar(225) COMMENT '填报人手机号'")
	private String fileMobile;
	@Column(columnDefinition="varchar(225) COMMENT '月报负责人姓名'")
	private String monthReportManagerName;
	@Column(columnDefinition="varchar(225) COMMENT '月报负责人手机号'")
	private String monthReportManagerTel;
	@Column(columnDefinition="varchar(225) COMMENT '月报负责人传真号'")
	private String monthReportManagerFax;
	@Column(columnDefinition="varchar(225) COMMENT '月报负责单位名称'")
	private String monthReportResponsibleUnitName;
	@Column(columnDefinition="varchar(225) COMMENT '责任单位负责人名称'")
	private String responsibleUnitManagerName;
	@Column(columnDefinition="varchar(225) COMMENT '责任单位负责人电话'")
	private String responsibleUnitManagerTel;
	@Column(columnDefinition="decimal(9) COMMENT '自开工至上年底完成投资'")
	private BigDecimal sinceLastYearCompletInvestment;
	@Column(columnDefinition="decimal(9) COMMENT '本年计划投资'")
	private BigDecimal thisYearPlanInvestment;
	@Column(columnDefinition="decimal(9) COMMENT '本月完成投资'")
	private BigDecimal thisMonthInvestTotal;
	@Column(columnDefinition="decimal(9) COMMENT '建筑安装工程投资'")
	private BigDecimal buildAndInstallInvest;
	@Column(columnDefinition="decimal(9) COMMENT '设备投资'")
	private BigDecimal equipmentInvest;
	@Column(columnDefinition="decimal(9) COMMENT '其他投资'")
	private BigDecimal otherInvest;
	@Column(columnDefinition="decimal(9) COMMENT '本年度累计完成投资'")
	private BigDecimal thisYearAccumulatedInvestment;
	@Column(columnDefinition="datetime COMMENT '预计开工日期'")
	private Date commencementDate;
	@Column(columnDefinition="datetime COMMENT '实际开工日期'")
	private Date actuallyDate;
	@Column(columnDefinition="datetime COMMENT '竣工日期'")
	private Date completedDate;
	@Column(columnDefinition="varchar(2000) COMMENT '项目审批进度'")
	private String projectApprovalProgress;
	@Column(columnDefinition="varchar(2000) COMMENT '工程形象进度或项目进展情况'")
	private String projectImageProgress;
	@Column(columnDefinition="int(4) COMMENT '项目进度自我检讨'")
	private Integer selfReview;
	@Column(columnDefinition="decimal(9) COMMENT '预计第一季度完成投资'")
	private BigDecimal firstQuarterCompletedInvestment;
	@Column(columnDefinition="decimal(9) COMMENT '预计第二季度完成投资'")
	private BigDecimal secondQuarterCompletedInvestment;
	@Column(columnDefinition="decimal(9) COMMENT '预计第三季度完成投资'")
	private BigDecimal thirdQuarterCompletedInvestment;
	@Column(columnDefinition="decimal(9) COMMENT '预计第四季度完成投资'")
	private BigDecimal thourthQuarterCompletedInvestment;
	 
	@Column(columnDefinition="datetime COMMENT '提交月'")
	private Date submitMonth;
	@Column(columnDefinition="datetime COMMENT '提交日期'")
	private Date submitDate;
	@Column(columnDefinition="datetime COMMENT '立项日期'")
	private Date approvalDate;
	@Column(columnDefinition="datetime COMMENT '项目建议书批复日期'")
	private Date proposalsReplyDate;
	@Column(columnDefinition="datetime COMMENT '可行性研究报告批复日期'")
	private Date feasibilityStudyReportReplyDate;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复日期'")
	private Date allEstimateReplyDate;
	@Column(columnDefinition="datetime COMMENT '前期工作计划批复日期'")
	private Date prePlanReplyDate;
	@Column(columnDefinition="decimal(9) COMMENT '计划总投资'")
	private BigDecimal invertPlanTotal;
	@Column(columnDefinition="decimal(9) COMMENT '实际完成投资'")
	private BigDecimal actuallyFinishiInvestment;
	@Column(columnDefinition="varchar(225) COMMENT '项目建议书批复类型'")
	private String proposalsType;
	@Column(columnDefinition="datetime COMMENT '项目建议书批复年份'")
	private Date proposalsYear;
	@Column(columnDefinition="varchar(225) COMMENT '项目建议书批复文号'")
	private String proposalsNum;
	@Column(columnDefinition="varchar(225) COMMENT '可行性研究报告批复类型'")
	private String reportType;
	@Column(columnDefinition="datetime  COMMENT '可行性研究报告批复年份'")
	private Date reportYear;
	@Column(columnDefinition="varchar(225) COMMENT '可行性研究报告批复文号'")
	private String reportNum;
	@Column(columnDefinition="varchar(225) COMMENT '项目总概算批复类型'")
	private String allEstimateType;
	@Column(columnDefinition="datetime COMMENT '项目总概算批复年份'")
	private Date allEstimateYear;
	@Column(columnDefinition="varchar(225) COMMENT '项目总概算批复文号'")
	private String allEstimateNum;
	@Column(columnDefinition="varchar(225) COMMENT '月报审批类型'")
	private String approvalType;
	@Column(columnDefinition="datetime COMMENT '审批年份'")
	private Date approvalYear;
	@Column(columnDefinition="varchar(225) COMMENT '审批编号'")
	private String approvalNum;
	@Column(columnDefinition="varchar(225) COMMENT '工作目标'")
	private String workTargets;
	@Column(columnDefinition="decimal(9) COMMENT '征用土地面积'")
	private BigDecimal requisitionLandArea;
	@Column(columnDefinition="decimal(9) COMMENT '拆迁面积'")
	private BigDecimal demolitionArea;
	@Column(columnDefinition="int(1)  COMMENT '是否完工'")
	private String isCompletion;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
}

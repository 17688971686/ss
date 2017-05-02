package cs.model;

import java.math.BigDecimal;
import java.util.Date;

/**
 * 月报表
 * @author Administrator
 *
 */

public class MonthReportDto extends BaseDto{

	private long id;
	private String projectId;//关联项目代码
	private String fileName;//填报人姓名
	private String fileMobile;//填报人手机号
	private String monthReportManagerName;//月报负责人姓名
	private String monthReportManagerTel;//月报负责人手机号
	private String monthReportManagerFax;//月报负责人传真号
	private String monthReportResponsibleUnitName;//月报负责单位名称
	private String responsibleUnitManagerName;//责任单位负责人名称
	private String responsibleUnitManagerTel;//责任单位负责人电话
	private BigDecimal sinceLastYearCompletInvestment;//自开工至上年底完成投资
	private BigDecimal thisYearPlanInvestment;//本年计划投资
	private BigDecimal thisMonthInvestTotal;//本月完成投资
	private BigDecimal buildAndInstallInvest;//建筑安装工程投资
	private BigDecimal equipmentInvest;//设备投资
	private BigDecimal otherInvest;//其他投资
	private BigDecimal thisYearAccumulatedInvestment;//本年度累计完成投资
	private Date commencementDate;//预计开工日期
	private Date actuallyDate;//实际开工日期
	private Date completedDate;//竣工日期
	private String projectApprovalProgress;//项目审批进度
	private String projectImageProgress;//工程形象进度或项目进展情况
	private Integer selfReview;//项目进度自我检讨
	private BigDecimal firstQuarterCompletedInvestment;//预计第一季度完成投资
	private BigDecimal secondQuarterCompletedInvestment;//预计第二季度完成投资
	private BigDecimal thirdQuarterCompletedInvestment;//预计第三季度完成投资
	private BigDecimal thourthQuarterCompletedInvestment;//预计第四季度完成投资
	private Date submitMonth;//提交月
	private Date submitDate;//提交日期
	private Date approvalDate;//立项日期
	private Date proposalsReplyDate;//项目建议书批复日期
	private Date feasibilityStudyReportReplyDate;//可行性研究报告批复日期
	private Date allEstimateReplyDate;//项目总概算批复日期
	private Date prePlanReplyDate;//前期工作计划批复日期
	private BigDecimal invertPlanTotal;//计划总投资
	private BigDecimal actuallyFinishiInvestment;//实际完成投资
	private String proposalsType;//项目建议书批复类型
	private Date proposalsYear;//项目建议书批复年份
	private String proposalsNum;//项目建议书批复文号
	private String reportType;//可行性研究报告批复类型
	private Date reportYear;//可行性研究报告批复年份
	private String reportNum;//可行性研究报告批复文号
	private String allEstimateType;//项目总概算批复类型
	private Date allEstimateYear;//项目总概算批复年份
	private String allEstimateNum;//项目总概算批复文号	
	private String approvalType;//月报审批类型
	private Date approvalYear;//审批年份	
	private String approvalNum;//审批编号	
	private String workTargets;	//工作目标
	private BigDecimal requisitionLandArea;//征用土地面积	
	private BigDecimal demolitionArea;	//拆迁面积
	private String isCompletion;	//是否完工
	private String remark;	//备注
	
	
	
	
}

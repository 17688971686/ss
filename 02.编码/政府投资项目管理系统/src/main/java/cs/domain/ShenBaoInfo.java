package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
/**
 * @Description: 申报信息表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_shenBaoInfo")
public class ShenBaoInfo extends BaseProject{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目ID'")
	private String projectId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '申报阶段'")
	private String projectShenBaoStage;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目建设性质分类'")
	private String projectConstrChar;
	
	//begin#年度计划相关
	@Column(columnDefinition="int NULL COMMENT '计划年度'")
	private Integer planYear;
	@Column(columnDefinition="double(10,4) NULL COMMENT '申请年度投资'")
	private Double applyYearInvest;	
	@Column(columnDefinition="double(10,4) NULL COMMENT '安排年度投资'")
	private Double yearInvestApproval;
	@Column(columnDefinition="varchar(255) NULL COMMENT '安排年度投资Id'")
	private String yearPlanCapitalId;
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度建设任务'")
	private String yearConstructionTask;
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度建设内容'")
	private String yearConstructionContent;
	//end#年度计划相关

   //begin#财政相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '功能科目'")
	private String functionSubjects;
	@Column(columnDefinition="varchar(500) NULL COMMENT '经济分类科目'")
	private String econClassSubjects;
	//end#财政相关
	
	//begin#审批相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '审批状态'")
	private String processState;
	//end
	
	//begin#建议书相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设必要性和依据'")
	private String projectConstrBasis;
	//end
	
	//begin#可行性研究报告相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '推荐方案介绍'")
	private String recomProgram;
	@Column(columnDefinition="varchar(500) NULL COMMENT '社会及经济效益评价'")
	private String socialAndEconomic;
	//end
	
	//begin#前期计划相关
	@Column(columnDefinition="bit(1) NULL COMMENT '是否申请前期工作经费'")
	private Boolean isApplyQianQiFei = false;//默认为不申请
	@Column(columnDefinition="double(10,4) NULL COMMENT '工作经费申请金额'")
	private Double qianQiFeiApply;
	//end
	
	//begin#前期计划相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '上一年形象进度'")
	private String lastYearImageSchedule;
	//end
	
	//begin#竣工决算相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '形象进度'")
	private String yearImageSchedule;
	//end
	
	//begin#关联信息
	@OneToOne(cascade=CascadeType.ALL)
	private ShenBaoUnitInfo bianZhiUnitInfo=new ShenBaoUnitInfo();
	public Double getYearInvestApproval() {
		return yearInvestApproval;
	}
	public void setYearInvestApproval(Double yearInvestApproval) {
		this.yearInvestApproval = yearInvestApproval;
	}
	@OneToOne(cascade=CascadeType.ALL)
	private ShenBaoUnitInfo shenBaoUnitInfo=new ShenBaoUnitInfo();
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getProjectId() {
		return projectId;
	}
	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}
	public String getProjectShenBaoStage() {
		return projectShenBaoStage;
	}
	public void setProjectShenBaoStage(String projectShenBaoStage) {
		this.projectShenBaoStage = projectShenBaoStage;
	}
	public String getProjectConstrChar() {
		return projectConstrChar;
	}
	public void setProjectConstrChar(String projectConstrChar) {
		this.projectConstrChar = projectConstrChar;
	}
	public Integer getPlanYear() {
		return planYear;
	}
	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}
	public Double getApplyYearInvest() {
		return applyYearInvest;
	}
	public void setApplyYearInvest(Double applyYearInvest) {
		this.applyYearInvest = applyYearInvest;
	}
	public ShenBaoUnitInfo getBianZhiUnitInfo() {
		return bianZhiUnitInfo;
	}
	public void setBianZhiUnitInfo(ShenBaoUnitInfo bianZhiUnitInfo) {
		this.bianZhiUnitInfo = bianZhiUnitInfo;
	}
	public ShenBaoUnitInfo getShenBaoUnitInfo() {
		return shenBaoUnitInfo;
	}
	public void setShenBaoUnitInfo(ShenBaoUnitInfo shenBaoUnitInfo) {
		this.shenBaoUnitInfo = shenBaoUnitInfo;
	}
	public List<Attachment> getAttachments() {
		return attachments;
	}
	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}
	public String getYearConstructionContent() {
		return yearConstructionContent;
	}
	public void setYearConstructionContent(String yearConstructionContent) {
		this.yearConstructionContent = yearConstructionContent;
	}
	public String getYearPlanCapitalId() {
		return yearPlanCapitalId;
	}
	public void setYearPlanCapitalId(String yearPlanCapitalId) {
		this.yearPlanCapitalId = yearPlanCapitalId;
	}
	public String getYearConstructionTask() {
		return yearConstructionTask;
	}
	public void setYearConstructionTask(String yearConstructionTask) {
		this.yearConstructionTask = yearConstructionTask;
	}
	public String getProcessState() {
		return processState;
	}
	public void setProcessState(String processState) {
		this.processState = processState;
	}
	public String getFunctionSubjects() {
		return functionSubjects;
	}
	public void setFunctionSubjects(String functionSubjects) {
		this.functionSubjects = functionSubjects;
	}
	public String getEconClassSubjects() {
		return econClassSubjects;
	}
	public void setEconClassSubjects(String econClassSubjects) {
		this.econClassSubjects = econClassSubjects;
	}
	public String getProjectConstrBasis() {
		return projectConstrBasis;
	}
	public void setProjectConstrBasis(String projectConstrBasis) {
		this.projectConstrBasis = projectConstrBasis;
	}
	public String getRecomProgram() {
		return recomProgram;
	}
	public void setRecomProgram(String recomProgram) {
		this.recomProgram = recomProgram;
	}
	public String getSocialAndEconomic() {
		return socialAndEconomic;
	}
	public void setSocialAndEconomic(String socialAndEconomic) {
		this.socialAndEconomic = socialAndEconomic;
	}
	public Boolean getIsApplyQianQiFei() {
		return isApplyQianQiFei;
	}
	public void setIsApplyQianQiFei(Boolean isApplyQianQiFei) {
		this.isApplyQianQiFei = isApplyQianQiFei;
	}
	public Double getQianQiFeiApply() {
		return qianQiFeiApply;
	}
	public void setQianQiFeiApply(Double qianQiFeiApply) {
		this.qianQiFeiApply = qianQiFeiApply;
	}
	public String getLastYearImageSchedule() {
		return lastYearImageSchedule;
	}
	public void setLastYearImageSchedule(String lastYearImageSchedule) {
		this.lastYearImageSchedule = lastYearImageSchedule;
	}
	public String getYearImageSchedule() {
		return yearImageSchedule;
	}
	public void setYearImageSchedule(String yearImageSchedule) {
		this.yearImageSchedule = yearImageSchedule;
	}
	
}

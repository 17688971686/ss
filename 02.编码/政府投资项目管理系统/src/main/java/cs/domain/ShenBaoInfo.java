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
	
	//begin#与项目相关
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目ID'")
	private String projectId;
	@Column(columnDefinition="bit(1) NULL COMMENT '项目是否纳入项目库'")
	private Boolean isIncludLibrary;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '申报阶段'")
	private String projectShenBaoStage;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目建设性质分类'")
	private String projectConstrChar;
	
	//begin#年度计划相关
	@Column(columnDefinition="int NULL COMMENT '计划年度'")
	private Integer planYear;

	@Column(columnDefinition="double(11,4) NULL COMMENT '申请年度投资'")
	private Double applyYearInvest;	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下一年申请年度投资'")
	private Double applyYearInvest_LastYear;	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年申请年度投资'")
	private Double applyYearInvest_LastTwoYear;	
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '安排年度投资'")
	private Double yearInvestApproval;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下一年安排年度投资'")
	private Double yearInvestApproval_lastYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年安排年度投资'")
	private Double yearInvestApproval_lastTwoYear;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '安排年度投资Id'")
	private String yearPlanCapitalId;
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度建设任务'")
	private String yearConstructionTask;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '年度建设内容'")
	private String yearConstructionContent;
	@Column(columnDefinition="varchar(500) NULL COMMENT '下一年度建设内容'")
	private String yearConstructionContentLastYear;
	@Column(columnDefinition="varchar(500) NULL COMMENT '下下年度建设内容'")
	private String yearConstructionContentLastTwoYear;
	@Column(columnDefinition="varchar(500) NULL COMMENT '申报信息备注'")
	private String yearConstructionContentShenBao;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '本年度资金筹措方案-公共预算'")
	private Double capitalSCZ_ggys_TheYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '本年度资金筹措方案-国土资金'")
	private Double capitalSCZ_gtzj_TheYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '本年度资金筹措方案-其他资金'")
	private Double capitalSCZ_qita;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下一年度资金筹措方案-公共预算'")
	private Double capitalSCZ_ggys_LastYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下一年度资金筹措方案-国土资金'")
	private Double capitalSCZ_gtzj_LastYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下年度资金筹措方案-其他资金'")
	private Double capitalSCZ_qita_LastYear;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度资金筹措方案-公共预算'")
	private Double capitalSCZ_ggys_LastTwoYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度资金筹措方案-国土资金'")
	private Double capitalSCZ_gtzj_LastTwoYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度资金筹措方案-其他资金'")
	private Double capitalSCZ_qita_LastTwoYear;

	@Column(columnDefinition="varchar(500) NULL COMMENT '下一年其他资金来源'")
	private String capitalOtherDescriptionShenBao_LastYear;
	@Column(columnDefinition="varchar(500) NULL COMMENT '其他资金来源'")
	private String capitalOtherDescriptionShenBao;
	@Column(columnDefinition="varchar(500) NULL COMMENT '下下年其他资金来源'")
	private String capitalOtherDescriptionShenBao_LastTwoYear;
	
	//安排资金
	@Column(columnDefinition="double(11,4) NULL COMMENT '安排年度资金筹措方案-公共预算'")
	private Double capitalAP_ggys_TheYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '安排年度资金筹措方案-国土基金'")
	private Double capitalAP_gtzj_TheYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '安排年度资金筹措方案-其他'")
	private Double capitalAP_qita;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下年度安排年度资金筹措方案-公共预算'")
	private Double capitalAP_ggys_LastYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下年度安排年度资金筹措方案-国土基金'")
	private Double capitalAP_gtzj_LastYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下年度安排年度资金筹措方案-其他'")
	private Double capitalAP_qita_LastYear;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度安排年度资金筹措方案-公共预算'")
	private Double capitalAP_ggys_LastTwoYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度安排年度资金筹措方案-国土基金'")
	private Double capitalAP_gtzj_LastTwoYear;
	@Column(columnDefinition="double(11,4) NULL COMMENT '下下年度安排年度资金筹措方案-其他'")
	private Double capitalAP_qita_LastTwoYear;
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
	
	//begin#审核相关
	@Column(columnDefinition="varchar(500) NULL COMMENT '审核状态'")
	private String auditState;
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
	public String getYearConstructionContentLastYear() {
		return yearConstructionContentLastYear;
	}
	public void setYearConstructionContentLastYear(String yearConstructionContentLastYear) {
		this.yearConstructionContentLastYear = yearConstructionContentLastYear;
	}
	public String getYearConstructionContentLastTwoYear() {
		return yearConstructionContentLastTwoYear;
	}
	public void setYearConstructionContentLastTwoYear(String yearConstructionContentLastTwoYear) {
		this.yearConstructionContentLastTwoYear = yearConstructionContentLastTwoYear;
	}
	public Double getCapitalSCZ_ggys_LastYear() {
		return capitalSCZ_ggys_LastYear;
	}
	public void setCapitalSCZ_ggys_LastYear(Double capitalSCZ_ggys_LastYear) {
		this.capitalSCZ_ggys_LastYear = capitalSCZ_ggys_LastYear;
	}
	public Double getCapitalSCZ_gtzj_LastYear() {
		return capitalSCZ_gtzj_LastYear;
	}
	public void setCapitalSCZ_gtzj_LastYear(Double capitalSCZ_gtzj_LastYear) {
		this.capitalSCZ_gtzj_LastYear = capitalSCZ_gtzj_LastYear;
	}

	public Double getCapitalSCZ_ggys_TheYear() {
		return capitalSCZ_ggys_TheYear;
	}
	public void setCapitalSCZ_ggys_TheYear(Double capitalSCZ_ggys_TheYear) {
		this.capitalSCZ_ggys_TheYear = capitalSCZ_ggys_TheYear;
	}
	public Double getCapitalSCZ_gtzj_TheYear() {
		return capitalSCZ_gtzj_TheYear;
	}
	public void setCapitalSCZ_gtzj_TheYear(Double capitalSCZ_gtzj_TheYear) {
		this.capitalSCZ_gtzj_TheYear = capitalSCZ_gtzj_TheYear;
	}
	public Double getCapitalSCZ_ggys_LastTwoYear() {
		return capitalSCZ_ggys_LastTwoYear;
	}
	public void setCapitalSCZ_ggys_LastTwoYear(Double capitalSCZ_ggys_LastTwoYear) {
		this.capitalSCZ_ggys_LastTwoYear = capitalSCZ_ggys_LastTwoYear;
	}
	public Double getCapitalSCZ_gtzj_LastTwoYear() {
		return capitalSCZ_gtzj_LastTwoYear;
	}
	public void setCapitalSCZ_gtzj_LastTwoYear(Double capitalSCZ_gtzj_LastTwoYear) {
		this.capitalSCZ_gtzj_LastTwoYear = capitalSCZ_gtzj_LastTwoYear;
	}
	public Double getApplyYearInvest_LastYear() {
		return applyYearInvest_LastYear;
	}
	public void setApplyYearInvest_LastYear(Double applyYearInvest_LastYear) {
		this.applyYearInvest_LastYear = applyYearInvest_LastYear;
	}
	public Double getApplyYearInvest_LastTwoYear() {
		return applyYearInvest_LastTwoYear;
	}
	public void setApplyYearInvest_LastTwoYear(Double applyYearInvest_LastTwoYear) {
		this.applyYearInvest_LastTwoYear = applyYearInvest_LastTwoYear;
	}
	public String getYearConstructionContentShenBao() {
		return yearConstructionContentShenBao;
	}
	public void setYearConstructionContentShenBao(String yearConstructionContentShenBao) {
		this.yearConstructionContentShenBao = yearConstructionContentShenBao;
	}
	public Double getCapitalSCZ_qita() {
		return capitalSCZ_qita;
	}
	public void setCapitalSCZ_qita(Double capitalSCZ_qita) {
		this.capitalSCZ_qita = capitalSCZ_qita;
	}
	public Double getCapitalSCZ_qita_LastYear() {
		return capitalSCZ_qita_LastYear;
	}
	public void setCapitalSCZ_qita_LastYear(Double capitalSCZ_qita_LastYear) {
		this.capitalSCZ_qita_LastYear = capitalSCZ_qita_LastYear;
	}
	public Double getCapitalSCZ_qita_LastTwoYear() {
		return capitalSCZ_qita_LastTwoYear;
	}
	public void setCapitalSCZ_qita_LastTwoYear(Double capitalSCZ_qita_LastTwoYear) {
		this.capitalSCZ_qita_LastTwoYear = capitalSCZ_qita_LastTwoYear;
	}
	public String getAuditState() {
		return auditState;
	}
	public void setAuditState(String auditState) {
		this.auditState = auditState;
	}
	public Boolean getIsIncludLibrary() {
		return isIncludLibrary;
	}
	public void setIsIncludLibrary(Boolean isIncludLibrary) {
		this.isIncludLibrary = isIncludLibrary;
	}
	public String getCapitalOtherDescriptionShenBao_LastYear() {
		return capitalOtherDescriptionShenBao_LastYear;
	}
	public void setCapitalOtherDescriptionShenBao_LastYear(String capitalOtherDescriptionShenBao_LastYear) {
		this.capitalOtherDescriptionShenBao_LastYear = capitalOtherDescriptionShenBao_LastYear;
	}
	public String getCapitalOtherDescriptionShenBao() {
		return capitalOtherDescriptionShenBao;
	}
	public void setCapitalOtherDescriptionShenBao(String capitalOtherDescriptionShenBao) {
		this.capitalOtherDescriptionShenBao = capitalOtherDescriptionShenBao;
	}
	public String getCapitalOtherDescriptionShenBao_LastTwoYear() {
		return capitalOtherDescriptionShenBao_LastTwoYear;
	}
	public void setCapitalOtherDescriptionShenBao_LastTwoYear(String capitalOtherDescriptionShenBao_LastTwoYear) {
		this.capitalOtherDescriptionShenBao_LastTwoYear = capitalOtherDescriptionShenBao_LastTwoYear;
	}
	
	public Double getYearInvestApproval_lastYear() {
		return yearInvestApproval_lastYear;
	}
	public void setYearInvestApproval_lastYear(Double yearInvestApproval_lastYear) {
		this.yearInvestApproval_lastYear = yearInvestApproval_lastYear;
	}
	public Double getYearInvestApproval_lastTwoYear() {
		return yearInvestApproval_lastTwoYear;
	}
	public void setYearInvestApproval_lastTwoYear(Double yearInvestApproval_lastTwoYear) {
		this.yearInvestApproval_lastTwoYear = yearInvestApproval_lastTwoYear;
	}
	public Double getCapitalAP_ggys_TheYear() {
		return capitalAP_ggys_TheYear;
	}
	public void setCapitalAP_ggys_TheYear(Double capitalAP_ggys_TheYear) {
		this.capitalAP_ggys_TheYear = capitalAP_ggys_TheYear;
	}
	public Double getCapitalAP_gtzj_TheYear() {
		return capitalAP_gtzj_TheYear;
	}
	public void setCapitalAP_gtzj_TheYear(Double capitalAP_gtzj_TheYear) {
		this.capitalAP_gtzj_TheYear = capitalAP_gtzj_TheYear;
	}
	public Double getCapitalAP_qita() {
		return capitalAP_qita;
	}
	public void setCapitalAP_qita(Double capitalAP_qita) {
		this.capitalAP_qita = capitalAP_qita;
	}
	public Double getCapitalAP_ggys_LastYear() {
		return capitalAP_ggys_LastYear;
	}
	public void setCapitalAP_ggys_LastYear(Double capitalAP_ggys_LastYear) {
		this.capitalAP_ggys_LastYear = capitalAP_ggys_LastYear;
	}
	public Double getCapitalAP_gtzj_LastYear() {
		return capitalAP_gtzj_LastYear;
	}
	public void setCapitalAP_gtzj_LastYear(Double capitalAP_gtzj_LastYear) {
		this.capitalAP_gtzj_LastYear = capitalAP_gtzj_LastYear;
	}
	public Double getCapitalAP_qita_LastYear() {
		return capitalAP_qita_LastYear;
	}
	public void setCapitalAP_qita_LastYear(Double capitalAP_qita_LastYear) {
		this.capitalAP_qita_LastYear = capitalAP_qita_LastYear;
	}
	public Double getCapitalAP_ggys_LastTwoYear() {
		return capitalAP_ggys_LastTwoYear;
	}
	public void setCapitalAP_ggys_LastTwoYear(Double capitalAP_ggys_LastTwoYear) {
		this.capitalAP_ggys_LastTwoYear = capitalAP_ggys_LastTwoYear;
	}
	public Double getCapitalAP_gtzj_LastTwoYear() {
		return capitalAP_gtzj_LastTwoYear;
	}
	public void setCapitalAP_gtzj_LastTwoYear(Double capitalAP_gtzj_LastTwoYear) {
		this.capitalAP_gtzj_LastTwoYear = capitalAP_gtzj_LastTwoYear;
	}
	public Double getCapitalAP_qita_LastTwoYear() {
		return capitalAP_qita_LastTwoYear;
	}
	public void setCapitalAP_qita_LastTwoYear(Double capitalAP_qita_LastTwoYear) {
		this.capitalAP_qita_LastTwoYear = capitalAP_qita_LastTwoYear;
	}
	
	
}

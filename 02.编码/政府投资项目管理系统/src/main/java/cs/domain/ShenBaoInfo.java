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
	@Column(columnDefinition="double(10,2) NULL COMMENT '申请年度投资'")
	private Double applyYearInvest;	
	@Column(columnDefinition="double(10,2) NULL COMMENT '安排年度投资'")
	private Double yearInvestApproval;	
	//end#年度计划相关
	
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
}

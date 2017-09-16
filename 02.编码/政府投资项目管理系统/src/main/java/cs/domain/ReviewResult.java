package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/**
 * @Description: 评审结果表
 * @author: wcq
 * @Date：2017年9月13日
 * @version：0.1
 */
@Entity
@Table(name="cs_reviewResult")
public class ReviewResult extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位'")
	private String constructionUnit;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '收文编号'")
	private String receiptNumber;
	
	@Column(columnDefinition="date NULL COMMENT '收文时间'")
	private Date receiptDate;
	
	@Column(columnDefinition="date NULL COMMENT '送审日期'")
	private Date approvalDate;
	
	@Column(columnDefinition="date NULL COMMENT '送审结束日期'")
	private Date approvalEndDate;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '申报'")
	private Double projectInvestSum;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '审定'")
	private Double authorize;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '核减率'")
	private String nuclear;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '核减'")
	private String cut;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '备注'")
	private String remarks;
	//关联
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getConstructionUnit() {
		return constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public String getReceiptNumber() {
		return receiptNumber;
	}

	public void setReceiptNumber(String receiptNumber) {
		this.receiptNumber = receiptNumber;
	}

	public Date getReceiptDate() {
		return receiptDate;
	}

	public void setReceiptDate(Date receiptDate) {
		this.receiptDate = receiptDate;
	}

	public Date getApprovalDate() {
		return approvalDate;
	}

	public void setApprovalDate(Date approvalDate) {
		this.approvalDate = approvalDate;
	}

	public Date getApprovalEndDate() {
		return approvalEndDate;
	}

	public void setApprovalEndDate(Date approvalEndDate) {
		this.approvalEndDate = approvalEndDate;
	}

	public String getRelId() {
		return relId;
	}

	public void setRelId(String relId) {
		this.relId = relId;
	}

	public Double getProjectInvestSum() {
		return projectInvestSum;
	}

	public void setProjectInvestSum(Double projectInvestSum) {
		this.projectInvestSum = projectInvestSum;
	}

	public Double getAuthorize() {
		return authorize;
	}

	public void setAuthorize(Double authorize) {
		this.authorize = authorize;
	}

	public String getNuclear() {
		return nuclear;
	}

	public void setNuclear(String nuclear) {
		this.nuclear = nuclear;
	}

	public String getCut() {
		return cut;
	}

	public void setCut(String cut) {
		this.cut = cut;
	}

	public String getRemarks() {
		return remarks;
	}

	public void setRemarks(String remarks) {
		this.remarks = remarks;
	}

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}

	
}

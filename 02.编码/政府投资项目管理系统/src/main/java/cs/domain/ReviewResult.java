package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
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
	
	//关联
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;

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

	
}

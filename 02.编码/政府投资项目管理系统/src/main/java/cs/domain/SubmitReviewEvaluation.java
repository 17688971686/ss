package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
/*
 * 送审文件内容质量评价
 */
@Entity
@Table(name="cs_submitreviewevaluation")
public class SubmitReviewEvaluation extends BaseEntity{

	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) COMMENT '中介单位id'")
	private String mediationUnitId;
	@Column(columnDefinition="varchar(255)  COMMENT '评价等级'")
	private String rating;
	@Column(columnDefinition="varchar(255)  COMMENT '中介单位名称'")
	private String mediationUnitName;
	//begin#关联信息
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getMediationUnitId() {
		return mediationUnitId;
	}
	public void setMediationUnitId(String mediationUnitId) {
		this.mediationUnitId = mediationUnitId;
	}
	public String getRating() {
		return rating;
	}
	public void setRating(String rating) {
		this.rating = rating;
	}
	public String getMediationUnitName() {
		return mediationUnitName;
	}
	public void setMediationUnitName(String mediationUnitName) {
		this.mediationUnitName = mediationUnitName;
	}
	public List<Attachment> getAttachments() {
		return attachments;
	}
	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}
	
}

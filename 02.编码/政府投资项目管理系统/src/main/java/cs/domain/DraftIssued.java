package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 发文拟稿表
 * @author: wcq
 * @Date：2017年9月8日
 * @version：0.1
 */
@Entity
@Table(name="cs_draftIssued")
public class DraftIssued extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '审定金额'")
	private Double capitalSD;
	
	@Column(columnDefinition="date NULL COMMENT '拟稿时间'")
	private Date draftDate;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '秘密等级'")
	private String hecretHierarchy;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '文件缓急'")
	private String fileSet;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '文件种类'")
	private String documentType;

	@Column(columnDefinition="varchar(255) NULL COMMENT '文件类型'")
	private String fileType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '公开类型'")
	private String openType;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '标题'")
	private String title;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '主题词'")
	private String keyWord;

	@Column(columnDefinition="varchar(255) NULL COMMENT '发文种类'")
	private String postingCategory;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '单位名称'")
	private String unitName;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '总投资'")
	private Double capitalTotal;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '拟稿单位拟稿人'")
	private String userNameAndUnit;
	
	//关联
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Double getCapitalSD() {
		return capitalSD;
	}

	public void setCapitalSD(Double capitalSD) {
		this.capitalSD = capitalSD;
	}

	public Date getDraftDate() {
		return draftDate;
	}

	public void setDraftDate(Date draftDate) {
		this.draftDate = draftDate;
	}

	public String getHecretHierarchy() {
		return hecretHierarchy;
	}

	public void setHecretHierarchy(String hecretHierarchy) {
		this.hecretHierarchy = hecretHierarchy;
	}

	public String getFileSet() {
		return fileSet;
	}

	public void setFileSet(String fileSet) {
		this.fileSet = fileSet;
	}

	public String getDocumentType() {
		return documentType;
	}

	public void setDocumentType(String documentType) {
		this.documentType = documentType;
	}

	public String getFileType() {
		return fileType;
	}

	public void setFileType(String fileType) {
		this.fileType = fileType;
	}

	public String getOpenType() {
		return openType;
	}

	public void setOpenType(String openType) {
		this.openType = openType;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getKeyWord() {
		return keyWord;
	}

	public void setKeyWord(String keyWord) {
		this.keyWord = keyWord;
	}

	public String getPostingCategory() {
		return postingCategory;
	}

	public void setPostingCategory(String postingCategory) {
		this.postingCategory = postingCategory;
	}

	public String getRelId() {
		return relId;
	}

	public void setRelId(String relId) {
		this.relId = relId;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public Double getCapitalTotal() {
		return capitalTotal;
	}

	public void setCapitalTotal(Double capitalTotal) {
		this.capitalTotal = capitalTotal;
	}

	public String getUserNameAndUnit() {
		return userNameAndUnit;
	}

	public void setUserNameAndUnit(String userNameAndUnit) {
		this.userNameAndUnit = userNameAndUnit;
	}
	
	
}

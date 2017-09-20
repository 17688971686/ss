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
 * @Description: 评审委托书表
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Entity
@Table(name="cs_commission")
public class Commission extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '项目名称'")
	private String projectName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '编制部门'")
	private String unitName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '建设单位'")
	private String constructionUnit;
	
	@Column(columnDefinition="date NULL COMMENT '经办时间'")
	private Date beginDate;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '经办人'")
	private String processRole;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '经办意见'")
	private String processSuggestion_JBR;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '联系人'")
	private String contacts;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '评审类别'")
	private String approvalType;
	
	@Column(columnDefinition="double(11,4) NULL COMMENT '报送投资'")
	private Double capitalBaoSong;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<Datum> datum=new ArrayList<Datum>();

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

	public String getUnitName() {
		return unitName;
	}

	public void setUnitName(String unitName) {
		this.unitName = unitName;
	}

	public String getConstructionUnit() {
		return constructionUnit;
	}

	public void setConstructionUnit(String constructionUnit) {
		this.constructionUnit = constructionUnit;
	}

	public Date getBeginDate() {
		return beginDate;
	}

	public void setBeginDate(Date beginDate) {
		this.beginDate = beginDate;
	}

	public String getProcessRole() {
		return processRole;
	}

	public void setProcessRole(String processRole) {
		this.processRole = processRole;
	}

	public String getProcessSuggestion_JBR() {
		return processSuggestion_JBR;
	}

	public void setProcessSuggestion_JBR(String processSuggestion_JBR) {
		this.processSuggestion_JBR = processSuggestion_JBR;
	}

	public String getContacts() {
		return contacts;
	}

	public void setContacts(String contacts) {
		this.contacts = contacts;
	}

	public String getApprovalType() {
		return approvalType;
	}

	public void setApprovalType(String approvalType) {
		this.approvalType = approvalType;
	}

	public Double getCapitalBaoSong() {
		return capitalBaoSong;
	}

	public void setCapitalBaoSong(Double capitalBaoSong) {
		this.capitalBaoSong = capitalBaoSong;
	}

	public String getRelId() {
		return relId;
	}

	public void setRelId(String relId) {
		this.relId = relId;
	}

	public List<Datum> getDatum() {
		return datum;
	}

	public void setDatum(List<Datum> datum) {
		this.datum = datum;
	}
	
	
}

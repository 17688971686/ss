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
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * @Description: 计划下达申请表
 * @author: cx
 * @Date：2018年3月6日
 * @version：0.1
 *
 */
@Entity
@Table(name="cs_planReachApplication")
public class PlanReachApplication extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255)  not null COMMENT '申请名称'")
	private String applicationName;
	
	@Column(columnDefinition="varchar(255)  not null COMMENT '申请单位'")
	private String applicationUnit;
	
	@Column(columnDefinition="varchar(255)  not null COMMENT '负责人'")
	private String resPerson;
	
	@Column(columnDefinition="varchar(255)  not null COMMENT '负责人电话'")
	private String resPersonTel;
	
	@Temporal(TemporalType.TIMESTAMP)
	@Column(columnDefinition="datetime  not null COMMENT '申请时间'")
	private Date applicationTime;
	
	//关联信息
	@OneToMany(cascade=CascadeType.ALL)
	private List<ShenBaoInfo> shenBaoInfos=new ArrayList<>();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getApplicationName() {
		return applicationName;
	}

	public void setApplicationName(String applicationName) {
		this.applicationName = applicationName;
	}

	public String getApplicationUnit() {
		return applicationUnit;
	}

	public void setApplicationUnit(String applicationUnit) {
		this.applicationUnit = applicationUnit;
	}

	public Date getApplicationTime() {
		return applicationTime;
	}

	public void setApplicationTime(Date applicationTime) {
		this.applicationTime = applicationTime;
	}

	public List<ShenBaoInfo> getShenBaoInfos() {
		return shenBaoInfos;
	}

	public void setShenBaoInfos(List<ShenBaoInfo> shenBaoInfos) {
		this.shenBaoInfos = shenBaoInfos;
	}

	public String getResPerson() {
		return resPerson;
	}

	public void setResPerson(String resPerson) {
		this.resPerson = resPerson;
	}

	public String getResPersonTel() {
		return resPersonTel;
	}

	public void setResPersonTel(String resPersonTel) {
		this.resPersonTel = resPersonTel;
	}

}

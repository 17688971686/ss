package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Basic;
import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Transient;


/**
 * @Description:年度计划打包表
 * @author: wxy
 * @date: 2018年04月26日
 */
@Entity
@Table(name="cs_packPlan")
public class PackPlan extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '名称'")
	private String name;
	
	@Column(columnDefinition="int NULL COMMENT '年度'")
	private Integer year;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '备注'")
	private String remark;
	
	@Column(columnDefinition="double(13,4) DEFAULT 0.0 COMMENT '总指标'")
	private Double totalMoney=0.0;
	
	@Column(columnDefinition="double(13,4) DEFAULT 0.0 COMMENT '公共指标'")
	private Double ggMoney=0.0;
	
	@Column(columnDefinition="double(13,4) DEFAULT 0.0 COMMENT '国土指标'")
	private Double gtMoney=0.0;
	
	@Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否已加入计划下达'")
	private Boolean isInPlan = false;//默认为不申请
	
	@Transient
	private Double capitalSCZ_ggys_TheYear=0.0;
	
	@Transient
	private Double capitalSCZ_gtzj_TheYear=0.0;
	
	//begin#关联信息
	@OneToMany(cascade=CascadeType.ALL)
	private List<AllocationCapital> allocationCapitals=new ArrayList<>();
	
	@OneToMany(cascade=CascadeType.ALL)
	private List<ShenBaoInfo> shenBaoInfos=new ArrayList<>();
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public Integer getYear() {
		return year;
	}

	public void setYear(Integer year) {
		this.year = year;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}

	public Double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(Double totalMoney) {
		this.totalMoney = totalMoney;
	}

	public List<AllocationCapital> getAllocationCapitals() {
		return allocationCapitals;
	}

	public void setAllocationCapitals(List<AllocationCapital> allocationCapitals) {
		this.allocationCapitals = allocationCapitals;
	}

	public List<ShenBaoInfo> getShenBaoInfos() {
		return shenBaoInfos;
	}

	public void setShenBaoInfos(List<ShenBaoInfo> shenBaoInfos) {
		this.shenBaoInfos = shenBaoInfos;
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

	public Boolean getIsInPlan() {
		return isInPlan;
	}

	public void setIsInPlan(Boolean isInPlan) {
		this.isInPlan = isInPlan;
	}

	public Double getGgMoney() {
		return ggMoney;
	}

	public void setGgMoney(Double ggMoney) {
		this.ggMoney = ggMoney;
	}

	public Double getGtMoney() {
		return gtMoney;
	}

	public void setGtMoney(Double gtMoney) {
		this.gtMoney = gtMoney;
	}
	
}

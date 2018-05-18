package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;


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
	
}

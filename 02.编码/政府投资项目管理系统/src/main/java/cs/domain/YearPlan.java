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
 * @Description: 年度计划表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_yearPlan")
public class YearPlan extends BaseEntity{
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
	private List<YearPlanCapital> yearPlanCapitals=new ArrayList<>();

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

	public List<YearPlanCapital> getYearPlanCapitals() {
		return yearPlanCapitals;
	}

	public void setYearPlanCapitals(List<YearPlanCapital> yearPlanCapitals) {
		this.yearPlanCapitals = yearPlanCapitals;
	}

	public Double getTotalMoney() {
		return totalMoney;
	}

	public void setTotalMoney(Double totalMoney) {
		this.totalMoney = totalMoney;
	}
}

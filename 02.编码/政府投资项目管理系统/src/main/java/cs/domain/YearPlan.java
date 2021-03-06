package cs.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

/**
 * @Description: 年度计划表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name = "cs_yearPlan")
public class YearPlan extends BaseEntity {
    @Id
    private String id;

    @Column(columnDefinition = "varchar(255) NULL COMMENT '名称'")
    private String name;

    /**
     * 默认为未锁定
     */
    @Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '是否锁定'")
    private Boolean hasLock = false;

    @Column(columnDefinition = "varchar(255) NULL COMMENT '锁定人'")
    private String lockName;

    @Column(columnDefinition = "int NULL COMMENT '年度'")
    private Integer year;

    @Column(columnDefinition = "varchar(500) NULL COMMENT '备注'")
    private String remark;

    @Column(columnDefinition = "double(13,4) DEFAULT 0.0 COMMENT '总指标'")
    private Double totalMoney = 0.0;

    /**
     * 默认为草稿
     */
    @Column(columnDefinition="bit(1) DEFAULT b'0' COMMENT '用途 ，作为：草稿或者计划下达。0：草稿，1：计划下达'")
	private Boolean isDraftOrPlan = false;

    //begin#关联信息

    @OneToMany(cascade = CascadeType.ALL)
    private List<YearPlanCapital> yearPlanCapitals = new ArrayList<>();

    @OneToMany(cascade = CascadeType.ALL)
    private List<PackPlan> packPlans = new ArrayList<>();

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

    public List<PackPlan> getPackPlans() {
        return packPlans;
    }

    public void setPackPlans(List<PackPlan> packPlans) {
        this.packPlans = packPlans;
    }

	public Boolean getIsDraftOrPlan() {
		return isDraftOrPlan;
	}

	public void setIsDraftOrPlan(Boolean isDraftOrPlan) {
		this.isDraftOrPlan = isDraftOrPlan;
	}

    public Boolean getHasLock() {
        return hasLock;
    }

    public void setHasLock(Boolean hasLock) {
        this.hasLock = hasLock;
    }

    public String getLockName() {
        return lockName;
    }

    public void setLockName(String lockName) {
        this.lockName = lockName;
    }
}

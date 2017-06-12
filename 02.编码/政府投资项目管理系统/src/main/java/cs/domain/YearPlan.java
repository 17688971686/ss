package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;

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
	
	//begin#关联信息
	@OneToMany
	private List<YearPlanCapital> yearPlanCapitals=new ArrayList<>();
	
}

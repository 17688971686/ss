//package cs.domain;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import javax.persistence.CascadeType;
//import javax.persistence.Column;
//import javax.persistence.Entity;
//import javax.persistence.Id;
//import javax.persistence.OneToMany;
//import javax.persistence.Table;
//
///**
// * @Description: 计划下达申请表
// * @author: cx
// * @Date：2018年3月6日
// * @version：0.1
// *
// */
//@Entity
//@Table(name="cs_planRepachApplication")
//public class PlanRepachApplication extends BaseEntity{
//	@Id
//	private String id;
//	
//	@Column(columnDefinition="varchar(255)  not null COMMENT '申请表的名称'")
//	private String applicationName;
//	
//	@Column(columnDefinition="varchar(255)  not null COMMENT '申请表的单位'")
//	private String applicationUnit;
//	
//	//关联信息
//	@OneToMany(cascade=CascadeType.ALL)
//	private List<Project> projects=new ArrayList<>();
//	
//	
//}

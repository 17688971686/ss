package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 部门表
 * @author Administrator
 *
 */
@Entity
@Table(name="department")
public class Department extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	//private   部门编号ID
//	@Column(columnDefinition = "   COMMENT '父级部门编号'")   //没有确定类型
//	private   parentId;
//	@Column(columnDefinition = "  COMMENT '行政区划编号'")
//	private  divisionId;
	@Column(columnDefinition = "varchar(255)  COMMENT '部门名称'")
	private String deptName;
	@Column(columnDefinition = "varchar(255)  COMMENT '部门负责人'")
	private String deptResPerson;
	@Column(columnDefinition = "varchar(255)  COMMENT '部门详细地址'")
	private String deptAddress;
	@Column(columnDefinition = "int(11) COMMENT '排序'")
	private Integer itemOrder;
	@Column(columnDefinition = "varchar(255)  COMMENT '备注'")
	private String comment;
	
	
}

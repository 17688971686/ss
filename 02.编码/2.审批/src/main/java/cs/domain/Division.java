package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 区域表
 * @author Administrator
 *
 */
@Entity
@Table(name="division")
public class Division extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	//private   区域编号ID
	
//	@Column(columnDefinition = "  COMMENT '父级行政区划编号'")
//	private  parentId;                 没有确定类型
	@Column(columnDefinition = "varchar(255)  COMMENT '区划地址'")
	private String divisionAdress;
	@Column(columnDefinition = "int(11)  COMMENT '排序'")
	private Integer itemOrder;
	@Column(columnDefinition = "varchar(255)  COMMENT '备注'")
	private String comment;
}

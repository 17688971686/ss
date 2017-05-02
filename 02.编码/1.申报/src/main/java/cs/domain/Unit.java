package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 单位表
 * @author Administrator
 *
 */
@Entity
@Table(name="cs-unit")
public class Unit extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(columnDefinition="varchar(225) NOT NULL COMMENT '单位名称'")
	private String unitName;
	@Column(columnDefinition="varchar(225) NOT NULL COMMENT '组织机构代码'")
	private String orgCode;
//	@Column(columnDefinition=" COMMENT '所属区域'")
//	private  divisionId;
	@Column(columnDefinition="int(4) COMMENT '资质等级'")
	private Integer qualifiedLeval;
	@Column(columnDefinition="varchar(225) COMMENT '电话号码'")
	private String unitTel;
	@Column(columnDefinition="varchar(225) COMMENT '电子邮箱'")
	private String unitEmail;
	@Column(columnDefinition="varchar(225) COMMENT '传真号码'")
	private String unitFax;
	@Column(columnDefinition="int(4) COMMENT '单位性质'")
	private Integer unitProperty;
	@Column(columnDefinition="varchar(225) COMMENT '单位地址'")
	private String unitAddress;
	@Column(columnDefinition="varchar(225) COMMENT '法人名称'")
	private String legalName;
	@Column(columnDefinition="varchar(225) COMMENT '法人电话'")
	private String legalTel;
	@Column(columnDefinition="varchar(225) COMMENT '单位负责人名称'")
	private String unitResPerson;
	@Column(columnDefinition="varchar(225) COMMENT '单位联系人名称'")
	private String unitContactPerson;
	@Column(columnDefinition="varchar(225) COMMENT '负责人电话'")
	private String resPersonTel;
	@Column(columnDefinition="varchar(225) COMMENT '负责人手机'")
	private String resPersonMobile;
	@Column(columnDefinition="varchar(225) COMMENT '负责人邮箱'")
	private String resPersonEmail;
	@Column(columnDefinition="varchar(225) COMMENT '负责人传真'")
	private String resPersonFax;
	@Column(columnDefinition="varchar(225) COMMENT '联系人电话'")
	private String contactPersonTel;
	@Column(columnDefinition="varchar(225) COMMENT '联系人手机'")
	private String contactPersonMobile;
	@Column(columnDefinition="varchar(225) COMMENT '联系人邮箱'")
	private String contactPersonEmail;
	@Column(columnDefinition="varchar(225) COMMENT '联系人传真'")
	private String contactPersonFax;
	@Column(columnDefinition="int(11) COMMENT '排序'")
	private Integer itemOrder;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
}

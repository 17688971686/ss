package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 企业表
 * @author Administrator
 *
 */
@Entity
@Table(name="enterprise")
public class Enterprise extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	//private   企业编号ID
	
//	@Column(columnDefinition = "  NOT NULL COMMENT '与申报企业关联编号'")//没有写类型
//	private  refEnterpriseID;
	@Column(columnDefinition = "varchar(225)  NOT NULL  COMMENT '单位名称'")
	private String enterpriseName;
	@Column(columnDefinition = "varchar(225)  NOT NULL  COMMENT '组织机构代码'")
	private String enterpriseCode;
	@Column(columnDefinition = "int(4)  COMMENT '单位性质'")
	private Integer enterpriseProperty;
	//@Column(columnDefinition = "   COMMENT '所属区域'")//没有写类型
	//private    divisionId;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位注册地址'")
	private String regAddress;
	@Column(columnDefinition = "varchar(225)  COMMENT '法人姓名'")
	private String legalName;
	@Column(columnDefinition = "varchar(225)  COMMENT '法人电话'")
	private String legalTel;
	@Column(columnDefinition = "int(1)  COMMENT '企业信息是否完整'")
	private Integer isFinish;
	@Column(columnDefinition = "int(1)  COMMENT '企业信息是否提交'")
	private Integer issubmit;
	@Column(columnDefinition = "varchar(225)  COMMENT '电子邮箱'")
	private String email;
	@Column(columnDefinition = "varchar(225)  COMMENT '传真号码'")
	private String fax;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位负责人姓名'")
	private String unitPrincipalName;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位负责人电话号码'")
	private String unitPrincipalTel;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位负责人手机'")
	private String unitPrincipalMobile;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位负责人传真号码'")
	private String unitPrincipalFax;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位联系人姓名'")
	private String unitContactName;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位联系人电话号码'")
	private String unitContactTel;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位联系人手机'")
	private String unitContactMobile;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位联系人传真号码'")
	private String unitContactFax;
	@Column(columnDefinition = "varchar(225)  COMMENT '单位联系人Email'")
	private String unitContactEmail;
}

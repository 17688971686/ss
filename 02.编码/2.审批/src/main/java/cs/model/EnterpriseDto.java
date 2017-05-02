package cs.model;

/**
 * 企业表
 * @author Administrator
 *
 */

public class EnterpriseDto extends BaseDto{

	//private   企业编号ID
//	private refEnterpriseID;//与申报企业关联编号 ---->没有确定类型
	private String enterpriseName;//单位名称
	private String enterpriseCode;//组织机构代码
	private Integer enterpriseProperty;//单位性质
	//private    divisionId;  //所属区域ID
	private String regAddress;//单位注册地址
	private String legalName;//法人姓名
	private String legalTel;//法人电话
	private Integer isFinish;//企业信息是否完整
	private Integer issubmit;//企业信息是否提交
	private String email;//电子邮箱
	private String fax;//传真号码
	private String unitPrincipalName;//单位负责人姓名
	private String unitPrincipalTel;//单位负责人电话号码
	private String unitPrincipalMobile;	//单位负责人手机
	private String unitPrincipalFax;//单位负责人传真号码	
	private String unitContactName;	//单位联系人姓名
	private String unitContactTel;	//单位联系人电话号码
	private String unitContactMobile;	//单位联系人手机
	private String unitContactFax;	//单位联系人传真号码
	private String unitContactEmail;//单位联系人Email
	
}

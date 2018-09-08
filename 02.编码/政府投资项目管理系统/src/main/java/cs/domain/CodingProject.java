package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description 赋码项目表
 * @author wcq
 * @Data 20180829
 */
@Entity
@Table(name="cs_coding_project")
public class CodingProject extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(128) NULL COMMENT '项目名称'")
	private String P_NAME;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目名称'")
	private String APPLY_YEAR;
	
	@Column(columnDefinition="double(11,2) DEFAULT 0 COMMENT '总投资'")
	private Double TOTAL_INVEST=0.0;
	
	@Column(columnDefinition="varchar(128) NULL COMMENT '项目建设区代码地址'")
	private String BUILD_ADDRESS_DISTRICT;
	
	@Column(columnDefinition="varchar(128) NULL COMMENT '项目建设街道代码地址'")
	private String BUILD_ADDRESS_STREET;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目建设类型'")
	private String P_BUILD_TYPE;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设详细地址'")
	private String DETAILED_ADDRESS;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '国标行业（中文）'")
	private String NATIONAL_INDUSTRY_CN;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '国标行业（代码）'")
	private String NATIONAL_INDUSTRY;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '行业归口（中文）'")
	private String INDUSTRY_CN;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '行业归口（代码）'")
	private String INDUSTRY;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '建设规模及内容'")
	private String CONTENT_SCALE;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '项目建设必要性'")
	private String P_NECESSARY;
	
	@Column(columnDefinition="varchar(128) NULL COMMENT '项目(法人)单位'")
	private String P_COMPANY;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '单位证件类型'")
	private String CERTIFICATE_TYPE;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '单位证件类型 (中文)'")
	private String CERTIFICATE_TYPE_CN;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '单位证件号码'")
	private String CERTIFICATE_CODE;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人姓名'")
	private String P_PRINCIPAL;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人职务'")
	private String P_PRINCIPAL_JOB;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人手机号码'")
	private String P_PRINCIPAL_PHONE;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人邮箱'")
	private String P_PRINCIPAL_EMAIL;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人QQ'")
	private String P_PRINCIPAL_QQ;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目负责人微信'")
	private String P_PRINCIPAL_WECHAT;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目联系人姓名'")
	private String P_CONTACT_NAME;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目联系人手机号码'")
	private String P_CONTACT_PHONE;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目联系人邮箱'")
	private String P_CONTACT_EMAIL;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目联系人QQ'")
	private String P_CONTACT_QQ;
	
	@Column(columnDefinition="varchar(32) NULL COMMENT '项目联系人微信'")
	private String P_CONTACT_WECHAT;
	
	@Column(columnDefinition="varchar(64) NULL COMMENT '国家编码'")
	private String COUNTRY_CODE;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getP_NAME() {
		return P_NAME;
	}

	public void setP_NAME(String p_NAME) {
		P_NAME = p_NAME;
	}

	public String getAPPLY_YEAR() {
		return APPLY_YEAR;
	}

	public void setAPPLY_YEAR(String aPPLY_YEAR) {
		APPLY_YEAR = aPPLY_YEAR;
	}

	public Double getTOTAL_INVEST() {
		return TOTAL_INVEST;
	}

	public void setTOTAL_INVEST(Double tOTAL_INVEST) {
		TOTAL_INVEST = tOTAL_INVEST;
	}

	public String getBUILD_ADDRESS_DISTRICT() {
		return BUILD_ADDRESS_DISTRICT;
	}

	public void setBUILD_ADDRESS_DISTRICT(String bUILD_ADDRESS_DISTRICT) {
		BUILD_ADDRESS_DISTRICT = bUILD_ADDRESS_DISTRICT;
	}

	public String getBUILD_ADDRESS_STREET() {
		return BUILD_ADDRESS_STREET;
	}

	public void setBUILD_ADDRESS_STREET(String bUILD_ADDRESS_STREET) {
		BUILD_ADDRESS_STREET = bUILD_ADDRESS_STREET;
	}

	public String getP_BUILD_TYPE() {
		return P_BUILD_TYPE;
	}

	public void setP_BUILD_TYPE(String p_BUILD_TYPE) {
		P_BUILD_TYPE = p_BUILD_TYPE;
	}

	public String getDETAILED_ADDRESS() {
		return DETAILED_ADDRESS;
	}

	public void setDETAILED_ADDRESS(String dETAILED_ADDRESS) {
		DETAILED_ADDRESS = dETAILED_ADDRESS;
	}

	public String getNATIONAL_INDUSTRY_CN() {
		return NATIONAL_INDUSTRY_CN;
	}

	public void setNATIONAL_INDUSTRY_CN(String nATIONAL_INDUSTRY_CN) {
		NATIONAL_INDUSTRY_CN = nATIONAL_INDUSTRY_CN;
	}

	public String getNATIONAL_INDUSTRY() {
		return NATIONAL_INDUSTRY;
	}

	public void setNATIONAL_INDUSTRY(String nATIONAL_INDUSTRY) {
		NATIONAL_INDUSTRY = nATIONAL_INDUSTRY;
	}

	public String getINDUSTRY_CN() {
		return INDUSTRY_CN;
	}

	public void setINDUSTRY_CN(String iNDUSTRY_CN) {
		INDUSTRY_CN = iNDUSTRY_CN;
	}

	public String getINDUSTRY() {
		return INDUSTRY;
	}

	public void setINDUSTRY(String iNDUSTRY) {
		INDUSTRY = iNDUSTRY;
	}

	public String getCONTENT_SCALE() {
		return CONTENT_SCALE;
	}

	public void setCONTENT_SCALE(String cONTENT_SCALE) {
		if(cONTENT_SCALE != null && cONTENT_SCALE != "" && cONTENT_SCALE.length() >500){
			CONTENT_SCALE=cONTENT_SCALE.substring(0, 499);
		}else{
			CONTENT_SCALE = cONTENT_SCALE;
		}
		
	}

	public String getP_NECESSARY() {
		return P_NECESSARY;
	}

	public void setP_NECESSARY(String p_NECESSARY) {
		
		if(p_NECESSARY != "" && p_NECESSARY != null && p_NECESSARY.length() >500){
			P_NECESSARY=p_NECESSARY.substring(0, 499);
		}else{
			P_NECESSARY = p_NECESSARY;
		}
	}

	public String getP_COMPANY() {
		return P_COMPANY;
	}

	public void setP_COMPANY(String p_COMPANY) {
		P_COMPANY = p_COMPANY;
	}

	public String getCERTIFICATE_TYPE() {
		return CERTIFICATE_TYPE;
	}

	public void setCERTIFICATE_TYPE(String cERTIFICATE_TYPE) {
		CERTIFICATE_TYPE = cERTIFICATE_TYPE;
	}

	public String getCERTIFICATE_TYPE_CN() {
		return CERTIFICATE_TYPE_CN;
	}

	public void setCERTIFICATE_TYPE_CN(String cERTIFICATE_TYPE_CN) {
		CERTIFICATE_TYPE_CN = cERTIFICATE_TYPE_CN;
	}

	public String getCERTIFICATE_CODE() {
		return CERTIFICATE_CODE;
	}

	public void setCERTIFICATE_CODE(String cERTIFICATE_CODE) {
		CERTIFICATE_CODE = cERTIFICATE_CODE;
	}

	public String getP_PRINCIPAL() {
		return P_PRINCIPAL;
	}

	public void setP_PRINCIPAL(String p_PRINCIPAL) {
		P_PRINCIPAL = p_PRINCIPAL;
	}

	public String getP_PRINCIPAL_JOB() {
		return P_PRINCIPAL_JOB;
	}

	public void setP_PRINCIPAL_JOB(String p_PRINCIPAL_JOB) {
		P_PRINCIPAL_JOB = p_PRINCIPAL_JOB;
	}

	public String getP_PRINCIPAL_PHONE() {
		return P_PRINCIPAL_PHONE;
	}

	public void setP_PRINCIPAL_PHONE(String p_PRINCIPAL_PHONE) {
		P_PRINCIPAL_PHONE = p_PRINCIPAL_PHONE;
	}

	public String getP_PRINCIPAL_EMAIL() {
		return P_PRINCIPAL_EMAIL;
	}

	public void setP_PRINCIPAL_EMAIL(String p_PRINCIPAL_EMAIL) {
		P_PRINCIPAL_EMAIL = p_PRINCIPAL_EMAIL;
	}

	public String getP_PRINCIPAL_QQ() {
		return P_PRINCIPAL_QQ;
	}

	public void setP_PRINCIPAL_QQ(String p_PRINCIPAL_QQ) {
		P_PRINCIPAL_QQ = p_PRINCIPAL_QQ;
	}

	public String getP_PRINCIPAL_WECHAT() {
		return P_PRINCIPAL_WECHAT;
	}

	public void setP_PRINCIPAL_WECHAT(String p_PRINCIPAL_WECHAT) {
		P_PRINCIPAL_WECHAT = p_PRINCIPAL_WECHAT;
	}

	public String getP_CONTACT_NAME() {
		return P_CONTACT_NAME;
	}

	public void setP_CONTACT_NAME(String p_CONTACT_NAME) {
		P_CONTACT_NAME = p_CONTACT_NAME;
	}

	public String getP_CONTACT_PHONE() {
		return P_CONTACT_PHONE;
	}

	public void setP_CONTACT_PHONE(String p_CONTACT_PHONE) {
		P_CONTACT_PHONE = p_CONTACT_PHONE;
	}

	public String getP_CONTACT_EMAIL() {
		return P_CONTACT_EMAIL;
	}

	public void setP_CONTACT_EMAIL(String p_CONTACT_EMAIL) {
		P_CONTACT_EMAIL = p_CONTACT_EMAIL;
	}

	public String getP_CONTACT_QQ() {
		return P_CONTACT_QQ;
	}

	public void setP_CONTACT_QQ(String p_CONTACT_QQ) {
		P_CONTACT_QQ = p_CONTACT_QQ;
	}

	public String getP_CONTACT_WECHAT() {
		return P_CONTACT_WECHAT;
	}

	public void setP_CONTACT_WECHAT(String p_CONTACT_WECHAT) {
		P_CONTACT_WECHAT = p_CONTACT_WECHAT;
	}

	public String getCOUNTRY_CODE() {
		return COUNTRY_CODE;
	}

	public void setCOUNTRY_CODE(String cOUNTRY_CODE) {
		COUNTRY_CODE = cOUNTRY_CODE;
	}
	
	
}

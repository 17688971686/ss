package cs.domain.framework;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import cs.domain.BaseEntity;
/**
 * @Description: 用户表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_user")
public class User extends BaseEntity {
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '登录名'")
	private String loginName;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '密码'")
	private String password;
	@Column(columnDefinition="varchar(255)  COMMENT '显示名'")
	private String displayName;
	
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	
	@Column(columnDefinition="int(11) COMMENT '登录失败次数'")
	private int loginFailCount = 0;
	@Column(columnDefinition="datetime  COMMENT '最后一次登录时间'")
	private Date lastLoginDate;
	
//	@Column(columnDefinition="varchar(255)  COMMENT '国籍'")
//	private String country;
//
//	@Column(columnDefinition="varchar(255)  COMMENT '城市'")
//	private String city;
//
//	@Column(columnDefinition="varchar(255)  COMMENT '职务'")
//	private String duty;
//
//	@Column(columnDefinition="varchar(255)  COMMENT '职级'")
//	private String dutyLevelName;
//	
//	@Column(columnDefinition="int(11)  COMMENT '性别'")
//	private int sex = 1;
//	
	@Column(columnDefinition="varchar(255)  COMMENT '邮箱'")
	private String email;
	
	@Column(columnDefinition="varchar(255)  COMMENT '手机号'")
	private String mobilePhone;
	
//	@Column(columnDefinition="varchar(255)  COMMENT '办公电话'")
//	private String officePhone;
//	
//	@Column(columnDefinition="varchar(255)  COMMENT '入职时间'")
//	private Date worktime;
	
	@ManyToMany
	private List<Role> roles=new ArrayList<>();
	
	@ManyToMany
	private List<Org> orgs =new ArrayList<>();

	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getLoginName() {
		return loginName;
	}
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}
	public String getPassword() {
		return password;
	}
	public void setPassword(String password) {
		this.password = password;
	}
	public String getDisplayName() {
		return displayName;
	}
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	public List<Role> getRoles() {
		return roles;
	}
	public void setRoles(List<Role> roles) {
		this.roles = roles;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	
	
	public List<Org> getOrgs() {
		return orgs;
	}
	public void setOrgs(List<Org> orgs) {
		this.orgs = orgs;
	}
	public int getLoginFailCount() {
		return loginFailCount;
	}
	public void setLoginFailCount(int loginFailCount) {
		this.loginFailCount = loginFailCount;
	}
	public Date getLastLoginDate() {
		return lastLoginDate;
	}
	public void setLastLoginDate(Date lastLoginDate) {
		this.lastLoginDate = lastLoginDate;
	}
	public String getEmail() {
		return email;
	}
	public void setEmail(String email) {
		this.email = email;
	}
	public String getMobilePhone() {
		return mobilePhone;
	}
	public void setMobilePhone(String mobilePhone) {
		this.mobilePhone = mobilePhone;
	}
	
}

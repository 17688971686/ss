package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

@Entity
@Table(name="cs_user")
public class User extends DomainBase {
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
	private int loginFailCount;
	@Column(columnDefinition="datetime  COMMENT '最后一次登录时间'")
	private Date lastLoginDate;

	

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
	
	
}

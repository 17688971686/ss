package cs.domain.framework;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CollectionTable;
import javax.persistence.Column;
import javax.persistence.ElementCollection;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.Table;

import cs.domain.BaseEntity;
/**
 * @Description: 角色表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name = "cs_role")
public class Role extends BaseEntity {
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '角色名'")
	
	private String roleName;
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	
	@ElementCollection
	@CollectionTable(name="cs_resource",joinColumns=@JoinColumn(name="roleId"))
	private List<Resource> resources=new ArrayList<>();
	
	@ManyToMany(mappedBy="roles")
	private List<User> users =new ArrayList<>();
	
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getRoleName() {
		return roleName;
	}

	public void setRoleName(String roleName) {
		this.roleName = roleName;
	}

	public List<Resource> getResources() {
		return resources;
	}

	public void setResources(List<Resource> resources) {
		this.resources = resources;
	}

	public List<User> getUsers() {
		return users;
	}

	public void setUsers(List<User> users) {
		this.users = users;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}

	

	
}

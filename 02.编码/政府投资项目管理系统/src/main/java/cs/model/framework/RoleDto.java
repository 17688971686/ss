package cs.model.framework;

import java.util.ArrayList;
import java.util.List;

import cs.model.BaseDto;

public class RoleDto extends BaseDto {
	private String id;
	private String roleName;
	private String comment;
	private List<ResourceDto> resources=new ArrayList<>();
	private List<UserDto> userDtos = new ArrayList<>();
	
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
	
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public List<ResourceDto> getResources() {
		return resources;
	}
	public void setResources(List<ResourceDto> resources) {
		this.resources = resources;
	}
	public List<UserDto> getUserDtos() {
		return userDtos;
	}
	public void setUserDtos(List<UserDto> userDtos) {
		this.userDtos = userDtos;
	}
}

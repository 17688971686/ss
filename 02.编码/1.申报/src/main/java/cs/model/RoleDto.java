package cs.model;

import java.util.ArrayList;
import java.util.List;

public class RoleDto extends BaseDto {
	private String id;
	private String roleName;
	private String comment;
	private List<ResourceDto> resources=new ArrayList<>();
	
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
}

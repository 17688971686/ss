package cs.model.framework;

import java.util.ArrayList;
import java.util.List;

import cs.model.BaseDto;

public class OrgDto extends BaseDto {
	private String id;
	private String name;
	private String comment;
	private String orgIdentity;
	List<UserDto> userDtos = new ArrayList<>();
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getOrgIdentity() {
		return orgIdentity;
	}
	public void setOrgIdentity(String orgIdentity) {
		this.orgIdentity = orgIdentity;
	}
	public List<UserDto> getUserDtos() {
		return userDtos;
	}
	public void setUserDtos(List<UserDto> userDtos) {
		this.userDtos = userDtos;
	}
}

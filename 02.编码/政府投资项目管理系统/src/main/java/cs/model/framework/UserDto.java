package cs.model.framework;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Opinion;
import cs.model.BaseDto;
import cs.model.DomainDto.OpinionDto;

public class UserDto extends BaseDto {
	private String id;
	private String loginName;
	private String password;
	private String displayName;
	private String comment;
	private List<RoleDto> roles=new ArrayList<>();
	private List<OpinionDto> opinionDtos=new ArrayList<>();
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
	public List<RoleDto> getRoles() {
		return roles;
	}
	public void setRoles(List<RoleDto> roles) {
		this.roles = roles;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public List<OpinionDto> getOpinionDtos() {
		return opinionDtos;
	}
	public void setOpinionDtos(List<OpinionDto> opinionDtos) {
		this.opinionDtos = opinionDtos;
	}

	
	
}

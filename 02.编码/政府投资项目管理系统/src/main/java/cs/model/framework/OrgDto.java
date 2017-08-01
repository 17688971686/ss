package cs.model.framework;

import java.util.ArrayList;
import java.util.List;

import cs.domain.framework.Org;

public class OrgDto extends Org {
	List<UserDto> userDtos = new ArrayList<>();

	public List<UserDto> getUserDtos() {
		return userDtos;
	}

	public void setUserDtos(List<UserDto> userDtos) {
		this.userDtos = userDtos;
	}
	
}

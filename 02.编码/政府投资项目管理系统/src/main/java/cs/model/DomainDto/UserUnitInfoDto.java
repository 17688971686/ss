package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.UserUnitInfo;
import cs.domain.framework.User;
import cs.model.framework.UserDto;
/**
 * @Description:用户单位信息实体类 
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class UserUnitInfoDto extends UserUnitInfo {
	private String unitPropertyDesc;
	private String divisionDesc;
	private List<UserDto> userDtos= new ArrayList<>();

	public String getUnitPropertyDesc() {
		return unitPropertyDesc;
	}

	public void setUnitPropertyDesc(String unitPropertyDesc) {
		this.unitPropertyDesc = unitPropertyDesc;
	}

	public String getDivisionDesc() {
		return divisionDesc;
	}

	public void setDivisionDesc(String divisionDesc) {
		this.divisionDesc = divisionDesc;
	}

	public List<UserDto> getUserDtos() {
		return userDtos;
	}

	public void setUserDtos(List<UserDto> userDtos) {
		this.userDtos = userDtos;
	}
	
	

}

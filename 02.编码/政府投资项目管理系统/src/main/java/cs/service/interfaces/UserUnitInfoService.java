package cs.service.interfaces;

import cs.model.DomainDto.UserUnitInfoDto;

public interface UserUnitInfoService {	
	UserUnitInfoDto getByUserName(String userName);
	
	void save(String userName,UserUnitInfoDto unitInfoDto);
		
}

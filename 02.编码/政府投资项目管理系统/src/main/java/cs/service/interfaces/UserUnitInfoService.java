package cs.service.interfaces;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;

public interface UserUnitInfoService extends IService<UserUnitInfoDto, UserUnitInfo, String>{	

	void save(String userName,UserUnitInfoDto unitInfoDto);
	
	UserUnitInfo getByUserName(String userName);
		
}

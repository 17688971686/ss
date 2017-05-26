package cs.service.interfaces;

import cs.model.DomainDto.UserUnitInfoDto;

public interface UserUnitInfoService {
	UserUnitInfoDto getByUserName(String userName);

}

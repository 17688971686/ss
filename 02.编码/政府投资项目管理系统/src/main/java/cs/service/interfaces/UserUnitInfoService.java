package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;

public interface UserUnitInfoService {
	PageModelDto<UserUnitInfoDto> get(ODataObj oDataObj);
	
	UserUnitInfoDto getByUserName(String userName);
	
	void save(String userName,UserUnitInfoDto unitInfoDto);
		
}

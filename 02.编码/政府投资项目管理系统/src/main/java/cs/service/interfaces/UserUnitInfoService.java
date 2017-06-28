package cs.service.interfaces;

import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;

public interface UserUnitInfoService extends IService<UserUnitInfoDto, UserUnitInfo, String>{	

	void save(String userName,UserUnitInfoDto unitInfoDto);
		
}

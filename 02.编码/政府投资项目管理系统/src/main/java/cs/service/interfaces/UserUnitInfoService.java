package cs.service.interfaces;

import java.util.List;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;

public interface UserUnitInfoService extends IService<UserUnitInfoDto, UserUnitInfo, String>{

	/**
	 *
	 * @param userName
	 * @param unitInfoDto
	 */
	void save(String userName,UserUnitInfoDto unitInfoDto);

	/**
	 * 通过单位名称获取部门信息
	 * @param userName
	 * @return
	 */
	UserUnitInfo getByUserName(String userName);

	/**
	 *
	 * @return
	 */
	List<UserUnitInfoDto> Get();

	/**
	 * 通过用户 ID 获取单位信息
	 * @param userId
	 * @return
	 */
	UserUnitInfoDto getByUserId(String userId);
		
}

package cs.service.interfaces;

import java.util.List;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;

/**
 * @author Administrator
 *用户单位管理服务层
 */
public interface UserUnitInfoService extends IService<UserUnitInfoDto, UserUnitInfo, String>{

	/**
	 *保存单位
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
	 *查询单位
	 * @return unit list
	 */
	List<UserUnitInfoDto> Get();

	/**
	 * 通过用户 ID 获取单位信息
	 * @param userId
	 * @return
	 */
	UserUnitInfoDto getByUserId(String userId);
		
}

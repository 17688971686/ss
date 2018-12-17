package cs.service.framework;

import cs.model.PageModelDto;
import cs.model.framework.OrgDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataObj;
/**
 * @author Administrator
 *  部门服务层
 */
public interface OrgService {

	/**
	 * 
	 * @param odataObj
	 * @return 查询部门
	 */
	PageModelDto<OrgDto> get(ODataObj odataObj);
	/**
	 * 创建部门
	 * @param orgDto 部门实体
	 */
	void createOrg(OrgDto orgDto);
	/**
	 *  更新部门
	 * @param orgDto
	 */
	void updateOrg(OrgDto orgDto);
	/**
	 *  删除部门
	 * @param id
	 */
	void deleteOrg(String id) ;
	void deleteOrgs(String[] ids);
	/**
	 * 查询部门
	 * @param id 主键
	 * @return
	 */
	PageModelDto<UserDto> getOrgUsers(String id) ;
	/**
	 *  查找非部门用户
	 * @param id 部门ID
	 * @param oDataObj
	 * @return
	 */
	PageModelDto<UserDto> getUsersNotInOrg(String id,ODataObj oDataObj);
	/**
	 *  部门添加用户
	 * @param userId
	 * @param orgId
	 */
	void addUserToOrg(String userId,String orgId);
	/**
	 *  删除部门用户
	 * @param userId 用户ID
	 * @param orgId部门ID
	 */
	void removeOrgUser(String userId, String orgId);
	void removeOrgUsers(String[] userIds, String orgId);
}
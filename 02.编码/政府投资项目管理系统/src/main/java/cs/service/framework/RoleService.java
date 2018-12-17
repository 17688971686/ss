package cs.service.framework;

import java.util.List;

import cs.model.PageModelDto;
import cs.model.framework.RoleDto;
import cs.repository.odata.ODataObj;

/**
 *  角色管理服务层
 * @author Administrator
 *
 */
public interface RoleService {

	/**
	 *  查询角色
	 * @param odataObj
	 * @return
	 */
	PageModelDto<RoleDto> get(ODataObj odataObj);
	/**
	 *  创建角色
	 * @param roleDto 角色实体
	 */
	void createRole(RoleDto roleDto);
	/**
	 *  更新角色
	 * @param roleDto
	 */
	void updateRole(RoleDto roleDto);
	/**
	 *  删除角色
	 * @param id 角色ID
	 */
	void deleteRole(String id);
	void deleteRoles(String[] ids);
	/**
	 *  查询角色
	 * @return 角色实体集合
	 */
	List<RoleDto> Get();
}
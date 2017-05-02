package cs.service.framework;

import cs.model.PageModelDto;
import cs.model.framework.RoleDto;
import cs.repository.odata.ODataObj;

public interface RoleService {

	PageModelDto<RoleDto> get(ODataObj odataObj);
	void createRole(RoleDto roleDto);
	void updateRole(RoleDto roleDto);
	void deleteRole(String id);
	void deleteRoles(String[] ids);
}
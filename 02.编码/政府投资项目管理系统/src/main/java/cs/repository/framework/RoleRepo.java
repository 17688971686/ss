package cs.repository.framework;

import cs.domain.framework.Role;
import cs.repository.interfaces.IRepository;

public interface RoleRepo extends IRepository<Role, String>{
	boolean isRoleExist(String roleName);
}

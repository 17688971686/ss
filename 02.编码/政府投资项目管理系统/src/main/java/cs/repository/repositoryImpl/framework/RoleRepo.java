package cs.repository.repositoryImpl.framework;

import cs.domain.framework.Role;
import cs.repository.IRepository;

public interface RoleRepo extends IRepository<Role, String>{
	boolean isRoleExist(String roleName);
}

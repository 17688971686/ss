package cs.service.framework;

import java.util.List;
import java.util.Set;

import cs.common.Response;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataObj;

public interface UserService {

	PageModelDto<UserDto> get(ODataObj odataObj);
	
	List<UserDto> getAll();

	void createUser(UserDto userDto);

	void deleteUser(String id);

	void deleteUsers(String[] ids);
	
	void updateUser(UserDto userDto);
	
	Response Login(String userName, String password);
	Set<String> getCurrentUserPermissions();
	void logout();
	void changePwd(String password);
	
	User findUserByName(String userName);

}
package cs.service.framework;

import java.util.Map;
import java.util.Set;
import cs.common.Response;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataObj;

public interface UserService {

	PageModelDto<UserDto> get(ODataObj odataObj);

	void createUser(UserDto userDto);

	void deleteUser(String id);

	void deleteUsers(String[] ids);
	
	void updateUser(UserDto userDto);
	
	void initUser(@SuppressWarnings("rawtypes") Map map);
	
	Response Login (String userName, String password,String role);
	Set<String> getCurrentUserPermissions();
	void logout();
	void changePwd(String password);
	
	User findUserByName(String userName);
	
	User findById(String id);

}
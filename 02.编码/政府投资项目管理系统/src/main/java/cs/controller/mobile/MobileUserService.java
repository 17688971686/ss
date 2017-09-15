package cs.controller.mobile;

import java.util.List;
import java.util.Set;

import cs.common.MobileResponse;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataObj;

public interface MobileUserService {
	
	MobileResponse Login(String userName, String password,String role);
}
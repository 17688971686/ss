package cs.controller.mobile;

import cs.common.MobileResponse;

public interface MobileUserService {
	
	MobileResponse Login(String userName, String password,String role);
}
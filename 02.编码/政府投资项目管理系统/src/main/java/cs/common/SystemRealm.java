package cs.common;


import java.util.Collection;
import java.util.Set;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.AuthenticationException;
import org.apache.shiro.authc.AuthenticationInfo;
import org.apache.shiro.authc.AuthenticationToken;
import org.apache.shiro.authc.SimpleAuthenticationInfo;
import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.authz.SimpleAuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.session.Session;
import org.apache.shiro.session.mgt.eis.SessionDAO;
import org.apache.shiro.subject.PrincipalCollection;
import org.apache.shiro.subject.support.DefaultSubjectContext;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import cs.service.framework.UserService;

/**
 * @author Administrator
 *shiro注册
 */
public class SystemRealm  extends AuthorizingRealm {

	@Autowired
	private UserService userService;
	@Autowired
	private ICurrentUser currentUser;

	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		// TODO Auto-generated method stub
		System.out.println("authorize process");
		Set<String > permissions ;
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		String key = currentUser.getLoginName();
		permissions = userService.getPermissions(key);
		if(null== permissions){
			permissions=userService.getCurrentUserPermissions();
			userService.setPermissions(key,permissions);
		}
		authorizationInfo.addStringPermissions(permissions);
		return authorizationInfo;
	}
	
	 


	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		System.out.println("authentication process");
		// TODO Auto-generated method stub
		String userName = (String) token.getPrincipal(); 
		String password = new String((char[]) token.getCredentials());
		return new SimpleAuthenticationInfo(userName, password, getName());
	}

}

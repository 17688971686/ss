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
//	@Autowired
//	private SessionDAO sessionDAO;
	@Override
	protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principals) {
		// TODO Auto-generated method stub
		System.out.println("authorize process");
		SimpleAuthorizationInfo authorizationInfo = new SimpleAuthorizationInfo();
		Set<String > permissions=userService.getCurrentUserPermissions();
		authorizationInfo.addStringPermissions(permissions);
		return authorizationInfo;
	}
	
	 


	@Override
	protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws AuthenticationException {
		System.out.println("authentication process");
		// TODO Auto-generated method stub
		String userName = (String) token.getPrincipal(); 
		String password = new String((char[]) token.getCredentials());


//
//		Collection<Session> sessions = sessionDAO.getActiveSessions();
//		for(Session session:sessions){
//			String loginUsername = String.valueOf(session.getAttribute(DefaultSubjectContext.PRINCIPALS_SESSION_KEY));
//			//判断是否同一个用户再同一个浏览器中登录，是就不踢除
//			if (SecurityUtils.getSubject().getSession().getId().equals(session.getId()))
//				break;
//			//获得session中已经登录用户的名字
//			if(userName.equalsIgnoreCase(loginUsername) ){ //这里的username也就是当前登录的username
//				sessionDAO.delete(session); //这里就把session清除
//				break;
//			}
//		}
//		//返回值实例化
//		//身份证认证授权转移到 com.fh.controller.system.login  LoginController类下的login()方法中
//		if(  userName !=null){
//			//设置用户session
//			Session session = SecurityUtils.getSubject().getSession();
//			session.setAttribute("USER_SESSION", userName);
			return new SimpleAuthenticationInfo(userName, password, getName());
//		}else{
//			return null;
//		}
	}

}

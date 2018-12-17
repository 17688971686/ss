package cs.common;

import java.util.Date;

/**
 * @author Administrator
 * session用户实体
 *
 */
public interface ICurrentUser {

	String getLoginName();

	void setLoginName(String loginName);

	String getDisplayName();

	void setDisplayName(String displayName);
	
	Date getLastLoginDate();
	void setLastLoginDate(Date lastLoginDate);
	
	String getUserId();
	
	void setUserId(String userId);

}
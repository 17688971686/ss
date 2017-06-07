package cs.common;

import java.util.Date;

public interface ICurrentUser {

	String getLoginName();

	void setLoginName(String loginName);

	String getDisplayName();

	void setDisplayName(String displayName);
	
	Date getLastLoginDate();
	void setLastLoginDate(Date lastLoginDate);

}
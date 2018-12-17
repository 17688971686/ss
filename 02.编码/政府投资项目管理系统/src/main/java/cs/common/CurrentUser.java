package cs.common;

import java.util.Date;

import org.springframework.context.annotation.Scope;
import org.springframework.context.annotation.ScopedProxyMode;
import org.springframework.stereotype.Component;

/**
 * session用户
 * @author Administrator
 *
 */
@Component
@Scope(value = "session", proxyMode = ScopedProxyMode.TARGET_CLASS)
public class CurrentUser implements ICurrentUser {
	private String loginName;
	private String displayName;
	private Date LastLoginDate;
	private String userId;

	@Override
	public String getLoginName() {
		if (loginName == null) {
			return "";
		}else{
		return loginName;
		}
	}

	@Override
	public void setLoginName(String loginName) {
		this.loginName = loginName;
	}

	@Override
	public String getDisplayName() {
		return displayName;
	}

	@Override
	public void setDisplayName(String displayName) {
		this.displayName = displayName;
	}
	
	@Override
	public String getUserId() {
		return userId;
	}
	
	@Override
	public void setUserId(String userId) {
		this.userId = userId;
	}

	public Date getLastLoginDate() {
		return LastLoginDate;
	}

	public void setLastLoginDate(Date lastLoginDate) {
		LastLoginDate = lastLoginDate;
	}
}

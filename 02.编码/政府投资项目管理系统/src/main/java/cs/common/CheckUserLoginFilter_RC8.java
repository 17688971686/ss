package cs.common;

import java.io.IOException;
import java.util.Date;
import java.util.Map;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.AssertionHolder;
import org.jasig.cas.client.validation.Assertion;

import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import cs.domain.framework.User;

public class CheckUserLoginFilter_RC8 implements Filter {
	private static Logger logger = Logger.getLogger(CheckUserLoginFilter_RC8.class);
	
    public CheckUserLoginFilter_RC8() {
    	
    }

	public void destroy() {
	}

	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {
		HttpSession session = ((HttpServletRequest)request).getSession();
		String loginUID = (String) session.getAttribute("loginUID");
		System.out.println("=====>1:"+loginUID);
		User riseUser = (User) session.getAttribute("riseUser");
		System.out.println("=====>2:"+riseUser);
		if(StringUtils.isBlank(loginUID) || riseUser == null) {
			Assertion casAssertion = AssertionHolder.getAssertion();
			AttributePrincipal ap = casAssertion.getPrincipal();
			String loginName = ap.getName();
			Map<String, Object> attr = ap.getAttributes();
			loginUID = attr.get("ID").toString();
			System.out.println("=====>3:"+loginUID);
			PersonManager pm = HuasisoftUtil.getPersonManager();
//			Person person = RisesoftUtil.getPersonManager().getPerson(loginUID);
			ORGPerson person =null;
			User user = new User();
			try {
				person = pm.get(loginUID);
				System.out.println("=====>4:"+person);
			} catch (Exception e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			String country = person.getCountry();
			String city = person.getCity();
			String duty = person.getDuty();
			String dutyLevelName = person.getDutyLevelName();
			String email = person.getEmail();
			int sex = person.getSex();
			String officePhone = person.getOfficePhone();
			Date worktime = person.getWorktime();

			user.setLoginName(loginName);
//			user.setCountry(country);
//			user.setCity(city);
//			user.setDuty(duty);
//			user.setDutyLevelName(dutyLevelName);
			user.setEmail(email);
//			user.setSex(sex);
			user.setMobilePhone(officePhone);
//			user.setWorktime(worktime);
			user.setPassword(person.getPlainText());
			session.setAttribute("riseUser", user);
			User user333 = (User)session.getAttribute("riseUser");
			System.out.println("=======8:"+user333);
		}
		chain.doFilter(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}

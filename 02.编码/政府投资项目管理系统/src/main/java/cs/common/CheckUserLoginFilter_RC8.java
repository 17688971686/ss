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
		User riseUser = (User) session.getAttribute("riseUser");
		if(StringUtils.isBlank(loginUID) || riseUser == null) {
			Assertion casAssertion = AssertionHolder.getAssertion();
			AttributePrincipal ap = casAssertion.getPrincipal();
			String loginName = ap.getName();
			Map<String, Object> attr = ap.getAttributes();
			loginUID = attr.get("ID").toString();
//			Person person = RisesoftUtil.getPersonManager().getPerson(loginUID);
			System.out.println(loginUID);
			PersonManager oum = HuasisoftUtil.getPersonManager();
			ORGPerson person = null;
			try {
				person = oum.get(loginUID);
				System.out.println("person:" +person);
			} catch (Exception e) {
				logger.info("查询工作台任务数据");
				e.printStackTrace();
			}
			User user = new User();
			
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
//			user.setEmail(email);
//			user.setSex(sex);
//			user.setOfficePhone(officePhone);
//			user.setWorktime(worktime);
			user.setPassword(person.getPlainText());
			session.setAttribute("riseUser", user);
		}
		chain.doFilter(request, response);
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}

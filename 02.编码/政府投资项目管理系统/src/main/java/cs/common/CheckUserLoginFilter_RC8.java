package cs.common;

import java.io.IOException;
import java.util.Date;
import java.util.List;
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
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.AssertionHolder;
import org.jasig.cas.client.validation.Assertion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.util.CollectionUtils;

import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import cs.domain.framework.User;
import cs.domain.framework.User_;
import cs.model.framework.UserDto;
import cs.repository.framework.UserRepo;
import cs.service.framework.UserService;

public class CheckUserLoginFilter_RC8 implements Filter {
	private static Logger logger = Logger.getLogger(CheckUserLoginFilter_RC8.class);
	@Autowired
	private UserService userService;
	@Autowired
	private UserRepo userRepo;
	
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
			ORGPerson person =null;
			User user = new User();
			try {
				person = pm.get(loginUID);
				System.out.println("=====>4:"+person);
			} catch (Exception e) {
				throw new IllegalArgumentException("查询RC8人员失败");
			}
			String email = person.getEmail();
			String officePhone = person.getOfficePhone();

			//如果本地数据库没有OAID，则更新
			Criterion criterion = Restrictions.eq(User_.loginName.getName(), person.getLoginName());
			List<User> localUser = userRepo.findByCriteria(criterion);
			
			if(!CollectionUtils.isEmpty(localUser)){
				if(localUser.get(0).getOaId() == ""){
					UserDto userDto = new UserDto();
					userDto.setOaId(person.getId());
					userService.createSYSUser(userDto);
				}
			}
			user.setLoginName(loginName);
			user.setEmail(email);
			user.setMobilePhone(officePhone);
			user.setPassword(person.getPlainText());
			session.setAttribute("riseUser", user);
		}
		try {
			chain.doFilter(request, response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		
	}

	public void init(FilterConfig fConfig) throws ServletException {
	}

}

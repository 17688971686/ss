package cs.controller.shenbao;

import java.text.ParseException;
import java.util.Date;
import java.util.Map;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.jasig.cas.client.authentication.AttributePrincipal;
import org.jasig.cas.client.util.AssertionHolder;
import org.jasig.cas.client.validation.Assertion;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import com.huasisoft.h1.api.org.PersonManager;
import com.huasisoft.h1.model.ORGPerson;
import com.huasisoft.h1.util.HuasisoftUtil;

import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.framework.UserDto;
import cs.model.shenbao.IndexDto;
import cs.repository.framework.UserRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.ArticleService;

@Controller
@RequestMapping(name = "申报端登陆页", path = "")
public class ShenBaoHomeController {
	private String ctrlName = "shenbao/home";
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private ArticleService articleService;
	@Autowired
	private UserService userService;
	@Autowired
	private UserRepo userRepo;

	@RequestMapping(name = "首页", path = "/", method = RequestMethod.GET)
	public String index() {

		return this.ctrlName + "/index";
	}

	private static Logger logger = Logger.getLogger(ShenBaoHomeController.class);

	@RequestMapping(name = "首页", path = "/", method = RequestMethod.GET)
	public String adminIndex(HttpServletRequest request, Model model) {
		HttpSession session = ((HttpServletRequest) request).getSession();
		String loginUID = (String) session.getAttribute("loginUID");
		UserDto userDto = (UserDto) session.getAttribute("riseUser");
		if (StringUtils.isBlank(loginUID) || userDto == null) {
			Assertion casAssertion = AssertionHolder.getAssertion();
			AttributePrincipal ap = casAssertion.getPrincipal();
			Map<String, Object> attr = ap.getAttributes();
			loginUID = attr.get("ID").toString();
			PersonManager pm = HuasisoftUtil.getPersonManager();
			ORGPerson person = null;
			try {
				person = pm.get(loginUID);
			} catch (Exception e) {
				throw new IllegalArgumentException("查询RC8人员失败");
			}

			userDto.setDisplayName(person.getName());
			userDto.setLoginName(person.getLoginName());
			userDto.setPassword(person.getPlainText());
			userDto.setEmail(person.getEmail());
			userDto.setMobilePhone(person.getMobile());
			userDto.setOaId(person.getId());
			session.setAttribute("riseUser", userDto);
		}
		Boolean hasRole = false;
		if(!ObjectUtils.isEmpty(userDto)){
			User user2 = userService.createSYSUser(userDto);
		
			currentUser.setLoginName(user2.getLoginName());
			currentUser.setDisplayName(user2.getDisplayName());
			currentUser.setUserId(user2.getId());
			Date lastLoginDate = user2.getLastLoginDate();
			if (lastLoginDate != null) {
				currentUser.setLastLoginDate(user2.getLastLoginDate());
			}
			Date date = new Date();
			String dateStr = String.format("%s %s", Util.formatDate(date, "yyyy/MM/dd"), Util.getDay(date));
			model.addAttribute("userName", currentUser.getLoginName());
			model.addAttribute("date", dateStr);
			model.addAttribute("user", user2.getLoginName());
			model.addAttribute("userId", user2.getId());
			// shiro
			UsernamePasswordToken token = new UsernamePasswordToken(user2.getLoginName(), user2.getPassword());
			Subject currentUser = SecurityUtils.getSubject();
			currentUser.login(token);
			if (!CollectionUtils.isEmpty(user2.getRoles())) {
				loop2: for (Role x : user2.getRoles()) {
					if (x.getRoleName().equals("管理员") || x.getRoleName().equals("超级管理员")) {// 如果有对应的角色则允许登录
						hasRole = true;
						break loop2;
					} else {
					}
				}
			}
		}
		if (hasRole == true) {
			return "adminLogin/adminIndex/index";
		} else {
			return "adminLogin/shenbaoIndex/index";
		}

	}

	@RequestMapping(name = "获取首页数据", path = "/indexData", method = RequestMethod.GET)
	public @ResponseBody IndexDto indexData(HttpServletRequest request) throws ParseException {
		IndexDto indexDto = new IndexDto();
		Function<String, PageModelDto<ArticleDto>> func = (type) -> {
			ODataObj odataOb;
			try {
				odataOb = new ODataObj(request);
				ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
				filterItem.setField("type");
				filterItem.setOperator("eq");
				filterItem.setValue(type);
				odataOb.getFilter().add(filterItem);
				PageModelDto<ArticleDto> articleDtoList = articleService.get(odataOb);
				return articleDtoList;
			} catch (ParseException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			return null;

		};

		indexDto.setArticle_tzgg(func.apply("tzgg").getValue());
		indexDto.setArticle_zcfg(func.apply("zcfg").getValue());
		indexDto.setArticle_bszn(func.apply("bszn").getValue());
		indexDto.setArticle_cybg(func.apply("cybg").getValue());

		return indexDto;
	}

	@RequestMapping(name = "获取文章数据", path = "/article", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ArticleDto> article(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ArticleDto> articleDtoList = articleService.get(odataObj);

		return articleDtoList;
	}

}

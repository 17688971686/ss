package cs.controller.shenbao;

import java.text.ParseException;
import java.util.Date;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.shenbao.IndexDto;
import cs.repository.framework.UserRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.ArticleService;
import cs.service.interfaces.UserUnitInfoService;

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

//	 @RequestMapping(name = "首页", path = "/",method = RequestMethod.GET)
//	 public String index() {
//	
//	 return this.ctrlName + "/index";
//	 }

	@RequestMapping(name = "首页", path = "/", method = RequestMethod.GET)
	public String adminIndex(HttpServletRequest request, Model model) {
		User user2 = userService.getUserByName(request);
		Boolean hasRole = false;
//		if (user != null) {// 028eaa66-9646-4c84-b65e-27120cbcea87
//			User user2 = userService.findById(user.getId());// 3005faf9-12a6-42df-87b9-74f726498ed8
			if (user2 != null) {
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
				hasRole = userService.getRole(user2.getId());
			} else {
				throw new IllegalArgumentException("系统不存在该用户，请同步后重新登录！");
			}
//		} else {
//			throw new IllegalArgumentException("会话丢失，请重新登录！");
//		}

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

package cs.controller.shenbao;

import java.text.ParseException;
import java.util.Date;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

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

	 @RequestMapping(name = "首页", path = "/",method = RequestMethod.GET)
	 public String index() {
	
	 return this.ctrlName + "/index";
	 }
//	private static Logger logger = Logger.getLogger(ShenBaoHomeController.class);
//
//	@RequestMapping(name = "首页", path = "/", method = RequestMethod.GET)
//	public String adminIndex(HttpServletRequest request, Model model) {
//		HttpSession session = ((HttpServletRequest) request).getSession();
//		UserDto userDto = (UserDto) session.getAttribute("riseUser");
////        User user2 = userRepo.findUserByName(user.getLoginName());
//		User user2 = userService.createSYSUser(userDto);
//		logger.info("=====>5:"+request);
//		System.out.println("=====>6:"+request);
//		Boolean hasRole = false;
//			if (!ObjectUtils.isEmpty(user2)) {
//				currentUser.setLoginName(user2.getLoginName());
//				currentUser.setDisplayName(user2.getDisplayName());
//				currentUser.setUserId(user2.getId());
//				Date lastLoginDate = user2.getLastLoginDate();
//				if (lastLoginDate != null) {
//					currentUser.setLastLoginDate(user2.getLastLoginDate());
//				}
//				Date date = new Date();
//				String dateStr = String.format("%s %s", Util.formatDate(date, "yyyy/MM/dd"), Util.getDay(date));
//				model.addAttribute("userName", currentUser.getLoginName());
//				model.addAttribute("date", dateStr);
//				model.addAttribute("user", user2.getLoginName());
//				model.addAttribute("userId", user2.getId());
//				// shiro
//				UsernamePasswordToken token = new UsernamePasswordToken(user2.getLoginName(), user2.getPassword());
//				Subject currentUser = SecurityUtils.getSubject();
//				currentUser.login(token);
//				 if(!CollectionUtils.isEmpty(user2.getRoles())){
//					 loop2:for (Role x : user2.getRoles()) {
//		                 if (x.getRoleName().equals("管理员") || x.getRoleName().equals("超级管理员")) {//如果有对应的角色则允许登录
//		                     hasRole = true;
//		                     break loop2;
//		                 } else {
//		                 }
//		             }
//		        }
////				hasRole = userService.getRole(user2.getId());
//			} else {
//				throw new IllegalArgumentException("系统不存在该用户，请同步后重新登录！");
//			}
//		if (hasRole == true) {
//			return "adminLogin/adminIndex/index";
//		} else {
//			return "adminLogin/shenbaoIndex/index";
//		}
//	}

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

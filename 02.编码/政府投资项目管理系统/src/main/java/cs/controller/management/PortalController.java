package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.Portal.ArticleDto;
import cs.repository.odata.ODataObj;
import cs.service.management.ArticleService;



@Controller
@RequestMapping(name = "统一门户管理", path = "management/portal")
public class PortalController {
	private String ctrlName = "management/portal";
	
	@Autowired
	private ArticleService articleService;

	//@RequiresPermissions("management/portal##get")	
	@RequestMapping(name = "获取文章数据", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ArticleDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ArticleDto> articleDtoList = articleService.get(odataObj);

		return articleDtoList;
	}
	
	//@RequiresPermissions("management/portal##post")	
	@RequestMapping(name = "创建文章", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody ArticleDto dto) {
		articleService.createArticle(dto);
	}
	
	//@RequiresPermissions("management/portal##put")	
	@RequestMapping(name = "更新文章", path = "", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody ArticleDto dto) {
		articleService.updateArticle(dto);
	}
	
	//@RequiresPermissions("management/portal##delete")	
	@RequestMapping(name = "删除文章", path = "", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			articleService.deleteArticles(ids);
		} else {
			articleService.deleteArticle(id);
		}
	}
	
	
	//@RequiresPermissions("management/portal#html/list#get")
	@RequestMapping(name = "列表页面", path = "html/list", method = RequestMethod.GET)	
	public String list() {

		return this.ctrlName + "/list";
	}
	@RequestMapping(name = "编辑页", path = "html/edit", method = RequestMethod.GET)	
	public String edit() {

		return this.ctrlName + "/edit";
	}
}
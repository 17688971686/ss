package cs.controller.shenbao;


import java.text.ParseException;
import java.util.function.Function;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.shenbao.IndexDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ArticleService;


@Controller
@RequestMapping(name = "申报端登陆页", path = "")
public class ShenBaoHomeController {
	private String ctrlName = "shenbao/home";

	@Autowired
	private ArticleService articleService;
	
	@RequestMapping(name = "首页", path = "/",method = RequestMethod.GET)
	public String index() {

		return this.ctrlName + "/index";
	}
	
	
	@RequestMapping(name = "获取首页数据", path = "/indexData", method = RequestMethod.GET)
	public @ResponseBody IndexDto indexData(HttpServletRequest request) throws ParseException {
		IndexDto indexDto=new IndexDto();
		Function<String,PageModelDto<ArticleDto>> func=(type)->{
			ODataObj odataOb;
			try {
				odataOb = new ODataObj(request);
				ODataFilterItem<String> filterItem= new ODataFilterItem<String>();
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

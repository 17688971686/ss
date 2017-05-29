package cs.controller.management;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.DomainDto.BasicDataDto;

@Controller
@RequestMapping(name="基础数据管理", path="management/basicData")
public class BasicDataController {
	private String ctrl ="management/basicData";

	@RequestMapping(name="创建基础数据",path="",method=RequestMethod.POST)
	@ResponseStatus(value=HttpStatus.CREATED)
	public void post(BasicDataDto basicDataDto){
		
	}
	
	//begin#html
	@RequestMapping(name="基础数据管理页面",path="html/index",method=RequestMethod.GET)
	public String index(){
		return ctrl+"/index";
	}
	//end#html
}

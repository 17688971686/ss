package cs.controller.management;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.DomainDto.BasicDataDto;
import cs.service.common.BasicDataService;


/**
 * @author Administrator
 * @Description 基础数据管理控制层
 */
@Controller
@RequestMapping(name="后台管理--基础数据管理", path="management/basicData")
public class BasicDataController {
	@Autowired
	private BasicDataService basicDataService;
	
	private String ctrl ="management/basicData";

	@RequiresPermissions("management/basicData##post")
	@RequestMapping(name="创建基础数据",path="",method=RequestMethod.POST)
	@ResponseStatus(value=HttpStatus.CREATED)
	public void post(@RequestBody BasicDataDto basicDataDto){
		basicDataService.createBasicData(basicDataDto);
		basicDataService.reloadData();
	}
	
	@RequiresPermissions("management/basicData#deleteBasicData#post")
	@RequestMapping(name="删除基础数据",path="deleteBasicData",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id){			
		basicDataService.deleteBasicData(id);
		basicDataService.reloadData();
	}
	
	@RequiresPermissions("management/basicData#updateBasicData#post")
	@RequestMapping(name="更新基础数据",path="updateBasicData",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody BasicDataDto basicDataDto){			
		basicDataService.updateBasicData(basicDataDto);	
		basicDataService.reloadData();
	}
	
	//begin#html
	@RequiresPermissions("management/basicData#html/index#get")
	@RequestMapping(name="基础数据管理页面",path="html/index",method=RequestMethod.GET)
	public String index(){
		return ctrl+"/index";
	}
	//end#html
}

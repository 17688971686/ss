package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="申报端--项目申报",path="shenbaoAdmin/shenbao")
public class ShenBaoAdminShenBaoController {
	private String ctrlName = "shenbaoAdmin/shenbao";
	
	@Autowired ShenBaoInfoService shenBaoInfoService;
	@Autowired
	ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private BasicDataService basicDataService;
	
	@RequiresPermissions("shenbaoAdmin/shenbao##get")
	@RequestMapping(name = "获取申报信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoService.get(odataObj);
		//TODO 这一块可以不需要了
		shenBaoInfoDtos.getValue().forEach(x->{	
			//获取项目相关类型的名称
			x.setProjectClassifyDesc(basicDataService.getDescriptionById(x.getProjectClassify()));//项目分类名称
			x.setProjectIndustryDesc(basicDataService.getDescriptionById(x.getProjectIndustry()));//项目行业领域名称
//			x.setProjectTypeDesc(basicDataService.getDescriptionById(x.getProjectType()));//项目类型名称
			x.setProjectCategoryDesc(basicDataService.getDescriptionById(x.getProjectCategory()));//项目类别名称
			x.setProjectStageDesc(basicDataService.getDescriptionById(x.getProjectStage()));//项目阶段名称
			x.setProjectConstrCharDesc(basicDataService.getDescriptionById(x.getProjectConstrChar()));//项目建设性质名称
			x.setProjectShenBaoStageDesc(basicDataService.getDescriptionById(x.getProjectShenBaoStage()));//项目申报阶段名称
			x.setCapitalOtherTypeDesc(basicDataService.getDescriptionById(x.getCapitalOtherType()));//资金其他来源名称					
		});
		return shenBaoInfoDtos;	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#unit#get")
	@RequestMapping(name = "获取单位申报信息", path = "unit",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getByUnit(HttpServletRequest request) throws ParseException{
		//根据当前登陆用户查找到单位信息
		//UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件
		ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
		filterItem.setField("createdBy");
		filterItem.setOperator("eq");
		filterItem.setValue(currentUser.getUserId());
		odataObj.getFilter().add(filterItem);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoService.get(odataObj);		
		return shenBaoInfoDtos;	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao##post")
	@RequestMapping(name = "创建申报信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto,false);	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao##put")
	@RequestMapping(name = "更新申报信息", path = "",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  update(@RequestBody ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoService.update(shenBaoInfoDto,shenBaoInfoDto.getId());	
	}
		
	//begin#html
	@RequiresPermissions("shenbaoAdmin/shenbao#html/list#get")
	@RequestMapping(name = "项目列表页面", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#html/edit#get")
	@RequestMapping(name = "申报信息编辑页面", path = "html/edit",method=RequestMethod.GET)
	public String create() {
		return this.ctrlName + "/edit";
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#html/records#get")
	@RequestMapping(name = "申报记录列表页", path = "html/records",method=RequestMethod.GET)
	public String records() {
		return this.ctrlName + "/records";
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#html/shenBaoInfo#get")
	@RequestMapping(name = "申报记录详情页", path = "html/shenBaoInfo",method=RequestMethod.GET)
	public String shenBaoInfo() {
		return this.ctrlName + "/shenBaoInfo";
	}
}

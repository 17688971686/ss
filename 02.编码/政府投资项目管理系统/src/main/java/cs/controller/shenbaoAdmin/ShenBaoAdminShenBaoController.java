package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.List;

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
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;

@Controller
@RequestMapping(name="申报端--项目申报",path="shenbaoAdmin/shenbao")
public class ShenBaoAdminShenBaoController {
	private String ctrlName = "shenbaoAdmin/shenbao";
	
	@Autowired 
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	
	@RequiresPermissions("shenbaoAdmin/shenbao##get")
	@RequestMapping(name = "获取申报信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoService.get(odataObj);
		return shenBaoInfoDtos;	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#unit#get")
	@RequestMapping(name = "获取单位申报信息", path = "unit",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getByUnit(HttpServletRequest request) throws ParseException{
		ODataObj odataObj = new ODataObj(request);
		//设置过滤条件 根据创建单位找到对应的申报信息
		//根据登陆名查找到单位信息
		UserUnitInfoDto userUnitInfoDto1 = null;
		List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
		for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
			if(!userUnitInfoDto.getUserDtos().isEmpty()){
				for (UserDto user : userUnitInfoDto.getUserDtos()) {
					if(user.getId().equals(currentUser.getUserId())){
						userUnitInfoDto1 =userUnitInfoDto;
					}
				} 
			}
			
				
		}
//		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
		if(userUnitInfoDto1 != null){
			ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
			filterItem.setField("unitName");
			filterItem.setOperator("eq");
			filterItem.setValue(userUnitInfoDto1.getId());
			odataObj.getFilter().add(filterItem);
		}else{
			ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
			filterItem.setField("unitName");
			filterItem.setOperator("eq");
			filterItem.setValue("noId");
			odataObj.getFilter().add(filterItem);
		}
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = shenBaoInfoService.get(odataObj);		
		return shenBaoInfoDtos;	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao##post")
	@RequestMapping(name = "创建申报信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto,false);	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#updateShenbao#post")
	@RequestMapping(name = "更新申报信息", path = "updateShenbao",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void update(@RequestBody ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoService.updateShenBaoInfo(shenBaoInfoDto,false);	
	}
	
	@RequiresPermissions("shenbaoAdmin/shenbao#deleteShenbao#post")
	@RequestMapping(name = "删除申报信息", path = "deleteShenbao",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id){
		String[] ids = id.split(",");
		if(ids.length>1){
			for(String idstr:ids){
				shenBaoInfoService.delete(idstr);	
			}
		}else{
			shenBaoInfoService.delete(id);
		}
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

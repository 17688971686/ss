package cs.controller.shenbaoAdmin;

import java.text.ParseException;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import cs.domain.ShenBaoInfo_;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.ValidationSQLUtil;
import cs.activiti.service.ActivitiService;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;
/**
 * @author Administrator
 * @Description 申报端项目申报管理控制层
 */
@Controller
@RequestMapping(name="申报端--项目申报",path="shenbaoAdmin/shenbao")
public class ShenBaoAdminShenBaoController {
	private String ctrlName = "shenbaoAdmin/shenbao";
	
	@Autowired 
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired 
	protected ActivitiService activitiService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	private String processDefinitionKey = "ShenpiReview";
	
	@RequiresPermissions("shenbaoAdmin/shenbao##get")
	@RequestMapping(name = "获取申报信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException{
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = null;
		if(ValidationSQLUtil.BuildObj(request)){
			return shenBaoInfoDtos;
		};
		ODataObj odataObj = new ODataObj(request);

		//查询暂存未提交流程的申报信息
		String isUpdate = request.getParameter("isUpdate");
		if(null != isUpdate && !isUpdate.isEmpty()){
			List<ODataFilterItem> ODataFilterItemList = odataObj.getFilter();
			if(ODataFilterItemList == null || ODataFilterItemList.isEmpty()){
				ODataFilterItemList = new ArrayList<ODataFilterItem>();
				odataObj.setFilter(ODataFilterItemList);
			}
			ODataFilterItem oDataFilterItem = new ODataFilterItem();
			oDataFilterItem.setField(ShenBaoInfo_.zong_processId.getName());
			oDataFilterItem.setOperator("isNull");
			ODataFilterItemList.add(oDataFilterItem);
		}
		
		String isRecord = request.getParameter("isRecord");
		if(null != isRecord && !isRecord.isEmpty()){
			ODataFilterItem<String> filterItem=new ODataFilterItem<String>();
			filterItem.setField("projectShenBaoStage");
			filterItem.setOperator("ne");
			filterItem.setValue(BasicDataConfig.projectShenBaoStage_planReach);
			odataObj.getFilter().add(filterItem);
		}
	
		
		shenBaoInfoDtos = shenBaoInfoService.get(odataObj);
		return shenBaoInfoDtos;	
	}
	
//	@RequiresPermissions("shenbaoAdmin/shenbao##get")
	@RequestMapping(name = "撤销流程", path = "{processId}",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void reback(HttpServletRequest request,@PathVariable String processId) throws ParseException{
		shenBaoInfoService.reback(processId);
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
	
//	@RequestMapping(name = "查询是否为备案信息", path = "getRecords",method=RequestMethod.POST)
//	public Map getRecords(@RequestBody ShenBaoInfoDto shenBaoInfoDto ){
//		Map map= shenBaoInfoService.isRecords(shenBaoInfoDto);
//		return map;
//	}
	
	@RequestMapping(name = "启动项目上线申请审批", path = "start",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  startProcess(@RequestBody String projectId){
		shenBaoInfoService.startProcessShenbao(processDefinitionKey, projectId);
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

	/*@RequestMapping(name = "关联项目附件", path = "saveApprovalAttDtos",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void saveApprovalAttDtos(@RequestBody ProjectDto dto) {
		String id = dto.getId();
		List<AttachmentDto> attachmentDtos = dto.getAttachmentDtos();
		
		//附件
		attachmentDtos.forEach(x -> {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(dto.getCreatedBy());
			attachment.setModifiedBy(dto.getModifiedBy());
			dto.getAttachments().add(attachment);
		});
		
		ODataObj oDataObj = new ODataObj();
		ODataFilterItem oDataFilterItem = new ODataFilterItem<>();
		oDataFilterItem.setField("id");
		oDataFilterItem.setOperator("eq");
		oDataFilterItem.setValue(id);
		oDataObj.getFilter().add(oDataFilterItem);
		
		PageModelDto<ProjectDto> pageModelDto = ProjectService.Get(oDataObj);
		ProjectDto projectDto = pageModelDto.getValue().get(0);
		projectDto.getAttachments().addAll(attachments);
		
		ProjectService.update(dto, id);
	}*/
		
//	@RequiresPermissions("shenbaoAdmin/shenbao#html/list#get")
	@RequestMapping(name = "项目列表页面", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
	
//	@RequiresPermissions("shenbaoAdmin/shenbao#html/edit#get")
	@RequestMapping(name = "申报信息编辑页面", path = "html/edit",method=RequestMethod.GET)
	public String create() {
		return this.ctrlName + "/edit";
	}
	
//	@RequiresPermissions("shenbaoAdmin/shenbao#html/records#get")
	@RequestMapping(name = "申报记录列表页", path = "html/records",method=RequestMethod.GET)
	public String records() {
		return this.ctrlName + "/records";
	}
	
//	@RequiresPermissions("shenbaoAdmin/shenbao#html/shenBaoInfo#get")
	@RequestMapping(name = "申报记录详情页", path = "html/shenBaoInfo",method=RequestMethod.GET)
	public String shenBaoInfo() {
		return this.ctrlName + "/shenBaoInfo";
	}
}

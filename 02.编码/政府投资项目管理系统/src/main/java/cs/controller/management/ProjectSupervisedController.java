package cs.controller.management;

import java.text.ParseException;
import java.util.*;


import javax.servlet.http.HttpServletRequest;

import cs.repository.odata.ODataFilterItem;

import org.activiti.engine.ProcessEngine;
import org.activiti.engine.ProcessEngines;
import org.activiti.engine.history.HistoricProcessInstance;
import org.activiti.engine.runtime.ProcessInstance;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import com.sn.framework.common.ObjectUtils;

import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenPiItemsDto;
import cs.model.DomainDto.ShenPiUnitDto;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.ProjectSupervisedService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.ShenPiItemsService;
import cs.service.interfaces.ShenPiUnitService;


/**
 * @author Administrator
 * @Description 监管项目管理控制层
 */
@Controller
@RequestMapping(name = "后台管理--监管项目管理", path = "management/supervision/project")
public class ProjectSupervisedController {
	private String ctrlName = "management/supervision/project";
	private String ctrlUnitName = "management/supervision/shenpiUnit";
	private String ctrlItemsName = "management/supervision/shenpiItems";
	private String ctrlFanKuiItemsName = "management/supervision/shenpifankuiItems";
	
	@Autowired
	private ProjectSupervisedService projectSupervisedService;
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private ShenPiUnitService shenPiUnitService ;
	@Autowired
	private ShenPiItemsService shenPiItemsService ;
	@Autowired
	private UserService userService;
	
	ProcessEngine processEngine = ProcessEngines.getDefaultProcessEngine();
	
	@RequestMapping(name = "获取审批单位信息", path = "shenpiUnit",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenPiUnitDto> getShenPiUnit(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenPiUnitDto> shenPiUnitDtos = shenPiUnitService.get(odataObj);		
		return shenPiUnitDtos;
	}
	@RequestMapping(name = "更新审批单位信息", path = "updateShenpiUnit", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateShenpiUnit(@RequestBody ShenPiUnitDto dto) {
		shenPiUnitService.update(dto,dto.getId());
	}
	@RequestMapping(name = "创建审批单位信息", path = "createShenpiUnit", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody ShenPiUnitDto dto) {
		shenPiUnitService.create(dto);
	}
	@RequestMapping(name = "删除审批单位信息", path = "delShenPiUnit", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			shenPiUnitService.deletes(ids);
		} else {
			shenPiUnitService.delete(id);
		}
	} 
	@RequestMapping(name = "获取逾期审批事项信息", path = "shenpiItemsOverdue",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenPiItemsDto> shenpiItemsOverdue(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenPiItemsDto> shenpiItemsDtos = shenPiItemsService.getShenpiItemsOverdue(odataObj);		
		return shenpiItemsDtos;
	} 
	@RequestMapping(name = "获取审批事项信息", path = "shenpiItems",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenPiItemsDto> getShenpiItems(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenPiItemsDto> shenpiItemsDtos = shenPiItemsService.get(odataObj);		
		return shenpiItemsDtos;
	}

	@RequestMapping(name = "获取单个审批事项信息", path = "/single/shenpiItems",method=RequestMethod.GET)
	public @ResponseBody List<ShenPiItemsDto> getSingleShenpiItems(@RequestParam(required = false) String id,
																   @RequestParam(required = false) String shenpiName,
															       @RequestParam(required = false) String shenpiUnitName,
															       @RequestParam(required = false) String shenpiState) throws ParseException {
		ODataObj odataObj = new ODataObj();
		@SuppressWarnings("rawtypes")
		List<ODataFilterItem> ODataFilterItemList = new ArrayList<>();
		if(id !=null){
			ODataFilterItem<String> filterItem0= new ODataFilterItem<>();
			filterItem0.setField("id");//"shenpiUnitId"
			filterItem0.setOperator("ne");//"eq"
			filterItem0.setValue(id);//shenPiUnits.get(0).getId()
			ODataFilterItemList.add(filterItem0);
		}
		if(shenpiName !=null){
			ODataFilterItem<String> filterItem= new ODataFilterItem<>();
			filterItem.setField("shenpiName");//"shenpiUnitId"
			filterItem.setOperator("eq");//"eq"
			filterItem.setValue(shenpiName);//shenPiUnits.get(0).getId()
			ODataFilterItemList.add(filterItem);
		}
		if(shenpiUnitName != null){
			ODataFilterItem<String> filterItem2= new ODataFilterItem<>();
			filterItem2.setField("shenpiUnitName");//"shenpiUnitId"
			filterItem2.setOperator("eq");//"eq"
			filterItem2.setValue(shenpiUnitName);//shenPiUnits.get(0).getId()
			ODataFilterItemList.add(filterItem2);
		}
		if(shenpiUnitName != null){
			ODataFilterItem<String> filterItem3= new ODataFilterItem<>();
			filterItem3.setField("shenpiState");//"shenpiUnitId"
			filterItem3.setOperator("eq");//"eq"
			filterItem3.setValue(shenpiState);//shenPiUnits.get(0).getId()
			ODataFilterItemList.add(filterItem3);
			odataObj.setFilter(ODataFilterItemList);
		}
		List<ShenPiItemsDto> shenpiItemsDtos = shenPiItemsService.findByDto(odataObj);
		return shenpiItemsDtos;
	}

	@RequestMapping(name = "更新审批事项", path = "updateShenpiItems", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateShenpiItems(@RequestBody ShenPiItemsDto dto) {
		shenPiItemsService.update(dto,dto.getId());
	}
	@RequestMapping(name = "创建审批事项", path = "createShenpiItems", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createShenpiItems(@RequestBody ShenPiItemsDto dto) {
		shenPiItemsService.create(dto);
	}
	@RequestMapping(name = "删除审批事项", path = "delShenPiItem", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delShenPiItem(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			shenPiItemsService.deletes(ids);
		} else {
			shenPiItemsService.delete(id);
		}
	} 
	@RequestMapping(name = "审批事项反馈编辑页面", path = "html/shenpifankuiItemsChange", method = RequestMethod.GET)	
	public String shenpifankuiItemsChange() {
       
		return this.ctrlFanKuiItemsName + "/edit";
	}
	@RequestMapping(name = "审批事项反馈列表页面", path = "html/shenpifankuiItemsList", method = RequestMethod.GET)	
	public String shenpifankuiItemsList() {
		return ctrlFanKuiItemsName + "/list";
	}
	@RequestMapping(name = "审批事项反馈详情", path = "html/shenpifankuiItemsDetail", method = RequestMethod.GET)	
	public String shenpifankuiItemsDetail() {
       
		return this.ctrlFanKuiItemsName + "/detail";
	}
	@RequestMapping(name = "审批事项列表页面", path = "html/shenpiItemsList", method = RequestMethod.GET)	
	public String shenpiItemsList() {
		return ctrlItemsName + "/list";
	}
	@RequestMapping(name = "审批事项编辑页面", path = "html/shenpiItemsChange", method = RequestMethod.GET)	
	public String shenpiItemsChange() {
       
		return this.ctrlItemsName + "/edit";
	}
	@RequestMapping(name = "审批事项详情", path = "html/shenpiItemsDetail", method = RequestMethod.GET)	
	public String shenpiItemsDetail() {
       
		return this.ctrlItemsName + "/detail";
	}
	@RequestMapping(name = "审批单位列表页面", path = "html/unitList", method = RequestMethod.GET)	
	public String unitList() {
		return ctrlUnitName + "/list";
	}
	@RequestMapping(name = "审批单位编辑页面", path = "html/shenpiUnitChange", method = RequestMethod.GET)	
	public String shenpiUnitChange() {
       
		return this.ctrlUnitName + "/edit";
	}
	@RequestMapping(name = "审批单位详情", path = "html/shenpiUnitDetail", method = RequestMethod.GET)	
	public String shenpiUnitDetail() {
       
		return this.ctrlUnitName + "/detail";
	}
	// begin#html
	@RequiresPermissions("management/supervision/project#html/list#get")
	@RequestMapping(name = "监管项目列表", path = "html/list", method = RequestMethod.GET)
	public String todo() {
		return ctrlName + "/list";
	}
	
	@RequiresPermissions("management/supervision/project#html/edit#get")
	@RequestMapping(name = "监管项目编辑页", path = "html/edit",method=RequestMethod.GET)
	public String edit() {
		return this.ctrlName + "/edit";
	}

	@RequiresPermissions("management/supervision/project##post")
	@RequestMapping(name = "创建监管项目信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  create(@RequestBody ProjectDto ProjectDto){		
		projectSupervisedService.create(ProjectDto);		
	}
	
	@RequiresPermissions("management/supervision/project##get")
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = projectSupervisedService.get(odataObj);
		return ProjectDtos;
	}
	
	@RequiresPermissions("management/supervision/project#updateProject#post")
	@RequestMapping(name = "更新项目信息", path = "updateProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody ProjectDto ProjectDto){		
		Project entity = projectSupervisedService.findById(ProjectDto.getId());
		if(entity !=null){
			if(entity.getProjectStage().equals(ProjectDto.getProjectStage())){//项目阶段没有发生变化
				projectSupervisedService.update(ProjectDto,ProjectDto.getId());
			}else{//项目阶段发生变化
				//根据number查询
				List<ProjectDto> ProjectDtosForNumber = projectSupervisedService.getProjectByNumber(ProjectDto.getProjectNumber());			
				Map<String,ProjectDto> map = new HashMap<String,ProjectDto>();
				ProjectDtosForNumber.stream().forEach(x->{
					map.put(x.getProjectStage(),x);				
				});
				//遍历map
				Boolean hasProject = false;
				Iterator<Map.Entry<String, ProjectDto>> it = map.entrySet().iterator();
				while(it.hasNext()){
					Map.Entry<String, ProjectDto> entry = it.next();  
		            if(ProjectDto.getProjectStage().equals(entry.getKey())){//如果之前就存在更改后的阶段
		            	hasProject = true;
		            	ProjectDto.setIsLatestVersion(entry.getValue().getIsLatestVersion());
		            	ProjectDto.setIsMonthReport(entry.getValue().getIsMonthReport());
		            	projectSupervisedService.update(ProjectDto, entry.getValue().getId());//更新之前的数据
		            }
				}
				//如果之前不存在更改后的阶段
				if(!hasProject){
					//默认新增的项目为不填写月报
					ProjectDto.setIsMonthReport(false);
					projectSupervisedService.create(ProjectDto);//创建一条新数据
					projectSupervisedService.updateVersion(ProjectDto.getId(), false);//更新本条数据的版本            	
				}
			}		
		}
	}
	
	@RequiresPermissions("management/supervision/project#unitName#get")
	@RequestMapping(name = "获取监管项目信息--可查看单位名称", path = "unitName",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getProjectAndUnitName(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto> ProjectDtos = shenBaoInfoService.get(odataObj);
		return ProjectDtos;
	}
	
	@RequestMapping(name = "获取流程图地址所需参数", path = "getDiagramViewerInfo",method=RequestMethod.GET)
	public @ResponseBody Map<String,Object> getDiagramViewerInfo(HttpServletRequest request) throws ParseException {
		 String processInstanceId = request.getParameter("processInstanceId");
		 Map<String,Object> map = new HashMap<String,Object>();
		 map.put("ip", request.getServerName());
		 map.put("port", request.getServerPort());
		
		 String processDefinitionId;
		 
		 ProcessInstance instance = processEngine.getRuntimeService().createProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
		 if(ObjectUtils.isEmpty(instance)) {
			 HistoricProcessInstance instance2 = processEngine.getHistoryService().createHistoricProcessInstanceQuery().processInstanceId(processInstanceId).singleResult();
			 processDefinitionId = instance2.getProcessDefinitionId();
		 }else {
			 processDefinitionId = instance.getProcessDefinitionId();
		 }
		 
		 map.put("processInstanceId", processInstanceId);
		 map.put("processDefinitionId", processDefinitionId);
		 
		 map = userService.getRolesIntoMap(map);
		 
		 /*//获取当前任务的key值
		 map = processService.getCurrentKeyIntoMap(processInstanceId,map);*/
		 
		 return map;
	}
}

package cs.controller.management;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.alibaba.fastjson.JSONObject;
import com.sn.framework.odata.OdataFilter;
import cs.common.BasicDataConfig;
import cs.controller.CommonController;
import cs.excelHelper.PoiExcel2k3Helper;
import cs.excelHelper.PoiExcel2k7Helper;
import cs.model.DomainDto.MonthReportDto;
import cs.model.project.UpdateDisbursedResultVO;
import cs.repository.odata.ODataFilterItem;
import org.apache.commons.lang3.StringUtils;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.Statistics.ProjectStageData;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
import sun.misc.Request;


/**
 * @author Administrator
 * @Description 项目管理控制层
 */
@Controller
@RequestMapping(name="后台管理--项目管理",path="management/project")
public class ProjectController {
	private String ctrlName = "management/project";
	private String ctrlName2 = "management/supervision/project";
	
	@Autowired
	private ProjectService ProjectService;
	
	@RequiresPermissions("management/project##get")
	@RequestMapping(name = "获取项目信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);
		return ProjectDtos;
	}

	@RequestMapping(name = "获取项目和月报信息", path = "getProjectMonth",method=RequestMethod.POST)
	public @ResponseBody List<MonthReportDto> getProjectMonth(@RequestBody Map map) throws ParseException {
		//默认条件
		return ProjectService.getProjectMonth(map);
	}
	
	@RequiresPermissions("management/project#unitName#get")
	@RequestMapping(name = "获取项目信息--可查看单位名称", path = "unitName",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectDto> getProjectAndUnitName(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ProjectDto> ProjectDtos = ProjectService.get(odataObj);
//		PageModelDto<ProjectDto> ProjectDtos = ProjectService.Get(odataObj);
		return ProjectDtos;
	}
	
//	@RequiresPermissions("management/project#getProjects#get")
	@RequestMapping(name = "获取项目信息--用于图表分析", path = "getProjects",method=RequestMethod.GET)
	public @ResponseBody Map<String, List<ProjectStageData>> getStageProjects(){
	    Map<String, List<ProjectStageData>> map = new HashMap<>();

	    map.put("projectStage", ProjectService.getStageProjects());
	    map.put("isMonthReport", ProjectService.getMonthReportProjects());
	    map.put("projectIndustry", ProjectService.getIndustryProjects());

		return map;
	}

	@RequiresPermissions("management/project##delete")
	@RequestMapping(name = "删除项目信息", path = "",method=RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  delete(@RequestBody String id){
		String[] ids=id.split(",");
		if(ids.length>1){
			ProjectService.deletes(ids);	
		}else{
			ProjectService.delete(id);	
		}		
		
	}
	
	@RequiresPermissions("management/project#updateProject#post")
	@RequestMapping(name = "更新项目信息", path = "updateProject",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  update(@RequestBody ProjectDto ProjectDto){		
		Project entity = ProjectService.findById(ProjectDto.getId());
		if(entity !=null){
			//项目阶段没有发生变化
			if(entity.getProjectStage().equals(ProjectDto.getProjectStage())){
				ProjectService.update(ProjectDto,ProjectDto.getId());
			}else{//项目阶段发生变化
				//根据number查询
				List<ProjectDto> ProjectDtosForNumber = ProjectService.getProjectByNumber(ProjectDto.getProjectNumber());			
				Map<String,ProjectDto> map = new HashMap<String,ProjectDto>();
				ProjectDtosForNumber.stream().forEach(x->{
					map.put(x.getProjectStage(),x);				
				});
				//遍历map
				Boolean hasProject = false;
				Iterator<Map.Entry<String, ProjectDto>> it = map.entrySet().iterator();
				while(it.hasNext()){
					Map.Entry<String, ProjectDto> entry = it.next();
					//如果之前就存在更改后的阶段
		            if(ProjectDto.getProjectStage().equals(entry.getKey())){
		            	hasProject = true;
		            	ProjectDto.setIsLatestVersion(entry.getValue().getIsLatestVersion());
		            	ProjectDto.setIsMonthReport(entry.getValue().getIsMonthReport());
						//更新之前的数据
		            	ProjectService.update(ProjectDto, entry.getValue().getId());
		            }
				}
				//如果之前不存在更改后的阶段
				if(!hasProject){
					//默认新增的项目为不填写月报
					ProjectDto.setIsMonthReport(false);
					//创建一条新数据
					ProjectService.create(ProjectDto);
					//更新本条数据的版本
	            	ProjectService.updateVersion(ProjectDto.getId(), false);
				}
			}		
		}
	}
	
	@SuppressWarnings("rawtypes")
	@RequiresPermissions("management/project#isMonthReport#post")
	@RequestMapping(name = "更新项目是否填报状态", path = "isMonthReport",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void updateByIsMonthReport(@RequestBody Map data){
		String id = data.get("id").toString();
		String isMonthReport = data.get("isMonthReport").toString();
		Boolean isMR = false;
		if(isMonthReport.equals("true")){
			isMR = true;
		}
		String[] ids=id.split(",");
		if(ids.length>1){
			for(String obj:ids){
				ProjectService.updateProjectByIsMonthReport(obj,isMR);	
			}
		}else{
			ProjectService.updateProjectByIsMonthReport(id,isMR);	
		}	
	}

//	@RequiresPermissions("management/project#updateProjectToLibrary#post")
	@RequestMapping(name="更新项目纳入/出项目库", path="updateProjectToLibray", method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public	void updateProjectToLibary(@RequestBody Map data, HttpServletRequest request) throws ParseException {
		String id = data.get("id").toString();
		Boolean isIncludLibary = Boolean.parseBoolean(data.get("isIncludLibary").toString());
        ODataObj odataObj = new ODataObj(request);
		//传入项目id对比申报表的projectId
        ODataFilterItem<String> oDataFilterItem = new ODataFilterItem<>();
        oDataFilterItem.setField("projectId");
        oDataFilterItem.setOperator("eq");
        oDataFilterItem.setValue(id);
        odataObj.getFilter().add(oDataFilterItem);
		//直接传入projectShenBaoStage_7对比申报表的projectShenBaoStage
        ODataFilterItem<String> oDataFilterItem2 = new ODataFilterItem<>();
		oDataFilterItem2.setField("projectShenBaoStage");
		oDataFilterItem2.setOperator("eq");
		oDataFilterItem2.setValue("projectShenBaoStage_7");
		odataObj.getFilter().add(oDataFilterItem2);
        ProjectService.updateProjectForLibary(odataObj, id, isIncludLibary);
	}



	@RequiresPermissions("management/project#updateDisbursed#post")
	@RequestMapping(name = "更新已拨付资金", path = "updateDisbursed", method = RequestMethod.POST)
	@ResponseBody
	public UpdateDisbursedResultVO updateDisbursed(@RequestBody String fileName, HttpServletRequest request) {
		String filePath = request.getSession().getServletContext().getRealPath("/") + CommonController.FILE_UPLOAD_TO + fileName;
		if (StringUtils.upperCase(fileName).endsWith(StringUtils.upperCase(PoiExcel2k3Helper.FILE_NAME_SUFFIX))
				|| StringUtils.upperCase(fileName).endsWith(StringUtils.upperCase(PoiExcel2k7Helper.FILE_NAME_SUFFIX))) {
			Map<String, Object> result = ProjectService.updateAlreadyDisbursedByExcel(filePath);
			return new UpdateDisbursedResultVO((Integer) result.get("totalCount"), (Integer) result.get("successCount"), (List<Object[]>) result.get("errorList"));
		}
		throw new IllegalArgumentException("文件格式错误，请上传xls或xlsx格式的Excel文件");
	}

	@RequiresPermissions("management/project#updateProject#post")
	@RequestMapping(name = "检查项目代码是否重复", path = "projectNumberExist", method = RequestMethod.GET)
	@ResponseBody
	public boolean projectNumberExist(@RequestParam String projectNumber, @RequestParam String ignoreProject) {
		return ProjectService.projectNumberExists(projectNumber, ignoreProject);
	}

	@RequiresPermissions("management/project##post")
	@RequestMapping(name = "创建项目信息", path = "",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void create(@RequestBody ProjectDto ProjectDto){		
		ProjectService.create(ProjectDto);		
	}


	@RequestMapping(name="移交项目", path = "moveProject", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void moveProject(@RequestBody Map<String, Object> map){
		ProjectService.moveProject(map);
	}
	
	
	
	//begin#html
	@RequiresPermissions("management/project#html/list#get")
	@RequestMapping(name = "列表页", path = "html/list",method=RequestMethod.GET)
	public String list() {
		return this.ctrlName + "/list";
	}
	
	@RequiresPermissions("management/project#html/edit#get")
	@RequestMapping(name = "编辑页", path = "html/edit",method=RequestMethod.GET)
	public String edit() {
		return this.ctrlName + "/edit";
	}
	
	@RequiresPermissions("management/project#html/details#get")
	@RequestMapping(name = "详情页", path = "html/details",method=RequestMethod.GET)
	public String details() {
		return this.ctrlName2 + "/projectInfo";
	}
	
	@RequiresPermissions("management/project#html/list_SH#get")
	@RequestMapping(name = "社会投资项目列表页", path = "html/list_SH",method=RequestMethod.GET)
	public String list_SH() {
		return this.ctrlName + "/list_SH";
	}

	@RequiresPermissions("management/project#html/statistics#get")
	@RequestMapping(name = "项目统计分析", path = "html/statistics", method = RequestMethod.GET)
	public String statistics() {
		return this.ctrlName + "/statistics";
	}

	@RequiresPermissions("management/project#html/updateDisbursed#get")
	@RequestMapping(name = "已拨付数上传", path = "html/updateDisbursed", method = RequestMethod.GET)
	public String updateDisbursed() {
		return this.ctrlName + "/updateDisbursed";
	}

}

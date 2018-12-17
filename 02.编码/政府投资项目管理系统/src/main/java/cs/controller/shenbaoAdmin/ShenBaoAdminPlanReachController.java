package cs.controller.shenbaoAdmin;

import com.sn.framework.common.StringUtil;
import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.model.DomainDto.*;
import cs.model.PageModelDto;
import cs.model.framework.UserDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.PlanReachApplicationService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.text.ParseException;
import java.util.List;
import java.util.Map;

import static com.sn.framework.common.StringUtil.SEPARATE_COMMA;
/**
 * @author Administrator
 * @Description 申报端计划下达管理控制层
 */
@Controller
@RequestMapping(name = "申报端--计划下达", path = "shenbaoAdmin/planReach")
public class ShenBaoAdminPlanReachController {
    private String ctrlName = "shenbaoAdmin/planReach";

    @Autowired
    private ProjectService projectService;
    @Autowired
    private ShenBaoInfoService shenbaoInfoService;
    @Autowired
    ICurrentUser currentUser;
    @Autowired
    private UserUnitInfoService userUnitInfoService;
    @Autowired
    private PlanReachApplicationService planReachApplicationService;

    //@RequiresPermissions("shenbaoAdmin/planReach##get")
    @RequestMapping(name = "获取计划下达申请信息", path = "", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<PlanReachApplicationDto> get(ODataObj odataObj) throws ParseException {
        //根据登陆名查找到单位信息addShenBaoInfo
        UserUnitInfoDto userUnitInfoDto1 = null;
        List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
        for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
            if (!CollectionUtils.isEmpty(userUnitInfoDto.getUserDtos())) {
                for (UserDto user : userUnitInfoDto.getUserDtos()) {
                    if (user.getId().equals(currentUser.getUserId())) {
                        userUnitInfoDto1 = userUnitInfoDto;
                        break;
                    }
                }
            }
        }
        ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
        if (userUnitInfoDto1 == null) {
            filterItem.setValue("noid");
        } else {
            filterItem.setValue(userUnitInfoDto1.getId());
        }
        filterItem.setField("applicationUnit");
        filterItem.setOperator("eq");

        odataObj.getFilter().add(filterItem);
        PageModelDto<PlanReachApplicationDto> planReachApplications = planReachApplicationService.get(odataObj);
        return planReachApplications;
    }

    @RequestMapping(name = "获取计划下达申请信息", path = "getShenbaoInfoFromYearplan", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<ShenBaoInfoDto> getShenbaoInfoFromYearplan(ODataObjNew odataObj) {
        PageModelDto<ShenBaoInfoDto> shenBaoInfos = planReachApplicationService.getShenbaoInfoFromYearplan(odataObj);
        return shenBaoInfos;
    }

    @RequestMapping(name = "获取单列申报数据", path = "getShenBaoInfoOutOfPlanReach/{planReachId}",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfoOutOfPlanReach(HttpServletRequest request,@PathVariable String planReachId) throws ParseException {
    	ODataObj odataObj = new ODataObj(request);
    	return planReachApplicationService.getShenBaoInfoOutOfPlanReach(odataObj,planReachId,false);
	}
    
    @RequestMapping(name = "获取打包申报数据", path = "getShenBaoInfoOutOfPackPlan/{planReachId}",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenBaoInfoOutOfPackPlan(HttpServletRequest request,@PathVariable String planReachId) throws ParseException {
    	ODataObj odataObj = new ODataObj(request);
    	return planReachApplicationService.getShenBaoInfoOutOfPlanReach(odataObj,planReachId,true);
	}
    
    //@RequiresPermissions("shenbaoAdmin/planReach##post")
    @RequestMapping(name = "创建计划下达申请信息", path = "", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void create(@RequestBody PlanReachApplicationDto dto) {
        planReachApplicationService.create(dto);
    }

    //@RequiresPermissions("shenbaoAdmin/planReach#updatePlanReach#post")
    @RequestMapping(name = "更新计划下达申请信息", path = "updatePlanReach", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void update(@RequestBody PlanReachApplicationDto dto) throws ParseException {
        planReachApplicationService.update(dto, dto.getId());
    }

    //@RequiresPermissions("shenbaoAdmin/planReach#deletePlanReach#post")
    @RequestMapping(name = "删除计划下达申请信息", path = "deletePlanReach", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void delete(@RequestBody String id) {
        String[] ids = StringUtil.split(id, SEPARATE_COMMA);
        for (String idstr : ids) {
            planReachApplicationService.delete(idstr);
        }
    }

    @RequiresPermissions("shenbaoAdmin/planReach#notInclud#get")
    @RequestMapping(name = "获取未纳入年度计划的项目", path = "notInclud", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<ProjectDto> getNotInclud(ODataObj odataObj) {
        //设置过滤条件--查询登陆用户单位的项目信息
        UserUnitInfo unit = userUnitInfoService.getByUserName(currentUser.getUserId());
        ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
        filterItem.setField("unitName");
        filterItem.setOperator("eq");
        filterItem.setValue(unit.getId());
        odataObj.getFilter().add(filterItem);

        PageModelDto<ProjectDto> projectDtos = projectService.get(odataObj);
        return projectDtos;
    }

    @RequiresPermissions("shenbaoAdmin/planReach#hasInclud#get")
    @RequestMapping(name = "获取已纳入年度计划的项目", path = "hasInclud", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<ShenBaoInfoDto> getHasInclud(ODataObj odataObj) {
        //设置过滤条件--查询登陆用户单位的项目信息
        UserUnitInfo unit = userUnitInfoService.getByUserName(currentUser.getUserId());
        ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
        filterItem.setField("unitName");
        filterItem.setOperator("eq");
        filterItem.setValue(unit.getId());
        odataObj.getFilter().add(filterItem);

        PageModelDto<ShenBaoInfoDto> shenbaoInfoDtos = shenbaoInfoService.get(odataObj);
        return shenbaoInfoDtos;
    }

    @SuppressWarnings("rawtypes")
    @RequiresPermissions("shenbaoAdmin/planReach#comfirmPlanReach#post")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    @RequestMapping(name = "确定计划下达申请资金", path = "comfirmPlanReach", method = RequestMethod.POST)
    public void comfirmPlanReach(@RequestBody Map map) {
        shenbaoInfoService.comfirmPlanReach(map, false);
    }

    @RequestMapping(name = "获取计划下达中申报项目列表数据", path = "{id}/shenBaoInfoList", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<ShenBaoInfoDto> getShenBaoInfo(ODataObj odataObj, @PathVariable String id) {
        PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = planReachApplicationService.getShenBaoInfo(id, odataObj);
        return shenBaoInfoDtos;
    }

    @RequestMapping(name = "获取计划下达中打包类中添加的申报数据", path = "{id}/shenBaoInfoFromPack", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(ODataObj odataObj, @PathVariable String id) {
        PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = planReachApplicationService.getShenBaoInfoFromPackPlan(id, odataObj);
        return shenBaoInfoDtos;
    }

    @RequestMapping(name = "计划下达申请中添加申报项目", path = "addShenBaoInfo/{planReachId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void addShenBaoInfoToPlanReach(@RequestBody String projectId, @PathVariable String planReachId) {
        String[] ids = StringUtil.split(projectId, SEPARATE_COMMA);
        planReachApplicationService.addShenBaoInfos(planReachId, ids);
    }

    @RequestMapping(name = "打包中添加申报项目", path = "addShenBaoInfoToPack/{packId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void addShenBaoInfoToPack(@RequestBody String projectId, @PathVariable String packId) {
        String[] ids = StringUtil.split(projectId, SEPARATE_COMMA);
        planReachApplicationService.addShenBaoInfoToPacks(packId, ids);
    }

    @RequestMapping(name = "启动计划下达审批流程", path = "startProcess/{packId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void startProcess(@PathVariable String packId) {
        planReachApplicationService.startProcess(packId);
    }

    @RequestMapping(name = "启动单条计划下达审批流程", path = "startProcessOne", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void startProcessOne(@RequestParam(required = false) String shenbaoId) {
        shenbaoInfoService.startProcessShenbao("planreach", shenbaoId);

    }

    @RequestMapping(name = "撤销单条计划下达审批流程", path = "deleteProcessOne", method = RequestMethod.GET)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void deleteProcessOne(@RequestParam(required = false) String shenbaoId) {
        planReachApplicationService.deleteProcessOne(shenbaoId);

    }

    @RequestMapping(name = "添加申请资金", path = "updateShnebaoInfo", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void updateShnebaoInfo(@RequestBody ShenBaoInfoDto dto) {
//        double apPlanReach_gtzj = Double.parseDouble(gtmoney);
//        double apPlanReach_ggys = Double.parseDouble(ggmoney);
        planReachApplicationService.updateShnebaoInfo(dto.getId(), dto.getSqPlanReach_ggys(), dto.getSqPlanReach_gtzj());
    }

    @RequestMapping(name = "获取计划下达中打包列表数据", path = "{id}/packPlanList", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<PackPlanDto> getPackPkan(ODataObj odataObj, @PathVariable String id) {
        PageModelDto<PackPlanDto> packPlanDtos = planReachApplicationService.getPackPlan(id, odataObj);
        return packPlanDtos;
    }

    @RequestMapping(name = "获取包列表数据", path = "packPlanList", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<PackPlanDto> getPackPkan(ODataObj odataObj) {
        PageModelDto<PackPlanDto> packPlanDtos = planReachApplicationService.getPackPlan(odataObj);
        return packPlanDtos;
    }

    @RequestMapping(name = "计划下达申请中删除申报信息", path = "deleteShenBaoInfo/{packPlanId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void deleteShenBaoInfo(@RequestBody String shenbaoId, @PathVariable String packPlanId) {
        String[] ids = StringUtil.split(shenbaoId, SEPARATE_COMMA);
        if (ids.length > 1) {
            planReachApplicationService.deleteShenBaoInfos(packPlanId, ids);
        } else {
            planReachApplicationService.deleteShenBaoInfo(packPlanId, shenbaoId);
        }
    }

    @RequestMapping(name = "计划下达申请中删除打包信息", path = "deletePack/{packPlanId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void deletePack(@RequestBody String shenbaoId, @PathVariable String packPlanId) {
        String[] ids = StringUtil.split(shenbaoId, SEPARATE_COMMA);
        if (ids.length > 1) {
            planReachApplicationService.deletePacks(packPlanId, ids);
        } else {
            planReachApplicationService.deletePack(packPlanId, shenbaoId);
        }
    }

    @RequestMapping(name = "删除打包信息中的申报信息", path = "deletePlanShenBaoInfo/{packPlanId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void deletePlanShenBaoInfo(@RequestBody String shenbaoId, @PathVariable String packPlanId) {
        String[] ids = StringUtil.split(shenbaoId, SEPARATE_COMMA);
        if (ids.length > 1) {
            planReachApplicationService.deletePlanShenBaoInfos(packPlanId, ids);
        } else {
            planReachApplicationService.deletePlanShenBaoInfo(packPlanId, shenbaoId);
        }
    }

    @RequestMapping(name = "计划下达申请中添加打包信息", path = "addPackPlan/{planReachId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void addPackPlanToPlanReach(@RequestBody String packPlanId, @PathVariable String planReachId) {
        String[] ids = StringUtil.split(packPlanId, SEPARATE_COMMA);
        if (ids.length > 1) {
            planReachApplicationService.addPackPlans(planReachId, ids);
        } else {
            planReachApplicationService.addPackPlan(planReachId, packPlanId);
        }
    }


    @RequiresPermissions("shenbaoAdmin/planReach#html/list#get")
    @RequestMapping(name = "列表页", path = "html/list", method = RequestMethod.GET)
    public String list() {
        return this.ctrlName + "/list";
    }

    //@RequiresPermissions("shenbaoAdmin/planReach#html/edit#get")
    @RequestMapping(name = "编辑页", path = "html/edit", method = RequestMethod.GET)
    public String edit() {
        return this.ctrlName + "/edit";
    }

    //@RequiresPermissions("shenbaoAdmin/planReach#html/print#get")
    @RequestMapping(name = "打印页", path = "html/print", method = RequestMethod.GET)
    public String print() {
        return this.ctrlName + "/print";
    }

    @RequestMapping(name = "打包计划编制", path = "html/packPlan", method = RequestMethod.GET)
    public String packPlan() {
        return this.ctrlName + "/packPlan";
    }
}

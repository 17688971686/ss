package cs.controller.management;

import java.text.ParseException;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import com.sn.framework.common.StringUtil;
import com.sn.framework.odata.OdataFilter;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.model.DomainDto.ProjectDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.ShenBaoInfoService;
import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.exportExcel.YearPlanStatistics;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanService;

import static com.sn.framework.common.StringUtil.SEPARATE_COMMA;
/**
 * @author Administrator
 * @Description 年度计划管理控制层
 */
@Controller
@RequestMapping(name = "后台管理--年度计划管理", path = "management/yearPlan")
public class YearPlanController {
    private String ctrl = "management/yearPlan";
    @Autowired
    private YearPlanService yearPlanService;
    @Autowired
    private ShenBaoInfoService shenBaoInfoService;

    @RequiresPermissions("management/yearPlan##get")
    @RequestMapping(name = "获取年度计划列表数据", path = "", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<YearPlanDto> get(HttpServletRequest request) throws ParseException {
        ODataObj odataObj = new ODataObj(request);
        PageModelDto<YearPlanDto> yearPlanDtos = yearPlanService.get(odataObj);
        return yearPlanDtos;
    }

    @RequiresPermissions("management/yearPlan#id/projectList#get")
    @RequestMapping(name = "获取年度计划项目列表数据", path = "{id}/{projectName}/{unitName}/projectList", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<ShenBaoInfoDto> getShenBaoInfo(ODataObjNew odataObj,@PathVariable String id, @PathVariable String projectName, @PathVariable String unitName) {
        PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = yearPlanService.getYearPlanShenBaoInfo(id,odataObj,false);
        return shenBaoInfoDtos;
    }

    @RequestMapping(name = "主动下达计划", path = "activeRelease/{packid}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void activeRelease(HttpServletRequest request ,@RequestBody ShenBaoInfoDto dto,@PathVariable String packid) {
        ODataObjNew odataObj = new ODataObjNew(request);
        yearPlanService.activeRelease( odataObj, dto,packid);
    }

    @RequestMapping(name = "主动下达计划", path = "activeReleasePack", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void activeReleasePack(HttpServletRequest request ,@RequestBody ShenBaoInfoDto dto) {
        ODataObjNew odataObj = new ODataObjNew(request);
        yearPlanService.activeReleasePack( odataObj, dto);
    }

    @RequestMapping(name = "获取年度计划申报信息", path = "shenbaoinfo/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ShenBaoInfoDto getShenBaoInfoById(ODataObjNew odataObj, @PathVariable String id) {
        ShenBaoInfoDto shenBaoInfoDtos = yearPlanService.getShenBaoInfoById(id);
        return shenBaoInfoDtos;
    }

    @RequestMapping(name = "获取年度计划申报信息", path = "projectinfo/{id}", method = RequestMethod.GET)
    @ResponseBody
    public ShenBaoInfoDto getProjectInfoById(ODataObjNew odataObj, @PathVariable String id) {
        ShenBaoInfoDto projectDto = yearPlanService.getProjectInfoById(id);
        return projectDto;
    }

    @RequestMapping(name = "获取申报数据", path = "planreachShenbaoList",method=RequestMethod.GET)
    public @ResponseBody PageModelDto<ShenBaoInfoDto> getShenbaoInfoDtos(HttpServletRequest request) throws ParseException {
        ODataObj odataObj = new ODataObj(request);
        ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
        filterItem.setField("projectShenBaoStage");
        filterItem.setOperator("eq");
        filterItem.setValue("projectShenBaoStage_5");
        odataObj.getFilter().add(filterItem);

        PageModelDto<ShenBaoInfoDto>  shenbaoInfoDtos= shenBaoInfoService.get(odataObj);
        return shenbaoInfoDtos;
    }

    //@RequiresPermissions("management/yearPlan#id/packPlanList#get")
    @RequestMapping(name = "获取年度打包计划列表数据", path = "{id}/packPlanList", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<PackPlanDto> getPackPlan(HttpServletRequest request, @PathVariable String id) throws ParseException {
        ODataObj odataObj = new ODataObj(request);
        PageModelDto<PackPlanDto> packPlanDtos = yearPlanService.getYearPlanPack(id, odataObj);
        return packPlanDtos;
    }

    @RequiresPermissions("management/yearPlan#addCapital/planId#post")
    @RequestMapping(name = "添加年度计划项目", path = "addCapital/{planId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void addCapital(@RequestBody String shenBaoId, @PathVariable String planId) {
        String[] ids = StringUtil.split(shenBaoId, SEPARATE_COMMA);
        if (ids.length > 1) {
            yearPlanService.addYearPlanCapitals(planId, ids);
        } else {
            yearPlanService.addYearPlanCapital(planId, shenBaoId);
        }
    }

    //@RequiresPermissions("management/yearPlan#addPackPlan/planId#post")
    @RequestMapping(name = "添加年度计划打包", path = "addPackPlan/{planId}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void addPackPlan(@RequestBody String packId, @PathVariable String planId) {
        String[] ids = packId.split(",");
        if (ids.length > 1) {
            yearPlanService.addYearPlanPacks(planId, ids);
        } else {
            yearPlanService.addYearPlanPack(planId, packId);
        }
    }

    @RequiresPermissions("management/yearPlan#removeCapital#post")
    @RequestMapping(name = "移除年度计划项目", path = "removeCapital", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void removeCapital(@RequestParam String planId, @RequestBody String yearPlanCapitalId) {
        String[] ids = yearPlanCapitalId.split(",");
        yearPlanService.removeYearPlanCapital(planId, ids);
    }

    //@RequiresPermissions("management/yearPlan#removePack#post")
    @RequestMapping(name = "移除年度计划打包", path = "removePack", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void removePack(@RequestParam String planId, @RequestBody String yearPlanPackId) {
        String[] ids = yearPlanPackId.split(",");
        yearPlanService.removeYearPlanPack(planId, ids);
    }

    @RequiresPermissions("management/yearPlan#getStatistics#get")
    @RequestMapping(name = "获取年度计划统计信息", path = "getStatistics", method = RequestMethod.GET)
    public @ResponseBody
    List<YearPlanStatistics> getStatistics(@RequestParam String planId) {
        return yearPlanService.getStatistics(planId);
    }

    @RequiresPermissions("management/yearPlan##post")
    @RequestMapping(name = "添加年度计划", path = "", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void post(@RequestBody YearPlanDto dto) {
        yearPlanService.create(dto);
    }

    @RequiresPermissions("management/yearPlan#updateYearPlan#post")
    @RequestMapping(name = "更新年度计划", path = "updateYearPlan", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void put(@RequestBody YearPlanDto dto) {
        yearPlanService.update(dto, dto.getId());
    }

    @RequiresPermissions("management/yearPlan#deleteYearPlan#post")
    @RequestMapping(name = "删除年度计划", path = "deleteYearPlan", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void delete(@RequestBody String id) {
        String[] ids = id.split(",");
        if (ids.length > 1) {
            for (String planId : ids) {
                yearPlanService.delete(planId);
            }
        } else {
            yearPlanService.delete(id);
        }
    }

    //begin#html
    @RequiresPermissions("management/yearPlan#html/shenbaoInfoList#get")
    @RequestMapping(name = "年度计划项目库--政投列表页", path = "html/shenbaoInfoList", method = RequestMethod.GET)
    public String yearplanListZF() {
        return ctrl + "/shenbaoInfoList";
    }

    @RequiresPermissions("management/yearPlan#html/shenbaoInfoListSH#get")
    @RequestMapping(name = "年度计划项目库--社投列表页", path = "html/shenbaoInfoListSH", method = RequestMethod.GET)
    public String yearplanListSH() {
        return ctrl + "/shenbaoInfoListSH";
    }

    @RequiresPermissions("management/yearPlan#html/shenbaoInfoEdit#get")
    @RequestMapping(name = "年度计划项目申报编辑页", path = "html/shenbaoInfoEdit", method = RequestMethod.GET)
    public String shenBaoInfoEdit() {
        return ctrl + "/shenbaoInfoEdit";
    }

    @RequiresPermissions("management/yearPlan#html/planList#get")
    @RequestMapping(name = "年度计划--政投列表页", path = "html/planList", method = RequestMethod.GET)
    public String planBZList() {
        return ctrl + "/planList";
    }

    @RequiresPermissions("management/yearPlan#html/planEdit#get")
    @RequestMapping(name = "年度计划编辑页", path = "html/planEdit", method = RequestMethod.GET)
    public String planBZEdit() {
        return ctrl + "/planEdit";
    }

    @RequiresPermissions("management/yearPlan#html/planBZ#get")
    @RequestMapping(name = "年度计划编制页", path = "html/planBZ", method = RequestMethod.GET)
    public String planBZ() {
        return ctrl + "/planBZ";
    }

    @RequestMapping(name = "打包项目列表", path = "html/projectList", method = RequestMethod.GET)
    public String projectList() {
        return ctrl + "/pack/projectList";
    }

}

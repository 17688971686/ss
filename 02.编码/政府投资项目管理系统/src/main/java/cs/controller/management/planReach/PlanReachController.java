package cs.controller.management.planReach;

import java.text.ParseException;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;

import com.sn.framework.common.StringUtil;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.common.Response;
import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ShenBaoInfoService;

import static com.sn.framework.common.StringUtil.SEPARATE_COMMA;

/**
 * @author cx
 * @ClassName: PlanReachController
 * @Description: 计划下达管理控制器
 * @date 2018年1月11日 上午9:38:41
 */
@Controller
@RequestMapping(name = "后台管理--计划下达管理--计划下达", path = "management/planReachManage/planReach")
public class PlanReachController {
    private String ctrl = "management/planReachManage/planReach";

    @Autowired
    private ShenBaoInfoService shenbaoInfoService;
    @Autowired
    private PlanReachApprovalService planReachApprovalService;

    //@RequiresPermissions("management/planReachManage/planReach##get")
    @RequestMapping(name = "获取计划下达申请", path = "", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<ShenBaoInfoDto> getPlanReach(HttpServletRequest request) throws ParseException {
        ODataObj odataObj = new ODataObj(request);
        PageModelDto<ShenBaoInfoDto> shenbaoInfoDtos = shenbaoInfoService.get(odataObj);
        return shenbaoInfoDtos;
    }

    //@RequiresPermissions("management/planReachManage/planReach#approval#get")
    @RequestMapping(name = "获取计划下达批复信息", path = "approval", method = RequestMethod.GET)
    public @ResponseBody
    PageModelDto<PlanReachApprovalDto> getPlanReachApproval(HttpServletRequest request) throws ParseException {
        ODataObj odataObj = new ODataObj(request);
        PageModelDto<PlanReachApprovalDto> planReachApprovalDtos = planReachApprovalService.get(odataObj);
        return planReachApprovalDtos;
    }

    
    //@RequiresPermissions("management/planReachManage/planReach##post")
    @SuppressWarnings("rawtypes")
    @RequestMapping(name = "创建计划下达批复信息", path = "", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void create(@RequestBody Map data) throws ParseException {
        planReachApprovalService.create(data);
    }

    //@RequiresPermissions("management/planReachManage/planReach##post")
    @RequestMapping(name = "更新计划下达批复信息", path = "updatePlanReachManage", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void update(@RequestBody Map data) throws ParseException {
        planReachApprovalService.update(data);
    }

    //@RequiresPermissions("management/planReachManage/planReach#deletePlanReach#post")
    @RequestMapping(name = "删除计划下达批复信息", path = "deletePlanReach", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    public void delete(@RequestBody String id) {
        String[] ids = StringUtil.split(id, SEPARATE_COMMA);
        for (String idstr : ids) {
            planReachApprovalService.delete(idstr);
        }
    }
    
    @RequestMapping(name = "检查项目", path = "checkIsOnly/{ids}", method = RequestMethod.GET)
    @ResponseBody
    public Response checkIsOnly(@PathVariable String ids) {
    	Response resp = new Response();
        String[] id = StringUtil.split(ids, SEPARATE_COMMA);
        for (String idstr : id) {
        	resp = planReachApprovalService.checkIsOnlys(idstr);
        	if(resp.getMessage() != ""){
        		break;
        	}
        }
        return resp;
    }

    @SuppressWarnings("rawtypes")
    //@RequiresPermissions("management/planReachManage/planReach#comfirmPlanReach#post")
    @ResponseStatus(value = HttpStatus.NO_CONTENT)
    @RequestMapping(name = "确定计划下达申请资金", path = "comfirmPlanReach", method = RequestMethod.POST)
    public void comfirmPlanReach(@RequestBody Map map) {
        shenbaoInfoService.comfirmPlanReach(map, true);
    }

    @RequestMapping(name = "添加申请资金", path = "updateShnebaoInfo/{shenbaoId}/{ggmoney}/{gtmoney}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void updateShnebaoInfo(@PathVariable String shenbaoId, @PathVariable String ggmoney, @PathVariable String gtmoney) {

        double xdPlanReach_gtzj = Double.parseDouble(gtmoney);
        double xdPlanReach_ggys = Double.parseDouble(ggmoney);
        planReachApprovalService.updateShnebaoInfo(shenbaoId, xdPlanReach_ggys, xdPlanReach_gtzj);
    }
    
    @RequestMapping(name = "办结单条任务--计划类", path = "endProcess/{id}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void endProcess(@PathVariable String id) {
    	planReachApprovalService.endProcess(id);
    }
    
    @RequestMapping(name = "办结所有任务--计划类", path = "endProcesss/{id}", method = RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void endProcesss(@PathVariable String id) {
    	planReachApprovalService.endProcesss(id);
    }
    
    //@RequiresPermissions("management/planReachManage/planReach#html/list#get")
    @RequestMapping(name = "计划下达列表页面", path = "html/list", method = RequestMethod.GET)
    public String list() {
        return ctrl + "/list";
    }

    //@RequiresPermissions("management/planReachManage/planReach#html/tabList#get")
    @RequestMapping(name = "计划下达批复列表页面", path = "html/tabList", method = RequestMethod.GET)
    public String tabList() {
        return ctrl + "/tabList";
    }

    //@RequiresPermissions("management/planReachManage/planReach#html/tabEdit#get")
    @RequestMapping(name = "计划下达批复编辑页面", path = "html/tabEdit", method = RequestMethod.GET)
    public String tabEdit() {
        return ctrl + "/tabEdit";
    }

    //@RequiresPermissions("management/planReachManage/planReach#html/print#get")
    @RequestMapping(name = "计划下达批复打印页面", path = "html/print", method = RequestMethod.GET)
    public String print() {
        return ctrl + "/print";
    }
}

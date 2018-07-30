package cs.controller.mobile;

import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.YearPlanService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

@Controller
@RequestMapping(name = "手机端--年度计划管理", path = "mobile/management/yearPlan")
public class YearPlanMobileController {

    @Autowired
    private YearPlanService yearPlanService;

    @RequestMapping(name = "获取年度计划列表数据", path = "", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<YearPlanDto> get(ODataObj odataObj) {
        PageModelDto<YearPlanDto> yearPlanDtos = yearPlanService.get(odataObj);
        return yearPlanDtos;
    }

    @RequestMapping(name = "获取年度计划项目列表数据", path = "{id}/projectList", method = RequestMethod.GET)
    @ResponseBody
    public PageModelDto<ShenBaoInfoDto> getShenBaoInfo(ODataObjNew odataObj, @PathVariable String id) {
        PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = yearPlanService.getYearPlanShenBaoInfo(id, odataObj, false);
        return shenBaoInfoDtos;
    }

}

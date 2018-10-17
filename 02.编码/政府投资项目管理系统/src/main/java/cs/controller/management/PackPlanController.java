package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

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

import cs.common.ICurrentUser;
import cs.domain.PackPlan;
import cs.model.PageModelDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PackPlanService;
import cs.service.interfaces.UserUnitInfoService;

/**
 * @Description: 打包计划控制类
 * @author: wxy
 * @date: 2018年04月27日
 */
@Controller
@RequestMapping(name="后台管理--年度打包计划管理",path="management/packPlan")
public class PackPlanController {
	private String ctrl ="management/yearPlan/pack";
	@Autowired
	private PackPlanService packPlanService;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
    @Autowired
    ICurrentUser currentUser;
    
	//@RequiresPermissions("management/packPlan##get")
	@RequestMapping(name = "获取打包计划列表数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<PackPlanDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<PackPlanDto>  packPlanDtos= packPlanService.get(odataObj);	
//		UserUnitInfoDto userUnitInfoDto1 = userUnitInfoService.getByUserId(currentUser.getUserId());
//		double d = 0.0;
//		double a = 0.0;
//		boolean isOurUnit = false;
//		for (int i = 0; i < packPlanDtos.getValue().size(); i++) {
//			if (packPlanDtos.getValue().get(i) != null) {
//				for (int j = 0; j < packPlanDtos.getValue().get(i).getAllocationCapitals().size(); j++) {
//					if (packPlanDtos.getValue().get(i).getAllocationCapitals().get(j) != null) {
//						// 如果有本单位的打包计划
//						if (packPlanDtos.getValue().get(i).getAllocationCapitals().get(j).getUnitName()
//								.equals(userUnitInfoDto1.getId())) {
//							d += packPlanDtos.getValue().get(i).getAllocationCapitals().get(j).getCapital_ggys();
//							a += packPlanDtos.getValue().get(i).getAllocationCapitals().get(j).getCapital_gtzj();
//							isOurUnit = true;
//						}
//					}
//				}
//			}
//			if (isOurUnit) {
//				packPlanDtos.getValue().get(i).setCapitalSCZ_ggys_TheYear(d);
//				packPlanDtos.getValue().get(i).setCapitalSCZ_gtzj_TheYear(a);
//			}
//		}
		return packPlanDtos;
	}
	
	//@RequiresPermissions("management/packPlan##post")
	@RequestMapping(name="添加打包计划",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody PackPlanDto dto){
		packPlanService.create(dto);
	}
	
//	@RequiresPermissions("management/packPlan#updatePackPlan#post")
	@RequestMapping(name="更新打包计划",path="updatePackPlan",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void put(HttpServletRequest request , @RequestBody PackPlanDto dto){
		packPlanService.update(dto,dto.getId());
	}
	
	//@RequiresPermissions("management/yearPlan#deletePackPlan#post")
	@RequestMapping(name="删除年度计划",path="deletePackPlan",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id){
		String[] ids=id.split(",");
		try {
			if(ids.length>1){
				for(String planId:ids){
					packPlanService.delete(planId);	
				}
			}else{
				
					packPlanService.delete(id);	
			}	
		} catch (Exception e) {
			// TODO: handle exception
			throw new IllegalArgumentException(String.format("无法删除,请重新选择！"));
		}
	}
	
	//@RequiresPermissions("management/packPlan#html/packList#get")
	@RequestMapping(name="打包计划列表页",path="html/packList",method=RequestMethod.GET)
	public String planBZList(){
		return ctrl+"/packList";
	}
	
	//@RequiresPermissions("management/yearPlan#html/packEdit#get")
	@RequestMapping(name="打包计划编制页",path="html/packEdit",method=RequestMethod.GET)
	public String packEdit(){
		return ctrl+"/packEdit";
	}
	

}

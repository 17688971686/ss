package cs.controller.shenbaoAdmin;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.management.ProjectInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.shenbaoAdmin.ProjectInfoService;

/**
 * @description 项目信息控制层
 * @author cx
 * @date 2017-05-07
 *
 */
@Controller
@RequestMapping(name = "项目信息", path = "projectInfo")
public class ProjectInfoController {
	private String ctrlName = "shenbaoAdmin/projectDetails";
	//依赖注入服务层
	@Autowired
	private ProjectInfoService projectInfoService;
	
	/**
	 * @Description：分页查询项目信息
	 * @author： cx
	 * @Date： 2017年5月13日
	 * @version: 0.1
	 */
	@RequestMapping(name = "获取项目信息",path = "",method = RequestMethod.GET)
	public @ResponseBody PageModelDto<ProjectInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj=new ODataObj(request);
		PageModelDto<ProjectInfoDto> projectInfoDtos = projectInfoService.get(odataObj);	
		
		return projectInfoDtos;		
	}
								
	/**
	 * @Description：项目详情页面
	 * @param Id 项目代码
	 * @author： cx
	 * @Date： 2017年5月10日
	 * @version: 0.1
	 */
	@RequestMapping(name = "项目详情页面",path = "html/projectDetails",method = RequestMethod.GET)
	public String projectDetails(){		
		//跳转到详情页面		
		return ctrlName+"/html/projectDetails";
	}
}

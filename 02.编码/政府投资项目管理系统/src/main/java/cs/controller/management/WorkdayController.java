package cs.controller.management;

import com.sn.framework.common.StringUtil;
import cs.common.SNKit;
import cs.common.utils.DateUtils;
import cs.model.DomainDto.WorkdayDto;
import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.WorkdayService;
import org.apache.shiro.authz.annotation.RequiresAuthentication;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.text.ParseException;
import java.util.*;
/**
 * @author Administrator
 * @Description 工作日管理控制层
 */
@Controller
@RequestMapping(name = "配置管理--工作日管理", path = "workday")
public class WorkdayController {

	@Autowired
	private WorkdayService workdayService;

	private String ctrl = "management/workday";

	//begin工作日管理
	//@RequiresPermissions("workday#html/workday/index#get")
	@RequiresAuthentication
	@RequestMapping(name = "工作日管理主页", path = "html/index", method = RequestMethod.GET)
	public String to_workday_index(){
		System.out.println("主页面走没走");
		return ctrl+"/index";
	}

	//@RequiresPermissions("workday#edit#get")
	@RequiresAuthentication
	@RequestMapping(name = "编辑工作日页面", path = "html/edit",method=RequestMethod.GET)
	public String  to_workday_edit()  {
		System.out.println("修改页面走没有");
		return  ctrl+"/edit";
	}

	@RequiresAuthentication
	@RequestMapping(name="获取工作日所有数据",path="findByOdataObj",method=RequestMethod.GET)
	@ResponseBody
	public PageModelDto<WorkdayDto> getWorkday(HttpServletRequest request) throws ParseException{
		ODataObj odataObj=new ODataObj(request);
		return workdayService.getWorkday(odataObj);
	}

	//@RequiresPermissions("workday#getWorkdayById#get")
	@RequiresAuthentication
	@RequestMapping(name="通过id获取单个对象",path="getWorkdayById",method=RequestMethod.GET)
	@ResponseBody
	public WorkdayDto getWorkdayById(@RequestParam String id){
		return workdayService.getWorkdayById(id);
	}

	//@RequiresPermissions("workday#delete#post")
	@RequiresAuthentication
	@RequestMapping(name="删除",path="",method=RequestMethod.DELETE)
	@ResponseStatus(value=HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id){
		workdayService.deleteWorkday(id);
	}


	//@RequiresPermissions("workday##put")
	@RequiresAuthentication
	@RequestMapping(name="更新",path="",method=RequestMethod.PUT)
	@ResponseStatus(value=HttpStatus.NO_CONTENT)
	public void update(@RequestBody WorkdayDto workdayDto){
		workdayService.updateWorkday(workdayDto);
	}

	//@RequiresPermissions("workday#save#post")
	@RequiresAuthentication
	@RequestMapping(name = "保存", path = "save",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  createWorkday(@RequestBody WorkdayDto workdayDto,HttpServletResponse response)  {
		String resultMsg = "";
		String isNodate="";//存重复的日期
		boolean isrepeat = false;//判断是否已存在的日期
		String str=workdayDto.getDatess();
		//把中文字符串转换为英文字符串
		str = str.replace("，",",");
		//截取字符串
		String[] strs = StringUtil.split(str,",");
		Calendar now = Calendar.getInstance();
		//获取当前年份
		String year= Integer.toString( now.get(Calendar.YEAR)) ;
		//获取月份
		String month=workdayDto.getMonth();

		if (strs.length > 1) {
			for (int i=0;i<strs.length;i++){
				String day = strs[i];
				if(StringUtil.isBlank(day)) continue;
				String dates=year+"-"+month+"-"+day;
				workdayDto.setDates(DateUtils.converToDate(dates,null));
				isrepeat=workdayService.isRepeat(workdayDto.getDates());
				if(isrepeat){
					if(isNodate!=""){
						isNodate+="、"+strs[i]+"号";
					}else{
						isNodate+=month+"月"+strs[i]+"号";
					}
				}else{
					resultMsg =  workdayService.createWorkday(workdayDto);
				}
			}
		} else {
			String dates=year+"-"+month+"-"+str;
			workdayDto.setDates(DateUtils.converToDate(dates,null));
			isrepeat=workdayService.isRepeat(workdayDto.getDates());
			if(isrepeat){
				isNodate = month+"月"+str+"号";
			}else{
				resultMsg =  workdayService.createWorkday(workdayDto);
			}
		}
		//重复日期
		boolean flag = true;
		if(!isNodate.equals("")){//当有重复日期时，返回重复日期的提示
			resultMsg=isNodate;
			flag = false;
		}
		Map result = new HashMap();
		result.put("flag",flag);
		result.put("reMsg",resultMsg);

		SNKit.printJsonMsg(response, HttpStatus.OK, result);
	}
}

package cs.controller.codingPlatform;


import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import cs.common.DateUtil;
import cs.service.interfaces.CodingPlatformService;


@Controller
@RequestMapping(name = "赋码平台", path = "coding")
public class CodingPlatformController {
	private static Logger logger = Logger.getLogger(CodingPlatformController.class);
	@Autowired 
	protected CodingPlatformService codingPlatformService;
	
	@RequestMapping(name="获取token", path = "/getAccessToken", method = RequestMethod.GET)
	@ResponseBody
	public void getAccessToken(HttpServletRequest request) {
		codingPlatformService.getAccessToken();
	}
	
	/**
	 * 获取日期以来所有项目
	 * @param request
	 * @param todaytime 日期
	 * @param pageIndex 页码
	 * @return
	 */
//	@RequiresPermissions("coding#getShenBaoInfoAll#get")
	@RequestMapping(name="根据日期和页码查询所有并更新", path = "/getShenBaoInfoAll", method = RequestMethod.GET)
	@ResponseBody
	public void getShenBaoInfoAll(HttpServletRequest request,@RequestParam(required = true) String todaytime,@RequestParam(required = true) String pageIndex) {
		String str = null;
		str = codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
		JsonParser parser = new JsonParser(); // 创建JSON解析器
		try {
			JsonObject object = (JsonObject) parser.parse(str);
			
			for (int i = 1; i <= object.get("totalPage").getAsInt(); i++) {
				if(i == 50 || i==70 || i==90){
					Thread.sleep(5000);
				}
				str =codingPlatformService.getShenBaoInfoFromCoding(todaytime,String.valueOf(i));
				if(str != ""){
					codingPlatformService.saveAll(str);
				}
				
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
//	@RequiresPermissions("coding#getShenBaoInfoOne#get")
	@RequestMapping(name="根据日期和页码查询并更新", path = "/getShenBaoInfoOne", method = RequestMethod.GET)
	@ResponseBody
	public void getShenBaoInfoOne(HttpServletRequest request,@RequestParam(required = true) String todaytime,@RequestParam(required = true) String pageIndex) {
		codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
	}
	
	@Scheduled(cron="0 0 1/6 * * ? ")
	public void scheduled() {
		//<0/5 * * * * ? >每5秒
		//<0 0 1/6 * * ? >每6小时
		logger.info("=========>:定时任务开始");
		String pageIndex = "1";
		String todaytime = DateUtil.getYear()+"-"+DateUtil.getMonth()+"-"+DateUtil.getDay();
		System.out.println(todaytime);
		String str = null;
		str = codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
		System.out.println(str);
		JsonParser parser = new JsonParser(); // 创建JSON解析器
		try {
			if(str != ""){
				JsonObject object = (JsonObject) parser.parse(str);
				
				for (int i = 1; i <= object.get("totalPage").getAsInt(); i++) {
					if(i == 50 || i==70 || i==90){
						Thread.sleep(5000);
					}
					str =codingPlatformService.getShenBaoInfoFromCoding(todaytime,String.valueOf(i));
					codingPlatformService.saveAll(str);
				}
			}
			
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
}

package cs.controller.codingPlatform;

import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import cs.common.ICurrentUser;
import cs.service.interfaces.CodingPlatformService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;


@Controller
@RequestMapping(name = "赋码平台", path = "coding")
public class CodingPlatformController {
	private static Logger logger = Logger.getLogger(CodingPlatformController.class);
	@Autowired 
	protected CodingPlatformService codingPlatformService;
	@Autowired
	private ICurrentUser currentUser;
	
	@RequestMapping(value = "/getAccessToken", method = RequestMethod.GET)
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
	@RequestMapping(value = "/getShenBaoInfoAll", method = RequestMethod.GET)
	@ResponseBody
	public void getShenBaoInfoAll(HttpServletRequest request,@RequestParam(required = true) String todaytime,@RequestParam(required = true) String pageIndex) {
		String str = null;
		str = codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
		JsonParser parser = new JsonParser(); // 创建JSON解析器
		try {
			JsonObject object = (JsonObject) parser.parse(str);
			
			for (int i = 1; i <= object.get("totalPage").getAsInt(); i++) {
				str =codingPlatformService.getShenBaoInfoFromCoding(todaytime,String.valueOf(i));
				codingPlatformService.saveAll(str);
			}
		}catch (Exception e) {
			// TODO: handle exception
		}
		
	}
	
	@RequestMapping(value = "/getShenBaoInfoOne", method = RequestMethod.GET)
	@ResponseBody
	public void getShenBaoInfoOne(HttpServletRequest request,@RequestParam(required = true) String todaytime,@RequestParam(required = true) String pageIndex) {
		codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
	}
	
	@SuppressWarnings("deprecation")
	@Scheduled(cron="0 0 1/6 * * ? ")
	public void scheduled() {
		//<0/5 * * * * ? >每5秒
		//<0 0 1/6 * * ? >每6小时
		logger.info("=========>:定时任务开始");
		String pageIndex = "1";
		Date d = new Date();
		String todaytime = String.valueOf(d.getYear())+"-"+String.valueOf(d.getMonth())+"-"+String.valueOf(d.getDay());
		System.out.println(todaytime);
		String str = null;
		str = codingPlatformService.getShenBaoInfoFromCoding(todaytime,pageIndex);
		System.out.println(str);
		JsonParser parser = new JsonParser(); // 创建JSON解析器
		try {
			JsonObject object = (JsonObject) parser.parse(str);
			
			for (int i = 1; i <= object.get("totalPage").getAsInt(); i++) {
				str =codingPlatformService.getShenBaoInfoFromCoding(todaytime,String.valueOf(i));
				codingPlatformService.saveAll(str);
			}
		}catch (Exception e) {
			e.printStackTrace();
		}
		
	}
	
}

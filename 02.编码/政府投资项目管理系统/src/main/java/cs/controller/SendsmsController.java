package cs.controller;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import org.apache.commons.io.IOUtils;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseStatus;
import com.alibaba.fastjson.JSONObject;
import cs.common.ConfigUtil;
import cs.model.ActionResult;
import cs.model.SendMsg;

/**
 * @Description: 发送短信控制层
 * @author: cx
 * @Date：2017年7月11日
 * @version：0.1
 */
@Controller
@RequestMapping(name = "发送短信", path = "sendMsg")
public class SendsmsController {
	@RequestMapping(name="发送单条短信",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public ActionResult sendms(@RequestBody SendMsg sendMsg) throws Exception{
		ActionResult result = new ActionResult();
		//请求地址
		URL url=new URL(ConfigUtil.msgUrl);
		HttpURLConnection connection=(HttpURLConnection) url.openConnection();
		connection.setDoInput(true);
		connection.setDoOutput(true);
		connection.setRequestMethod("POST");
		//设置请求参数/返回信息的格式
		connection.setRequestProperty("Accept", "application/json");
        connection.setRequestProperty("Content-Type", "application/json");
		
		OutputStream os=connection.getOutputStream();
		//请求体
		String soap = "{Pin:'"+ConfigUtil.msgPid+"',mobile:'"+sendMsg.getMobile()+"',content:'"+sendMsg.getContent()+"',formUser:'"+sendMsg.getFromUser()+"'}";
		os.write(soap.getBytes("UTF-8"));
		os.flush();
		InputStream is=connection.getInputStream();
		//将返回的数据转换为java对象
		JSONObject jsStr = JSONObject.parseObject(IOUtils.toString(is));
		result = (ActionResult) JSONObject.toJavaObject(jsStr,ActionResult.class);
		is.close();
		os.close();
		
		return result;
	}
}

package cs.codingPlatform.service.impl;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;
import com.google.gson.JsonArray;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;

import cs.codingPlatform.service.CodingPlatformService;
import cs.common.BasicDataConfig;
import cs.common.HttpClientUtils;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;

@Service
public class CodingPlatformServiceImpl implements CodingPlatformService{
	public String access_token;
	public String GET_ACCESS_TOKEN = "http://203.91.46.83:9016/B/BasicApi/GetAccessToken?appid=" + BasicDataConfig.APPID + "&appsecret=" + BasicDataConfig.APPSECRET;
	
	@SuppressWarnings("rawtypes")
	@Override
	@Transactional
	public String getAccessToken(HttpServletRequest request) {
		String str = HttpClientUtils.getHttpReturn(request, GET_ACCESS_TOKEN);
		Map mapTypes = JSON.parseObject(str);
		if(mapTypes.get("resultCode") != null && (int)mapTypes.get("resultCode") == 1){
			Map map = (Map) mapTypes.get("resultData");
			access_token = (String) map.get("accessToken");
		}
		
		// 更新session
//		HttpSession session = request.getSession(true);
//		session.setAttribute("access_token", access_token);
//		session.setMaxInactiveInterval(7200);

		return access_token;
	}

	@SuppressWarnings("finally")
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfo> getShenBaoInfo(HttpServletRequest request,String  todaytime,String pageIndex) {
		getAccessToken(request);
		String url1 = "http://203.91.46.83:9016/E/GovApi/GetGovernmentProjectData?todaytime="+todaytime+"&pageIndex="+pageIndex+"&Content-Type=application/json";
		String str = "";
        try {
            URL url = new URL(url1);    // 把字符串转换为URL请求地址
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();// 打开连接
            connection.setRequestProperty("authorSecret",BasicDataConfig.AUTHORSECRET);
            connection.setRequestProperty("accessToken",access_token);
            connection.connect();// 连接会话
            // 获取输入流,并指定字符集,如若不指定会有乱码问题
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream() , "utf-8"));
            String line;
            StringBuilder sb = new StringBuilder();
            while ((line = br.readLine()) != null) {// 循环读取流
                sb.append(line);
            }
            br.close();// 关闭流
            connection.disconnect();// 断开连接
            str = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("失败!");
        }
        
        JsonParser parser = new JsonParser(); // 创建JSON解析器
        List<ShenBaoInfo> list = new ArrayList<>();
		try {
			JsonObject object = (JsonObject) parser.parse(str);
			JsonArray array = object.get("resultData").getAsJsonArray();
			if(object.get("resultCode").getAsInt() == 1){
				
				for (int i = 0; i < array.size(); i++) {
					JsonObject subObject = array.get(i).getAsJsonObject();
					ShenBaoInfo entity = new ShenBaoInfo();
					entity.setProjectName(subObject.get("P_NAME").getAsString());
					
					list.add(entity);
				}
			}
			
		}finally {
			return new PageModelDto<>(list,list.size());
		}
		
	}
	
	
}

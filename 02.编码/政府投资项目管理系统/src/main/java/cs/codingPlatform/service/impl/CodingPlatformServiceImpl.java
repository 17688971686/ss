package cs.codingPlatform.service.impl;

import java.util.Map;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.alibaba.fastjson.JSON;

import cs.codingPlatform.service.CodingPlatformService;
import cs.common.BasicDataConfig;
import cs.common.HttpClientUtils;

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
		for (Object obj : mapTypes.keySet()) {
			if (obj.equals("access_token")) {
				access_token = (String) mapTypes.get(obj);
			}
		}

		// 更新session
		HttpSession session = request.getSession(true);
		session.setAttribute("access_token", access_token);
		session.setMaxInactiveInterval(7200);

		return access_token;
	}

	@Override
	@Transactional
	public void getShenBaoInfo(HttpServletRequest request,String  todaytime,String pageIndex) {
		getAccessToken(request);
		String get_shenbaoinfo = "203.91.46.83:9016/E/GovApi/GetGovernmentProjectData?todaytime="+todaytime+"&pageIndex="+pageIndex+"&Content-Type=application/json";
		
		
	}
	
	
}

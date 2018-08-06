package cs.codingPlatform.service;

import javax.servlet.http.HttpServletRequest;

public interface CodingPlatformService {

	String getAccessToken(HttpServletRequest request);

	void getShenBaoInfo(HttpServletRequest request, String todaytime, String pageIndex);

}

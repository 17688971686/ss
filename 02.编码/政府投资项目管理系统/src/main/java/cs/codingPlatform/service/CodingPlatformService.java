package cs.codingPlatform.service;

import javax.servlet.http.HttpServletRequest;

import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;

public interface CodingPlatformService {

	String getAccessToken(HttpServletRequest request);

	PageModelDto<ShenBaoInfo> getShenBaoInfo(HttpServletRequest request, String todaytime, String pageIndex);

}

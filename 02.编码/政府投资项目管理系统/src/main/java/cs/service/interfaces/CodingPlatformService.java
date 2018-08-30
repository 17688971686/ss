package cs.service.interfaces;

import javax.servlet.http.HttpServletRequest;

import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;

public interface CodingPlatformService {

	void saveAll(String str);

	String getShenBaoInfoFromCoding(String todaytime, String pageIndex);

	String getAccessToken();

}

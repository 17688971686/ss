package cs.service.interfaces;

import javax.servlet.http.HttpServletRequest;

import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;

/**
 * @author Administrator
 *赋码项目服务层
 */
public interface CodingPlatformService {

	/**
	 * 保存赋码项目
	 * @param str json数据
	 */
	void saveAll(String str);
	
	/**
	 * 查询赋码项目
	 * @param todaytime 查询截止时间（往前推）
	 * @param pageIndex 页码
	 * @return json字符串
	 */
	String getShenBaoInfoFromCoding(String todaytime, String pageIndex);

	/**
	 * 获取token
	 * @return
	 */
	String getAccessToken();

}

package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.OpinionDto;
import cs.repository.odata.ODataObj;

/**
 * @author Administrator
 * 意见信息服务层
 *
 */
public interface OpinionService {

	/**
	 * seve opinion
	 * @param opinionDto dto
	 */
	void saveUserOpin(OpinionDto opinionDto);

	/**
	 * delete opinions
	 * @param ids id list
	 */
	void deleteOpins(String[] ids);

	void deleteOpin(String id);

	/**
	 * update opinion
	 * @param opinDto dto
	 */
	void editOpin(OpinionDto opinDto);

	/**
	 * get opinion
	 * @param odataObj
	 * @return pagemodel
	 */
	PageModelDto<OpinionDto> getOpin(ODataObj odataObj);
}

package cs.service.interfaces;

import cs.domain.ShenPiItems;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenPiItemsDto;
import cs.repository.odata.ODataObj;

/**
 * @author Administrator
 *审批事项服务层
 */
public interface ShenPiItemsService extends IService<ShenPiItemsDto, ShenPiItems, String> {
	/**
	 * 查询审批事项
	 * @param odataObj
	 * @return
	 */
	public PageModelDto<ShenPiItemsDto> getShenpiItemsOverdue(ODataObj odataObj);

}

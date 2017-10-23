package cs.service.interfaces;

import cs.domain.ShenPiItems;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenPiItemsDto;
import cs.repository.odata.ODataObj;

public interface ShenPiItemsService extends IService<ShenPiItemsDto, ShenPiItems, String> {
	public PageModelDto<ShenPiItemsDto> getShenpiItemsOverdue(ODataObj odataObj);

}

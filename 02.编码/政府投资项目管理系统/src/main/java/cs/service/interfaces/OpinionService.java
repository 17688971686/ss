package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.OpinionDto;
import cs.repository.odata.ODataObj;

public interface OpinionService {

	void saveUserOpin(OpinionDto opinionDto);

	//PageModelDto<OpinionDto> getOpin(ODataObj odataObj);

	void deleteOpins(String[] ids);

	void deleteOpin(String id);

	void editOpin(OpinionDto opinDto);

	PageModelDto<OpinionDto> getOpin(ODataObj odataObj);
}

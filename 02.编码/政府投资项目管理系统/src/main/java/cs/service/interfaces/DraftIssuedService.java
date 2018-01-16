package cs.service.interfaces;

import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;
import cs.repository.odata.ODataObj;

public interface DraftIssuedService extends IService<DraftIssuedDto, DraftIssued, String>{
	

	DraftIssuedDto getDraftByTaskId(String id);

	void createDraft(DraftIssuedDto draftIssuedDto, String id);	
}

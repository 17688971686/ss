package cs.service.interfaces;

import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;

public interface DraftIssuedService extends IService<DraftIssuedDto, DraftIssued, String>{
	void createDraft(DraftIssuedDto draftIssuedDto);	
}

package cs.service.common;

import java.util.List;

import cs.model.DomainDto.BasicDataDto;
import cs.repository.odata.ODataObj;

public interface BasicDataService {
	String getDescriptionById(String id);
	List<BasicDataDto> getByIdentity(String identity);
	List<BasicDataDto> Get();
	void reloadData();
	
}

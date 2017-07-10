package cs.service.common;

import java.util.List;
import cs.domain.BasicData;
import cs.model.DomainDto.BasicDataDto;

public interface BasicDataService {
	String getDescriptionById(String id);
	List<BasicDataDto> getByIdentity(String identity);
	List<BasicDataDto> Get();
	void reloadData();
	
	void createBasicData(BasicDataDto basicDataDto);
	
	void deleteBasicData(String id);
	
	void updateBasicData(BasicDataDto basicDataDto);
	
	BasicData findById(String id);
	
}

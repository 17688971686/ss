package cs.service.common;

import java.util.List;

import cs.model.DomainDto.BasicDataDto;
import cs.repository.odata.ODataObj;

public interface BasicDataService {
	String queryValueById(String id);
	List<BasicDataDto> queryByIdentity(String identity);
	List<BasicDataDto> queryByParentId(String pId);
	
	List<BasicDataDto> Get(ODataObj odataObj);
	String GetDescriptionById(List<BasicDataDto> data,String id);
}

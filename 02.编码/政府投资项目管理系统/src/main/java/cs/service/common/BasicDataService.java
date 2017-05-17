package cs.service.common;

import java.util.List;

import cs.model.management.BasicDataDto;

public interface BasicDataService {
	String queryValueById(String id);
	List<BasicDataDto> queryByIdentity(String identity);
	List<BasicDataDto> queryByParentId(String pId);
	
}

package cs.service.interfaces;

import cs.domain.AgencyServiceMatters;
import cs.model.DomainDto.AgencyServiceMattersDto;

public interface AgencyServiceMattersService extends IService<AgencyServiceMattersDto, AgencyServiceMatters, String>{
	
	//根据名称来查找中介服务事项
	AgencyServiceMatters findAgencyServiceMattersByName(String name);
	//根据代码称来查找中介服务事项
	AgencyServiceMatters findAgencyServiceMattersByCode(String code);
	
	void deleteAgencyServiceMattersCatalogs(String[] ids);

}

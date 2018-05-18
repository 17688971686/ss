package cs.service.impl;

import java.util.List;

import cs.domain.AllocationCapital;
import cs.model.DomainDto.AllocationCapitalDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AllocationCapitalService;

public class AllocationCapitalServiceImpl extends AbstractServiceImpl<AllocationCapitalDto,AllocationCapital,String> 
	implements AllocationCapitalService{

	@Override
	public List<AllocationCapitalDto> findByDto(ODataObj odataObj) {
		return null;
	}
	
}

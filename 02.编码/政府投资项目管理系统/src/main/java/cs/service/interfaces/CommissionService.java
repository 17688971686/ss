package cs.service.interfaces;

import cs.domain.Commission;
import cs.model.DomainDto.CommissionDto;

public interface CommissionService extends IService<CommissionDto, Commission, String>{

	CommissionDto getProxyByTaskId(String id);

	void createProxy(CommissionDto commissionDto, String id);

	void createDatum(CommissionDto commissionDto, String id);

}

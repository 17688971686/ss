package cs.service.framework;

import java.util.List;

import cs.common.Response;
import cs.common.sysResource.SysResourceDto;
import cs.model.DomainDto.SysConfigDto;

public interface SysService {

	List<SysResourceDto> get();
	 Response SysInit();
	 Response SysInitBasicData();
	 
	 SysConfigDto getConfigValue(String configType);
}
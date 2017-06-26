package cs.service.framework;

import java.util.List;

import cs.common.Response;
import cs.common.sysResource.SysResourceDto;
import cs.model.DomainDto.SysConfigDto;

public interface SysService {

	List<SysResourceDto> getSysResources();
	 Response SysInit();
	 Response SysInitBasicData();
	 List<SysConfigDto> getSysConfigs();
	 /**
	  * 创建task签收人
	  * @param sysConfigDto
	  */
	 void createTaskUser(SysConfigDto sysConfigDto);
}
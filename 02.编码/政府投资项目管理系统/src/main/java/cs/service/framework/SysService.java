package cs.service.framework;

import java.util.List;

import cs.common.Response;
import cs.common.sysResource.SysResourceDto;

public interface SysService {

	List<SysResourceDto> get();
	 Response SysInit();
	 Response SysInitBasicData();
}
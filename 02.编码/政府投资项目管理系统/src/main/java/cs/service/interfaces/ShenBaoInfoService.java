package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;

public interface ShenBaoInfoService {
	PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj);
	
	void createShenBaoInfo(ShenBaoInfoDto shenBaoInfoDto);
}

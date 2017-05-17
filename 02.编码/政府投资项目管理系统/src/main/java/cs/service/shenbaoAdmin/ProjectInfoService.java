package cs.service.shenbaoAdmin;

import cs.model.PageModelDto;
import cs.model.management.ProjectInfoDto;
import cs.repository.odata.ODataObj;

public interface ProjectInfoService {
	PageModelDto<ProjectInfoDto> get(ODataObj odataObj);
}

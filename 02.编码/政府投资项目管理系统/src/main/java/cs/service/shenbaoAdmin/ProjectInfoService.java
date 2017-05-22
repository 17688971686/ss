package cs.service.shenbaoAdmin;

import cs.model.PageModelDto;
import cs.model.management.ProjectInfoDto;
import cs.repository.odata.ODataObj;

public interface ProjectInfoService {
	PageModelDto<ProjectInfoDto> get(ODataObj odataObj);
	
	void deleteProjectInfo(String id);

	void deleteProjectInfos(String[] ids);
	
	void updateProjectInfo(ProjectInfoDto projectInfoDto);
	
	void createProjectInfo(ProjectInfoDto projectInfoDto);
}

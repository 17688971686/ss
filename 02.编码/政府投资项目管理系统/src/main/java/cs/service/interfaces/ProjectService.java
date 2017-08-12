package cs.service.interfaces;

import java.util.List;
import cs.domain.Project;
import cs.model.DomainDto.ProjectDto;


public interface ProjectService extends IService<ProjectDto, Project, String> {		
	void updateProjectByIsMonthReport(ProjectDto projectDto);
	
	List<ProjectDto> getProjectByNumber(String number);
	
	void updateVersion(String id,Boolean isLatestVersion);
}

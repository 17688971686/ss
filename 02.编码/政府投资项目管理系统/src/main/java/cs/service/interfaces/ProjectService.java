package cs.service.interfaces;

import java.util.List;
import cs.domain.Project;
import cs.model.DomainDto.ProjectDto;


public interface ProjectService extends IService<ProjectDto, Project, String> {		
	void updateProjectByIsMonthReport(ProjectDto projectDto);
	
	void updateProjectByIsIncludLibrary(String projectId,String str);
	
	List<ProjectDto> getProjectByNumber(String number);
	
	void updateVersion(String id,Boolean isLatestVersion);
	
	void updateProjectByIsIncludLibrary(String projectId,Boolean isIncludLibrary);
}

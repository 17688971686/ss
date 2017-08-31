package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.AssistReview;

public class AssistReviewDto extends AssistReview{
	private ProjectDto projectDto=new ProjectDto();
	private List<MediationUnitDto> mediationUnitDtos=new ArrayList<MediationUnitDto>();
	public ProjectDto getProjectDto() {
		return projectDto;
	}
	public void setProjectDto(ProjectDto projectDto) {
		this.projectDto = projectDto;
	}
	public List<MediationUnitDto> getMediationUnitDtos() {
		return mediationUnitDtos;
	}
	public void setMediationUnitDtos(List<MediationUnitDto> mediationUnitDtos) {
		this.mediationUnitDtos = mediationUnitDtos;
	}
		
}

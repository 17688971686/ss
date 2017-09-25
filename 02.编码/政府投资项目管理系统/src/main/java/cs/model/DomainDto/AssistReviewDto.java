package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.AssistReview;

public class AssistReviewDto extends AssistReview{
	private ProjectDto projectDto=new ProjectDto();
	private List<MediationUnitDto> mediationUnitDtos=new ArrayList<MediationUnitDto>();
	private List<ServiceEvaluationDto> serviceEvaluationDtos=new ArrayList<>();
	private List<SubmitReviewEvaluationDto> submitReviewEvaluationDtos=new ArrayList<>();
	public List<SubmitReviewEvaluationDto> getSubmitReviewEvaluationDtos() {
		return submitReviewEvaluationDtos;
	}
	public void setSubmitReviewEvaluationDtos(List<SubmitReviewEvaluationDto> submitReviewEvaluationDtos) {
		this.submitReviewEvaluationDtos = submitReviewEvaluationDtos;
	}
	public List<ServiceEvaluationDto> getServiceEvaluationDtos() {
		return serviceEvaluationDtos;
	}
	public void setServiceEvaluationDtos(List<ServiceEvaluationDto> serviceEvaluationDtos) {
		this.serviceEvaluationDtos = serviceEvaluationDtos;
	}
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

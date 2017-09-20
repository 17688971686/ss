package cs.service.interfaces;

import cs.domain.AssistReview;
import cs.model.DomainDto.AssistReviewDto;

public interface AssistReviewService extends IService<AssistReviewDto, AssistReview, String>  {
	public AssistReview updateAssistReview(AssistReviewDto dto, String id);

}

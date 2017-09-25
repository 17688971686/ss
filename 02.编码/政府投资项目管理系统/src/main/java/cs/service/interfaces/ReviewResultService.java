package cs.service.interfaces;

import cs.domain.ReviewResult;
import cs.model.DomainDto.ReviewResultDto;

public interface ReviewResultService extends IService<ReviewResultDto, ReviewResult, String>{

	void createReviewResult(ReviewResultDto reviewResultDto, String id);

	ReviewResultDto getReviewResultByTaskId(String id);


}

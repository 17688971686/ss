package cs.service.interfaces;

import cs.domain.AssistReview;
import cs.model.DomainDto.AssistReviewDto;

/**
 * @author Administrator
 *协审活动管理服务层
 */
public interface AssistReviewService extends IService<AssistReviewDto, AssistReview, String>  {
	/**
	 *  更新协审活动
	 * @param dto
	 * @param id
	 * @return
	 */
	public AssistReview updateAssistReview(AssistReviewDto dto, String id);

}

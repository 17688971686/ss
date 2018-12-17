package cs.service.interfaces;

import cs.domain.ReviewResult;
import cs.model.DomainDto.ReviewResultDto;
/**
 * 评审结果服务层
 * @author Administrator
 *
 */
public interface ReviewResultService extends IService<ReviewResultDto, ReviewResult, String>{

	/**
	 * 创建评审结果
	 * @param reviewResultDto
	 * @param id 申报信息ID
	 */
	void createReviewResult(ReviewResultDto reviewResultDto, String id);

	/**
	 * 根据任务ID查询评审结果
	 * @param id
	 * @return
	 */
	ReviewResultDto getReviewResultByTaskId(String id);


}

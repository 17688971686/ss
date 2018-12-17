package cs.service.interfaces;

import cs.domain.Approval;
import cs.model.DomainDto.ApprovalDto;

/**
 * @author Administrator
 *评审报批表服务层
 */
public interface ApprovalService extends IService<ApprovalDto, Approval, String>{


	/**
	 *  创建评审报批表
	 * @param approvalDto
	 */
	void createDraft(ApprovalDto approvalDto);

}

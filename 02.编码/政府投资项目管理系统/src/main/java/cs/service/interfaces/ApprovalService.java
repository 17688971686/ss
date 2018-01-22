package cs.service.interfaces;

import cs.domain.Approval;
import cs.model.DomainDto.ApprovalDto;

public interface ApprovalService extends IService<ApprovalDto, Approval, String>{


	void createDraft(ApprovalDto approvalDto);

}

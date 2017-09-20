package cs.service.interfaces;

import cs.domain.Approval;
import cs.model.DomainDto.ApprovalDto;

public interface ApprovalService extends IService<ApprovalDto, Approval, String>{

	ApprovalDto getDraftByTaskId(String id);

	void createDraft(ApprovalDto approvalDto, String id);

}

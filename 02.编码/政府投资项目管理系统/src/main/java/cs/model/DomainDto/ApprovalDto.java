package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Approval;

public class ApprovalDto extends Approval{
	private List<AttachmentDto> attachmentDtos = new ArrayList<>();

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}
}

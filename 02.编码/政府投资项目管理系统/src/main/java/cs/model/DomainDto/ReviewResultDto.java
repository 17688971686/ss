package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.ReviewResult;

public class ReviewResultDto extends ReviewResult{

	//附件信息
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}
	
	
}

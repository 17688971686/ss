package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.model.DomainDto.AttachmentDto;
@Component
public class AttachmentMapper implements IMapper<AttachmentDto, Attachment>  {
	public  AttachmentDto toDto(Attachment attachment){
		AttachmentDto attachmentDto = new AttachmentDto();
		if(attachment != null){
			attachmentDto.setId(attachment.getId());
			attachmentDto.setComment(attachment.getComment());
			attachmentDto.setName(attachment.getName());
			attachmentDto.setUrl(attachment.getUrl());
			
			attachmentDto.setCreatedBy(attachment.getCreatedBy());
			attachmentDto.setCreatedDate(attachment.getCreatedDate());
			attachmentDto.setModifiedDate(attachment.getModifiedDate());
			attachmentDto.setModifiedBy(attachment.getModifiedBy());
			attachmentDto.setType(attachment.getType());
		}
		return 	attachmentDto;		
	}
	public  Attachment buildEntity(AttachmentDto attachmentDto,Attachment attachment){	
		if(attachmentDto != null&&attachment!=null){
			if(attachment.getId() ==null || attachment.getId().isEmpty()){
				attachment.setId(UUID.randomUUID().toString());
			}
			
			attachment.setComment(attachmentDto.getComment());
			attachment.setName(attachmentDto.getName());
			attachment.setUrl(attachmentDto.getUrl());			
			attachment.setType(attachmentDto.getType());
		}
		return attachment;
	}
}

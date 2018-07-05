package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.model.DomainDto.AttachmentDto;
/**
 * @Description: 附件实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class AttachmentMapper implements IMapper<AttachmentDto, Attachment>  {
	@Override
	public  AttachmentDto toDto(Attachment attachment){
		AttachmentDto attachmentDto = new AttachmentDto();
		if(attachment != null){
			//附件信息
			attachmentDto.setId(attachment.getId());
			attachmentDto.setComment(attachment.getComment());
			attachmentDto.setName(attachment.getName());
			attachmentDto.setUrl(attachment.getUrl());
			attachmentDto.setType(attachment.getType());
			//基础信息
			attachmentDto.setCreatedBy(attachment.getCreatedBy());
			attachmentDto.setCreatedDate(attachment.getCreatedDate());
			attachmentDto.setModifiedDate(attachment.getModifiedDate());
			attachmentDto.setModifiedBy(attachment.getModifiedBy());
			attachmentDto.setItemOrder(attachment.getItemOrder());
			attachmentDto.setBusinessType(attachment.getBusinessType());
		}
		return 	attachmentDto;		
	}
	
	@Override
	public  Attachment buildEntity(AttachmentDto attachmentDto,Attachment attachment){	
		if(attachmentDto != null&&attachment!=null){
			if(attachment.getId() ==null || attachment.getId().isEmpty()){
				attachment.setId(UUID.randomUUID().toString());
			}
			//附件信息
			attachment.setComment(attachmentDto.getComment());
			attachment.setName(attachmentDto.getName());
			attachment.setUrl(attachmentDto.getUrl());			
			attachment.setType(attachmentDto.getType());
			//基础信息
			attachment.setCreatedBy(attachmentDto.getCreatedBy());
			attachment.setCreatedDate(attachmentDto.getCreatedDate());
			attachment.setModifiedDate(attachmentDto.getModifiedDate());
			attachment.setModifiedBy(attachmentDto.getModifiedBy());
			attachment.setItemOrder(attachmentDto.getItemOrder());
			attachment.setBusinessType(attachmentDto.getBusinessType());
		}
		return attachment;
	}
}

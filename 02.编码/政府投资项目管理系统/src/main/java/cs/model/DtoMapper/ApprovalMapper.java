package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Approval;
import cs.domain.Attachment;
import cs.model.DomainDto.ApprovalDto;
import cs.model.DomainDto.AttachmentDto;

/**
 * @Description: 评审报批实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Component
public class ApprovalMapper  implements IMapper<ApprovalDto, Approval>{
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	@Override
	public ApprovalDto toDto(Approval entity) {
		ApprovalDto dto = new ApprovalDto();
		if(dto != null){
			dto.setBeginDate(entity.getBeginDate());
			dto.setCapitalBaoSong(entity.getCapitalBaoSong());
			dto.setConstructionUnit(entity.getConstructionUnit());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setId(entity.getId());
			dto.setItemOrder(entity.getItemOrder());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setProcessRole(entity.getProcessRole());
			dto.setProcessSuggestion_JBR(entity.getProcessSuggestion_JBR());
			dto.setProjectName(entity.getProjectName());
			dto.setProjectNumber(entity.getProjectNumber());
			dto.setUnitName(entity.getUnitName());
			dto.setApprovalType(entity.getApprovalType());
			dto.setRelId(entity.getRelId());
			//关联附件
			entity.getAttachments().stream().forEach(x->{
				dto.getAttachmentDtos().add(attachmentMapper.toDto(x));
			});
		}
		
		return dto;
	}

	@Override
	public Approval buildEntity(ApprovalDto dto, Approval entity) {
		// TODO Auto-generated method stub
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setRelId(dto.getRelId());
			entity.setBeginDate(dto.getBeginDate());
			entity.setCapitalBaoSong(dto.getCapitalBaoSong());
			entity.setConstructionUnit(dto.getConstructionUnit());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setProcessRole(dto.getProcessRole());
			entity.setProcessSuggestion_JBR(dto.getProcessSuggestion_JBR());
			entity.setProjectName(dto.getProjectName());
			entity.setProjectNumber(dto.getProjectNumber());
			entity.setUnitName(dto.getUnitName());
			entity.setApprovalType(dto.getApprovalType());
		}
		return entity;
	}

}

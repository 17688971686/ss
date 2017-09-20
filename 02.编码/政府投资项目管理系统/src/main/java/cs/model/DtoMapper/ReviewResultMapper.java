package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Approval;
import cs.domain.Attachment;
import cs.domain.ReviewResult;
import cs.model.DomainDto.ApprovalDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ReviewResultDto;

/**
 * @Description: 评审结果实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月13日
 * @version：0.1
 */
@Component
public class ReviewResultMapper implements IMapper<ReviewResultDto, ReviewResult>{

	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Override
	public ReviewResultDto toDto(ReviewResult entity) {
		// TODO Auto-generated method stub
		ReviewResultDto dto = new ReviewResultDto();
		if(dto != null){
			dto.setApprovalDate(entity.getApprovalDate());
			dto.setApprovalEndDate(entity.getApprovalEndDate());
			dto.setConstructionUnit(entity.getConstructionUnit());
			dto.setId(entity.getId());
			dto.setProjectName(entity.getProjectName());
			dto.setReceiptDate(entity.getReceiptDate());
			dto.setReceiptNumber(entity.getReceiptNumber());
			dto.setRelId(entity.getRelId());
			dto.setProjectInvestSum(entity.getProjectInvestSum());
			dto.setAuthorize(entity.getAuthorize());
			dto.setCut(entity.getCut());
			dto.setRemarks(entity.getRemarks());
			dto.setNuclear(entity.getNuclear());
			
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
			
			//begin#关联信息
			//附件
			entity.getAttachments().stream().forEach(x->{
				dto.getAttachmentDtos().add(attachmentMapper.toDto(x));				
			});
		}
		return dto;
	}

	@Override
	public ReviewResult buildEntity(ReviewResultDto dto, ReviewResult entity) {
		// TODO Auto-generated method stub
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setApprovalDate(dto.getApprovalDate());
			entity.setApprovalEndDate(dto.getApprovalEndDate());
			entity.setConstructionUnit(dto.getConstructionUnit());
			entity.setProjectName(dto.getProjectName());
			entity.setReceiptDate(dto.getReceiptDate());
			entity.setReceiptNumber(dto.getReceiptNumber());
			entity.setRelId(dto.getRelId());
			entity.setProjectInvestSum(dto.getProjectInvestSum());
			entity.setAuthorize(dto.getAuthorize());
			entity.setCut(dto.getCut());
			entity.setRemarks(dto.getRemarks());
			entity.setNuclear(dto.getNuclear());
			
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}

	
}

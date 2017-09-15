package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.Approval;
import cs.domain.ReviewResult;
import cs.model.DomainDto.ApprovalDto;
import cs.model.DomainDto.ReviewResultDto;

/**
 * @Description: 评审结果实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月13日
 * @version：0.1
 */
@Component
public class ReviewResultMapper implements IMapper<ReviewResultDto, ReviewResult>{

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
			
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
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
			
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}

	
}

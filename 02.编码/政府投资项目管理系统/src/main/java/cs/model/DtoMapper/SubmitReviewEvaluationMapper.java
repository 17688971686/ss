package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.domain.SubmitReviewEvaluation;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.SubmitReviewEvaluationDto;
/**
 * @Description: 送审文件内容质量评价实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月13日
 * @version：0.1
 */
@Component
public class SubmitReviewEvaluationMapper implements IMapper<SubmitReviewEvaluationDto, SubmitReviewEvaluation> {
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Override
	public SubmitReviewEvaluationDto toDto(SubmitReviewEvaluation entity) {
		SubmitReviewEvaluationDto dto=new SubmitReviewEvaluationDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setMediationUnitId(entity.getMediationUnitId());
			dto.setRating(entity.getRating());
			dto.setMediationUnitName(entity.getMediationUnitName());
			//基础信息
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
			entity.getAttachments().stream().forEach(x->{
				dto.getAttachmentDtos().add(attachmentMapper.toDto(x));
			});
			
		}
		return dto;
	}

	@Override
	public SubmitReviewEvaluation buildEntity(SubmitReviewEvaluationDto dto, SubmitReviewEvaluation entity) {
		if(dto!=null||entity!=null){
			 if(entity.getId() == null || entity.getId().isEmpty()){
			        entity.setId(UUID.randomUUID().toString());
			      }
			 entity.setMediationUnitId(dto.getMediationUnitId());
			 entity.setRating(dto.getRating());
			 entity.setMediationUnitName(dto.getMediationUnitName());
				//基础信息
			 entity.setCreatedBy(dto.getCreatedBy());
			 entity.setCreatedDate(dto.getCreatedDate());
			 entity.setModifiedBy(dto.getModifiedBy());
			 entity.setModifiedDate(dto.getModifiedDate());
			 entity.setItemOrder(dto.getItemOrder()); 
		
		}		
		return entity;
	}

}

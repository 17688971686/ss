package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.AssistReview;
import cs.domain.MediationUnit;
import cs.domain.ServiceEvaluation;
import cs.domain.SubmitReviewEvaluation;
import cs.model.DomainDto.AssistReviewDto;
import cs.model.DomainDto.MediationUnitDto;
import cs.model.DomainDto.ServiceEvaluationDto;
import cs.model.DomainDto.SubmitReviewEvaluationDto;

@Component
public class AssistReviewMapper implements IMapper<AssistReviewDto, AssistReview> {
	@Autowired
	IMapper<MediationUnitDto, MediationUnit> mediationUnitMapper;
	@Autowired
	IMapper<ServiceEvaluationDto, ServiceEvaluation> serviceEvaluationMapper;
	@Autowired
	IMapper<SubmitReviewEvaluationDto, SubmitReviewEvaluation> submitReviewEvaluationMapper;
	@Override
	public AssistReviewDto toDto(AssistReview entity) {
		AssistReviewDto dto=new  AssistReviewDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setAssistReviewAddress(entity.getAssistReviewAddress());
			dto.setAssistReviewBeginDate(entity.getAssistReviewBeginDate());
			dto.setAssistReviewEndDate(entity.getAssistReviewEndDate());
			dto.setAssistReviewName(entity.getAssistReviewName());
			dto.setComment(entity.getComment());
			dto.setProjectId(entity.getProjectId());
			dto.setServiceComment(entity.getServiceComment());
			dto.setSentComment(entity.getSentComment());
			dto.setIsEvaluation(entity.getIsEvaluation());
			//基础信息
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
			entity.getMediationUnits().stream().forEach(x->{
				dto.getMediationUnitDtos().add(mediationUnitMapper.toDto(x));
			});
			entity.getServiceEvaluation().stream().forEach(x->{
				dto.getServiceEvaluationDtos().add(serviceEvaluationMapper.toDto(x));
			});
			entity.getSubmitReviewEvaluation().stream().forEach(x->{
				dto.getSubmitReviewEvaluationDtos().add(submitReviewEvaluationMapper.toDto(x));
			});
			
		}
		
		return dto;
	}

	@Override
	public AssistReview buildEntity(AssistReviewDto dto, AssistReview entity) {
		if(dto!=null||entity!=null){
			 if(entity.getId() == null || entity.getId().isEmpty()){
			        entity.setId(UUID.randomUUID().toString());
			      }
			 entity.setAssistReviewAddress(dto.getAssistReviewAddress());
			 entity.setAssistReviewBeginDate(dto.getAssistReviewBeginDate());
			 entity.setAssistReviewEndDate(dto.getAssistReviewEndDate());
			 entity.setAssistReviewName(dto.getAssistReviewName());
			 entity.setComment(dto.getComment());
			 entity.setProjectId(dto.getProjectId());
			 entity.setServiceComment(dto.getServiceComment());
			 entity.setSentComment(dto.getSentComment());
			 entity.setIsEvaluation(dto.getIsEvaluation());
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

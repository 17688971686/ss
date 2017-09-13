package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ShenPiItems;
import cs.model.DomainDto.ShenPiItemsDto;

@Component
public class ShenPiItemsMapper implements IMapper<ShenPiItemsDto, ShenPiItems>{

	@Override
	public ShenPiItemsDto toDto(ShenPiItems entity) {
		ShenPiItemsDto dto=new ShenPiItemsDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setShenpiBeginDate(entity.getShenpiBeginDate());
			dto.setShenpiDays(entity.getShenpiDays());
			dto.setShenpiDetails(entity.getShenpiDetails());
			dto.setShenpiName(entity.getShenpiName());
			dto.setShenpiState(entity.getShenpiState());
			dto.setShenpiUnitId(entity.getShenpiUnitId());
			dto.setComment(entity.getComment());
			dto.setProjectId(entity.getProjectId());
			dto.setProjectName(entity.getProjectName());
			dto.setShenpiUnitName(entity.getShenpiUnitName());
			
			//基础信息
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
		}
		return dto;
	}

	@Override
	public ShenPiItems buildEntity(ShenPiItemsDto dto, ShenPiItems entity) {
		if(dto!=null||entity!=null){
			 if(entity.getId() == null || entity.getId().isEmpty()){
			        entity.setId(UUID.randomUUID().toString());
			 }
			 entity.setShenpiBeginDate(dto.getShenpiBeginDate());
			 entity.setShenpiDays(dto.getShenpiDays());
			 entity.setShenpiDetails(dto.getShenpiDetails());
			 entity.setShenpiName(dto.getShenpiName());
			 entity.setShenpiState(dto.getShenpiState());
			 entity.setShenpiUnitId(dto.getShenpiUnitId());
			 entity.setComment(dto.getComment());
			 entity.setProjectId(dto.getProjectId());
			 entity.setProjectName(dto.getProjectName());
			 entity.setShenpiUnitName(dto.getShenpiUnitName());
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

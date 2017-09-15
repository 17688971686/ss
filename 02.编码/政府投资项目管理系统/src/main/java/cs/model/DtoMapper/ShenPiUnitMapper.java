package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ShenPiUnit;
import cs.model.DomainDto.ShenPiUnitDto;

@Component
public class ShenPiUnitMapper implements IMapper<ShenPiUnitDto, ShenPiUnit>{

	@Override
	public ShenPiUnitDto toDto(ShenPiUnit entity) {
		ShenPiUnitDto dto=new ShenPiUnitDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setShenpiUnitName(entity.getShenpiUnitName());
			dto.setShenpiUnitAddress(entity.getShenpiUnitAddress());
			dto.setContacts(entity.getContacts());
			dto.setContactsTel(entity.getContactsTel());
			dto.setEmail(entity.getEmail());
			dto.setFax(entity.getFax());
			dto.setIntroduce(entity.getIntroduce());
			dto.setComment(entity.getComment());
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
	public ShenPiUnit buildEntity(ShenPiUnitDto dto, ShenPiUnit entity) {
		if(dto!=null||entity!=null){
			 if(entity.getId() == null || entity.getId().isEmpty()){
			        entity.setId(UUID.randomUUID().toString());
			 }
			 entity.setShenpiUnitName(dto.getShenpiUnitName());
			 entity.setShenpiUnitAddress(dto.getShenpiUnitAddress());
			 entity.setContacts(dto.getContacts());
			 entity.setContactsTel(dto.getContactsTel());
			 entity.setEmail(dto.getEmail());
			 entity.setFax(dto.getFax());
			 entity.setIntroduce(dto.getIntroduce());
			 entity.setComment(dto.getComment());
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

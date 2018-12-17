package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.MediationUnit;
import cs.model.DomainDto.MediationUnitDto;
/*
 * 中介信息表实体转换
 * 
 */
@Component
public class MediationUnitMapper implements IMapper<MediationUnitDto,MediationUnit> {

	@Override
	public MediationUnitDto toDto(MediationUnit entity) {
		MediationUnitDto dto =new MediationUnitDto();
		if(entity !=null){
			dto.setId(entity.getId());
			dto.setMediationUnitAddress(entity.getMediationUnitAddress());
			dto.setMediationUnitName(entity.getMediationUnitName());
			dto.setComment(entity.getComment());
			dto.setContacts(entity.getContacts());
			dto.setContactsTel(entity.getContactsTel());
			dto.setCredentialsAptitude(entity.getCredentialsAptitude());
			dto.setCredentialsNum(entity.getCredentialsNum());
			dto.setCredentialsType(entity.getCredentialsType());
			dto.setBusinessScope(entity.getBusinessScope());
			//基础信息
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
			
		
		
		}	
		return dto;
	}

	@Override
	public MediationUnit buildEntity(MediationUnitDto dto, MediationUnit entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());			
			}
			entity.setMediationUnitAddress(dto.getMediationUnitAddress());
			entity.setMediationUnitName(dto.getMediationUnitName());
			entity.setComment(dto.getComment());
			entity.setContacts(dto.getContacts());
			entity.setContactsTel(dto.getContactsTel());
			entity.setCredentialsAptitude(dto.getCredentialsAptitude());
			entity.setCredentialsNum(dto.getCredentialsNum());
			entity.setCredentialsType(dto.getCredentialsType());
			entity.setBusinessScope(dto.getBusinessScope());
			//基础信息
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
		
		
		
		}
		return entity;
	}

}

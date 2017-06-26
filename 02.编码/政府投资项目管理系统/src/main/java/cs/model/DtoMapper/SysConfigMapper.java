package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.framework.SysConfig;
import cs.model.DomainDto.SysConfigDto;

@Component
public class SysConfigMapper implements IMapper<SysConfigDto, SysConfig> {

	@Override
	public SysConfigDto toDto(SysConfig entity) {
		SysConfigDto dto=new SysConfigDto();
		dto.setConfigValue(entity.getConfigValue());
		dto.setConfigName(entity.getConfigName());
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setId(entity.getId());
		dto.setItemOrder(entity.getItemOrder());
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setModifiedBy(entity.getModifiedBy());
		dto.setConfigType(entity.getConfigType());

		return dto;
	}

	@Override
	public SysConfig buildEntity(SysConfigDto dto, SysConfig entity) {
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());
		}
		entity.setConfigValue(dto.getConfigValue());
		entity.setConfigName(dto.getConfigName());
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setCreatedDate(dto.getCreatedDate());
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setConfigType(dto.getConfigType());
		return entity;
	}

}

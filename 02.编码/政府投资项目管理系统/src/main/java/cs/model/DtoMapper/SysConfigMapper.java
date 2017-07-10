package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.framework.SysConfig;
import cs.model.DomainDto.SysConfigDto;
/**
 * @Description: 系统配置实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class SysConfigMapper implements IMapper<SysConfigDto, SysConfig> {

	@Override
	public SysConfigDto toDto(SysConfig entity) {
		SysConfigDto dto=new SysConfigDto();
		if(entity != null){
			dto.setId(entity.getId());
			dto.setConfigValue(entity.getConfigValue());
			dto.setConfigName(entity.getConfigName());
			dto.setConfigType(entity.getConfigType());
			//基础信息
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setItemOrder(entity.getItemOrder());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			
		}
		return dto;
	}

	@Override
	public SysConfig buildEntity(SysConfigDto dto, SysConfig entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setConfigType(dto.getConfigType());
			entity.setConfigValue(dto.getConfigValue());
			entity.setConfigName(dto.getConfigName());
			
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
		}
		return entity;
	}

}

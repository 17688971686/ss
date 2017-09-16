package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.Opinion;
import cs.model.DomainDto.OpinionDto;
/**
 * @Description: 意见实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月6日
 * @version：0.1
 */
@Component
public class OpinionMapper implements IMapper<OpinionDto, Opinion>{
	
	@Override
	public OpinionDto toDto(Opinion entity) {
		OpinionDto dto=new OpinionDto();
		if(entity !=null){
			dto.setId(entity.getId());
			dto.setOpinion(entity.getOpinion());
			dto.setRelId(entity.getRelId());
			
			//基础信息
			dto.setCreatedDate(entity.getCreatedDate());		
			dto.setCreatedBy(entity.getCreatedBy());		
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
		}
		return dto;
	}

	@Override
	public Opinion buildEntity(OpinionDto dto, Opinion entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			
			entity.setOpinion(dto.getOpinion());
			//基础信息
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}
}

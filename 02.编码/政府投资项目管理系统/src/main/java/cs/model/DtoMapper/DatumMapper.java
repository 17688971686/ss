package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;
import cs.domain.Datum;
import cs.model.DomainDto.DatumDto;

/**
 * @Description: 评审报批实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Component
public class DatumMapper  implements IMapper<DatumDto, Datum>{

	@Override
	public DatumDto toDto(Datum entity) {
		// TODO Auto-generated method stub
		DatumDto dto = new DatumDto();
		if(dto != null){
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setId(entity.getId());
			dto.setItemOrder(entity.getItemOrder());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setDataName(entity.getDataName());
			dto.setDataNumber(entity.getDataNumber());
		}
		
		return dto;
	}

	@Override
	public Datum buildEntity(DatumDto dto, Datum entity) {
		// TODO Auto-generated method stub
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
//			entity.setModifiedBy(dto.getModifiedBy());
//			entity.setModifiedDate(dto.getModifiedDate());
			entity.setDataName(dto.getDataName());
			entity.setDataNumber(dto.getDataNumber());
		}
		return entity;
	}

}

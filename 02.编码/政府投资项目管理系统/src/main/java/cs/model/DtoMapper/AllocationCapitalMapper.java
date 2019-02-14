package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.AllocationCapital;
import cs.model.DomainDto.AllocationCapitalDto;

/**
 * @Description: 打包类型单位资金实体类与数据库资源转换类
 * @author wxy
 *
 */
@Component
public class AllocationCapitalMapper implements IMapper<AllocationCapitalDto,AllocationCapital>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public AllocationCapitalDto toDto(AllocationCapital entity) {
		AllocationCapitalDto allocationCapitalDto = new AllocationCapitalDto();
		if(entity != null){
			allocationCapitalDto.setId(entity.getId());
			allocationCapitalDto.setUnitId(entity.getUnitId());
			allocationCapitalDto.setUnitName(entity.getUnitName());
			allocationCapitalDto.setCapital_ggys(entity.getCapital_ggys());
			allocationCapitalDto.setCapital_gtzj(entity.getCapital_gtzj());
			allocationCapitalDto.setCapital_ggys_surplus(entity.getCapital_ggys_surplus());
			allocationCapitalDto.setCapital_gtzj_surplus(entity.getCapital_gtzj_surplus());
		}
		return allocationCapitalDto;
	}

	@Override
	public AllocationCapital buildEntity(AllocationCapitalDto dto, AllocationCapital entity) {
		if(dto != null && entity != null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setUnitId(dto.getUnitId());
			entity.setUnitName(dto.getUnitName());
			entity.setCapital_ggys(dto.getCapital_ggys());
			entity.setCapital_gtzj(dto.getCapital_gtzj());
			entity.setCapital_ggys_surplus(dto.getCapital_ggys_surplus());
			entity.setCapital_gtzj_surplus(dto.getCapital_gtzj_surplus());
		}
		return entity;
	}

}

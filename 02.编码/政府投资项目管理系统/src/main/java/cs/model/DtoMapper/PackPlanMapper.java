package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.PackPlan;
import cs.model.DomainDto.PackPlanDto;

/**
 * @Description: 年度打包计划实体类与数据库资源转换类
 * @author Administrator
 *
 */
@Component
public class PackPlanMapper implements IMapper<PackPlanDto, PackPlan>{
	
	@Autowired
	AllocationCapitalMapper allocationCapitalMapper;
	@Autowired
	ShenBaoInfoMapper shenBaoInfoMapper;

	@Override
	public PackPlanDto toDto(PackPlan entity) {
		PackPlanDto packPlanDto = new PackPlanDto();
		if(entity !=null){
			packPlanDto.setId(entity.getId());
			packPlanDto.setYear(entity.getYear());
			packPlanDto.setName(entity.getName());
			packPlanDto.setRemark(entity.getRemark());
			packPlanDto.setTotalMoney(entity.getTotalMoney());
			//基础数据
			packPlanDto.setItemOrder(entity.getItemOrder());
			packPlanDto.setModifiedDate(entity.getModifiedDate());
			packPlanDto.setModifiedBy(entity.getModifiedBy());
			packPlanDto.setCreatedBy(entity.getCreatedBy());
			packPlanDto.setCreatedDate(entity.getCreatedDate());
			//begin#关联信息
			entity.getAllocationCapitals().stream().forEach(x->{
				packPlanDto.getAllocationCapitals().add(allocationCapitalMapper.toDto(x));
			});
			entity.getShenBaoInfos().stream().forEach(x->{
				packPlanDto.getShenBaoInfoDtos().add(shenBaoInfoMapper.toDto(x));
			});
		}
		return packPlanDto;
	}

	@Override
	public PackPlan buildEntity(PackPlanDto dto, PackPlan entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setYear(dto.getYear());
			entity.setName(dto.getName());
			entity.setRemark(dto.getRemark());
			entity.setTotalMoney(dto.getTotalMoney());
			//基础数据
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());		
			entity.setItemOrder(dto.getItemOrder());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			//begin#关联信息：外部根据需要自己创建
		}
		return entity;
	}

}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.Workday;
import cs.model.DomainDto.WorkdayDto;
/**
 * @Description: 日期管理实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月6日
 * @version：0.1
 */
@Component
public class WorkdayMapper implements IMapper<WorkdayDto, Workday>{
	
	@Override
	public WorkdayDto toDto(Workday entity) {
		WorkdayDto dto=new WorkdayDto();
		if(entity !=null){
			dto.setId(entity.getId());
			dto.setStatus(entity.getStatus());
			dto.setRemark(entity.getRemark());
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
	public Workday buildEntity(WorkdayDto dto, Workday entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			
			entity.setStatus(dto.getStatus());
			entity.setRemark(dto.getRemark());
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

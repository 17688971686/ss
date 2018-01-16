package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.AgencyServiceMatters;
import cs.model.DomainDto.AgencyServiceMattersDto;


/**
 * @Description： 中介服务事项实体类与数据库转换类
 * @author： wxy
 * @createDate： 2017年09月14日
 * @version：
 */
@Component
public class AgencyServiceMattersMapper implements IMapper<AgencyServiceMattersDto, AgencyServiceMatters>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public AgencyServiceMattersDto toDto(AgencyServiceMatters entity) {
		AgencyServiceMattersDto agencyServiceMattersDto = new AgencyServiceMattersDto();
		if(entity != null){
			agencyServiceMattersDto.setId(entity.getId());
			agencyServiceMattersDto.setName(entity.getName());
			agencyServiceMattersDto.setCode(entity.getCode());
		}
		return agencyServiceMattersDto;
	}

	@Override
	public AgencyServiceMatters buildEntity(AgencyServiceMattersDto dto, AgencyServiceMatters entity) {
		if(dto != null && entity != null){
			if(entity.getId() == null || entity.getId().trim().isEmpty() ){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
		}
		return entity;
	}

}

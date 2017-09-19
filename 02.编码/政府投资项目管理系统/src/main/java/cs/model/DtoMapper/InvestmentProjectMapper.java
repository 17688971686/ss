package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.InvestmentProject;
import cs.model.DomainDto.InvestmentProjectDto;

/**
 * @Description： 投资项目实体类与数据库资源转换类
 * @author：wxy
 * @createDate： 2017年09月07号
 * @version： 
 */
@Component
public class InvestmentProjectMapper implements IMapper<InvestmentProjectDto, InvestmentProject>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public InvestmentProjectDto toDto(InvestmentProject entity) {
		InvestmentProjectDto investmentProjectDto = new InvestmentProjectDto();
		if(entity != null){
			investmentProjectDto.setId(entity.getId());
			investmentProjectDto.setName(entity.getName());
			investmentProjectDto.setCode(entity.getCode());
			investmentProjectDto.setParentId(entity.getParentId());
			investmentProjectDto.setType(entity.getType());
		}
		return investmentProjectDto;
	}

	@Override
	public InvestmentProject buildEntity(InvestmentProjectDto dto, InvestmentProject entity) {
		if(dto != null && entity != null){
			if(entity.getId() == null || entity.getId().trim().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			if(dto.getParentId() == null ){
				entity.setParentId("");
			}else{
				entity.setParentId(dto.getParentId());
			}
			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
			entity.setType(dto.getType());
		}
		return entity;
	}

}

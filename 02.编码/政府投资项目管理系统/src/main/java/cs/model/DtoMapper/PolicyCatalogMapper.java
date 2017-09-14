package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.PolicyCatalog;
import cs.model.DomainDto.PolicyCatalogDto;

/**
 * @Description： 政策目录实体类与数据库资源转换类
 * @author：wxy
 * @createDate： 2017年09月12号
 * @version： 
 */
@Component
public class PolicyCatalogMapper implements IMapper<PolicyCatalogDto, PolicyCatalog>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public PolicyCatalogDto toDto(PolicyCatalog entity) {
		PolicyCatalogDto policyCatalogDto = new PolicyCatalogDto();
		if(entity != null){
			policyCatalogDto.setId(entity.getId());
			policyCatalogDto.setName(entity.getName());
			policyCatalogDto.setCode(entity.getCode());
			policyCatalogDto.setParentId(entity.getParentId());
		}
		return policyCatalogDto;
	}

	@Override
	public PolicyCatalog buildEntity(PolicyCatalogDto dto, PolicyCatalog entity) {
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
		}
		return entity;
	}

}

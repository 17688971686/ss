package cs.model.DtoMapper;

import com.sn.framework.common.StringUtil;
import cs.common.ICurrentUser;
import cs.domain.framework.AdminResource;
import cs.model.DomainDto.AdminResourceDto;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class AdminResourceMapper implements IMapper<AdminResourceDto, AdminResource> {

	@Autowired
    ICurrentUser currentUser;
	@Autowired
    YearPlanCapitalMapper yearPlanCapitalMapper;
	
	
	@Override
	public AdminResourceDto toDto(AdminResource entity) {
		AdminResourceDto adminResourceDto =new AdminResourceDto();
		adminResourceDto.setCreatedBy(entity.getCreatedBy());
		adminResourceDto.setCreatedDate(entity.getCreatedDate());
		adminResourceDto.setId(entity.getId());
		adminResourceDto.setItemOrder(entity.getItemOrder());
		adminResourceDto.setModifiedBy(entity.getModifiedBy());
		adminResourceDto.setModifiedDate(entity.getCreatedDate());
		adminResourceDto.setName(entity.getName());
		adminResourceDto.setParentId(entity.getParentId());
		adminResourceDto.setPath(entity.getPath());

		return adminResourceDto;
	}

	@Override
	public AdminResource buildEntity(AdminResourceDto dto, AdminResource entity) {
		if(StringUtil.isNotBlank(dto.getId())) {
			entity.setId(dto.getId());
		}
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setCreatedDate(dto.getCreatedDate());
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setName(dto.getName());
		entity.setParentId(dto.getParentId());
		entity.setPath(dto.getPath());
		
		return entity;
	}

}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.PartApprovalMatters;
import cs.model.DomainDto.PartApprovalMattersDto;

/**
 * @Description： 部门审批事项实体类与数据库转换类
 * @author： wxy
 * @createDate： 2017年9月13日
 * @version： 
 */

@Component
public class PartApprovalMattersMapper implements IMapper<PartApprovalMattersDto, PartApprovalMatters>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public PartApprovalMattersDto toDto(PartApprovalMatters entity) {
		PartApprovalMattersDto partApprovalMattersDto = new PartApprovalMattersDto();
		if(entity != null){
			partApprovalMattersDto.setId(entity.getId());
			partApprovalMattersDto.setName(entity.getName());
			partApprovalMattersDto.setCode(entity.getCode());
		}
		
		return partApprovalMattersDto;
	}

	@Override
	public PartApprovalMatters buildEntity(PartApprovalMattersDto dto, PartApprovalMatters entity) {
		if(dto !=null && entity != null){
			if(entity.getId() == null || entity.getId().trim().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setName(dto.getName());
			entity.setCode(dto.getCode());
		}
		return null;
	}

}

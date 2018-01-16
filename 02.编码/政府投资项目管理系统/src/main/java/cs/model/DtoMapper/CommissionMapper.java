package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;
import cs.domain.Commission;
import cs.model.DomainDto.CommissionDto;

/**
 * @Description: 评审报批实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Component
public class CommissionMapper  implements IMapper<CommissionDto, Commission>{

	@Override
	public CommissionDto toDto(Commission entity) {
		// TODO Auto-generated method stub
		CommissionDto dto = new CommissionDto();
		if(dto != null){
			dto.setBeginDate(entity.getBeginDate());
			dto.setCapitalBaoSong(entity.getCapitalBaoSong());
			dto.setConstructionUnit(entity.getConstructionUnit());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setId(entity.getId());
			dto.setItemOrder(entity.getItemOrder());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setProcessRole(entity.getProcessRole());
			dto.setProcessSuggestion_JBR(entity.getProcessSuggestion_JBR());
			dto.setProjectName(entity.getProjectName());
			dto.setUnitName(entity.getUnitName());
			dto.setRelId(entity.getRelId());
			dto.setApprovalType(entity.getApprovalType());
			dto.setContacts(entity.getContacts());
			dto.setDatum(entity.getDatum());
		}
		
		return dto;
	}

	@Override
	public Commission buildEntity(CommissionDto dto, Commission entity) {
		// TODO Auto-generated method stub
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setBeginDate(dto.getBeginDate());
			entity.setCapitalBaoSong(dto.getCapitalBaoSong());
			entity.setConstructionUnit(dto.getConstructionUnit());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
//			entity.setModifiedBy(dto.getModifiedBy());
//			entity.setModifiedDate(dto.getModifiedDate());
			entity.setProcessRole(dto.getProcessRole());
			entity.setProcessSuggestion_JBR(dto.getProcessSuggestion_JBR());
			entity.setProjectName(dto.getProjectName());
			entity.setUnitName(dto.getUnitName());
			entity.setApprovalType(dto.getApprovalType());
			entity.setContacts(dto.getContacts());
		}
		return entity;
	}

}

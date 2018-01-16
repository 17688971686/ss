package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.CreditProjectAnomaly;
import cs.model.DomainDto.CreditProjectAnomalyDto;

/**
 * @Description： 项目异常名录实体类与数据库资源转换类
 * @author： wxy
 * @createDate： 2017年9月5日
 * @version： 
 */
@Component
public class CreditProjectAnomalyMapper implements IMapper<CreditProjectAnomalyDto, CreditProjectAnomaly>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public CreditProjectAnomalyDto toDto(CreditProjectAnomaly entity) {
		CreditProjectAnomalyDto projectAnomalyDto = new CreditProjectAnomalyDto();
		if(entity != null){
			projectAnomalyDto.setId(entity.getId());
			projectAnomalyDto.setProjectName(entity.getProjectName());
			projectAnomalyDto.setProjectNumber(entity.getProjectNumber());
			projectAnomalyDto.setUnitName(entity.getUnitName());
			projectAnomalyDto.setShenbaoDate(entity.getShenbaoDate());
			projectAnomalyDto.setIsIllegalName(entity.getIsIllegalName());
			projectAnomalyDto.setIsBlackList(entity.getIsBlackList());
			projectAnomalyDto.setShenBaoInfoId(entity.getShenBaoInfoId());
		}
		return projectAnomalyDto;
	}

	@Override
	public CreditProjectAnomaly buildEntity(CreditProjectAnomalyDto dto, CreditProjectAnomaly entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setProjectName(dto.getProjectName());
			entity.setProjectNumber(dto.getProjectNumber());
			entity.setUnitName(dto.getUnitName());
			entity.setShenbaoDate(dto.getShenbaoDate());
			entity.setIsIllegalName(dto.getIsIllegalName());
			entity.setIsBlackList(dto.getIsBlackList());
			entity.setShenBaoInfoId(dto.getShenBaoInfoId());
		}
		
		return entity;
	}

}

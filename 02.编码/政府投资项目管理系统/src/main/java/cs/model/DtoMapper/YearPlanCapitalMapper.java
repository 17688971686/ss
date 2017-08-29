package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.YearPlanCapital;
import cs.model.DomainDto.YearPlanCapitalDto;
/**
 * @Description: 年度计划编制信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class YearPlanCapitalMapper implements IMapper<YearPlanCapitalDto, YearPlanCapital> {

	@Autowired
	ICurrentUser currentUser;
	@Override
	public YearPlanCapitalDto toDto(YearPlanCapital entity) {
		YearPlanCapitalDto yearPlanCapitalDto =new YearPlanCapitalDto();
		if(entity !=null){
			yearPlanCapitalDto.setId(entity.getId());
			//资金安排情况
			yearPlanCapitalDto.setCapitalQCZ_ggys(entity.getCapitalQCZ_ggys());		
			yearPlanCapitalDto.setCapitalQCZ_gtzj(entity.getCapitalQCZ_gtzj());
			yearPlanCapitalDto.setCapitalSCZ_gtzj(entity.getCapitalSCZ_gtzj());		
			yearPlanCapitalDto.setCapitalSCZ_ggys(entity.getCapitalSCZ_ggys());
			yearPlanCapitalDto.setCapitalSCZ_zxzj(entity.getCapitalSCZ_zxzj());
			yearPlanCapitalDto.setCapitalSHTZ(entity.getCapitalSHTZ());
			yearPlanCapitalDto.setCapitalZYYS(entity.getCapitalZYYS());
			yearPlanCapitalDto.setCapitalOther(entity.getCapitalOther());
			yearPlanCapitalDto.setCapitalSum(entity.getCapitalSum());
			//关联的申报id
			yearPlanCapitalDto.setShenbaoInfoId(entity.getShenbaoInfoId());
			//基本信息
			yearPlanCapitalDto.setCreatedDate(entity.getCreatedDate());
			yearPlanCapitalDto.setCreatedBy(entity.getCreatedBy());
			yearPlanCapitalDto.setModifiedDate(entity.getModifiedDate());
			yearPlanCapitalDto.setModifiedBy(entity.getModifiedBy());
			yearPlanCapitalDto.setItemOrder(entity.getItemOrder());
		}
		return yearPlanCapitalDto;
	}

	@Override
	public YearPlanCapital buildEntity(YearPlanCapitalDto dto, YearPlanCapital entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//资金安排情况
			entity.setCapitalQCZ_ggys(dto.getCapitalQCZ_ggys());	
			entity.setCapitalQCZ_gtzj(dto.getCapitalQCZ_gtzj());
			entity.setCapitalSCZ_gtzj(dto.getCapitalSCZ_gtzj());		
			entity.setCapitalSCZ_zxzj(dto.getCapitalSCZ_zxzj());
			entity.setCapitalSCZ_ggys(dto.getCapitalSCZ_ggys());
			entity.setCapitalSHTZ(dto.getCapitalSHTZ());
			entity.setCapitalZYYS(dto.getCapitalZYYS());
			entity.setCapitalOther(dto.getCapitalOther());
			entity.setCapitalSum(dto.getCapitalSum());
			//关联的申报id
			entity.setShenbaoInfoId(dto.getShenbaoInfoId());
			//基本信息
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());		
			entity.setCreatedDate(dto.getCreatedDate());		
			entity.setCreatedBy(currentUser.getUserId());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}
}

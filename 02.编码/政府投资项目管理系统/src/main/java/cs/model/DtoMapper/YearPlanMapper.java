package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import cs.common.ICurrentUser;
import cs.domain.YearPlan;
import cs.model.DomainDto.YearPlanDto;
/**
 * @Description: 年度计划信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class YearPlanMapper implements IMapper<YearPlanDto, YearPlan> {

	@Autowired
	ICurrentUser currentUser;
	@Autowired
	YearPlanCapitalMapper yearPlanCapitalMapper;
	@Autowired
	PackPlanMapper packPlanMapper;
	
	
	@Override
	public YearPlanDto toDto(YearPlan entity) {
		YearPlanDto yearPlanDto =new YearPlanDto();
		if(entity !=null){
			yearPlanDto.setId(entity.getId());
			yearPlanDto.setYear(entity.getYear());
			yearPlanDto.setName(entity.getName());
			yearPlanDto.setRemark(entity.getRemark());
			yearPlanDto.setTotalMoney(entity.getTotalMoney());
			//基础数据
			yearPlanDto.setItemOrder(entity.getItemOrder());
			yearPlanDto.setModifiedDate(entity.getModifiedDate());
			yearPlanDto.setModifiedBy(entity.getModifiedBy());
			yearPlanDto.setCreatedBy(entity.getCreatedBy());
			yearPlanDto.setCreatedDate(entity.getCreatedDate());
			//begin#关联信息
			entity.getYearPlanCapitals().stream().forEach(x->{
				yearPlanDto.getYearPlanCapitalDtos().add(yearPlanCapitalMapper.toDto(x));				
			});
			entity.getPackPlans().stream().forEach(x->{
				yearPlanDto.getPackPlanDtos().add(packPlanMapper.toDto(x));
			});
		}
		return yearPlanDto;
	}

	@Override
	public YearPlan buildEntity(YearPlanDto dto, YearPlan entity) {
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

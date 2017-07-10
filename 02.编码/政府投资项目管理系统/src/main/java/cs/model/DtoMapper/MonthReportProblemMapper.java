package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.MonthReportProblem;
import cs.model.DomainDto.MonthReportProblemDto;
/**
 * @Description: 月报问题实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class MonthReportProblemMapper implements IMapper<MonthReportProblemDto, MonthReportProblem>{
	@Override
	public MonthReportProblemDto toDto(MonthReportProblem monthReportProblem){
		MonthReportProblemDto monthReportProblemDto = new MonthReportProblemDto();
		if(monthReportProblem != null){
			//月报问题信息
			monthReportProblemDto.setId(monthReportProblem.getId());
			monthReportProblemDto.setProblemIntroduction(monthReportProblem.getProblemIntroduction());
			monthReportProblemDto.setSolutionsAndSuggest(monthReportProblem.getSolutionsAndSuggest());
			monthReportProblemDto.setRemark(monthReportProblem.getRemark());
			//基础信息
			monthReportProblemDto.setCreatedBy(monthReportProblem.getCreatedBy());
			monthReportProblemDto.setCreatedDate(monthReportProblem.getCreatedDate());
			monthReportProblemDto.setModifiedBy(monthReportProblem.getModifiedBy());
			monthReportProblemDto.setModifiedDate(monthReportProblem.getModifiedDate());
			monthReportProblemDto.setItemOrder(monthReportProblem.getItemOrder());
		}
		return monthReportProblemDto;
	}

	@Override
	public MonthReportProblem buildEntity(MonthReportProblemDto dto, MonthReportProblem entity) {
		if(dto !=null && entity !=null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//月报问题信息
			entity.setProblemIntroduction(dto.getProblemIntroduction());
			entity.setSolutionsAndSuggest(dto.getSolutionsAndSuggest());
			entity.setRemark(dto.getRemark());
			//基础信息
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}
	
	
}

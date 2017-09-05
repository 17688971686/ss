package cs.model.DtoMapper;

import java.text.SimpleDateFormat;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.CreditIllegalName;
import cs.model.DomainDto.CreditIllegalNameDto;
/**
 * @Description: 项目异常名录信息实体类与数据库资源转换类
 * @author: wxy
 * @Date：2017年8月30日
 * @version：
 */
@Component
public class CreditIllegalNameMapper implements IMapper<CreditIllegalNameDto, CreditIllegalName>{

	@Autowired
	ICurrentUser currentUser;
	
	@Override
	public CreditIllegalNameDto toDto(CreditIllegalName entity) {
		CreditIllegalNameDto illegalNameDto = new CreditIllegalNameDto();
		if(entity != null){
			illegalNameDto.setId(entity.getId());
			illegalNameDto.setProjectName(entity.getProjectName());
			illegalNameDto.setProjectNumber(entity.getProjectNumber());
			illegalNameDto.setUnitName(entity.getUnitName());
			illegalNameDto.setShenbaoDate(entity.getShenbaoDate());
			illegalNameDto.setDepartmentName(entity.getDepartmentName());
			illegalNameDto.setDivisionCode(entity.getDivisionCode());
			illegalNameDto.setIllegalType(entity.getIllegalType());
			illegalNameDto.setIllegalLevel(entity.getIllegalLevel());
			illegalNameDto.setIllegalContent(entity.getIllegalContent());
			illegalNameDto.setIllegalDate(entity.getIllegalDate());
			illegalNameDto.setValidityFlag(entity.getValidityFlag());
		}
		return illegalNameDto;
	}

	@Override
	public CreditIllegalName buildEntity(CreditIllegalNameDto dto, CreditIllegalName entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setProjectName(dto.getProjectName());
			entity.setProjectNumber(dto.getProjectNumber());
			entity.setUnitName(dto.getUnitName());
			entity.setShenbaoDate(dto.getShenbaoDate());
			entity.setDepartmentName(dto.getDepartmentName());
			entity.setDivisionCode(dto.getDivisionCode());
			entity.setIllegalType(dto.getIllegalType());
			entity.setIllegalLevel(dto.getIllegalLevel());
			entity.setIllegalContent(dto.getIllegalContent());
			entity.setIllegalDate(dto.getIllegalDate());
			entity.setValidityFlag(dto.getValidityFlag());
		}
		
		return entity;
	}
	

}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.common.ICurrentUser;
import cs.domain.CreditBlackList;
import cs.model.DomainDto.CreditBlackListDto;

/**
 * @description: 信用黑名单实体类与数据库资源转换类
 * @author： wxy
 * @createDate： 2017年9月1日
 * @version：
 */
@Component
public class CreditBlackListMapper implements IMapper<CreditBlackListDto, CreditBlackList>{
	
	@Autowired
	ICurrentUser currentUser;

	@Override
	public CreditBlackListDto toDto(CreditBlackList entity) {
		CreditBlackListDto blackListDto = new CreditBlackListDto();
		if(entity != null){
			blackListDto.setId(entity.getId());
			blackListDto.setProjectName(entity.getProjectName());
			blackListDto.setProjectNumber(entity.getProjectNumber());
			blackListDto.setShenbaoDate(entity.getShenbaoDate());
			blackListDto.setUnitName(entity.getUnitName());
			blackListDto.setEnterpriseName(entity.getEnterpriseName());
			blackListDto.setLegalRepCertType(entity.getLegalRepCertType());
			blackListDto.setLegalRepCertNumber(entity.getLegalRepCertNumber());
			blackListDto.setBlackDate(entity.getBlackDate());
			blackListDto.setBlackReason(entity.getBlackReason());
			blackListDto.setDepartmentName(entity.getDepartmentName());
			blackListDto.setDivisionCode(entity.getDivisionCode());
			blackListDto.setValidityFlag(entity.getValidityFlag());
		}
		
		return blackListDto;
	}

	@Override
	public CreditBlackList buildEntity(CreditBlackListDto dto, CreditBlackList entity) {
		if(dto != null && entity != null){
			if(entity.getId() == null || entity.getId().trim().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setProjectName(dto.getProjectName());
			entity.setProjectNumber(dto.getProjectNumber());
			entity.setShenbaoDate(dto.getShenbaoDate());
			entity.setUnitName(dto.getUnitName());
			entity.setEnterpriseName(dto.getEnterpriseName());
			entity.setLegalRepCertType(dto.getLegalRepCertType());
			entity.setLegalRepCertNumber(dto.getLegalRepCertNumber());
			entity.setBlackDate(dto.getBlackDate());
			entity.setBlackReason(dto.getBlackReason());
			entity.setDepartmentName(dto.getDepartmentName());
			entity.setDivisionCode(dto.getDivisionCode());
			entity.setValidityFlag(dto.getValidityFlag());
		}
		return entity;
	}


}

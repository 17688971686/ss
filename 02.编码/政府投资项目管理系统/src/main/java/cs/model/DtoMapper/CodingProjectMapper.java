package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.CodingProject;
import cs.domain.DraftIssued;
import cs.model.DomainDto.CodingProjectDto;
import cs.model.DomainDto.DraftIssuedDto;

/**
 * @Description: 赋码项目实体类与数据库资源转换类
 * @author: wcq
 * @Date：2018年8月29日
 * @version：0.1
 */
@Component
public class CodingProjectMapper  implements IMapper<CodingProjectDto, CodingProject> {

	@Override
	public CodingProjectDto toDto(CodingProject entity) {
		CodingProjectDto dto = new CodingProjectDto();
		if(dto != null){
			dto.setCERTIFICATE_CODE(entity.getCERTIFICATE_CODE());
			dto.setP_CONTACT_NAME(entity.getP_CONTACT_NAME());
			dto.setP_PRINCIPAL_PHONE(entity.getP_PRINCIPAL_PHONE());
			dto.setP_COMPANY(entity.getP_COMPANY());
			dto.setNATIONAL_INDUSTRY_CN(entity.getNATIONAL_INDUSTRY_CN());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setAPPLY_YEAR(entity.getAPPLY_YEAR());
			dto.setP_PRINCIPAL_EMAIL(entity.getP_PRINCIPAL_EMAIL());
			dto.setCONTENT_SCALE(entity.getCONTENT_SCALE());
			dto.setP_PRINCIPAL_QQ(entity.getP_PRINCIPAL_QQ());
			dto.setP_PRINCIPAL(entity.getP_PRINCIPAL());
			dto.setTOTAL_INVEST(entity.getTOTAL_INVEST());
			dto.setCERTIFICATE_TYPE_CN(entity.getCERTIFICATE_TYPE_CN());
			dto.setP_PRINCIPAL_JOB(entity.getP_PRINCIPAL_JOB());
			dto.setNATIONAL_INDUSTRY(entity.getNATIONAL_INDUSTRY());
			dto.setP_PRINCIPAL_WECHAT(entity.getP_PRINCIPAL_WECHAT());
			dto.setINDUSTRY_CN(entity.getINDUSTRY_CN());
			dto.setP_BUILD_TYPE(entity.getP_BUILD_TYPE());
			dto.setDETAILED_ADDRESS(entity.getDETAILED_ADDRESS());
			dto.setP_CONTACT_PHONE(entity.getP_CONTACT_PHONE());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setINDUSTRY(entity.getINDUSTRY());
			dto.setP_CONTACT_EMAIL(entity.getP_CONTACT_EMAIL());
			dto.setItemOrder(entity.getItemOrder());
			dto.setP_CONTACT_QQ(entity.getP_CONTACT_QQ());
			dto.setP_NAME(entity.getP_NAME());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setId(entity.getId());
			dto.setP_NECESSARY(entity.getP_NECESSARY());
			dto.setBUILD_ADDRESS_DISTRICT(entity.getBUILD_ADDRESS_DISTRICT());
			dto.setBUILD_ADDRESS_STREET(entity.getBUILD_ADDRESS_STREET());
			dto.setP_CONTACT_WECHAT(entity.getP_CONTACT_WECHAT());
			dto.setCERTIFICATE_TYPE(entity.getCERTIFICATE_TYPE());
			dto.setCOUNTRY_CODE(entity.getCOUNTRY_CODE());
			//基础信息
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setItemOrder(entity.getItemOrder());
			
		}
		return dto;
	}

	@Override
	public CodingProject buildEntity(CodingProjectDto dto, CodingProject entity) {
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setCERTIFICATE_CODE(dto.getCERTIFICATE_CODE());
			entity.setP_CONTACT_NAME(dto.getP_CONTACT_NAME());
			entity.setP_PRINCIPAL_PHONE(dto.getP_PRINCIPAL_PHONE());
			entity.setP_COMPANY(dto.getP_COMPANY());
			entity.setNATIONAL_INDUSTRY_CN(dto.getNATIONAL_INDUSTRY_CN());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setAPPLY_YEAR(dto.getAPPLY_YEAR());
			entity.setP_PRINCIPAL_EMAIL(dto.getP_PRINCIPAL_EMAIL());
			entity.setCONTENT_SCALE(dto.getCONTENT_SCALE());
			entity.setP_PRINCIPAL_QQ(dto.getP_PRINCIPAL_QQ());
			entity.setP_PRINCIPAL(dto.getP_PRINCIPAL());
			entity.setTOTAL_INVEST(dto.getTOTAL_INVEST());
			entity.setCERTIFICATE_TYPE_CN(dto.getCERTIFICATE_TYPE_CN());
			entity.setP_PRINCIPAL_JOB(dto.getP_PRINCIPAL_JOB());
			entity.setNATIONAL_INDUSTRY(dto.getNATIONAL_INDUSTRY());
			entity.setP_PRINCIPAL_WECHAT(dto.getP_PRINCIPAL_WECHAT());
			entity.setINDUSTRY_CN(dto.getINDUSTRY_CN());
			entity.setP_BUILD_TYPE(dto.getP_BUILD_TYPE());
			entity.setDETAILED_ADDRESS(dto.getDETAILED_ADDRESS());
			entity.setP_CONTACT_PHONE(dto.getP_CONTACT_PHONE());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setINDUSTRY(dto.getINDUSTRY());
			entity.setP_CONTACT_EMAIL(dto.getP_CONTACT_EMAIL());
			entity.setItemOrder(dto.getItemOrder());
			entity.setP_CONTACT_QQ(dto.getP_CONTACT_QQ());
			entity.setP_NAME(dto.getP_NAME());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setP_NECESSARY(dto.getP_NECESSARY());
			entity.setBUILD_ADDRESS_DISTRICT(dto.getBUILD_ADDRESS_DISTRICT());
			entity.setBUILD_ADDRESS_STREET(dto.getBUILD_ADDRESS_STREET());
			entity.setP_CONTACT_WECHAT(dto.getP_CONTACT_WECHAT());
			entity.setCERTIFICATE_TYPE(dto.getCERTIFICATE_TYPE());
			entity.setCOUNTRY_CODE(dto.getCOUNTRY_CODE());

			//基础信息
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}

}

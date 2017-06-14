package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ShenBaoUnitInfo;
import cs.model.DomainDto.ShenBaoUnitInfoDto;

@Component
public class ShenBaoUnitInfoMapper implements IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> {

	@Override
	public ShenBaoUnitInfoDto toDto(ShenBaoUnitInfo entity) {
		// TODO Auto-generated method stub
		ShenBaoUnitInfoDto shenBaoUnitInfoDto=new ShenBaoUnitInfoDto();
		shenBaoUnitInfoDto.setUnitEmail(entity.getUnitEmail());
		shenBaoUnitInfoDto.setResPersonFax(entity.getResPersonFax());
		shenBaoUnitInfoDto.setResPersonEmail(entity.getResPersonEmail());
		shenBaoUnitInfoDto.setModifiedDate(entity.getModifiedDate());
		shenBaoUnitInfoDto.setModifiedBy(entity.getModifiedBy());
		shenBaoUnitInfoDto.setDivisionId(entity.getDivisionId());
		shenBaoUnitInfoDto.setResPersonTel(entity.getResPersonTel());
		shenBaoUnitInfoDto.setRemark(entity.getRemark());
		shenBaoUnitInfoDto.setContactPersonMobile(entity.getContactPersonMobile());
		shenBaoUnitInfoDto.setUnitProperty(entity.getUnitProperty());
		shenBaoUnitInfoDto.setUnitAddress(entity.getUnitAddress());
		shenBaoUnitInfoDto.setContactPersonEmail(entity.getContactPersonEmail());
		shenBaoUnitInfoDto.setUnitContactPerson(entity.getUnitContactPerson());
		shenBaoUnitInfoDto.setResPersonMobile(entity.getResPersonMobile());
		shenBaoUnitInfoDto.setCreatedBy(entity.getCreatedBy());
		shenBaoUnitInfoDto.setUnitName(entity.getUnitName());
		shenBaoUnitInfoDto.setItemOrder(entity.getItemOrder());
		shenBaoUnitInfoDto.setOrgCode(entity.getOrgCode());
		shenBaoUnitInfoDto.setUnitTel(entity.getUnitTel());
		shenBaoUnitInfoDto.setUnitResPerson(entity.getUnitResPerson());
		shenBaoUnitInfoDto.setContactPersonTel(entity.getContactPersonTel());
		shenBaoUnitInfoDto.setContactPersonFax(entity.getContactPersonFax());
		shenBaoUnitInfoDto.setCreatedDate(entity.getCreatedDate());
		shenBaoUnitInfoDto.setId(entity.getId());
		shenBaoUnitInfoDto.setUnitFax(entity.getUnitFax());

		return shenBaoUnitInfoDto;
	}

	@Override
	public void buildEntity(ShenBaoUnitInfoDto dto, ShenBaoUnitInfo entity) {
		if(dto !=null && entity !=null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}			
			entity.setUnitEmail(dto.getUnitEmail());
			entity.setUnitName(dto.getUnitName());
			entity.setOrgCode(dto.getOrgCode());
			entity.setUnitTel(dto.getUnitTel());
			entity.setUnitFax(dto.getUnitFax());
			entity.setUnitProperty(dto.getUnitProperty());
			entity.setDivisionId(dto.getDivisionId());
			entity.setUnitAddress(dto.getUnitAddress());
			entity.setRemark(dto.getRemark());
			
			entity.setUnitResPerson(dto.getUnitResPerson());
			entity.setResPersonFax(dto.getResPersonFax());
			entity.setResPersonEmail(dto.getResPersonEmail());
			entity.setResPersonTel(dto.getResPersonTel());
			entity.setResPersonMobile(dto.getResPersonMobile());
			entity.setUnitContactPerson(dto.getUnitContactPerson());
			entity.setContactPersonTel(dto.getContactPersonTel());
			entity.setContactPersonFax(dto.getContactPersonFax());
			entity.setContactPersonEmail(dto.getContactPersonEmail());
			entity.setContactPersonMobile(dto.getContactPersonMobile());
					
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
			entity.setCreatedBy(dto.getCreatedBy());	
		}
		
	}

}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ShenBaoUnitInfo;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
/**
 * @Description: 申报单位信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class ShenBaoUnitInfoMapper implements IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> {

	@Override
	public ShenBaoUnitInfoDto toDto(ShenBaoUnitInfo entity) {
		ShenBaoUnitInfoDto shenBaoUnitInfoDto=new ShenBaoUnitInfoDto();
		if(entity != null){
			shenBaoUnitInfoDto.setId(entity.getId());
			//单位信息
			shenBaoUnitInfoDto.setUnitEmail(entity.getUnitEmail());
			shenBaoUnitInfoDto.setUnitName(entity.getUnitName());
			shenBaoUnitInfoDto.setUnitProperty(entity.getUnitProperty());
			shenBaoUnitInfoDto.setOrgCode(entity.getOrgCode());
			shenBaoUnitInfoDto.setUnitTel(entity.getUnitTel());
			shenBaoUnitInfoDto.setUnitFax(entity.getUnitFax());
			shenBaoUnitInfoDto.setDivisionId(entity.getDivisionId());
			shenBaoUnitInfoDto.setUnitAddress(entity.getUnitAddress());		
			shenBaoUnitInfoDto.setRemark(entity.getRemark());
			//负责人信息
			shenBaoUnitInfoDto.setUnitResPerson(entity.getUnitResPerson());
			shenBaoUnitInfoDto.setResPersonMobile(entity.getResPersonMobile());
			shenBaoUnitInfoDto.setResPersonTel(entity.getResPersonTel());
			shenBaoUnitInfoDto.setResPersonFax(entity.getResPersonFax());
			shenBaoUnitInfoDto.setResPersonEmail(entity.getResPersonEmail());
			//联系人信息
			shenBaoUnitInfoDto.setUnitContactPerson(entity.getUnitContactPerson());
			shenBaoUnitInfoDto.setContactPersonMobile(entity.getContactPersonMobile());
			shenBaoUnitInfoDto.setContactPersonEmail(entity.getContactPersonEmail());
			shenBaoUnitInfoDto.setContactPersonTel(entity.getContactPersonTel());
			shenBaoUnitInfoDto.setContactPersonFax(entity.getContactPersonFax());
			//基础数据
			shenBaoUnitInfoDto.setCreatedBy(entity.getCreatedBy());
			shenBaoUnitInfoDto.setModifiedDate(entity.getModifiedDate());
			shenBaoUnitInfoDto.setModifiedBy(entity.getModifiedBy());
			shenBaoUnitInfoDto.setCreatedDate(entity.getCreatedDate());
			shenBaoUnitInfoDto.setItemOrder(entity.getItemOrder());
		}
		return shenBaoUnitInfoDto;
	}

	@Override
	public ShenBaoUnitInfo buildEntity(ShenBaoUnitInfoDto dto, ShenBaoUnitInfo entity) {
		if(dto !=null && entity !=null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//单位基本信息
			entity.setUnitEmail(dto.getUnitEmail());
			entity.setUnitName(dto.getUnitName());
			entity.setOrgCode(dto.getOrgCode());
			entity.setUnitTel(dto.getUnitTel());
			entity.setUnitFax(dto.getUnitFax());
			entity.setUnitProperty(dto.getUnitProperty());
			entity.setDivisionId(dto.getDivisionId());
			entity.setUnitAddress(dto.getUnitAddress());
			entity.setRemark(dto.getRemark());
			//单位联系人和负责人
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
			//基础数据		
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
			entity.setCreatedBy(dto.getCreatedBy());	
		}
		return entity;
		
	}

}

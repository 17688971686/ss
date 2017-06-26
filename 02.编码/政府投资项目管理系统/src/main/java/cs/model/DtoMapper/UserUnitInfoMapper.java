package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;
@Component
public class UserUnitInfoMapper {
	public static UserUnitInfoDto toDto(UserUnitInfo unitInfo) {
		UserUnitInfoDto userUnitInfoDto =new UserUnitInfoDto();
		if(unitInfo!=null){
			userUnitInfoDto.setUserName(unitInfo.getUserName());
			userUnitInfoDto.setUnitEmail(unitInfo.getUnitEmail());
			userUnitInfoDto.setResPersonFax(unitInfo.getResPersonFax());
			userUnitInfoDto.setResPersonEmail(unitInfo.getResPersonEmail());
			userUnitInfoDto.setModifiedDate(unitInfo.getModifiedDate());
			userUnitInfoDto.setModifiedBy(unitInfo.getModifiedBy());
			userUnitInfoDto.setDivisionId(unitInfo.getDivisionId());
			userUnitInfoDto.setResPersonTel(unitInfo.getResPersonTel());
			userUnitInfoDto.setRemark(unitInfo.getRemark());
			userUnitInfoDto.setContactPersonMobile(unitInfo.getContactPersonMobile());
			userUnitInfoDto.setUnitProperty(unitInfo.getUnitProperty());
			userUnitInfoDto.setUnitAddress(unitInfo.getUnitAddress());
			userUnitInfoDto.setContactPersonEmail(unitInfo.getContactPersonEmail());
			userUnitInfoDto.setUnitContactPerson(unitInfo.getUnitContactPerson());
			userUnitInfoDto.setResPersonMobile(unitInfo.getResPersonMobile());
			userUnitInfoDto.setCreatedBy(unitInfo.getCreatedBy());
			userUnitInfoDto.setUnitName(unitInfo.getUnitName());
			userUnitInfoDto.setItemOrder(unitInfo.getItemOrder());
			userUnitInfoDto.setOrgCode(unitInfo.getOrgCode());
			userUnitInfoDto.setUnitTel(unitInfo.getUnitTel());
			userUnitInfoDto.setUnitResPerson(unitInfo.getUnitResPerson());
			userUnitInfoDto.setContactPersonTel(unitInfo.getContactPersonTel());
			userUnitInfoDto.setContactPersonFax(unitInfo.getContactPersonFax());
			userUnitInfoDto.setCreatedDate(unitInfo.getCreatedDate());
			userUnitInfoDto.setId(unitInfo.getId());
			userUnitInfoDto.setUnitFax(unitInfo.getUnitFax());

		}
		return userUnitInfoDto;
	}
	public static void buildEntity(UserUnitInfoDto unitInfoDto,UserUnitInfo userUnitInfo){
		if(userUnitInfo!=null&&unitInfoDto!=null){
			if(userUnitInfo.getId()==null||userUnitInfo.getId().isEmpty()){
				userUnitInfo.setId(UUID.randomUUID().toString());
			}
			userUnitInfo.setUnitEmail(unitInfoDto.getUnitEmail());
			userUnitInfo.setResPersonFax(unitInfoDto.getResPersonFax());
			userUnitInfo.setResPersonEmail(unitInfoDto.getResPersonEmail());
			userUnitInfo.setModifiedDate(unitInfoDto.getModifiedDate());
			userUnitInfo.setModifiedBy(unitInfoDto.getModifiedBy());
			userUnitInfo.setDivisionId(unitInfoDto.getDivisionId());
			userUnitInfo.setResPersonTel(unitInfoDto.getResPersonTel());
			userUnitInfo.setRemark(unitInfoDto.getRemark());
			userUnitInfo.setContactPersonMobile(unitInfoDto.getContactPersonMobile());
			userUnitInfo.setUnitProperty(unitInfoDto.getUnitProperty());
			userUnitInfo.setUnitAddress(unitInfoDto.getUnitAddress());
			userUnitInfo.setContactPersonEmail(unitInfoDto.getContactPersonEmail());
			userUnitInfo.setUnitContactPerson(unitInfoDto.getUnitContactPerson());
			userUnitInfo.setResPersonMobile(unitInfoDto.getResPersonMobile());
			userUnitInfo.setUserName(unitInfoDto.getUserName());
			userUnitInfo.setUnitName(unitInfoDto.getUnitName());
			userUnitInfo.setItemOrder(unitInfoDto.getItemOrder());
			userUnitInfo.setOrgCode(unitInfoDto.getOrgCode());
			userUnitInfo.setUnitTel(unitInfoDto.getUnitTel());
			userUnitInfo.setUnitResPerson(unitInfoDto.getUnitResPerson());
			userUnitInfo.setContactPersonTel(unitInfoDto.getContactPersonTel());
			userUnitInfo.setContactPersonFax(unitInfoDto.getContactPersonFax());
			userUnitInfo.setUnitFax(unitInfoDto.getUnitFax());

		}
	}
}

package cs.model.DtoMapper;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;

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
}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.UserUnitInfo;
import cs.model.DomainDto.UserUnitInfoDto;
/**
 * @Description: 用户单位信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class UserUnitInfoMapper implements IMapper<UserUnitInfoDto, UserUnitInfo>{
	public UserUnitInfoDto toDto(UserUnitInfo unitInfo) {
		UserUnitInfoDto userUnitInfoDto =new UserUnitInfoDto();
		if(unitInfo!=null){
			//用户单位基本信息
			userUnitInfoDto.setId(unitInfo.getId());
			userUnitInfoDto.setUnitName(unitInfo.getUnitName());
			userUnitInfoDto.setOrgCode(unitInfo.getOrgCode());
			userUnitInfoDto.setUnitTel(unitInfo.getUnitTel());			
			userUnitInfoDto.setUnitFax(unitInfo.getUnitFax());
			userUnitInfoDto.setUnitEmail(unitInfo.getUnitEmail());
			//常用申报信息
			userUnitInfoDto.setUnitProperty(unitInfo.getUnitProperty());
			userUnitInfoDto.setDivisionId(unitInfo.getDivisionId());
			userUnitInfoDto.setUnitAddress(unitInfo.getUnitAddress());
			userUnitInfoDto.setUnitResPerson(unitInfo.getUnitResPerson());
			userUnitInfoDto.setResPersonTel(unitInfo.getResPersonTel());
			userUnitInfoDto.setResPersonMobile(unitInfo.getResPersonMobile());
			userUnitInfoDto.setResPersonFax(unitInfo.getResPersonFax());
			userUnitInfoDto.setResPersonEmail(unitInfo.getResPersonEmail());
			userUnitInfoDto.setUnitContactPerson(unitInfo.getUnitContactPerson());
			userUnitInfoDto.setContactPersonMobile(unitInfo.getContactPersonMobile());
			userUnitInfoDto.setContactPersonEmail(unitInfo.getContactPersonEmail());
			userUnitInfoDto.setContactPersonTel(unitInfo.getContactPersonTel());
			userUnitInfoDto.setContactPersonFax(unitInfo.getContactPersonFax());
			userUnitInfoDto.setRemark(unitInfo.getRemark());
			//和单位信息关联的用户名			
			userUnitInfoDto.setUserName(unitInfo.getUserName());
			//基础数据			
			userUnitInfoDto.setCreatedBy(unitInfo.getCreatedBy());
			userUnitInfoDto.setCreatedDate(unitInfo.getCreatedDate());
			userUnitInfoDto.setModifiedDate(unitInfo.getModifiedDate());
			userUnitInfoDto.setModifiedBy(unitInfo.getModifiedBy());
			userUnitInfoDto.setItemOrder(unitInfo.getItemOrder());

		}
		return userUnitInfoDto;
	}
	public UserUnitInfo buildEntity(UserUnitInfoDto unitInfoDto,UserUnitInfo userUnitInfo){
		if(userUnitInfo!=null&&unitInfoDto!=null){
			//用户单位基本信息
			if(userUnitInfo.getId()==null||userUnitInfo.getId().isEmpty()){
				userUnitInfo.setId(UUID.randomUUID().toString());
			}
			userUnitInfo.setUnitName(unitInfoDto.getUnitName());
			userUnitInfo.setOrgCode(unitInfoDto.getOrgCode());
			userUnitInfo.setUnitEmail(unitInfoDto.getUnitEmail());
			userUnitInfo.setUnitFax(unitInfoDto.getUnitFax());
			userUnitInfo.setUnitTel(unitInfoDto.getUnitTel());
			//常用申报信息
			userUnitInfo.setUnitProperty(unitInfoDto.getUnitProperty());
			userUnitInfo.setDivisionId(unitInfoDto.getDivisionId());
			userUnitInfo.setUnitAddress(unitInfoDto.getUnitAddress());
			userUnitInfo.setUnitResPerson(unitInfoDto.getUnitResPerson());
			userUnitInfo.setResPersonTel(unitInfoDto.getResPersonTel());
			userUnitInfo.setResPersonMobile(unitInfoDto.getResPersonMobile());
			userUnitInfo.setResPersonFax(unitInfoDto.getResPersonFax());
			userUnitInfo.setResPersonEmail(unitInfoDto.getResPersonEmail());
			userUnitInfo.setUnitContactPerson(unitInfoDto.getUnitContactPerson());
			userUnitInfo.setContactPersonMobile(unitInfoDto.getContactPersonMobile());
			userUnitInfo.setContactPersonEmail(unitInfoDto.getContactPersonEmail());
			userUnitInfo.setContactPersonTel(unitInfoDto.getContactPersonTel());
			userUnitInfo.setContactPersonFax(unitInfoDto.getContactPersonFax());						
			userUnitInfo.setRemark(unitInfoDto.getRemark());
			//和单位信息关联的用户名															
			userUnitInfo.setUserName(unitInfoDto.getUserName());
			//基础数据																						
			userUnitInfo.setCreatedBy(unitInfoDto.getCreatedBy());
			userUnitInfo.setCreatedDate(unitInfoDto.getCreatedDate());
			userUnitInfo.setModifiedDate(unitInfoDto.getModifiedDate());
			userUnitInfo.setModifiedBy(unitInfoDto.getModifiedBy());
			userUnitInfo.setItemOrder(unitInfoDto.getItemOrder());
		}
		return userUnitInfo;
	}
}

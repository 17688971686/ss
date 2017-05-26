package cs.model.DtoMapper;

import java.util.UUID;

import cs.domain.UnitInfo;
import cs.model.DomainDto.UnitInfoDto;

public class UnitInfoMapper {
	public static UnitInfoDto toDto(UnitInfo unitInfo) {
		UnitInfoDto unitInfoDto = new UnitInfoDto();
		if (unitInfo != null) {
			unitInfoDto.setId(unitInfo.getId());
			unitInfoDto.setUnitName(unitInfo.getUnitName());// 单位名称
			unitInfoDto.setOrgCode(unitInfo.getOrgCode());// 组织机构代码
			unitInfoDto.setDivisionId(unitInfo.getDivisionId());// 行政区划编号
			unitInfoDto.setQualifiedLeval(unitInfo.getQualifiedLeval());// 资质等级
			unitInfoDto.setUnitTel(unitInfo.getUnitTel());// 电话号码
			unitInfoDto.setUnitEmail(unitInfo.getUnitEmail());// 电子邮箱
			unitInfoDto.setUnitFax(unitInfo.getUnitFax());// 传真号码
			unitInfoDto.setUnitProperty(unitInfo.getUnitProperty());// 单位性质
			unitInfoDto.setUnitAddress(unitInfo.getUnitAddress());// 单位地址
			unitInfoDto.setLegalName(unitInfo.getLegalName());// 法人名称
			unitInfoDto.setLegalTel(unitInfo.getLegalTel());// 法人电话

			unitInfoDto.setUnitResPerson(unitInfo.getUnitResPerson());// 单位负责人名称
			unitInfoDto.setResPersonTel(unitInfo.getResPersonTel());// 负责人电话
			unitInfoDto.setResPersonMobile(unitInfo.getResPersonMobile());// 负责人手机
			unitInfoDto.setResPersonFax(unitInfo.getResPersonFax());// 负责人传真
			unitInfoDto.setResPersonEmail(unitInfo.getResPersonEmail());// 负责人邮箱

			unitInfoDto.setUnitContactPerson(unitInfo.getUnitContactPerson());// 单位联系人名称
			unitInfoDto.setContactPersonMobile(unitInfo.getContactPersonMobile());// 单位联系人手机
			unitInfoDto.setContactPersonEmail(unitInfo.getContactPersonEmail());// 单位联系人邮箱
			unitInfoDto.setContactPersonTel(unitInfo.getContactPersonTel());// 单位联系人电话
			unitInfoDto.setContactPersonFax(unitInfo.getContactPersonFax());// 单位联系人传真

			unitInfoDto.setRemark(unitInfo.getRemark());// 备注
			
		}
		return unitInfoDto;
	}

	public static void buildEntity(UnitInfoDto unitInfoDto,UnitInfo unitInfo){
		if(unitInfoDto != null){
			if(unitInfo.getId() ==null || unitInfo.getId().isEmpty()){
				unitInfo.setId(UUID.randomUUID().toString());
			}		
			unitInfo.setUnitName(unitInfoDto.getUnitName());//单位名称
			unitInfo.setOrgCode(unitInfoDto.getOrgCode());//组织机构代码
			unitInfo.setDivisionId(unitInfoDto.getDivisionId());//行政区划编号
			unitInfo.setQualifiedLeval(unitInfoDto.getQualifiedLeval());//资质等级
			unitInfo.setUnitTel(unitInfoDto.getUnitTel());//电话号码
			unitInfo.setUnitEmail(unitInfoDto.getUnitEmail());//电子邮箱
			unitInfo.setUnitFax(unitInfoDto.getUnitFax());//传真号码
			unitInfo.setUnitProperty(unitInfoDto.getUnitProperty());//单位性质
			unitInfo.setUnitAddress(unitInfoDto.getUnitAddress());//单位地址
			unitInfo.setLegalName(unitInfoDto.getLegalName());//法人名称
			unitInfo.setLegalTel(unitInfoDto.getLegalTel());//法人电话
			
			unitInfo.setUnitResPerson(unitInfoDto.getUnitResPerson());//单位负责人名称
			unitInfo.setResPersonTel(unitInfoDto.getResPersonTel());//负责人电话
			unitInfo.setResPersonMobile(unitInfoDto.getResPersonMobile());//负责人手机
			unitInfo.setResPersonFax(unitInfoDto.getResPersonFax());//负责人传真
			unitInfo.setResPersonEmail(unitInfoDto.getResPersonEmail());//负责人邮箱
			
			unitInfo.setUnitContactPerson(unitInfoDto.getUnitContactPerson());//单位联系人名称
			unitInfo.setContactPersonMobile(unitInfoDto.getContactPersonMobile());//单位联系人手机
			unitInfo.setContactPersonEmail(unitInfoDto.getContactPersonEmail());//单位联系人邮箱
			unitInfo.setContactPersonTel(unitInfoDto.getContactPersonTel());//单位联系人电话
			unitInfo.setContactPersonFax(unitInfoDto.getContactPersonFax());//单位联系人传真
			
			unitInfo.setRemark(unitInfoDto.getRemark());//备注
			
		}
	}
}

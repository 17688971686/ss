package cs.model.DtoMapper;

import cs.domain.BasicData;
import cs.model.DomainDto.BasicDataDto;

public class BasicDataMapper {
	public static  BasicDataDto toDto(BasicData basicData){
		BasicDataDto basicDataDto=new BasicDataDto();
		if(basicData!=null){			
			basicDataDto.setComment(basicData.getComment());
			basicDataDto.setDescription(basicData.getDescription());
			basicDataDto.setCreatedBy(basicData.getCreatedBy());
			basicDataDto.setCreatedDate(basicData.getCreatedDate());
			basicDataDto.setpId(basicData.getpId());
			basicDataDto.setId(basicData.getId());	
			basicDataDto.setItemOrder(basicData.getItemOrder());
			basicDataDto.setIdentity(basicData.getIdentity());
			basicDataDto.setModifiedDate(basicData.getModifiedDate());
			basicDataDto.setModifiedBy(basicData.getModifiedBy());
			basicDataDto.setCanEdit(basicData.getCanEdit());
		}
		return  basicDataDto;
		
	}
	
	public static void buildEntity(BasicDataDto basicDataDto,BasicData basicData){
		if(basicDataDto !=null && basicData !=null){
			basicData.setComment(basicDataDto.getComment());
			basicData.setDescription(basicDataDto.getDescription());
			basicData.setCreatedBy(basicDataDto.getCreatedBy());
			basicData.setCreatedDate(basicDataDto.getCreatedDate());
			basicData.setpId(basicDataDto.getpId());
			basicData.setId(basicDataDto.getId());	
			basicData.setItemOrder(basicDataDto.getItemOrder());
			basicData.setIdentity(basicDataDto.getIdentity());
			basicData.setModifiedDate(basicDataDto.getModifiedDate());
			basicData.setModifiedBy(basicDataDto.getModifiedBy());
			basicData.setCanEdit(basicDataDto.getCanEdit());
		}
	}
}

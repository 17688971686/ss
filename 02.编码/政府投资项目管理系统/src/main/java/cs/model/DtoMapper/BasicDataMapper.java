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
		}
		return  basicDataDto;
		
	}
}

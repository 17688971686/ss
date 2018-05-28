package cs.model.DtoMapper;

import org.springframework.stereotype.Component;

import cs.domain.BasicData;
import cs.model.DomainDto.BasicDataDto;
/**
 * @Description: 基础数据实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class BasicDataMapper {
	public static  BasicDataDto toDto(BasicData basicData){
		BasicDataDto basicDataDto=new BasicDataDto();
		if(basicData!=null){
			//基础数据信息
			basicDataDto.setId(basicData.getId());
			basicDataDto.setComment(basicData.getComment());
			basicDataDto.setCount(basicData.getCount());
			basicDataDto.setDescription(basicData.getDescription());			
			basicDataDto.setpId(basicData.getpId());			
			basicDataDto.setCanEdit(basicData.getCanEdit());			
			basicDataDto.setIdentity(basicData.getIdentity());
			basicDataDto.setDay(basicData.getDay());
			//基础数据
			basicDataDto.setCreatedBy(basicData.getCreatedBy());
			basicDataDto.setCreatedDate(basicData.getCreatedDate());
			basicDataDto.setModifiedDate(basicData.getModifiedDate());
			basicDataDto.setModifiedBy(basicData.getModifiedBy());
			basicDataDto.setItemOrder(basicData.getItemOrder());
			
		}
		return  basicDataDto;
		
	}
	
	public static void buildEntity(BasicDataDto basicDataDto,BasicData basicData){
		if(basicDataDto !=null && basicData !=null){
			//基础数据信息
			basicData.setId(basicDataDto.getId());	
			basicData.setComment(basicDataDto.getComment());
			basicData.setCount(basicDataDto.getCount());
			basicData.setDescription(basicDataDto.getDescription());
			basicData.setCanEdit(basicDataDto.getCanEdit());
			basicData.setpId(basicDataDto.getpId());		
			//基础数据
			basicData.setIdentity(basicDataDto.getIdentity());
			basicData.setCreatedBy(basicDataDto.getCreatedBy());
			basicData.setCreatedDate(basicDataDto.getCreatedDate());
			basicData.setModifiedDate(basicDataDto.getModifiedDate());
			basicData.setModifiedBy(basicDataDto.getModifiedBy());
			basicData.setItemOrder(basicDataDto.getItemOrder());			
		}
	}
}

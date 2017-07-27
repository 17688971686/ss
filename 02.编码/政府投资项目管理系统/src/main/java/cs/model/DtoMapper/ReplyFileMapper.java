package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ReplyFile;
import cs.model.DomainDto.ReplyFileDto;
/**
 * @Description: 批复文件实体与数据库资源转换类
 * @author: cx
 * @Date：2017年7月26日
 * @version：0.1
 */
@Component
public class ReplyFileMapper implements IMapper<ReplyFileDto, ReplyFile> {

	@Override
	public ReplyFileDto toDto(ReplyFile entity) {
		ReplyFileDto dto = new ReplyFileDto();
		if(entity != null){
			//文件信息
			dto.setId(entity.getId());
			dto.setNumber(entity.getNumber());
			//dto.setName(entity.getName());
			dto.setFullName(entity.getFullName());
			dto.setType(entity.getType());
			//基础信息
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
		}
		return dto;
	}

	@Override
	public ReplyFile buildEntity(ReplyFileDto dto, ReplyFile entity) {
		if(dto !=null && entity != null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//文件信息
			entity.setNumber(dto.getNumber());
			//entity.setName(dto.getName());
			entity.setFullName(dto.getFullName());
			entity.setType(dto.getType());
			//基础信息
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}
	
}

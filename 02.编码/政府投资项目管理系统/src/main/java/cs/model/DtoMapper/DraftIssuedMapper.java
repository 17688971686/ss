package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;

/**
 * @Description: 发文拟稿实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class DraftIssuedMapper  implements IMapper<DraftIssuedDto, DraftIssued> {

	@Override
	public DraftIssuedDto toDto(DraftIssued entity) {
		// TODO Auto-generated method stub
		DraftIssuedDto draftIssuedDto = new DraftIssuedDto();
		if(draftIssuedDto != null){
			draftIssuedDto.setCapitalSD(entity.getCapitalSD());
			draftIssuedDto.setCreatedBy(entity.getCreatedBy());
			draftIssuedDto.setCreatedDate(entity.getCreatedDate());
			draftIssuedDto.setDocumentType(entity.getDocumentType());
			draftIssuedDto.setDraftDate(entity.getDraftDate());
			draftIssuedDto.setFileSet(entity.getFileSet());
			draftIssuedDto.setFileType(entity.getFileType());
			draftIssuedDto.setHecretHierarchy(entity.getHecretHierarchy());
			draftIssuedDto.setId(entity.getId());
			draftIssuedDto.setItemOrder(entity.getItemOrder());
			draftIssuedDto.setKeyWord(entity.getKeyWord());
			draftIssuedDto.setModifiedBy(entity.getModifiedBy());
			draftIssuedDto.setModifiedDate(entity.getModifiedDate());
			draftIssuedDto.setOpenType(entity.getOpenType());
			draftIssuedDto.setTitle(entity.getTitle());
			draftIssuedDto.setPostingCategory(entity.getPostingCategory());
			draftIssuedDto.setRelId(entity.getRelId());
		}
		return draftIssuedDto;
	}

	@Override
	public DraftIssued buildEntity(DraftIssuedDto dto, DraftIssued entity) {
		// TODO Auto-generated method stub
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			
			entity.setCapitalSD(dto.getCapitalSD());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setDocumentType(dto.getDocumentType());
			entity.setDraftDate(dto.getDraftDate());
			entity.setFileSet(dto.getFileSet());
			entity.setFileType(dto.getFileType());
			entity.setHecretHierarchy(dto.getHecretHierarchy());
			
			entity.setItemOrder(dto.getItemOrder());
			entity.setKeyWord(dto.getKeyWord());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setOpenType(dto.getOpenType());
			entity.setTitle(dto.getTitle());
			entity.setPostingCategory(dto.getPostingCategory());
		}
		return entity;
	}

}

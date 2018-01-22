package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;

/**
 * @Description: 发文拟稿实体类与数据库资源转换类
 * @author: wcq
 * @Date：2017年9月11日
 * @version：0.1
 */
@Component
public class DraftIssuedMapper  implements IMapper<DraftIssuedDto, DraftIssued> {

	@Override
	public DraftIssuedDto toDto(DraftIssued entity) {
		DraftIssuedDto draftIssuedDto = new DraftIssuedDto();
		if(draftIssuedDto != null){
			draftIssuedDto.setId(entity.getId());
			draftIssuedDto.setTitle(entity.getTitle());
			draftIssuedDto.setRelId(entity.getRelId());
			draftIssuedDto.setCapitalSD(entity.getCapitalSD());
			draftIssuedDto.setDocumentType(entity.getDocumentType());
			draftIssuedDto.setDraftDate(entity.getDraftDate());
			draftIssuedDto.setFileSet(entity.getFileSet());
			draftIssuedDto.setFileType(entity.getFileType());
			draftIssuedDto.setHecretHierarchy(entity.getHecretHierarchy());
			draftIssuedDto.setKeyWord(entity.getKeyWord());
			draftIssuedDto.setOpenType(entity.getOpenType());
			draftIssuedDto.setPostingCategory(entity.getPostingCategory());
			draftIssuedDto.setCapitalTotal(entity.getCapitalTotal());
			draftIssuedDto.setUnitName(entity.getUnitName());
			draftIssuedDto.setUserNameAndUnit(entity.getUserNameAndUnit());
			draftIssuedDto.setCapitalPifU(entity.getCapitalPifU());
			draftIssuedDto.setProjectName(entity.getProjectName());
			draftIssuedDto.setProjectNumber(entity.getProjectNumber());
			//基础信息
			draftIssuedDto.setCreatedBy(entity.getCreatedBy());
			draftIssuedDto.setCreatedDate(entity.getCreatedDate());
			draftIssuedDto.setModifiedBy(entity.getModifiedBy());
			draftIssuedDto.setModifiedDate(entity.getModifiedDate());
			draftIssuedDto.setItemOrder(entity.getItemOrder());
			
		}
		return draftIssuedDto;
	}

	@Override
	public DraftIssued buildEntity(DraftIssuedDto dto, DraftIssued entity) {
		if (dto != null && entity != null) {			
			if(entity.getId() ==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setTitle(dto.getTitle());
			entity.setRelId(dto.getRelId());
			entity.setCapitalSD(dto.getCapitalSD());
			entity.setDocumentType(dto.getDocumentType());
			entity.setDraftDate(dto.getDraftDate());
			entity.setFileSet(dto.getFileSet());
			entity.setFileType(dto.getFileType());
			entity.setHecretHierarchy(dto.getHecretHierarchy());
			entity.setKeyWord(dto.getKeyWord());
			entity.setOpenType(dto.getOpenType());
			entity.setPostingCategory(dto.getPostingCategory());
			entity.setCapitalPifU(dto.getCapitalPifU());
			entity.setCapitalTotal(dto.getCapitalTotal());
			entity.setProjectName(dto.getProjectName());
			entity.setProjectNumber(dto.getProjectNumber());
			entity.setUnitName(dto.getUnitName());
			entity.setUserNameAndUnit(dto.getUserNameAndUnit());
			//基础信息
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setItemOrder(dto.getItemOrder());
		}
		return entity;
	}

}

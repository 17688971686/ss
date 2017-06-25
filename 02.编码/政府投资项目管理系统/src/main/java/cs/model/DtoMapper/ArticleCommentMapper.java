package cs.model.DtoMapper;

import org.springframework.stereotype.Component;

import cs.domain.ArticleComment;
import cs.model.DomainDto.ArticleCommentDto;
@Component
public class ArticleCommentMapper implements IMapper<ArticleCommentDto, ArticleComment> {

	@Override
	public ArticleCommentDto toDto(ArticleComment entity) {
		// TODO Auto-generated method stub
		ArticleCommentDto dto=new ArticleCommentDto();
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setContent(entity.getContent());
		dto.setArticle(entity.getArticle());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setId(entity.getId());
		dto.setItemOrder(entity.getItemOrder());
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setModifiedBy(entity.getModifiedBy());

		
		return dto;
	}

	@Override
	public ArticleComment buildEntity(ArticleCommentDto dto, ArticleComment entity) {
		// TODO Auto-generated method stub
		return null;
	}

	

}

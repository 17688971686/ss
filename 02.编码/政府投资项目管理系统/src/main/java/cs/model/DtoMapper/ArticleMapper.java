package cs.model.DtoMapper;



import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Article;
import cs.domain.ArticleComment;
import cs.domain.Attachment;
import cs.model.DomainDto.ArticleCommentDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.DomainDto.AttachmentDto;
@Component
public class ArticleMapper implements IMapper<ArticleDto,Article> {

	@Autowired
	IMapper<ArticleCommentDto, ArticleComment> articleCommentMapper;
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	@Override
	public ArticleDto toDto(Article entity) {
		// TODO Auto-generated method stub
		ArticleDto dto=new ArticleDto();
		dto.setCreatedBy(entity.getCreatedBy());
		dto.setTitle(entity.getTitle());
		dto.setItemOrder(entity.getItemOrder());
		dto.setModifiedDate(entity.getModifiedDate());
		dto.setModifiedBy(entity.getModifiedBy());
		dto.setSlideImg(entity.getSlideImg());	
		dto.setPreviewImg(entity.getPreviewImg());
		dto.setType(entity.getType());
		dto.setContent(entity.getContent());
		dto.setCreatedDate(entity.getCreatedDate());
		dto.setId(entity.getId());
		
		//begin#关联
		entity.getAttachments().forEach(x->{
			dto.getAttachmentDtos().add(attachmentMapper.toDto(x));
		});
		entity.getArticleComments().forEach(x->{
			dto.getArticleCommentDtos().add(articleCommentMapper.toDto(x));
		});
		
		return dto;
	}

	@Override
	public Article buildEntity(ArticleDto dto, Article entity) {	
		if(entity.getId()==null||entity.getId().isEmpty()){
			entity.setId(UUID.randomUUID().toString());			
		}
		entity.setCreatedBy(dto.getCreatedBy());
		entity.setTitle(dto.getTitle());
		entity.setItemOrder(dto.getItemOrder());
		entity.setModifiedDate(dto.getModifiedDate());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setSlideImg(dto.getSlideImg());	
		entity.setPreviewImg(dto.getPreviewImg());
		entity.setType(dto.getType());
		entity.setContent(dto.getContent());
		entity.setCreatedDate(dto.getCreatedDate());
		
		//begin#关联信息：外部根据需要自己创建
		return entity;
	}

}

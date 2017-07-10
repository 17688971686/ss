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
/**
 * @Description: 文章实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class ArticleMapper implements IMapper<ArticleDto,Article> {
	@Autowired
	IMapper<ArticleCommentDto, ArticleComment> articleCommentMapper;
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	@Override
	public ArticleDto toDto(Article entity) {
		ArticleDto dto=new ArticleDto();
		if(entity !=null){
			//文章信息
			dto.setId(entity.getId());
			dto.setTitle(entity.getTitle());
			dto.setType(entity.getType());
			dto.setContent(entity.getContent());
			dto.setSlideImg(entity.getSlideImg());	
			dto.setPreviewImg(entity.getPreviewImg());		
			//基础信息
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
			
			//begin#关联信息
			//附件
			entity.getAttachments().forEach(x->{
				dto.getAttachmentDtos().add(attachmentMapper.toDto(x));
			});
			//文章评论
			entity.getArticleComments().forEach(x->{
				dto.getArticleCommentDtos().add(articleCommentMapper.toDto(x));
			});
		}	
		return dto;
	}

	@Override
	public Article buildEntity(ArticleDto dto, Article entity) {
		if(dto !=null && entity !=null){
			if(entity.getId()==null||entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());			
			}
			//文章信息
			entity.setTitle(dto.getTitle());
			entity.setSlideImg(dto.getSlideImg());	
			entity.setPreviewImg(dto.getPreviewImg());
			entity.setType(dto.getType());
			entity.setContent(dto.getContent());
			//基础信息
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setItemOrder(dto.getItemOrder());
			//begin#关联信息：外部根据需要自己创建			
		}
		return entity;		
	}
}

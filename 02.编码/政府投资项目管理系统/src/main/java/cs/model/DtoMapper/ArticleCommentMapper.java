package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.stereotype.Component;

import cs.domain.ArticleComment;
import cs.model.DomainDto.ArticleCommentDto;
/**
 * @Description: 文章评论实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class ArticleCommentMapper implements IMapper<ArticleCommentDto, ArticleComment> {
	@Override
	public ArticleCommentDto toDto(ArticleComment entity) {
		ArticleCommentDto dto=new ArticleCommentDto();
		if(entity !=null){
			dto.setId(entity.getId());
			//评论信息
			dto.setContent(entity.getContent());
			//关联信息
			dto.setArticle(entity.getArticle());
			//基础信息
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setItemOrder(entity.getItemOrder());
			
		}		
		return dto;
	}

	@Override
	public ArticleComment buildEntity(ArticleCommentDto dto, ArticleComment entity) {
		if(dto !=null && entity !=null){
			if(entity.getId() == null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			//评论信息
			entity.setContent(dto.getContent());
			//基础信息
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setItemOrder(dto.getItemOrder());
			//begin#关联信息：外部根据需要自己创建
		}
		return entity;
	}

	

}

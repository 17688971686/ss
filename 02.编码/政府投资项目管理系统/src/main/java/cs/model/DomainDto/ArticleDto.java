package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Article;

public class ArticleDto  extends Article {
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	private List<ArticleCommentDto> articleCommentDtos=new ArrayList<>();
	
	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}
	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}
	public List<ArticleCommentDto> getArticleCommentDtos() {
		return articleCommentDtos;
	}
	public void setArticleCommentDtos(List<ArticleCommentDto> articleCommentDtos) {
		this.articleCommentDtos = articleCommentDtos;
	}
}

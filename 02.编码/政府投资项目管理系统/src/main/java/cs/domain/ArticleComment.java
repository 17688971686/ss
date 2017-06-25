package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

/**
 * 文章评论表
 *
 *
 */
@Entity
@Table(name="cs_articleComment")
public class ArticleComment extends BaseEntity {
	@Id	
	private String id;
	
	@ManyToOne
	@JoinColumn(name="article_id",insertable=false,updatable=false)
	private Article article=new Article();
	
	@Column(columnDefinition="varchar(1000) NULL COMMENT '内容'")
	private String content;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public Article getArticle() {
		return article;
	}

	public void setArticle(Article article) {
		this.article = article;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}
}

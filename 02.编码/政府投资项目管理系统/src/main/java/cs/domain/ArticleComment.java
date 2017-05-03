package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;

@Entity
@Table(name="cs_articleComment")
public class ArticleComment extends DomainBase {
	@Id	
	private String id;
	
	@ManyToOne
	@JoinColumn(name="article_id",insertable=false,updatable=false)
	private Article article;
	
	@Column(columnDefinition="varchar(1000) NOT NULL COMMENT '内容'")
	private String content;
}

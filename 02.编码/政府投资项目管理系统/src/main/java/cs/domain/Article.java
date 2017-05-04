package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import javax.persistence.Table;

/**
 * 文章表
 *
 *
 */
@Entity
@Table(name="cs_article")
public class Article extends DomainBase {

	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '标题'")
	private String title;
	@Column(columnDefinition="text COMMENT '内容'")
	private String content;
	
	
	//申报门户：1-通知公告，2-政策法规,3-办事指南,4-常用表格，5-建议反馈	
	@Column(columnDefinition="varchar(255) not NULL COMMENT '类型'")
	private String type;
	
	@Column(columnDefinition="varchar(500)  NULL COMMENT '缩略图'")
	private String previewImg;
	
	//多个附件用；分开
	@Column(columnDefinition="varchar(1000)  NULL COMMENT '附件'")
	private String files;
	
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="article_id",nullable=false)
	private List<ArticleComment> ArticleComments=new ArrayList<>();

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPreviewImg() {
		return previewImg;
	}

	public void setPreviewImg(String previewImg) {
		this.previewImg = previewImg;
	}

	public String getFiles() {
		return files;
	}

	public void setFiles(String files) {
		this.files = files;
	}

	public List<ArticleComment> getArticleComments() {
		return ArticleComments;
	}

	public void setArticleComments(List<ArticleComment> articleComments) {
		ArticleComments = articleComments;
	}
}

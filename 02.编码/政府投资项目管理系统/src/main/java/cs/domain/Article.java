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
 * @Description:文章表 
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_article")
public class Article extends BaseEntity {

	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '标题'")
	private String title;
	@Column(columnDefinition="text COMMENT '内容'")
	private String content;
	
	
	//基础数据
	@Column(columnDefinition="varchar(255) not NULL COMMENT '类型'")
	private String type;
	
	@Column(columnDefinition="varchar(500)  NULL COMMENT '缩略图'")
	private String previewImg;
	
	@Column(columnDefinition="varchar(500)  NULL COMMENT '幻灯图'")
	private String slideImg;
	
	//begin#关联
	@OneToMany(cascade=CascadeType.ALL)
	@JoinColumn(name="article_id",nullable=false)
	private List<ArticleComment> articleComments =new ArrayList<>();

	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
	
	public String getSlideImg() {
		return slideImg;
	}

	public void setSlideImg(String slideImg) {
		this.slideImg = slideImg;
	}

	public List<ArticleComment> getArticleComments() {
		return articleComments;
	}

	public void setArticleComments(List<ArticleComment> articleComments) {
		this.articleComments = articleComments;
	}

	public List<Attachment> getAttachments() {
		return attachments;
	}

	public void setAttachments(List<Attachment> attachments) {
		this.attachments = attachments;
	}


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

}

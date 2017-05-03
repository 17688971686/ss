package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cs_attachment")
public class Attachment {
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '标题'")
	private String name;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT 'url地址'")
	private String url;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '备注'")
	private String comment;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
}

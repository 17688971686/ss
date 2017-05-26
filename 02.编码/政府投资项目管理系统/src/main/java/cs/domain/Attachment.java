package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 附件表
 *
 *
 */
@Entity
@Table(name="cs_attachment")
public class Attachment extends DomainBase{
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255)  COMMENT '标题'")
	private String name;
	@Column(columnDefinition="varchar(255) COMMENT 'url地址'")
	private String url;
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	@Column(columnDefinition="varchar(50) COMMENT '附件类型'")
	private String type;
	
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
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	
	
	
}

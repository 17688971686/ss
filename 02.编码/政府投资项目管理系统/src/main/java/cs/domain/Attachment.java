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
}

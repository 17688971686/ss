package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * 基础数据表
 *
 *
 */
@Entity
@Table(name="cs_basicData")
public class BasicData extends DomainBase {
	@Id	
	private String id;
	
	@Column(columnDefinition="varchar(255) COMMENT '父亲Id'")
	private String pId;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '标识'")
	private String identity;
	
	@Column(columnDefinition="varchar(255)  COMMENT '描述'")
	private String description;
	
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getpId() {
		return pId;
	}

	public void setpId(String pId) {
		this.pId = pId;
	}

	public String getIdentity() {
		return identity;
	}

	public void setIdentity(String identity) {
		this.identity = identity;
	}

	public String getDescription() {
		return description;
	}

	public void setDescription(String description) {
		this.description = description;
	}

	public String getComment() {
		return comment;
	}

	public void setComment(String comment) {
		this.comment = comment;
	}
}

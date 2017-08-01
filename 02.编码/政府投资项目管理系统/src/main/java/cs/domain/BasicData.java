package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 基础数据表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_basicData")
public class BasicData extends BaseEntity {
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
	
	@Column(columnDefinition="int(4)  COMMENT '该行业申报项目数量'")
	private Integer count = 0;//默认为0
	
	@Column(columnDefinition="bit  COMMENT '是否默认可编辑'")
	private Boolean canEdit;

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

	public Boolean getCanEdit() {
		return canEdit;
	}

	public void setCanEdit(Boolean canEdit) {
		this.canEdit = canEdit;
	}

	public Integer getCount() {
		return count;
	}

	public void setCount(Integer count) {
		this.count = count;
	}	
}

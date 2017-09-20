package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 政策目录表
 * @author： wxy
 * @createDate： 2017年09月12日
 * @version： 
 */
@Entity
@Table(name="cs_policyCatalog")
public class PolicyCatalog extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(1024) NULL COMMENT '名称'")
	private String name;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '代码'")
	private String code;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '父节点id'")
	private String parentId;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '政策类型'")
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

	public String getCode() {
		return code;
	}

	public void setCode(String code) {
		this.code = code;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}
	
	
	
}

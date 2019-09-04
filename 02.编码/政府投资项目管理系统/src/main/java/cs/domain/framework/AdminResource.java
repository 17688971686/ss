package cs.domain.framework;

import cs.domain.BaseEntity;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
@Table(name="cs_admin_resource")
public class AdminResource extends BaseEntity {
	@Id	
    @GeneratedValue(generator = "uuid")
    @GenericGenerator(name = "uuid", strategy = "uuid")
	private String id;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '资源名称'")
	private String name;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '路径'")
	private String path;	
	@Column(columnDefinition="varchar(255) COMMENT '父节点'")
	private String parentId;	

	public String getName() {
		return name;
	}

	public void setName(String name) {
		this.name = name;
	}

	public String getPath() {
		return path;
	}

	public void setPath(String path) {
		this.path = path;
	}

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getParentId() {
		return parentId;
	}

	public void setParentId(String parentId) {
		this.parentId = parentId;
	}


}

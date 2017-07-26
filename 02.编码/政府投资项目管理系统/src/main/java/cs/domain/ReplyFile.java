package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 批复文件数据表
 * @author: cx
 * @Date：2017年7月26日
 * @version：0.1
 */
@Entity
@Table(name="cs_replyfile")
public class ReplyFile extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '文号'")
	private String number;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '名称'")
	private Boolean name;
	
	@Column(columnDefinition="varchar(500) NULL COMMENT '全名'")
	private Boolean fullName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '类型'")
	private String type;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getNumber() {
		return number;
	}

	public void setNumber(String number) {
		this.number = number;
	}

	public Boolean getName() {
		return name;
	}

	public void setName(Boolean name) {
		this.name = name;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public Boolean getFullName() {
		return fullName;
	}

	public void setFullName(Boolean fullName) {
		this.fullName = fullName;
	}
	
}

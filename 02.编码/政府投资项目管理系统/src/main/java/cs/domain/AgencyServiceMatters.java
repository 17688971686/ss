package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description： 中介服务事项表
 * @author： wxy
 * @createDate： 2017年09月14日
 * @version：
 */
@Entity
@Table(name="cs_agencyServiceMatters")
public class AgencyServiceMatters extends BaseEntity{
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '名称'")
	private String name;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '代码'")
	private String code;

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
	

}

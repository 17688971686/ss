package cs.domain;

import javax.persistence.Column;
import javax.persistence.Embeddable;

@Embeddable
public class Resource {	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '资源名称'")
	private String name;
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '路径'")
	private String path;	
	@Column(columnDefinition="varchar(255)  COMMENT '请求方式'")
	private String method;

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

	public String getMethod() {
		return method;
	}

	public void setMethod(String method) {
		this.method = method;
	}
		
}

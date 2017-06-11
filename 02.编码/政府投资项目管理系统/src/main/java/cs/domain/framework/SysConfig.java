package cs.domain.framework;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name = "cs_sysConfig")
public class SysConfig {
	@Id
	private String id;
	@Column(columnDefinition = "bit COMMENT '是否已初始化'")
	private boolean isInit;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public boolean isInit() {
		return isInit;
	}
	public void setInit(boolean isInit) {
		this.isInit = isInit;
	}
}

package cs.domain.framework;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

import cs.domain.BaseEntity;
/**
 * @Description: 系统配置表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name = "cs_sysConfig")
public class SysConfig extends BaseEntity {
	@Id
	private String id;
	private String configType;//对应数据字典类型
	private String configName;
	private String configValue;
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getConfigName() {
		return configName;
	}
	public void setConfigName(String configName) {
		this.configName = configName;
	}
	public String getConfigValue() {
		return configValue;
	}
	public void setConfigValue(String configValue) {
		this.configValue = configValue;
	}
	public String getConfigType() {
		return configType;
	}
	public void setConfigType(String configType) {
		this.configType = configType;
	}
}

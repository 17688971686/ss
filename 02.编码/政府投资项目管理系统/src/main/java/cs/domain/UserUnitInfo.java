package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 用户单位信息表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_userUnitInfo")
public class UserUnitInfo extends BaseUnitInfo {
	@Id
	private String id;	
	
	@Column(columnDefinition="varchar(255)  COMMENT '和单位信息关联的用户名'")
	private String userName;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getUserName() {
		return userName;
	}

	public void setUserName(String userName) {
		this.userName = userName;
	}

	
}

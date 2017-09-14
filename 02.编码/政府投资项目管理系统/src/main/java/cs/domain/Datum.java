package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 评审资料表
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Entity
@Table(name="cs_datum")
public class Datum extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '资料名称'")
	private String dataName;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '数量'")
	private String dataNumber;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getDataName() {
		return dataName;
	}

	public void setDataName(String dataName) {
		this.dataName = dataName;
	}

	public String getDataNumber() {
		return dataNumber;
	}

	public void setDataNumber(String dataNumber) {
		this.dataNumber = dataNumber;
	}
	
}

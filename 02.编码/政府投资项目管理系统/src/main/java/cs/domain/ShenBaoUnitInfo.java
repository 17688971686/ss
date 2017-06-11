package cs.domain;


import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 申报单位表
 * 
 *
 */
@Entity
@Table(name="cs_shenBaoUnitInfo")
public class ShenBaoUnitInfo extends BaseUnitInfo{

	@Id
	private String id;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}	
	
	
}

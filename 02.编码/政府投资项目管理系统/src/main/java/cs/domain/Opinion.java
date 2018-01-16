package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;


/**
 * @Description: 意见表
 * @author: wcq
 * @Date：2017年9月6日
 * @version：0.1
 *
 */
@Entity
@Table(name="cs_opinion")
public class Opinion extends BaseEntity{

	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255)  COMMENT '个人意见'")
	private String opinion;
	
	//关联
	@Column(columnDefinition="varchar(255) NULL COMMENT '相关ID'")
	private String relId;
	
	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getOpinion() {
		return opinion;
	}

	public void setOpinion(String opinion) {
		this.opinion = opinion;
	}

	public String getRelId() {
		return relId;
	}

	public void setRelId(String relId) {
		this.relId = relId;
	}
	
}

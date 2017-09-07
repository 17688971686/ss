package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToMany;
import javax.persistence.ManyToOne;
import javax.persistence.OneToMany;
import javax.persistence.Table;


import cs.domain.framework.User;

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

}

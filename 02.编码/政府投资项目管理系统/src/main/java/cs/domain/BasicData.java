package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cs_basicData")
public class BasicData extends DomainBase {
	@Id	
	private String id;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '父亲Id'")
	private String pId;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '标识'")
	private String identity;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '描述'")
	private String desc;
	
	@Column(columnDefinition="varchar(255) NOT NULL COMMENT '备注'")
	private String comment;
}

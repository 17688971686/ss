package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

@Entity
@Table(name="cs_yearPlanCapital")
public class YearPlanCapital {
	@Id
	private String id;
	
	@Column(columnDefinition="varchar(255) NULL COMMENT '申报数据Id'")
	private String shenbaoInfoId;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-公共预算'")
	private Double capitalSCZ_ggys;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-国土资金'")
	private Double capitalSCZ_gtzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-市财政-专项资金'")
	private Double capitalSCZ_zxzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-区财政-公共预算'")
	private Double capitalQCZ_ggys;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-区财政-国土资金'")
	private Double capitalQCZ_gtzj;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-社会投资'")
	private Double capitalSHTZ;
	
	@Column(columnDefinition="double(10,2) NULL COMMENT '资金筹措方案-其它'")
	private Double capitalOther;
}

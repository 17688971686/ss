package cs.domain;

import java.util.ArrayList;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
@Entity
@Table(name="cs_shenBaoInfo")
public class ShenBaoInfo extends BaseProject{
	@Id
	private String id;
	
	//begin#年度计划相关
	@Column(columnDefinition="int NULL COMMENT '计划年度'")
	private Integer planYear;
	@Column(columnDefinition="double(10,2) NULL COMMENT '申请年度投资'")
	private Double applyYearInvest;
	//end#年度计划相关
	
	@OneToOne
	private ShenBaoUnitInfo bianZhiUnitInfo=new ShenBaoUnitInfo();
	@OneToOne
	private ShenBaoUnitInfo shenBaoUnitInfo=new ShenBaoUnitInfo();
	@OneToMany(cascade=CascadeType.ALL)
	private List<Attachment> attachments=new ArrayList<>();
}

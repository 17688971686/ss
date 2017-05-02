package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 问题协调表
 * @author Administrator
 *
 */
@Entity
@Table(name="cs-problemCoordinate")

public class ProblemCoordinate extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(columnDefinition="varchar(225) NOT NULL COMMENT '关联项目代码'")
	private String projectId;
	@Column(columnDefinition="varchar(225) COMMENT '标题'")
	private String problemTitle;
	@Column(columnDefinition="int(4)  COMMENT '问题类型'")
	private String problemType;
	@Column(columnDefinition="varchar(2000) COMMENT '问题描述'")
	private String problemDescribe;
	@Column(columnDefinition="varchar(225) COMMENT '涉及单位名称'")
	private String unitName;
	@Column(columnDefinition="varchar(225)  COMMENT '涉及部门名称'")
	private String deptName;
	@Column(columnDefinition="varchar(5000)  COMMENT '会议记录'")
	private String meetingRecord;
	@Column(columnDefinition="    COMMENT '相关附件'")//类型没有写
	private String relevantAnnex;
	@Column(columnDefinition="int(1)  COMMENT '是否保存'")
	private Integer isSave;
	@Column(columnDefinition="int(11)  COMMENT '排序'")
	private Integer itemOrder;
	@Column(columnDefinition="varchar(225)  COMMENT '备注'")
	private String remark;
	
	
	
}

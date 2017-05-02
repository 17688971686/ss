package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 处理流程记录
 * @author Administrator
 *
 */
@Entity
@Table(name="handleFlowRecord")
public class HandleFlowRecord  extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;//处理流程记录ID
//	@Column(columnDefinition = "int()  NOT NULL  COMMENT '项目编号'")
//	private String projectId;    //------->类型不明确
	@Column(columnDefinition = "varchar(225)  COMMENT '分办人'")
	private String dentifyingBy;
	@Column(columnDefinition = "varchar(225)  COMMENT '处理人'")
	private String auditBy;
	@Column(columnDefinition = "varchar(225)  COMMENT '意见'")
	private String opinion;
	@Column(columnDefinition = "int(4)  COMMENT '操作步骤'")
	private Integer projectStep;
	@Column(columnDefinition = "int(4)  COMMENT '拟稿状态'")
	private Integer drafteStatus;
	
	//意思还不是很明确
	@Column(columnDefinition = "varchar(500)  COMMENT '申报材料不符合要求'")
	private String reportMaterialUndesirable;
	@Column(columnDefinition = "varchar(500)  COMMENT '项目立项依据不充分'")
	private String accordingUndesirable;
	@Column(columnDefinition = "varchar(500)  COMMENT '建设内容不明确'")
	private String contentUndesirable;
	@Column(columnDefinition = "varchar(500)  COMMENT '投资概算及资金来源不合理'")
	private String capitalSourceUndesirable;
	@Column(columnDefinition = "varchar(500)  COMMENT '其他'")
	private String other;
	//
	
	@Column(columnDefinition = "int(1)  COMMENT '是否完成该流转'")
	private Integer isFinish;
	@Column(columnDefinition = "int(1)  COMMENT '是否主办部门'")
	private Integer isHost;
	@Column(columnDefinition = "int(1)  COMMENT '是否是主办人员'")
	private Integer isSponsor;
	@Column(columnDefinition = "int(1)  COMMENT '是否提交'")
	private Integer isSubmit;
	@Column(columnDefinition = "Bigint  COMMENT '前一个流程记录的Id'")
	private long previousHandleFlowId;
	@Column(columnDefinition = "Bigint  COMMENT '下一个流程记录的Id'")
	private long nextHandleFlowId;
	
	@Column(columnDefinition = "int(1)  COMMENT '是否进入年度计划'")
	private Integer isPassed;
	@Column(columnDefinition = "varchar(225)  COMMENT '审计部门'")
	private String auditDepartment;
	@Column(columnDefinition = "int(4)  COMMENT '审计等级'")
	private Integer level;
	@Column(columnDefinition = "int(4)  COMMENT '审计类型'")
	private Integer auditType;
}

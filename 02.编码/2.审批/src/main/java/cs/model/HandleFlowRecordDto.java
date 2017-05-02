package cs.model;

/**
 * 处理流程表
 * @author Administrator
 *
 */

public class HandleFlowRecordDto {

	private long id;//处理流程记录ID
//	private String projectId;    //------->类型不明确	关联上申报的项目
	private String dentifyingBy;//分办人
	private String auditBy;//处理人
	private String opinion;//意见
	private Integer projectStep;//操作步骤
	private Integer drafteStatus;//拟稿状态
	private String reportMaterialUndesirable;//申报材料不符合要求
	private String accordingUndesirable;//项目立项依据不充分
	private String contentUndesirable;//建设内容不明确
	private String capitalSourceUndesirable;//投资概算及资金来源不合理
	private String other;//其他
	private Integer isFinish;//是否完成该流转
	private Integer isHost;//是否主办部门
	private Integer isSponsor;//是否是主办人员
	private Integer isSubmit;//是否提交
	private long previousHandleFlowId;//前一个流程记录的Id
	private long nextHandleFlowId;//一个流程记录的Id
	private Integer isPassed;//是否进入年度计划
	private String auditDepartment;//审计部门
	private Integer level;//审计等级
	private Integer auditType;//审计类型
	
	
	
	
	
}

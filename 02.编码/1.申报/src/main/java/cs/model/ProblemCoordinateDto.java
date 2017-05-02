package cs.model;

/**
 * 问题协调表
 * @author Administrator
 *
 */

public class ProblemCoordinateDto extends BaseDto{

	private long id;
	private String projectId;//关联项目代码
	private String problemTitle;//标题
	private String problemType;//问题类型
	private String problemDescribe;//问题描述
	private String unitName;//涉及单位名称
	private String deptName;//涉及部门名称
	private String meetingRecord;//会议记录
	private String relevantAnnex;//相关附件
	private Integer isSave = 1;//是否保存     1:未保存  0;保存
	private Integer itemOrder;//排序
	private String remark;//备注
}

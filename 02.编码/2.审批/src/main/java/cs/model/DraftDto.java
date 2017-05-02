package cs.model;

import java.util.Date;

/**
 * 拟稿表
 * @author Administrator
 *
 */

public class DraftDto {

	private long id;//拟稿记录ID
//	private String projectId;    //------->类型不明确	
	private String drafter;//拟稿人
	private Integer secretLevel;//秘密等级
	private Integer priorityApplication;//文件缓急程序
	private String fileType;//文件类型
	private String fileTypeTime;//文件类型年份
	private Integer fileTypes;//文件种类
	private Integer postType;//发文种类
	private Integer open_Type;//公开类型
	private Integer isMeeting;//是否上会
	private Integer messageOpen;//信息公开
	private String messageOpenReason;//信息公开理由
	private String mainSending;//主送
	private String copySending;//抄送
	private Integer issuedNumber;//印发份数
	private Date draftedTime;//拟稿时间
	private String subjectName;//主题词
	private String mainSendingDeptNo;//主发送部门编号
	private String copySendingDeptNo;//抄送部门编号
	private String title;//标题
	
}

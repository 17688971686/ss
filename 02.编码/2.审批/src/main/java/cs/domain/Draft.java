package cs.domain;

import java.util.Date;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 拟稿表
 * @author Administrator
 *
 */
@Entity
@Table(name="draft")
public class Draft {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;//拟稿记录ID
	
//	@Column(columnDefinition = "varchar(225)  NOT NULL  COMMENT '项目编号'")
//	private String projectId;    //------->类型不明确
	@Column(columnDefinition = "varchar(225)  COMMENT '拟稿人'")
	private String drafter;
	@Column(columnDefinition = "int(4)  COMMENT '秘密等级'")
	private Integer secretLevel;
	@Column(columnDefinition = "int(4)  COMMENT '文件缓急程序'")
	private Integer priorityApplication;
	@Column(columnDefinition = "varchar(225)  COMMENT '文件类型'")
	private String fileType;
	@Column(columnDefinition = "varchar(225)  COMMENT '文件类型年份'")
	private String fileTypeTime;
	@Column(columnDefinition = "int(4)  COMMENT '文件种类'")
	private Integer fileTypes;
	@Column(columnDefinition = "int(4)  COMMENT '发文种类'")
	private Integer postType;
	@Column(columnDefinition = "int(4)  COMMENT '公开类型'")
	private Integer open_Type;
	@Column(columnDefinition = "int(1)  COMMENT '是否上会'")
	private Integer isMeeting;
	@Column(columnDefinition = "int(1)  COMMENT '信息公开'")
	private Integer messageOpen;
	@Column(columnDefinition = "varchar(500)  COMMENT '信息公开理由'")
	private String messageOpenReason;
	@Column(columnDefinition = "varchar(500)  COMMENT '主送'")
	private String mainSending;
	@Column(columnDefinition = "varchar(500)  COMMENT '抄送'")
	private String copySending;
	@Column(columnDefinition = "int(4)  COMMENT '印发份数'")
	private Integer issuedNumber;
	@Column(columnDefinition = "datetime COMMENT '拟稿时间'")
	private Date draftedTime;
	@Column(columnDefinition = "varchar(500)  COMMENT '主题词'")
	private String subjectName;
	@Column(columnDefinition = "varchar(500)  COMMENT '主发送部门编号'")
	private String mainSendingDeptNo;
	@Column(columnDefinition = "varchar(500)  COMMENT '抄送部门编号'")
	private String copySendingDeptNo;
	@Column(columnDefinition = "varchar(500)  COMMENT '标题'")
	private String title;
}

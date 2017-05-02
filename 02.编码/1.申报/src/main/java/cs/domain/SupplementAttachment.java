package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 上传附件表
 * @author Administrator
 *
 */

@Entity
@Table(name="cs-supplementAttachment")
public class SupplementAttachment extends DomainBase{

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	
	@Column(columnDefinition="varchar(225) NOT NULL COMMENT '项目代码'")
	private String projectId;
	
	@Column(columnDefinition = "varchar(255)  COMMENT '文件名称'")
	private String fileName;
	
	@Column(columnDefinition = "varchar(255)  COMMENT '文件路径'")
	private String physicalFileName;
	
	@Column(columnDefinition = "varchar(255)  COMMENT '文件类型'")
	private Integer fileTypeId;
	
	@Column(columnDefinition = "varchar(255)  COMMENT '备注'")
	private String remark;

	public long getId() {
		return id;
	}

	public void setId(long id) {
		this.id = id;
	}

	public String getProjectId() {
		return projectId;
	}

	public void setProjectId(String projectId) {
		this.projectId = projectId;
	}

	public String getFileName() {
		return fileName;
	}

	public void setFileName(String fileName) {
		this.fileName = fileName;
	}

	public String getPhysicalFileName() {
		return physicalFileName;
	}

	public void setPhysicalFileName(String physicalFileName) {
		this.physicalFileName = physicalFileName;
	}

	public Integer getFileTypeID() {
		return fileTypeId;
	}

	public void setFileTypeID(Integer fileTypeID) {
		this.fileTypeId = fileTypeID;
	}

	public String getRemark() {
		return remark;
	}

	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	
}

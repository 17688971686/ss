package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Project;

public class ProjectDto extends Project {
	
	//basicData描述信息
	//项目阶段
	private String projectStageDesc;
	//项目类型
	private String projectTypeDesc;
	//所属行业
	private String projectIndustryDesc;
	//项目分类
	private String projectClassifyDesc;
	
	//begin#关联信息
	//附件信息
	private List<AttachmentDto> attachmentDto=new ArrayList<>();


	public String getProjectStageDesc() {
		return projectStageDesc;
	}

	public void setProjectStageDesc(String projectStageDesc) {
		this.projectStageDesc = projectStageDesc;
	}

	public String getProjectTypeDesc() {
		return projectTypeDesc;
	}

	public void setProjectTypeDesc(String projectTypeDesc) {
		this.projectTypeDesc = projectTypeDesc;
	}

	public String getProjectIndustryDesc() {
		return projectIndustryDesc;
	}

	public void setProjectIndustryDesc(String projectIndustryDesc) {
		this.projectIndustryDesc = projectIndustryDesc;
	}

	public String getProjectClassifyDesc() {
		return projectClassifyDesc;
	}

	public void setProjectClassifyDesc(String projectClassifyDesc) {
		this.projectClassifyDesc = projectClassifyDesc;
	}

	public List<AttachmentDto> getAttachmentDto() {
		return attachmentDto;
	}

	public void setAttachmentDto(List<AttachmentDto> attachmentDto) {
		this.attachmentDto = attachmentDto;
	}
}

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
	//项目类别
	private String projectCategoryDesc;
	//功能分类科目
	private String projectFunctionClassifyDesc;
	//政府经济分类
	private String projectGoverEconClassifyDesc;
	//所属行业
	private String projectIndustryDesc;
	//项目分类
	private String projectClassifyDesc;
	//资金其他来源类型
	private String capitalOtherTypeDesc;
	
	//begin#关联信息
	//附件信息
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	
	//月报
	private List<MonthReportDto> monthReportDtos=new ArrayList<>();
	
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

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}

	public List<MonthReportDto> getMonthReportDtos() {
		return monthReportDtos;
	}

	public void setMonthReportDtos(List<MonthReportDto> monthReportDtos) {
		this.monthReportDtos = monthReportDtos;
	}

	public String getCapitalOtherTypeDesc() {
		return capitalOtherTypeDesc;
	}

	public void setCapitalOtherTypeDesc(String capitalOtherTypeDesc) {
		this.capitalOtherTypeDesc = capitalOtherTypeDesc;
	}

	public String getProjectCategoryDesc() {
		return projectCategoryDesc;
	}

	public void setProjectCategoryDesc(String projectCategoryDesc) {
		this.projectCategoryDesc = projectCategoryDesc;
	}

	public String getProjectFunctionClassifyDesc() {
		return projectFunctionClassifyDesc;
	}

	public void setProjectFunctionClassifyDesc(String projectFunctionClassifyDesc) {
		this.projectFunctionClassifyDesc = projectFunctionClassifyDesc;
	}

	public String getProjectGoverEconClassifyDesc() {
		return projectGoverEconClassifyDesc;
	}

	public void setProjectGoverEconClassifyDesc(String projectGoverEconClassifyDesc) {
		this.projectGoverEconClassifyDesc = projectGoverEconClassifyDesc;
	}
	
	
		
}

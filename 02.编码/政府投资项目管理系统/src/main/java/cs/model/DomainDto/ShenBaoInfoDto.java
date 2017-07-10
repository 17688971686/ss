package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.ShenBaoInfo;

public class ShenBaoInfoDto extends ShenBaoInfo {
	//项目阶段
	private String projectStageDesc;
	//项目类型
	private String projectTypeDesc;
	//项目类别
	private String projectCategoryDesc;
	//所属行业
	private String projectIndustryDesc;
	//项目分类
	private String projectClassifyDesc;
	//功能科目
	private String functionSubjectsDesc;
	//经济分类科目
	private String econClassSubjectsDesc;
	//项目申报阶段
	private String projectShenBaoStageDesc;
	//项目建设性质
	private String projectConstrCharDesc;
	//资金其他来源类型
	private String capitalOtherTypeDesc;
	
	private ShenBaoUnitInfoDto bianZhiUnitInfoDto=new ShenBaoUnitInfoDto();
	private ShenBaoUnitInfoDto shenBaoUnitInfoDto=new ShenBaoUnitInfoDto();
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	public ShenBaoUnitInfoDto getBianZhiUnitInfoDto() {
		return bianZhiUnitInfoDto;
	}
	public void setBianZhiUnitInfoDto(ShenBaoUnitInfoDto bianZhiUnitInfoDto) {
		this.bianZhiUnitInfoDto = bianZhiUnitInfoDto;
	}
	public ShenBaoUnitInfoDto getShenBaoUnitInfoDto() {
		return shenBaoUnitInfoDto;
	}
	public void setShenBaoUnitInfoDto(ShenBaoUnitInfoDto shenBaoUnitInfoDto) {
		this.shenBaoUnitInfoDto = shenBaoUnitInfoDto;
	}
	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}
	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}	
	public String getProjectShenBaoStageDesc() {
		return projectShenBaoStageDesc;
	}
	public void setProjectShenBaoStageDesc(String projectShenBaoStageDesc) {
		this.projectShenBaoStageDesc = projectShenBaoStageDesc;
	}
	public String getProjectConstrCharDesc() {
		return projectConstrCharDesc;
	}
	public void setProjectConstrCharDesc(String projectConstrCharDesc) {
		this.projectConstrCharDesc = projectConstrCharDesc;
	}
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
	public String getFunctionSubjectsDesc() {
		return functionSubjectsDesc;
	}
	public void setFunctionSubjectsDesc(String functionSubjectsDesc) {
		this.functionSubjectsDesc = functionSubjectsDesc;
	}
	public String getEconClassSubjectsDesc() {
		return econClassSubjectsDesc;
	}
	public void setEconClassSubjectsDesc(String econClassSubjectsDesc) {
		this.econClassSubjectsDesc = econClassSubjectsDesc;
	}	
}

package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.Project;
/**
 * @Description: 项目信息实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class ProjectDto extends Project {

	private boolean notHasType =false;
	//basicData描述信息
	//项目阶段（前期、施工、竣工）
	private String projectStageDesc;
	//项目类型
	private String projectTypeDesc;
	//项目类别
	private String projectCategoryDesc;
	//所属行业
	private String projectIndustryDesc;
	//项目分类
	private String projectClassifyDesc;
	//资金其他来源类型
	private String capitalOtherTypeDesc;
	//项目投资类型（政府投资/社会投资）
	private String projectInvestmentTypeDesc;
	//项目建设区域
	private String divisionIdDesc;

	//修改--申报信息id
	private String shenbaoId;
	private String projectShenBaoStage;
	private String zong_processId;
	
	//begin#关联信息
	//附件信息
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
	
	//月报
	private List<MonthReportDto> monthReportDtos=new ArrayList<>();

	public String getShenbaoId() {
		return shenbaoId;
	}

	public void setShenbaoId(String shenbaoId) {
		this.shenbaoId = shenbaoId;
	}

	public String getProjectShenBaoStage() {
		return projectShenBaoStage;
	}

	public String getZong_processId() {
		return zong_processId;
	}

	public void setZong_processId(String zong_processId) {
		this.zong_processId = zong_processId;
	}

	public void setProjectShenBaoStage(String projectShenBaoStage) {
		this.projectShenBaoStage = projectShenBaoStage;
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
	
	public String getProjectInvestmentTypeDesc() {
		return projectInvestmentTypeDesc;
	}

	public void setProjectInvestmentTypeDesc(String projectInvestmentTypeDesc) {
		this.projectInvestmentTypeDesc = projectInvestmentTypeDesc;
	}

	public String getDivisionIdDesc() {
		return divisionIdDesc;
	}

	public void setDivisionIdDesc(String divisionIdDesc) {
		this.divisionIdDesc = divisionIdDesc;
	}

	public boolean isNotHasType() {
		return notHasType;
	}

	public void setNotHasType(boolean notHasType) {
		this.notHasType = notHasType;
	}
}

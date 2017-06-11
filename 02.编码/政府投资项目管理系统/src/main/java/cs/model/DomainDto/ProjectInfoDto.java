//package cs.model.DomainDto;
//
//import java.math.BigDecimal;
//import java.util.ArrayList;
//import java.util.List;
//
//import cs.domain.MonthReport;
//import cs.domain.ProjectInfo;
//import cs.domain.UnitInfo;
//import cs.model.BaseDto;
//
///**
// * 项目信息实体类
// * @author cx
// * @Date 2017-05-04
// */
//public class ProjectInfoDto extends ProjectInfo{
//	
//	private String projectStageValue;//项目阶段(名称)
//	
//	private String investTypeValue;//投资类型(名称)
//	
//	private String projectClassifyValue;//项目分类(名称)
//	
//	private String industryValue;//国民经济行业分类(名称)
//	
//	private String projectIndustryValue;//项目行业归口(名称)
//	
//	private String projectTypeValue;//项目类型(名称)
//	
//	private String projectStatusValue;//项目状态(名称)
//	
//	//end#项目基本信息
//	
//	
//
//	
//	//begin#下一年度计划	
//	
//	private String JianSheXingZhiValue;//建设性质（名称）
//
//	//end#下一年度计划	
//	
//	
//	
//	//begin#关联信息
//	
//	//附件
//	
//	private List<AttachmentDto> attachmentDtos=new ArrayList<>();
//	
//	private UnitInfoDto shenBaoUnitDto=new UnitInfoDto();//申报单位
//	
//	private UnitInfoDto BianZhiUnitDto=new UnitInfoDto();
//	
//	private List<MonthReportDto> monthReportDtos = new ArrayList<>();
//	//end#关联信息
//
//	public String getProjectStageValue() {
//		return projectStageValue;
//	}
//
//	public void setProjectStageValue(String projectStageValue) {
//		this.projectStageValue = projectStageValue;
//	}
//
//	public String getInvestTypeValue() {
//		return investTypeValue;
//	}
//
//	public void setInvestTypeValue(String investTypeValue) {
//		this.investTypeValue = investTypeValue;
//	}
//
//	public String getProjectClassifyValue() {
//		return projectClassifyValue;
//	}
//
//	public void setProjectClassifyValue(String projectClassifyValue) {
//		this.projectClassifyValue = projectClassifyValue;
//	}
//
//	public String getIndustryValue() {
//		return industryValue;
//	}
//
//	public void setIndustryValue(String industryValue) {
//		this.industryValue = industryValue;
//	}
//
//	public String getProjectIndustryValue() {
//		return projectIndustryValue;
//	}
//
//	public void setProjectIndustryValue(String projectIndustryValue) {
//		this.projectIndustryValue = projectIndustryValue;
//	}
//
//	public String getProjectTypeValue() {
//		return projectTypeValue;
//	}
//
//	public void setProjectTypeValue(String projectTypeValue) {
//		this.projectTypeValue = projectTypeValue;
//	}
//
//	public String getProjectStatusValue() {
//		return projectStatusValue;
//	}
//
//	public void setProjectStatusValue(String projectStatusValue) {
//		this.projectStatusValue = projectStatusValue;
//	}
//
//	public String getJianSheXingZhiValue() {
//		return JianSheXingZhiValue;
//	}
//
//	public void setJianSheXingZhiValue(String jianSheXingZhiValue) {
//		JianSheXingZhiValue = jianSheXingZhiValue;
//	}
//
//	public List<AttachmentDto> getAttachmentDtos() {
//		return attachmentDtos;
//	}
//
//	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
//		this.attachmentDtos = attachmentDtos;
//	}
//
//	public UnitInfoDto getShenBaoUnitDto() {
//		return shenBaoUnitDto;
//	}
//
//	public void setShenBaoUnitDto(UnitInfoDto shenBaoUnitDto) {
//		this.shenBaoUnitDto = shenBaoUnitDto;
//	}
//
//	public UnitInfoDto getBianZhiUnitDto() {
//		return BianZhiUnitDto;
//	}
//
//	public void setBianZhiUnitDto(UnitInfoDto bianZhiUnitDto) {
//		BianZhiUnitDto = bianZhiUnitDto;
//	}
//
//	public List<MonthReportDto> getMonthReportDtos() {
//		return monthReportDtos;
//	}
//
//	public void setMonthReportDtos(List<MonthReportDto> monthReportDtos) {
//		this.monthReportDtos = monthReportDtos;
//	}
//
//	
//
//}

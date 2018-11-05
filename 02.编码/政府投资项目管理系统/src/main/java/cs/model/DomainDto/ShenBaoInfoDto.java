package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.ShenBaoInfo;


/**
 * @Description: 申报信息实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class ShenBaoInfoDto extends ShenBaoInfo {
	//项目阶段
	private String projectStageDesc;
	//项目类型
	private String projectTypeDesc;
	//项目类别
	private String projectCategoryDesc;
	//所属行业
	private String projectIndustryDesc;
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

	//暂存或提交
	private Integer isUpdateOrSubmit;


	//申报端下一年度计划  start
	private String projectConstrChar;
	private Integer planYear;
	private Boolean isApplyOutsideCapital = false;
	private Double applyOutsideCapital = 0.0;

	private Double applyYearInvest = 0.0;
	private Double capitalSCZ_ggys_TheYear = 0.0;
	private Double capitalSCZ_gtzj_TheYear = 0.0;
	private Double capitalSCZ_qita = 0.0;
	private String capitalOtherDescriptionShenBao;

	private Double applyYearInvest_LastYear = 0.0;
	private Double capitalSCZ_ggys_LastYear = 0.0;
	private Double capitalSCZ_gtzj_LastYear = 0.0;
	private Double capitalSCZ_qita_LastYear = 0.0;
	private String capitalOtherDescriptionShenBao_LastYear;

	private Double applyYearInvest_LastTwoYear = 0.0;
	private Double capitalSCZ_ggys_LastTwoYear = 0.0;
	private Double capitalSCZ_gtzj_LastTwoYear = 0.0;
	private Double capitalSCZ_qita_LastTwoYear = 0.0;
	private String capitalOtherDescriptionShenBao_LastTwoYear;

	private String yearConstructionContent;
	private String yearConstructionContentLastYear;
	private String yearConstructionContentLastTwoYear;

	private Double apInvestSum = 0.0;
	private String yearConstructionContentShenBao;
	//申报端下一年度计划  end

	private YearPlanYearContentDto yearPlanYearContentDto = new YearPlanYearContentDto();
	private ShenBaoUnitInfoDto bianZhiUnitInfoDto=new ShenBaoUnitInfoDto();
	private ShenBaoUnitInfoDto shenBaoUnitInfoDto=new ShenBaoUnitInfoDto();
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();

	public YearPlanYearContentDto getYearPlanYearContentDto() {
		return yearPlanYearContentDto;
	}

	public void setYearPlanYearContentDto(YearPlanYearContentDto yearPlanYearContentDto) {
		this.yearPlanYearContentDto = yearPlanYearContentDto;
	}

	public ShenBaoUnitInfoDto getBianZhiUnitInfoDto() {
		return bianZhiUnitInfoDto;
	}

	public Integer getIsUpdateOrSubmit() {
		return isUpdateOrSubmit;
	}

	public void setIsUpdateOrSubmit(Integer isUpdateOrSubmit) {
		this.isUpdateOrSubmit = isUpdateOrSubmit;
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

	public String getProjectConstrChar() {
		return projectConstrChar;
	}

	public void setProjectConstrChar(String projectConstrChar) {
		this.projectConstrChar = projectConstrChar;
	}

	public Integer getPlanYear() {
		return planYear;
	}

	public void setPlanYear(Integer planYear) {
		this.planYear = planYear;
	}

	public Boolean getApplyOutsideCapital() {
		return isApplyOutsideCapital;
	}

	public void setApplyOutsideCapital(Double applyOutsideCapital) {
		this.applyOutsideCapital = applyOutsideCapital;
	}

	public Double getApplyYearInvest() {
		return applyYearInvest;
	}

	public void setApplyYearInvest(Double applyYearInvest) {
		this.applyYearInvest = applyYearInvest;
	}

	public Double getCapitalSCZ_ggys_TheYear() {
		return capitalSCZ_ggys_TheYear;
	}

	public void setCapitalSCZ_ggys_TheYear(Double capitalSCZ_ggys_TheYear) {
		this.capitalSCZ_ggys_TheYear = capitalSCZ_ggys_TheYear;
	}

	public Double getCapitalSCZ_gtzj_TheYear() {
		return capitalSCZ_gtzj_TheYear;
	}

	public void setCapitalSCZ_gtzj_TheYear(Double capitalSCZ_gtzj_TheYear) {
		this.capitalSCZ_gtzj_TheYear = capitalSCZ_gtzj_TheYear;
	}

	public Double getCapitalSCZ_qita() {
		return capitalSCZ_qita;
	}

	public void setCapitalSCZ_qita(Double capitalSCZ_qita) {
		this.capitalSCZ_qita = capitalSCZ_qita;
	}

	public String getCapitalOtherDescriptionShenBao() {
		return capitalOtherDescriptionShenBao;
	}

	public void setCapitalOtherDescriptionShenBao(String capitalOtherDescriptionShenBao) {
		this.capitalOtherDescriptionShenBao = capitalOtherDescriptionShenBao;
	}

	public Double getApplyYearInvest_LastYear() {
		return applyYearInvest_LastYear;
	}

	public void setApplyYearInvest_LastYear(Double applyYearInvest_LastYear) {
		this.applyYearInvest_LastYear = applyYearInvest_LastYear;
	}

	public Double getCapitalSCZ_ggys_LastYear() {
		return capitalSCZ_ggys_LastYear;
	}

	public void setCapitalSCZ_ggys_LastYear(Double capitalSCZ_ggys_LastYear) {
		this.capitalSCZ_ggys_LastYear = capitalSCZ_ggys_LastYear;
	}

	public Double getCapitalSCZ_gtzj_LastYear() {
		return capitalSCZ_gtzj_LastYear;
	}

	public void setCapitalSCZ_gtzj_LastYear(Double capitalSCZ_gtzj_LastYear) {
		this.capitalSCZ_gtzj_LastYear = capitalSCZ_gtzj_LastYear;
	}

	public Double getCapitalSCZ_qita_LastYear() {
		return capitalSCZ_qita_LastYear;
	}

	public void setCapitalSCZ_qita_LastYear(Double capitalSCZ_qita_LastYear) {
		this.capitalSCZ_qita_LastYear = capitalSCZ_qita_LastYear;
	}

	public String getCapitalOtherDescriptionShenBao_LastYear() {
		return capitalOtherDescriptionShenBao_LastYear;
	}

	public void setCapitalOtherDescriptionShenBao_LastYear(String capitalOtherDescriptionShenBao_LastYear) {
		this.capitalOtherDescriptionShenBao_LastYear = capitalOtherDescriptionShenBao_LastYear;
	}

	public Double getApplyYearInvest_LastTwoYear() {
		return applyYearInvest_LastTwoYear;
	}

	public void setApplyYearInvest_LastTwoYear(Double applyYearInvest_LastTwoYear) {
		this.applyYearInvest_LastTwoYear = applyYearInvest_LastTwoYear;
	}

	public Double getCapitalSCZ_ggys_LastTwoYear() {
		return capitalSCZ_ggys_LastTwoYear;
	}

	public void setCapitalSCZ_ggys_LastTwoYear(Double capitalSCZ_ggys_LastTwoYear) {
		this.capitalSCZ_ggys_LastTwoYear = capitalSCZ_ggys_LastTwoYear;
	}

	public Double getCapitalSCZ_gtzj_LastTwoYear() {
		return capitalSCZ_gtzj_LastTwoYear;
	}

	public void setCapitalSCZ_gtzj_LastTwoYear(Double capitalSCZ_gtzj_LastTwoYear) {
		this.capitalSCZ_gtzj_LastTwoYear = capitalSCZ_gtzj_LastTwoYear;
	}

	public Double getCapitalSCZ_qita_LastTwoYear() {
		return capitalSCZ_qita_LastTwoYear;
	}

	public void setCapitalSCZ_qita_LastTwoYear(Double capitalSCZ_qita_LastTwoYear) {
		this.capitalSCZ_qita_LastTwoYear = capitalSCZ_qita_LastTwoYear;
	}

	public String getCapitalOtherDescriptionShenBao_LastTwoYear() {
		return capitalOtherDescriptionShenBao_LastTwoYear;
	}

	public void setCapitalOtherDescriptionShenBao_LastTwoYear(String capitalOtherDescriptionShenBao_LastTwoYear) {
		this.capitalOtherDescriptionShenBao_LastTwoYear = capitalOtherDescriptionShenBao_LastTwoYear;
	}

	public String getYearConstructionContent() {
		return yearConstructionContent;
	}

	public void setYearConstructionContent(String yearConstructionContent) {
		this.yearConstructionContent = yearConstructionContent;
	}

	public String getYearConstructionContentLastYear() {
		return yearConstructionContentLastYear;
	}

	public void setYearConstructionContentLastYear(String yearConstructionContentLastYear) {
		this.yearConstructionContentLastYear = yearConstructionContentLastYear;
	}

	public String getYearConstructionContentLastTwoYear() {
		return yearConstructionContentLastTwoYear;
	}

	public void setYearConstructionContentLastTwoYear(String yearConstructionContentLastTwoYear) {
		this.yearConstructionContentLastTwoYear = yearConstructionContentLastTwoYear;
	}

	public Double getApInvestSum() {
		return apInvestSum;
	}

	public void setApInvestSum(Double apInvestSum) {
		this.apInvestSum = apInvestSum;
	}

	public String getYearConstructionContentShenBao() {
		return yearConstructionContentShenBao;
	}

	public void setYearConstructionContentShenBao(String yearConstructionContentShenBao) {
		this.yearConstructionContentShenBao = yearConstructionContentShenBao;
	}

	public void setApplyOutsideCapital(Boolean applyOutsideCapital) {
		isApplyOutsideCapital = applyOutsideCapital;
	}
}

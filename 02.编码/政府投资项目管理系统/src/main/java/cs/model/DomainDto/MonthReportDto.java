package cs.model.DomainDto;
import java.util.ArrayList;
import java.util.List;

import cs.domain.MonthReport;

public class MonthReportDto extends MonthReport{
	
	private String proposalsTypeDisplay;//项目建议书批复类型
	
	private String reportTypeDisplay;//可行性研究报告批复类型
	
	private String allEstimateTypeDisplay;//可行性研究报告批复类型
	
	private String prePlanTypeDisplay;//前期工作计划批复类型
	
	private String selfReviewDisplay;//项目进度
	
	private String projectName; //项目名称
	
	
	//begin#关联信息
	//月报问题
	private List<MonthReportProblemDto> monthReportProblemsDto=new ArrayList<>();
	
	//月报附件
	private List<AttachmentDto> attachmentsDto=new ArrayList<>();

	//end#关联信息
	public String getProposalsTypeDisplay() {
		return proposalsTypeDisplay;
	}

	public void setProposalsTypeDisplay(String proposalsTypeDisplay) {
		this.proposalsTypeDisplay = proposalsTypeDisplay;
	}

	public String getReportTypeDisplay() {
		return reportTypeDisplay;
	}

	public void setReportTypeDisplay(String reportTypeDisplay) {
		this.reportTypeDisplay = reportTypeDisplay;
	}

	public String getAllEstimateTypeDisplay() {
		return allEstimateTypeDisplay;
	}

	public void setAllEstimateTypeDisplay(String allEstimateTypeDisplay) {
		this.allEstimateTypeDisplay = allEstimateTypeDisplay;
	}

	public String getPrePlanTypeDisplay() {
		return prePlanTypeDisplay;
	}

	public void setPrePlanTypeDisplay(String prePlanTypeDisplay) {
		this.prePlanTypeDisplay = prePlanTypeDisplay;
	}

	public String getSelfReviewDisplay() {
		return selfReviewDisplay;
	}

	public void setSelfReviewDisplay(String selfReviewDisplay) {
		this.selfReviewDisplay = selfReviewDisplay;
	}

	public List<MonthReportProblemDto> getMonthReportProblemsDto() {
		return monthReportProblemsDto;
	}

	public void setMonthReportProblemsDto(List<MonthReportProblemDto> monthReportProblemsDto) {
		this.monthReportProblemsDto = monthReportProblemsDto;
	}

	public List<AttachmentDto> getAttachmentsDto() {
		return attachmentsDto;
	}

	public void setAttachmentsDto(List<AttachmentDto> attachmentsDto) {
		this.attachmentsDto = attachmentsDto;
	}

	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}
	
	//end#关联信息
	
	
	
	
	
}

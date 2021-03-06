package cs.model.DomainDto;
import java.util.ArrayList;
import java.util.List;

import cs.domain.MonthReport;
/**
 * @Description: 月报实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class MonthReportDto extends MonthReport{
			
	private String projectProgressDescription;//项目进度
	
	private String selfReviewDesc;//项目进度安排
	
	private String projectName; //项目名称
	
	
	//begin#关联信息
	//月报问题
	private List<MonthReportProblemDto> monthReportProblemDtos=new ArrayList<>();
	
	//月报附件
	private List<AttachmentDto> attachmentDtos=new ArrayList<>();

	//end#关联信息
	
	public String getProjectName() {
		return projectName;
	}

	public void setProjectName(String projectName) {
		this.projectName = projectName;
	}

	public String getProjectProgressDescription() {
		return projectProgressDescription;
	}

	public void setProjectProgressDescription(String projectProgressDescription) {
		this.projectProgressDescription = projectProgressDescription;
	}

	public List<MonthReportProblemDto> getMonthReportProblemDtos() {
		return monthReportProblemDtos;
	}

	public void setMonthReportProblemDtos(List<MonthReportProblemDto> monthReportProblemDtos) {
		this.monthReportProblemDtos = monthReportProblemDtos;
	}

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}

	public String getSelfReviewDesc() {
		return selfReviewDesc;
	}

	public void setSelfReviewDesc(String selfReviewDesc) {
		this.selfReviewDesc = selfReviewDesc;
	}
	
}

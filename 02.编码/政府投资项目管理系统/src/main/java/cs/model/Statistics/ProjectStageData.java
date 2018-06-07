package cs.model.Statistics;

/**
 * 
* @ClassName: ProjectStageData 
* @Description: 用于项目统计javaBean
* @author cx
* @date 2017年11月17日 下午5:17:48 
*
 */
public class ProjectStageData {
	private String projectStage;
	private Boolean isMonthReport;
	private String projectIndustry;
	private Integer count;
	
	public String getProjectStage() {
		return projectStage;
	}
	public void setProjectStage(String projectStage) {
		this.projectStage = projectStage;
	}
	public Integer getCount() {
		return count;
	}
	public void setCount(Integer count) {
		this.count = count;
	}

	public Boolean getMonthReport() {
		return isMonthReport;
	}

	public void setMonthReport(Boolean monthReport) {
		isMonthReport = monthReport;
	}

	public String getProjectIndustry() {
		return projectIndustry;
	}

	public void setProjectIndustry(String projectIndustry) {
		this.projectIndustry = projectIndustry;
	}
}

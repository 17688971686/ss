package cs.model;


/**
 * 月报问题表
 * @author Administrator
 *
 */
public class MonthReportProblemDto {
 
	private long id;
	//private      //关联月报
	private String problemIntroduction;//问题简介
	private String solutionsAndSuggest;//解决措施及建议
	private String remark;//备注
	public long getId() {
		return id;
	}
	public void setId(long id) {
		this.id = id;
	}
	public String getProblemIntroduction() {
		return problemIntroduction;
	}
	public void setProblemIntroduction(String problemIntroduction) {
		this.problemIntroduction = problemIntroduction;
	}
	public String getSolutionsAndSuggest() {
		return solutionsAndSuggest;
	}
	public void setSolutionsAndSuggest(String solutionsAndSuggest) {
		this.solutionsAndSuggest = solutionsAndSuggest;
	}
	public String getRemark() {
		return remark;
	}
	public void setRemark(String remark) {
		this.remark = remark;
	}
	
	
}


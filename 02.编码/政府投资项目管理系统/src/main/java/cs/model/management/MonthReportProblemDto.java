package cs.model.management;

import cs.model.BaseDto;

/**
 * 月报问题实体类
 * @author cx
 * @Date 2017-05-03
 */
public class MonthReportProblemDto extends BaseDto{
	private String id;
	private String problemIntroduction;//问题简介
	private String solutionsAndSuggest;//解决措施及建议
	private String remark;//备注
	public String getId() {
		return id;
	}
	public void setId(String id) {
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

package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * 月报问题表
 * @author Administrator
 *
 */

@Entity
@Table(name="cs-monthReportProblem")
public class MonthReportProblem {

	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private long id;
	//关联月报///
	
	@Column(columnDefinition="varchar(225) COMMENT '问题简介'")
	private String problemIntroduction;
	@Column(columnDefinition="varchar(225) COMMENT '解决措施及建议'")
	private String solutionsAndSuggest;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
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

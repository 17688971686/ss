package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
/**
 * @Description: 月报问题表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_monthReportProblem")
public class MonthReportProblem extends BaseEntity {

	@Id
	private String id;	

	@Column(columnDefinition="varchar(2000) COMMENT '问题简介'")
	private String problemIntroduction;
	@Column(columnDefinition="varchar(2000) COMMENT '解决措施及建议'")
	private String solutionsAndSuggest;
	@Column(columnDefinition="varchar(225) COMMENT '备注'")
	private String remark;
	
	//begin#关联信息
	@ManyToOne
	@JoinColumn(name="monthReport_id",insertable=false,updatable=false)
	private MonthReport monthReport=new MonthReport();
	//end#关联信息

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

	public MonthReport getMonthReport() {
		return monthReport;
	}

	public void setMonthReport(MonthReport monthReport) {
		this.monthReport = monthReport;
	}
	
}

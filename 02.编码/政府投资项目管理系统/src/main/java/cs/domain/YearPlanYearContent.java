package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description:申报单位信息表
 * @author: liux
 * @Date：2018年10月22日
 * @version：0.1
 */
@Entity
@Table(name="cs_yearPlan_yearContent")
public class YearPlanYearContent extends BaseEntity{
    /* 年度计划 Begin（三年滚动计划） */
    @Id
    @Column(length = 64)
    private String id;


    //申报端下一年度计划  start
    @Column(columnDefinition = "varchar(125) NULL COMMENT '项目建设性质分类'")
    private String projectConstrChar;
    @Column(columnDefinition = "int NULL COMMENT '计划年度'")
    private Integer planYear;
    @Column(columnDefinition = "bit(1) DEFAULT b'0' COMMENT '是否需要申请指标外资金'")
    private Boolean isApplyOutsideCapital = false;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '申请指标外资金'")
    private Double applyOutsideCapital = 0.0;


    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第一年申请年度投资累计'")
    private Double applyYearInvest = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第一年资金筹措方案(申请)-公共预算'")
    private Double capitalSCZ_ggys_TheYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第一年资金筹措方案(申请)-国土资金'")
    private Double capitalSCZ_gtzj_TheYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第一年资金筹措方案(申请)-其他资金'")
    private Double capitalSCZ_qita = 0.0;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '第一年其他资金来源'")
    private String capitalOtherDescriptionShenBao;

    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第二年申请年度投资累计'")
    private Double applyYearInvest_LastYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第二年度资金筹措方案(申请)-公共预算'")
    private Double capitalSCZ_ggys_LastYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第二年度资金筹措方案(申请)-国土资金'")
    private Double capitalSCZ_gtzj_LastYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第二年资金筹措方案(申请)-其他资金'")
    private Double capitalSCZ_qita_LastYear = 0.0;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '第二年其他资金来源'")
    private String capitalOtherDescriptionShenBao_LastYear;

    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第三年申请年度投资累计'")
    private Double applyYearInvest_LastTwoYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第三年度资金筹措方案(申请)-公共预算'")
    private Double capitalSCZ_ggys_LastTwoYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第三年度资金筹措方案(申请)-国土资金'")
    private Double capitalSCZ_gtzj_LastTwoYear = 0.0;
    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '第三年度资金筹措方案(申请)-其他资金'")
    private Double capitalSCZ_qita_LastTwoYear = 0.0;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '第三年其他资金来源'")
    private String capitalOtherDescriptionShenBao_LastTwoYear;

    @Column(columnDefinition = "varchar(500) NULL COMMENT '第一年度建设内容'")
    private String yearConstructionContent;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '第二年度建设内容'")
    private String yearConstructionContentLastYear;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '第三年度建设内容'")
    private String yearConstructionContentLastTwoYear;

    @Column(columnDefinition = "double(11,4) DEFAULT 0 COMMENT '累计安排投资'")
    private Double apInvestSum = 0.0;
    @Column(columnDefinition = "varchar(500) NULL COMMENT '申报信息备注'")
    private String yearConstructionContentShenBao;
    //申报端下一年度计划  end

    /* 年度计划 End（三年滚动计划） */

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
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

    public Boolean getIsApplyOutsideCapital() {
        return isApplyOutsideCapital;
    }

    public void setIsApplyOutsideCapital(Boolean isApplyOutsideCapital) {
        this.isApplyOutsideCapital = isApplyOutsideCapital;
    }

    public Double getApplyOutsideCapital() {
        return applyOutsideCapital;
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
}

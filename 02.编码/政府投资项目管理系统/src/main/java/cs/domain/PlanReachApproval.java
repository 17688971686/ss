package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

/**
 * @author cx
 * @ClassName: planReachApproval
 * @Description: 计划下达批复表
 * @date 2018年3月12日 下午3:45:45
 */
@Entity
@Table(name = "cs_planReachApproval")
public class PlanReachApproval extends BaseEntity {
    @Id
    private String id;

    @Column(columnDefinition = "varchar(255)  not null COMMENT '标题'")
    private String title;

//    @Column(columnDefinition = "varchar(255)  not null COMMENT '负责人'")
//    private String resPerson;

    @Column(columnDefinition = "varchar(255)  not null COMMENT '负责人电话'")
    private String resPersonTel;

    @Temporal(TemporalType.TIMESTAMP)
    @Column(columnDefinition = "datetime  not null COMMENT '批复时间'")
    private Date approvalTime;

    /**
     * 关联信息
     */
    @OneToMany(cascade = CascadeType.ALL)
    private List<ShenBaoInfo> shenBaoInfos = new ArrayList<>();

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

//    public String getResPerson() {
//        return resPerson;
//    }
//
//    public void setResPerson(String resPerson) {
//        this.resPerson = resPerson;
//    }

    public String getResPersonTel() {
        return resPersonTel;
    }

    public void setResPersonTel(String resPersonTel) {
        this.resPersonTel = resPersonTel;
    }

    public Date getApprovalTime() {
        return approvalTime;
    }

    public void setApprovalTime(Date approvalTime) {
        this.approvalTime = approvalTime;
    }

    public List<ShenBaoInfo> getShenBaoInfos() {
        return shenBaoInfos;
    }

    public void setShenBaoInfos(List<ShenBaoInfo> shenBaoInfos) {
        this.shenBaoInfos = shenBaoInfos;
    }
}

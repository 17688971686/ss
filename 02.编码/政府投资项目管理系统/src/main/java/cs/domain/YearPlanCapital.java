package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;

/**
 * @Description: 计划编制表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name = "cs_yearPlanCapital")
public class YearPlanCapital extends BaseEntity {
    @Id
    private String id;

    @Column(columnDefinition = "varchar(255) NULL COMMENT '申报数据Id'")
    private String shenbaoInfoId;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-市财政-公共预算'")
    private Double capitalSCZ_ggys = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-市财政-国土资金'")
    private Double capitalSCZ_gtzj = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-市财政-专项资金'")
    private Double capitalSCZ_zxzj = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-区财政-公共预算'")
    private Double capitalQCZ_ggys = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-区财政-国土资金'")
    private Double capitalQCZ_gtzj = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-中央预算内投资'")
    private Double capitalZYYS = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-社会投资'")
    private Double capitalSHTZ = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金筹措方案-其它'")
    private Double capitalOther = 0.0;

    @Column(columnDefinition = "double(11,4) NULL COMMENT '资金总和'")
    private Double capitalSum = 0.0;

    public Double getCapitalSum() {
        return capitalSum;
    }

    public void setCapitalSum(Double capitalSum) {
        this.capitalSum = capitalSum;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getShenbaoInfoId() {
        return shenbaoInfoId;
    }

    public void setShenbaoInfoId(String shenbaoInfoId) {
        this.shenbaoInfoId = shenbaoInfoId;
    }

    public Double getCapitalSCZ_ggys() {
        return capitalSCZ_ggys;
    }

    public void setCapitalSCZ_ggys(Double capitalSCZ_ggys) {
        this.capitalSCZ_ggys = capitalSCZ_ggys;
    }

    public Double getCapitalSCZ_gtzj() {
        return capitalSCZ_gtzj;
    }

    public void setCapitalSCZ_gtzj(Double capitalSCZ_gtzj) {
        this.capitalSCZ_gtzj = capitalSCZ_gtzj;
    }

    public Double getCapitalSCZ_zxzj() {
        return capitalSCZ_zxzj;
    }

    public void setCapitalSCZ_zxzj(Double capitalSCZ_zxzj) {
        this.capitalSCZ_zxzj = capitalSCZ_zxzj;
    }

    public Double getCapitalQCZ_ggys() {
        return capitalQCZ_ggys;
    }

    public void setCapitalQCZ_ggys(Double capitalQCZ_ggys) {
        this.capitalQCZ_ggys = capitalQCZ_ggys;
    }

    public Double getCapitalQCZ_gtzj() {
        return capitalQCZ_gtzj;
    }

    public void setCapitalQCZ_gtzj(Double capitalQCZ_gtzj) {
        this.capitalQCZ_gtzj = capitalQCZ_gtzj;
    }

    public Double getCapitalSHTZ() {
        return capitalSHTZ;
    }

    public void setCapitalSHTZ(Double capitalSHTZ) {
        this.capitalSHTZ = capitalSHTZ;
    }

    public Double getCapitalOther() {
        return capitalOther;
    }

    public void setCapitalOther(Double capitalOther) {
        this.capitalOther = capitalOther;
    }

    public Double getCapitalZYYS() {
        return capitalZYYS;
    }

    public void setCapitalZYYS(Double capitalZYYS) {
        this.capitalZYYS = capitalZYYS;
    }
}

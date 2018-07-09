package cs.domain;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.OneToMany;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.persistence.Temporal;
import javax.persistence.TemporalType;

import cs.common.BasicDataConfig;

/**
 * @Description: 申报信息表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name = "cs_shenBaoInfo")
public class ShenBaoInfo extends BaseShenBaoInfo {

    //begin#关联信息
    @OneToOne(cascade = CascadeType.ALL)
    private ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();

    @OneToOne(cascade = CascadeType.ALL)
    private ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
    @OneToMany(cascade = CascadeType.ALL)
    private List<Attachment> attachments = new ArrayList<>();


    public ShenBaoUnitInfo getBianZhiUnitInfo() {
        return bianZhiUnitInfo;
    }

    public void setBianZhiUnitInfo(ShenBaoUnitInfo bianZhiUnitInfo) {
        this.bianZhiUnitInfo = bianZhiUnitInfo;
    }

    public ShenBaoUnitInfo getShenBaoUnitInfo() {
        return shenBaoUnitInfo;
    }

    public void setShenBaoUnitInfo(ShenBaoUnitInfo shenBaoUnitInfo) {
        this.shenBaoUnitInfo = shenBaoUnitInfo;
    }

    public List<Attachment> getAttachments() {
        return attachments;
    }

    public void setAttachments(List<Attachment> attachments) {
        this.attachments = attachments;
    }
}

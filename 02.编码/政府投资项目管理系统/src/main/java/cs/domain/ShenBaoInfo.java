package cs.domain;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

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

    @Column(columnDefinition="varchar(64) NULL COMMENT '打包名称'")
    private String planName;
    @Column(columnDefinition = "bit(1) DEFAULT b'0' COMMENT '是否已发文'")
    private Boolean isFaWen = false;

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

	public String getPlanName() {
		return planName;
	}

	public void setPlanName(String planName) {
		this.planName = planName;
	}

	public Boolean getIsFaWen() {
		return isFaWen;
	}

	public void setIsFaWen(Boolean isFaWen) {
		this.isFaWen = isFaWen;
	}

    
}

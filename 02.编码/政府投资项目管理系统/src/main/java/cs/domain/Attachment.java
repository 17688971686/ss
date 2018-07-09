package cs.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
/**
 * @Description: 附件表
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Entity
@Table(name="cs_attachment")
public class Attachment extends BaseEntity{
	@Id	
	private String id;
	@Column(columnDefinition="varchar(255)  COMMENT '标题'")
	private String name;
	@Column(columnDefinition="varchar(255) COMMENT 'url地址'")
	private String url;
	@Column(columnDefinition="varchar(255)  COMMENT '备注'")
	private String comment;
	@Column(columnDefinition="varchar(50) COMMENT '附件类型'")
	private String type;
	@Column(columnDefinition="varchar(50) COMMENT '附件业务相关类型'")
	private String businessType;
	@Column(columnDefinition="varchar(50) COMMENT '申报附件类型-用于监控端'")
	private String shenBaoAttType;
	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getName() {
		return name;
	}
	public void setName(String name) {
		this.name = name;
	}
	public String getUrl() {
		return url;
	}
	public void setUrl(String url) {
		this.url = url;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public String getType() {
		return type;
	}
	public void setType(String type) {
		this.type = type;
	}
	public String getBusinessType() {
		return businessType;
	}
	public void setBusinessType(String businessType) {
		this.businessType = businessType;
	}
	public String getShenBaoAttType() {
		return shenBaoAttType;
	}
	public void setShenBaoAttType(String shenBaoAttType) {
		this.shenBaoAttType = shenBaoAttType;
	}
	
}

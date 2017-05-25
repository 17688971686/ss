package cs.model.DomainDto;

import cs.model.BaseDto;

/**
 * 附件实体类
 * @author cx
 * @Date 2017-05-03
 */
public class AttachmentDto extends BaseDto{
	private String id;
	private String name;//标题
	private String url;//url地址
	private String comment;//备注
	private String type;//类型
	private String typeValue;//类型名称
	private Integer isUpload;//是否上传
	private String isUploadValue;
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
	public String getTypeValue() {
		return typeValue;
	}
	public void setTypeValue(String typeValue) {
		this.typeValue = typeValue;
	}
	public Integer getIsUpload() {
		return isUpload;
	}
	public void setIsUpload(Integer isUpload) {
		this.isUpload = isUpload;
	}
	public String getIsUploadValue() {
		return isUploadValue;
	}
	public void setIsUploadValue(String isUploadValue) {
		this.isUploadValue = isUploadValue;
	}
	
	
	
	
}

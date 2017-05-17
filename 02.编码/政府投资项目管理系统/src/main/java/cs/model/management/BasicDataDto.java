package cs.model.management;

import java.util.List;

import cs.model.BaseDto;

/**
 * 基础数据实体类
 * @author cx
 * @Date 2017-05-04
 */
public class BasicDataDto extends BaseDto{
	private String id;
	private String pId;//父亲Id
	private String identity;//标识-用于区分类型
	private String description;//描述-用于描述具体是哪一类
	private String comment;//备注
	private List<BasicDataDto> children;

	
	public String getId() {
		return id;
	}
	public void setId(String id) {
		this.id = id;
	}
	public String getpId() {
		return pId;
	}
	public void setpId(String pId) {
		this.pId = pId;
	}
	public String getIdentity() {
		return identity;
	}
	public void setIdentity(String identity) {
		this.identity = identity;
	}
	public String getDescription() {
		return description;
	}
	public void setDescription(String description) {
		this.description = description;
	}
	public String getComment() {
		return comment;
	}
	public void setComment(String comment) {
		this.comment = comment;
	}
	public List<BasicDataDto> getChildren() {
		return children;
	}
	public void setChildren(List<BasicDataDto> children) {
		this.children = children;
	}
	
	
}

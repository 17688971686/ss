package cs.model.DomainDto;

import cs.domain.Attachment;

/**
 * 附件实体类
 * @author cx
 * @Date 2017-05-03
 */
public class AttachmentDto extends Attachment{
	
	private String typeValue;//类型名称

	public String getTypeValue() {
		return typeValue;
	}

	public void setTypeValue(String typeValue) {
		this.typeValue = typeValue;
	}
	
	
	
	
	
}

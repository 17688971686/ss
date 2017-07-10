package cs.model.DomainDto;

import cs.domain.Attachment;
/**
 * @Description: 附件实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
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

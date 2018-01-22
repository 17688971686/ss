package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.TaskRecord;
/**
 * @Description: 任务处理流程实体类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
public class TaskRecordDto extends TaskRecord {
	private List<AttachmentDto> attachmentDtos = new ArrayList<>();

	public List<AttachmentDto> getAttachmentDtos() {
		return attachmentDtos;
	}

	public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
		this.attachmentDtos = attachmentDtos;
	}
	
}

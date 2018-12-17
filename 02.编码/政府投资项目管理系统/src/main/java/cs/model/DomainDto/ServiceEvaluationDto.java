package cs.model.DomainDto;

import java.util.ArrayList;
import java.util.List;

import cs.domain.ServiceEvaluation;
/**
 * @Description: 服务质量实体表
 * @author: wcq
 * @Date：2017年9月13日
 * @version：0.1
 */
public class ServiceEvaluationDto extends ServiceEvaluation {
	    //begin#关联信息
		//附件信息
		private List<AttachmentDto> attachmentDtos=new ArrayList<>();

		public List<AttachmentDto> getAttachmentDtos() {
			return attachmentDtos;
		}

		public void setAttachmentDtos(List<AttachmentDto> attachmentDtos) {
			this.attachmentDtos = attachmentDtos;
		}

}

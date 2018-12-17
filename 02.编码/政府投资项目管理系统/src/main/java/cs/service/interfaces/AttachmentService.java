package cs.service.interfaces;

import cs.domain.Attachment;
import cs.model.DomainDto.AttachmentDto;
import org.springframework.web.multipart.MultipartFile;

/**
 * @author Administrator
 *附件服务层
 */
public interface AttachmentService extends IService<AttachmentDto, Attachment, String>{
    /**
     * 上传word文件(针对在线编辑插件）
     * @param docContent
     * @param attachId
     * @return
     */
    Attachment uploadWord(MultipartFile docContent, String attachId);
}

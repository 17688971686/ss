package cs.service.impl;

import cs.common.SNKit;
import cs.domain.Attachment;
import cs.model.DomainDto.AttachmentDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AttachmentService;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

/**
 * @Description: 附件信息
 * @author: lx
 * @Date：2018年8月17日
 * @version：0.1
 */
@Service
public class AttachmentServiceImpl extends AbstractServiceImpl<AttachmentDto, Attachment, String> implements AttachmentService {
	
	private static Logger logger = Logger.getLogger(AttachmentServiceImpl.class);
	@Value("${diskPath}")
	private String diskPath;

	@Override
	public List<AttachmentDto> findByDto(ODataObj odataObj) {
		return null;
	}

	/**
	 * 上传word文件(针对在线编辑插件）
	 * @param docContent
	 * @param attachId
	 * @return
	 */
	@Override
	public Attachment uploadWord(MultipartFile docContent, String attachId) {
		//根据id获取正文信息
		Attachment att = this.findById(attachId);
		AttachmentDto attDto = new AttachmentDto();

		//this.update(attDto,att.getId());
		SNKit.fileInput(docContent, diskPath,att.getUrl());
		return att;
	}
}

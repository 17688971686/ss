package cs.service.impl;

import java.util.Date;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Article;
import cs.domain.Attachment;
import cs.model.PageModelDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ArticleService;
/**
 * @Description:文章服务层 
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class ArticleServiceImpl extends AbstractServiceImpl<ArticleDto, Article, String> implements ArticleService {

	private static Logger logger = Logger.getLogger(ArticleServiceImpl.class);
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private ICurrentUser currentUser;

	
	@Override
	@Transactional
	public PageModelDto<ArticleDto> get(ODataObj odataObj) {
		logger.info("获取文章数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public Article create(ArticleDto dto) {
		Article entity = super.create(dto);
		// begin#关联信息附件
		dto.getAttachmentDtos().forEach(x -> {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(currentUser.getLoginName());
			attachment.setModifiedBy(currentUser.getLoginName());
			entity.getAttachments().add(attachment);
		});
		super.repository.save(entity);
		logger.info(String.format("创建文章,Id:%s", entity.getId()));
		return entity;

	}

	@Override
	@Transactional
	public void delete(String id) {
		super.delete(id);
		logger.info(String.format("删除文章,ID:%s", id));
	}

	@Override
	@Transactional
	public Article update(ArticleDto dto, String id) {
		Article entity = super.update(dto, id);
		// begin#关联信息附件
		entity.getAttachments().forEach(x -> {//删除历史附件
			attachmentRepo.delete(x);
		});
		entity.getAttachments().clear();

		dto.getAttachmentDtos().forEach(x -> {//添加新附件
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(currentUser.getLoginName());
			attachment.setModifiedBy(currentUser.getLoginName());
			entity.getAttachments().add(attachment);
		});
		super.repository.save(entity);
		logger.info(String.format("更新文章,Id:%s", entity.getId()));
		return entity;
	}

}

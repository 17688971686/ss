package cs.service.impl;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.Article;
import cs.domain.Attachment;
import cs.model.PageModelDto;
import cs.model.DomainDto.ArticleDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;

@Service
public class ArticleServiceImpl extends AbstractServiceImpl<ArticleDto, Article, String> {

	private static Logger logger = Logger.getLogger(ArticleServiceImpl.class);
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;

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
		// begin#关联信息

		dto.getAttachmentDtos().forEach(x -> {
			entity.getAttachments().add(attachmentMapper.buildEntity(x, new Attachment()));
		});
		super.repository.save(entity);
		logger.info(String.format("创建文章,Id:%s", entity.getId()));
		return entity;

	}

	@Override
	@Transactional
	public void delete(String id) {
		// TODO Auto-generated method stub
		super.delete(id);
		logger.info(String.format("删除文章,ID:%s", id));
	}

	@Override
	@Transactional
	public Article update(ArticleDto dto, String id) {
		Article entity = super.update(dto, id);

		// begin#关联信息
		entity.getAttachments().forEach(x -> {// 删除历史附件
			attachmentRepo.delete(x);
		});
		entity.getAttachments().clear();

		dto.getAttachmentDtos().forEach(x -> {// 添加新附件
			entity.getAttachments().add(attachmentMapper.buildEntity(x, new Attachment()));
		});
		super.repository.save(entity);
		logger.info(String.format("更新文章,Id:%s", entity.getId()));
		return entity;

	}

}

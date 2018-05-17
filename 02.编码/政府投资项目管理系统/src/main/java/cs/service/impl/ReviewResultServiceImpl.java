package cs.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import cs.repository.odata.ODataObj;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.Attachment;
import cs.domain.ReviewResult;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ReviewResultDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.service.interfaces.ReviewResultService;

/**
 * @Description: 评审批报信息服务层
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Service
public class ReviewResultServiceImpl extends AbstractServiceImpl<ReviewResultDto, ReviewResult, String> implements ReviewResultService{

	private static Logger logger = Logger.getLogger(ReviewResultServiceImpl.class);
	
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private IRepository<ReviewResult, String> ReviewResultRepo;
	@Autowired
	private IMapper<ReviewResultDto, ReviewResult> reviewResultMapper;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	
	@Override
	@Transactional
	public ReviewResultDto getReviewResultByTaskId(String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<ReviewResult> dtos = ReviewResultRepo.findByCriteria(criterion);
		ReviewResult entity = new ReviewResult();
		if(dtos !=null && dtos.size()>0){
			entity = dtos.stream().findFirst().get();
			
			logger.info("查询用户数据");
			return reviewResultMapper.toDto(entity);
		}else{
			logger.info("查询用户数据");
			return null;
		}
		
	}
	
	@Override
	@Transactional
	public void createReviewResult(ReviewResultDto reviewResultDto, String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<ReviewResult> dtos = ReviewResultRepo.findByCriteria(criterion);
		if(dtos !=null && dtos.size()>0){
			ReviewResult entity = dtos.stream().findFirst().get();
			
			entity.getAttachments().forEach(x -> {//删除历史附件
				attachmentRepo.delete(x);
			});
			entity.getAttachments().clear();
			reviewResultDto.getAttachmentDtos().forEach(x -> {//添加新附件
				Attachment attachment = new Attachment();
				attachmentMapper.buildEntity(x, attachment);
				attachment.setCreatedBy(entity.getCreatedBy());
				attachment.setModifiedBy(entity.getModifiedBy());
				entity.getAttachments().add(attachment);
			});
			
			reviewResultMapper.buildEntity(reviewResultDto, entity);
			
			entity.setCreatedBy(currentUser.getUserId());
			entity.setCreatedDate(new Date());
			
			super.repository.save(entity);
			
		}else{
			ReviewResult entity = new ReviewResult();
			
			entity.setId(UUID.randomUUID().toString());
			
			reviewResultDto.getAttachmentDtos().forEach(x -> {//添加新附件
				Attachment attachment = new Attachment();
				attachmentMapper.buildEntity(x, attachment);
				attachment.setCreatedBy(entity.getCreatedBy());
				attachment.setModifiedBy(entity.getModifiedBy());
				entity.getAttachments().add(attachment);
			});
			
			reviewResultMapper.buildEntity(reviewResultDto, entity);
			entity.setRelId(id);
			entity.setModifiedBy(currentUser.getUserId());
			entity.setModifiedDate(new Date());
			
			super.repository.save(entity);
		}
		logger.info(String.format("创建评审委托书,登录名:%s", currentUser.getLoginName()));
	}

	@Override
	public List<ReviewResultDto> findByDto(ODataObj odataObj) {
		return null;
	}
}

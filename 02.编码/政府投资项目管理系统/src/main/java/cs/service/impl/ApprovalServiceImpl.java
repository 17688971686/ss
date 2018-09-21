package cs.service.impl;

import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mysql.cj.core.exceptions.NumberOutOfRange;

import cs.domain.Approval;
import cs.domain.Attachment;
import cs.model.PageModelDto;
import cs.model.DomainDto.ApprovalDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ApprovalService;

/**
 * @Description: 评审批报信息服务层
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Service
public class ApprovalServiceImpl extends AbstractServiceImpl<ApprovalDto, Approval, String> implements ApprovalService{

	private static Logger logger = Logger.getLogger(ApprovalServiceImpl.class);
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	
	@Override
	@Transactional
	public PageModelDto<ApprovalDto> get(ODataObj odataObj) {
		logger.info("获取评审报批单信息");
		return super.get(odataObj);
	}

	@Override
	public List<ApprovalDto> findByDto(ODataObj odataObj) {
		return null;
	}

	@Override
	@Transactional
	public void createDraft(ApprovalDto approvalDto) {
		
		Criterion criterion = Restrictions.eq("relId", approvalDto.getRelId());
		List<Approval> dtos = super.repository.findByCriteria(criterion);
		Approval entity;
		if(dtos !=null && dtos.size()>0){
			entity=super.update(approvalDto, approvalDto.getId());
		}else{
			entity = super.create(approvalDto);
		}
		//处理关联附件
		entity.getAttachments().forEach(x -> {//删除历史附件
			attachmentRepo.delete(x);
		});
		entity.getAttachments().clear();
		approvalDto.getAttachmentDtos().forEach(x -> {//添加新附件
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(entity.getCreatedBy());
			attachment.setModifiedBy(entity.getModifiedBy());
			entity.getAttachments().add(attachment);
		});
		
		
			super.repository.save(entity);
		
		logger.info("保存评审报批单信息");
	}
	
	
}

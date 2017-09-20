package cs.service.impl;

import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.Approval;
import cs.model.DomainDto.ApprovalDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
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
	private ICurrentUser currentUser;
	@Autowired
	private IRepository<Approval, String> ApprovalRepo;
	@Autowired
	private IMapper<ApprovalDto, Approval> approvalMapper;
	
	
	@Override
	@Transactional
	public ApprovalDto getDraftByTaskId(String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<Approval> dtos = ApprovalRepo.findByCriteria(criterion);
		Approval entity = new Approval();
		if(dtos !=null && dtos.size()>0){
			entity = dtos.stream().findFirst().get();
			return approvalMapper.toDto(entity);
		}else{
			return null;
		}
		
	}
	
	@Override
	@Transactional
	public void createDraft(ApprovalDto approvalDto, String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<Approval> dtos = ApprovalRepo.findByCriteria(criterion);
		if(dtos !=null && dtos.size()>0){
			Approval entity = dtos.stream().findFirst().get();
			approvalMapper.buildEntity(approvalDto, entity);
			
			entity.setCreatedBy(currentUser.getUserId());
			entity.setCreatedDate(new Date());
			super.repository.save(entity);
			
		}else{
			Approval entity = new Approval();
			entity.setRelId(id);
			entity.setId(UUID.randomUUID().toString());
			approvalMapper.buildEntity(approvalDto, entity);
			
			entity.setModifiedBy(currentUser.getUserId());
			entity.setModifiedDate(new Date());
			super.repository.save(entity);
		}
	}
	
	
}

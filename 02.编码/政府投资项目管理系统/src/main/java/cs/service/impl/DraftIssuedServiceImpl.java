package cs.service.impl;


import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.Attachment;
import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.service.interfaces.DraftIssuedService;

/**
 * @Description: 发文拟稿信息服务层
 * @author: wcq
 * @Date：2017年9月11日
 * @version：0.1
 */
@Service
public class DraftIssuedServiceImpl extends AbstractServiceImpl<DraftIssuedDto, DraftIssued, String> implements DraftIssuedService{
	
	private static Logger logger = Logger.getLogger(DraftIssuedServiceImpl.class);
	@Autowired
	private IRepository<DraftIssued, String> DraftIssuedRepo;
	@Autowired
	private IMapper<DraftIssuedDto, DraftIssued> draftIssuedMapper;
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public DraftIssuedDto getDraftByTaskId(String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<DraftIssued> dtos = DraftIssuedRepo.findByCriteria(criterion);
		DraftIssued entity = new DraftIssued();
		if(dtos !=null && dtos.size()>0){
			entity = dtos.stream().findFirst().get();
			return draftIssuedMapper.toDto(entity);
		}else{
			return null;
		}
		
	}

	@Override
	@Transactional
	public void createDraft(DraftIssuedDto draftIssuedDto, String id) {
		// TODO Auto-generated method stub
		Criterion criterion = Restrictions.eq("relId", id);
		List<DraftIssued> dtos = DraftIssuedRepo.findByCriteria(criterion);
		if(dtos !=null && dtos.size()>0){
			DraftIssued entity = dtos.stream().findFirst().get();
			draftIssuedMapper.buildEntity(draftIssuedDto, entity);
			
			entity.setCreatedBy(currentUser.getUserId());
			entity.setCreatedDate(new Date());
			super.repository.save(entity);
			
		}else{
			DraftIssued entity = new DraftIssued();
			entity.setRelId(id);
			entity.setId(UUID.randomUUID().toString());
			draftIssuedMapper.buildEntity(draftIssuedDto, entity);
			
			entity.setModifiedBy(currentUser.getUserId());
			entity.setModifiedDate(new Date());
			super.repository.save(entity);
		}
		
	}

	
	
	
}

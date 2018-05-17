package cs.service.impl;

import java.util.Date;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Opinion;
import cs.model.PageModelDto;
import cs.model.DomainDto.OpinionDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.framework.OpinionRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.OpinionService;

@Service
public class OpinionServiceImpl extends AbstractServiceImpl<OpinionDto, Opinion, String> implements OpinionService{

	private static Logger logger = Logger.getLogger(OpinionServiceImpl.class);
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private IMapper<OpinionDto, Opinion> opinionMapper;
	@Autowired
	private OpinionRepo opinionRepo;

	@Override
	@Transactional
	public void saveUserOpin(OpinionDto opinionDto) {
		// TODO Auto-generated method stub
		
		Opinion opin = new Opinion();
		
		opinionMapper.buildEntity(opinionDto, opin);
		
		opin.setCreatedBy(currentUser.getUserId());
		opin.setRelId(currentUser.getUserId());
		
		opinionRepo.save(opin);
		logger.info(String.format("保存用户意见,用户名:%s", currentUser.getLoginName()));
	}


	@Override
	@Transactional
	public void deleteOpins(String[] ids) {
		for (String id : ids) {
			this.deleteOpin(id);
		}
		logger.info("批量删除意见");
		
	}


	@Override
	@Transactional
	public void deleteOpin(String id) {
		Opinion opin = opinionRepo.findById(id);
		opinionRepo.delete(opin);
		logger.info(String.format("删除意见,用户名:%s", currentUser.getLoginName()));
		
	}


	@Override
	@Transactional
	public void editOpin(OpinionDto opinDto) {
		Opinion opin = opinionRepo.findById(opinDto.getId());
		
		opin.setOpinion(opinDto.getOpinion());
		opin.setModifiedBy(currentUser.getUserId());
		opin.setModifiedDate(new Date());
		opinionRepo.save(opin);
		
		logger.info(String.format("修改意见,用户名:%s", currentUser.getLoginName()));
		
	}


	@SuppressWarnings({ "rawtypes", "unchecked" })
	@Override
	@Transactional
	public PageModelDto<OpinionDto> getOpin(ODataObj odataObj) {	
		ODataFilterItem filter = new ODataFilterItem();
		filter.setField("relId");
		filter.setOperator("eq");
		filter.setValue(currentUser.getUserId());
		
		odataObj.getFilter().add(filter);
		
		return super.get(odataObj);
	}

	@Override
	public List<OpinionDto> findByDto(ODataObj odataObj) {
		return null;
	}
}

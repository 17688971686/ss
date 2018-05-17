package cs.service.impl;

import java.util.List;
import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;
import cs.domain.DraftIssued;
import cs.model.PageModelDto;
import cs.model.DomainDto.DraftIssuedDto;
import cs.repository.odata.ODataObj;
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
	
	@Override
	@Transactional
	public PageModelDto<DraftIssuedDto> get(ODataObj odataObj) {
		logger.info("获取发文拟稿信息");
		return super.get(odataObj);
	}

	@Override
	public List<DraftIssuedDto> findByDto(ODataObj odataObj) {
		return null;
	}

	@Override
	@Transactional
	public void createDraft(DraftIssuedDto draftIssuedDto) {
		Criterion criterion = Restrictions.eq("relId", draftIssuedDto.getRelId());
		List<DraftIssued> dtos = super.repository.findByCriteria(criterion);
		DraftIssued entity;
		if(dtos !=null && dtos.size()>0){
			entity=super.update(draftIssuedDto, draftIssuedDto.getId());
		}else{
			entity=super.create(draftIssuedDto);
		}
		super.repository.save(entity);
		logger.info("保存发文拟稿信息");
	}
}

package cs.service.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import cs.domain.CreditProjectAnomaly;
import cs.model.PageModelDto;
import cs.model.DomainDto.CreditProjectAnomalyDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.CreditProjectAnomalyService;

/**
 * @Description： 
 * @author Administrator
 *
 */
@Service
public class CreditProjectAnomalyServiceImpl extends AbstractServiceImpl<CreditProjectAnomalyDto, CreditProjectAnomaly, String> implements CreditProjectAnomalyService{
	
	private static Logger logger = Logger.getLogger(CreditProjectAnomalyServiceImpl.class);
	
	@Override
	@Transactional
	public CreditProjectAnomaly create(CreditProjectAnomalyDto dto){
		CreditProjectAnomaly entity = super.create(dto);
		logger.info(String.format("创建项目异常名录,名称：%s",dto.getProjectName()));
		super.repository.save(entity);
		return entity;
	}
	
	@Override
	@Transactional
	public PageModelDto<CreditProjectAnomalyDto> get(ODataObj odataObj){
		logger.info("查询异常名录信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public CreditProjectAnomaly update(CreditProjectAnomalyDto dto,String id) {		
		CreditProjectAnomaly illegalName = super.update(dto, id);
		super.repository.save(illegalName);
		logger.info("更新异常名录信息");	
		return illegalName;
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		CreditProjectAnomaly illegalName = super.findById(id);
		super.repository.delete(illegalName);
		logger.info("删除异常名录信息");	
	}
}

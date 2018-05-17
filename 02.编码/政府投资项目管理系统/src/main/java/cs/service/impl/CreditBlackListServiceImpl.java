package cs.service.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import cs.domain.CreditBlackList;
import cs.model.PageModelDto;
import cs.model.DomainDto.CreditBlackListDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.CreditBlackListService;

import java.util.List;

/**
 * @Description: 信用黑名单信息服务层
 * @author： wxy
 * @createDate： 2017年9月1日
 * @version:
 */

@Service
public class CreditBlackListServiceImpl extends AbstractServiceImpl<CreditBlackListDto, CreditBlackList, String> implements CreditBlackListService{
	private static Logger logger = Logger.getLogger(CreditBlackListServiceImpl.class);
	
	@Override
	@Transactional
	public PageModelDto<CreditBlackListDto> get(ODataObj odataObj){
		logger.info("查询黑名单信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public CreditBlackList create(CreditBlackListDto dto){
		CreditBlackList entity = super.create(dto);
		logger.info(String.format("创建黑名单,名称：%s",dto.getProjectName()));
		super.repository.save(entity);
		return entity;
	}
	
	@Override
	@Transactional
	public CreditBlackList update(CreditBlackListDto dto,String id) {		
		CreditBlackList blackList = super.update(dto, id);
		super.repository.save(blackList);
		logger.info("更新黑名单信息");	
		return blackList;
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		CreditBlackList blackList = super.findById(id);
		super.repository.delete(blackList);
		logger.info("删除异常名录信息");	
	}

	@Override
	public List<CreditBlackListDto> findByDto(ODataObj odataObj) {
		return null;
	}

}

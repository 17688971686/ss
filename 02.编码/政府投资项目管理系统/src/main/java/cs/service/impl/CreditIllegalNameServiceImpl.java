package cs.service.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

import cs.domain.CreditIllegalName;
import cs.model.PageModelDto;
import cs.model.DomainDto.CreditIllegalNameDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.CreditIllegalNameService;
/**
 * @Description: 项目异常名录信息服务层
 * @author: wxy
 * @Date：2017年8月30日
 * @version：
 */
@Service
public class CreditIllegalNameServiceImpl extends AbstractServiceImpl<CreditIllegalNameDto, CreditIllegalName, String> implements CreditIllegalNameService{
	private static Logger logger = Logger.getLogger(CreditIllegalNameServiceImpl.class);
	
	
	@Override
	@Transactional
	public CreditIllegalName create(CreditIllegalNameDto dto){
		CreditIllegalName entity = super.create(dto);
		logger.info(String.format("创建项目异常名录,名称：%s",dto.getProjectName()));
		super.repository.save(entity);
		return entity;
	}
	
	@Override
	@Transactional
	public PageModelDto<CreditIllegalNameDto> get(ODataObj odataObj){
		logger.info("查询异常名录信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public CreditIllegalName update(CreditIllegalNameDto dto,String id) {		
		CreditIllegalName illegalName = super.update(dto, id);
		super.repository.save(illegalName);
		logger.info("更新异常名录信息");	
		return illegalName;
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		CreditIllegalName illegalName = super.findById(id);
		super.repository.delete(illegalName);
		logger.info("删除异常名录信息");	
	}

}

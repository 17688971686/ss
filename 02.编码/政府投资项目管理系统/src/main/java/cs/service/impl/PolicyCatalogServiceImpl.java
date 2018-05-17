package cs.service.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Service;

import cs.domain.PolicyCatalog;
import cs.domain.PolicyCatalog_;
import cs.model.PageModelDto;
import cs.model.DomainDto.PolicyCatalogDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PolicyCatalogService;

/**
 * @Description: 政策目录服务层
 * @author: wxy
 * @Date：2017年09月12日
 * @version：
 */
@Service
public class PolicyCatalogServiceImpl extends AbstractServiceImpl<PolicyCatalogDto, PolicyCatalog, String> implements PolicyCatalogService{
	private static Logger logger = Logger.getLogger(PolicyCatalogServiceImpl.class);
	
	
	@Override
	@Transactional
	public PolicyCatalog create(PolicyCatalogDto dto){
		String name = dto.getName();
		String code = dto.getCode();
		PolicyCatalog policyCatalog1 = findPolicyCatalogByName(name);
		PolicyCatalog policyCatalog2 = findPolicyCatalogByCode(code);
		if(policyCatalog1 != null ){
			throw new IllegalArgumentException(String.format("政策目录：%s 已经存在政策目录中,请重新修改！", name));
		}
		if(policyCatalog2 != null){
			throw new IllegalArgumentException(String.format("政策目录：%s 已经存在政策目录中,请重新修改！", code));
		}
		PolicyCatalog entity = super.create(dto);
		logger.info(String.format("创建政策目录,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;
		
	}
	
	@Override
	@Transactional
	public PageModelDto<PolicyCatalogDto> get(ODataObj odataObj){
		logger.info("查询政策目录信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public PolicyCatalog update(PolicyCatalogDto dto,String id) {
		PolicyCatalog policyCatalog = super.findById(id);
		String oldName = policyCatalog.getName();
		String oldCode = policyCatalog.getCode();
		String name = dto.getName();
		String code = dto.getCode();
		PolicyCatalog policyCatalog1 = findPolicyCatalogByName(name);
		PolicyCatalog policyCatalog2 = findPolicyCatalogByCode(code);
		//判断修改后的和没修改前的进行比对
		if(!oldName.equals(name) && !oldCode.equals(code)){
			if(policyCatalog1 != null ){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", name));
			}
			if(policyCatalog2 != null){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", code));
			}
			policyCatalog = super.update(dto, id);
			super.repository.save(policyCatalog);
			logger.info("更新异常名录信息");	
			return policyCatalog;
			
		}
		if(!oldName.equals(name) && oldCode.equals(code)){
			if(policyCatalog1 != null ){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", name));
			}
			policyCatalog = super.update(dto, id);
			super.repository.save(policyCatalog);
			logger.info("更新异常名录信息");	
			return policyCatalog;
			
		}
		if(oldName.equals(name) && !oldCode.equals(code)){
			if(policyCatalog2 != null){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", code));
			}
			policyCatalog = super.update(dto, id);
			super.repository.save(policyCatalog);
			logger.info("更新异常名录信息");	
			return policyCatalog;
			
		}
		logger.info("更新异常名录信息");
		return policyCatalog;
		
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		PolicyCatalog policyCatalog = super.findById(id);
		List<PolicyCatalog> policyCatalogs = getPolicyCatalogByParentId(id);
		if(policyCatalogs != null){
			for (PolicyCatalog otherPolicyCatalog : policyCatalogs) {
				super.repository.delete(otherPolicyCatalog);
			}
		}
		super.repository.delete(policyCatalog);
		logger.info("删除异常名录信息");	
	}

	@Override
	public List<PolicyCatalogDto> findByDto(ODataObj odataObj) {
		return null;
	}

	@Override
	@Transactional
	public PolicyCatalog findPolicyCatalogByName(String name) {
		PolicyCatalog policyCatalog;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(PolicyCatalog_.name.getName(), name);
		Optional<PolicyCatalog>	query_policyCatalog =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_policyCatalog.isPresent()){
			policyCatalog = query_policyCatalog.get();
			return policyCatalog;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public PolicyCatalog findPolicyCatalogByCode(String code) {
		PolicyCatalog policyCatalog;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(PolicyCatalog_.code.getName(), code);
		Optional<PolicyCatalog>	query_policyCatalog =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_policyCatalog.isPresent()){
			policyCatalog = query_policyCatalog.get();
			return policyCatalog; 
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public void deletePolicyCatalogs(String[] ids) {
		for (String id : ids) {
			delete(id);
		}
	}

	@Override
	@Transactional
	public List<PolicyCatalog> getPolicyCatalogByParentId(String parentId) {
		Criterion criterion=Restrictions.eq(PolicyCatalog_.parentId.getName(), parentId);
		List<PolicyCatalog>	query_policyCatalogs =super.repository.findByCriteria(criterion);
		if(query_policyCatalogs.size()>0){
			return query_policyCatalogs;
		}else{
			return null;
		}
	}


}

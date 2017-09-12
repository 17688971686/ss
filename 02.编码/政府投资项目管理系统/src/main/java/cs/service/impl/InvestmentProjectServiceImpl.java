package cs.service.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.CreditIllegalName;
import cs.domain.InvestmentProject;
import cs.domain.InvestmentProject_;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.InvestmentProjectDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.InvestmentProjectService;

/**
 * @Description： 投资项目信息服务层
 * @author： wxy
 * @createDate: 2017年09月07日
 * @version： 
 */

@Service
public class InvestmentProjectServiceImpl extends AbstractServiceImpl<InvestmentProjectDto,InvestmentProject, String> implements InvestmentProjectService{
	private static Logger logger = Logger.getLogger(InvestmentProjectServiceImpl.class);
	
	@Autowired
	private IRepository<CreditIllegalName, String> investmentProjectRepo;
	
	@Override
	@Transactional
	public InvestmentProject create(InvestmentProjectDto dto){
		String name = dto.getName();
		String code = dto.getCode();
		InvestmentProject investmentProject1 = findInvestmentProjectByName(name);
		InvestmentProject investmentProject2 = findInvestmentProjectByCode(code);
		if(investmentProject1 != null ){
			throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", name));
		}
		if(investmentProject2 != null){
			throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", code));
		}
		InvestmentProject entity = super.create(dto);
		logger.info(String.format("创建投资项目目录,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;
		
	}
	
	@Override
	@Transactional
	public PageModelDto<InvestmentProjectDto> get(ODataObj odataObj){
		logger.info("查询异常名录信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public InvestmentProject update(InvestmentProjectDto dto,String id) {
		InvestmentProject investmentProject = super.findById(id);
		String oldName = investmentProject.getName();
		String oldCode = investmentProject.getCode();
		String name = dto.getName();
		String code = dto.getCode();
		InvestmentProject investmentProject1 = findInvestmentProjectByName(name);
		InvestmentProject investmentProject2 = findInvestmentProjectByCode(code);
		//判断修改后的和没修改前的进行比对
		if(!oldName.equals(name) && !oldCode.equals(code)){
			System.out.println(1);
			if(investmentProject1 != null ){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", name));
			}
			if(investmentProject2 != null){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", code));
			}
			investmentProject = super.update(dto, id);
			super.repository.save(investmentProject);
			logger.info("更新异常名录信息");	
			return investmentProject;
			
		}
		if(!oldName.equals(name) && oldCode.equals(code)){
			System.out.println(2);
			if(investmentProject1 != null ){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", name));
			}
			investmentProject = super.update(dto, id);
			super.repository.save(investmentProject);
			logger.info("更新异常名录信息");	
			return investmentProject;
			
		}
		if(oldName.equals(name) && !oldCode.equals(code)){
			System.out.println(3);
			if(investmentProject2 != null){
				throw new IllegalArgumentException(String.format("投资项目：%s 已经存在投资目录中,请重新修改！", code));
			}
			investmentProject = super.update(dto, id);
			super.repository.save(investmentProject);
			logger.info("更新异常名录信息");	
			return investmentProject;
			
		}
		logger.info("更新异常名录信息");
		return investmentProject;
		
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		InvestmentProject investmentProject = super.findById(id);
		List<InvestmentProject> investmentProjects = getInvestmentProjectByParentId(id);
		if(investmentProjects != null){
			for (InvestmentProject otherInvestmentProject : investmentProjects) {
				super.repository.delete(otherInvestmentProject);
			}
		}
		super.repository.delete(investmentProject);
		logger.info("删除异常名录信息");	
	}

	@Override
	@Transactional
	public InvestmentProject findInvestmentProjectByName(String name) {
		InvestmentProject investmentProject;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(InvestmentProject_.name.getName(), name);
		Optional<InvestmentProject>	query_investmentProject =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_investmentProject.isPresent()){
			investmentProject = query_investmentProject.get();
			return investmentProject;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public InvestmentProject findInvestmentProjectByCode(String code) {
		InvestmentProject investmentProject;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(InvestmentProject_.code.getName(), code);
		Optional<InvestmentProject>	query_investmentProject =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_investmentProject.isPresent()){
			investmentProject = query_investmentProject.get();
			return investmentProject; 
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public void deleteCatalogs(String[] ids) {
		for (String id : ids) {
			delete(id);
		}
	}

	@Override
	@Transactional
	public List<InvestmentProject> getInvestmentProjectByParentId(String parentId) {
		Criterion criterion=Restrictions.eq(InvestmentProject_.parentId.getName(), parentId);
		List<InvestmentProject>	query_investmentProjects =super.repository.findByCriteria(criterion);
		if(query_investmentProjects.size()>0){
			return query_investmentProjects;
		}else{
			return null;
		}
	}
}

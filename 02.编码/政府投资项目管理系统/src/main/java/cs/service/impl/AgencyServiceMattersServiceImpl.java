package cs.service.impl;

import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.AgencyServiceMatters;
import cs.domain.AgencyServiceMatters_;
import cs.model.PageModelDto;
import cs.model.DomainDto.AgencyServiceMattersDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AgencyServiceMattersService;

/**
 * @Description： 中介服务事项服务层
 * @author： wxy
 * @createDate： 2017年09月14日
 * @version： 
 */
@Service
public class AgencyServiceMattersServiceImpl extends AbstractServiceImpl<AgencyServiceMattersDto, AgencyServiceMatters, String> implements AgencyServiceMattersService{
	
	private static Logger logger = Logger.getLogger(AgencyServiceMattersServiceImpl.class);
	
	@Autowired
	private IRepository<AgencyServiceMatters, String> agencyServiceMatters;
	
	@Override
	@Transactional
	public AgencyServiceMatters create(AgencyServiceMattersDto dto){
		String name = dto.getName();
		String code = dto.getCode();
		AgencyServiceMatters agencyServiceMatters1 = findAgencyServiceMattersByName(name);
		AgencyServiceMatters agencyServiceMatters2 = findAgencyServiceMattersByCode(code);
		if(agencyServiceMatters1 != null ){
			throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
		}
		if(agencyServiceMatters2 != null){
			throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
		}
		AgencyServiceMatters entity = super.create(dto);
		logger.info(String.format("创建部门审批事项,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;
		
	}
	
	@Override
	@Transactional
	public PageModelDto<AgencyServiceMattersDto> get(ODataObj odataObj){
		logger.info("查询部门审批事项信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public AgencyServiceMatters update(AgencyServiceMattersDto dto,String id) {
		AgencyServiceMatters agencyServiceMatters = super.findById(id);
		String oldName = agencyServiceMatters.getName();
		String oldCode = agencyServiceMatters.getCode();
		String name = dto.getName();
		String code = dto.getCode();
		AgencyServiceMatters agencyServiceMatters1 = findAgencyServiceMattersByName(name);
		AgencyServiceMatters agencyServiceMatters2 = findAgencyServiceMattersByCode(code);
		//判断修改后的和没修改前的进行比对
		if(!oldName.equals(name) && !oldCode.equals(code)){
			if(agencyServiceMatters1 != null ){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
			}
			if(agencyServiceMatters2 != null){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
			}
			agencyServiceMatters = super.update(dto, id);
			super.repository.save(agencyServiceMatters);
			logger.info("更新部门审批事项信息");	
			return agencyServiceMatters;
			
		}
		if(!oldName.equals(name) && oldCode.equals(code)){
			if(agencyServiceMatters1 != null ){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
			}
			agencyServiceMatters = super.update(dto, id);
			super.repository.save(agencyServiceMatters);
			logger.info("更新部门审批事项信息");	
			return agencyServiceMatters;
			
		}
		if(oldName.equals(name) && !oldCode.equals(code)){
			if(agencyServiceMatters2 != null){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
			}
			agencyServiceMatters = super.update(dto, id);
			super.repository.save(agencyServiceMatters);
			logger.info("更新部门审批事项信息");	
			return agencyServiceMatters;
			
		}
		logger.info("更新部门审批事项信息");
		return agencyServiceMatters;
		
	}
	
	@Override
	@Transactional
	public void delete(String id){
		AgencyServiceMatters agencyServiceMatters =  super.findById(id);
		super.repository.delete(agencyServiceMatters);
		logger.info("删除中介服务事项");
	}
	
	@Override
	@Transactional
	public AgencyServiceMatters findAgencyServiceMattersByName(String name) {
		AgencyServiceMatters agencyServiceMatters;
		Criterion criterion = Restrictions.eq(AgencyServiceMatters_.name.getName(), name);
		Optional<AgencyServiceMatters> query_agencyServiceMatters = super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_agencyServiceMatters.isPresent()){
			agencyServiceMatters = query_agencyServiceMatters.get();
			return agencyServiceMatters;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public AgencyServiceMatters findAgencyServiceMattersByCode(String code) {
		AgencyServiceMatters agencyServiceMatters;
		Criterion criterion = Restrictions.eq(AgencyServiceMatters_.code.getName(),code);
		Optional<AgencyServiceMatters> query_agencyServiceMatters = super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_agencyServiceMatters.isPresent()){
			agencyServiceMatters = query_agencyServiceMatters.get();
			return agencyServiceMatters;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public void deleteAgencyServiceMattersCatalogs(String[] ids) {
		for(String id : ids){
			delete(id);
		}
		
	}

}

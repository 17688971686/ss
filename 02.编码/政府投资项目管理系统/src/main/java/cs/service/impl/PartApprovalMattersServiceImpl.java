package cs.service.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.PartApprovalMatters;
import cs.domain.PartApprovalMatters_;
import cs.model.PageModelDto;
import cs.model.DomainDto.PartApprovalMattersDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PartApprovalMattersService;

/**
 * @Description： 部门审批事项服务层
 * @author： wxy
 * @createDate： 2017年09月13日
 * @version： 
 */
@Service
public class PartApprovalMattersServiceImpl extends AbstractServiceImpl<PartApprovalMattersDto, PartApprovalMatters, String> 
	implements PartApprovalMattersService{
	private static Logger logger = Logger.getLogger(PartApprovalMattersServiceImpl.class);
	
	@SuppressWarnings("unused")
	@Autowired
	private IRepository<PartApprovalMatters, String> partApprovalMatters;
	
	@Override
	@Transactional
	public PartApprovalMatters create(PartApprovalMattersDto dto){
		String name = dto.getName();
		String code = dto.getCode();
		PartApprovalMatters partApprovalMatters1 = findPartApprovalMattersByName(name);
		PartApprovalMatters partApprovalMatters2 = findPartApprovalMattersByCode(code);
		if(partApprovalMatters1 != null ){
			throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
		}
		if(partApprovalMatters2 != null){
			throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
		}
		PartApprovalMatters entity = super.create(dto);
		logger.info(String.format("创建部门审批事项,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;
		
	}
	
	@Override
	@Transactional
	public PageModelDto<PartApprovalMattersDto> get(ODataObj odataObj){
		logger.info("查询部门审批事项信息");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public PartApprovalMatters update(PartApprovalMattersDto dto,String id) {
		PartApprovalMatters partApprovalMatters = super.findById(id);
		String oldName = partApprovalMatters.getName();
		String oldCode = partApprovalMatters.getCode();
		String name = dto.getName();
		String code = dto.getCode();
		PartApprovalMatters partApprovalMatters1 = findPartApprovalMattersByName(name);
		PartApprovalMatters partApprovalMatters2 = findPartApprovalMattersByCode(code);
		//判断修改后的和没修改前的进行比对
		if(!oldName.equals(name) && !oldCode.equals(code)){
			if(partApprovalMatters1 != null ){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
			}
			if(partApprovalMatters2 != null){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
			}
			partApprovalMatters = super.update(dto, id);
			super.repository.save(partApprovalMatters);
			logger.info("更新部门审批事项信息");	
			return partApprovalMatters;
			
		}
		if(!oldName.equals(name) && oldCode.equals(code)){
			if(partApprovalMatters1 != null ){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", name));
			}
			partApprovalMatters = super.update(dto, id);
			super.repository.save(partApprovalMatters);
			logger.info("更新部门审批事项信息");	
			return partApprovalMatters;
			
		}
		if(oldName.equals(name) && !oldCode.equals(code)){
			if(partApprovalMatters2 != null){
				throw new IllegalArgumentException(String.format("部门审批事项：%s 已经存在部门审批事项目录中,请重新修改！", code));
			}
			partApprovalMatters = super.update(dto, id);
			super.repository.save(partApprovalMatters);
			logger.info("更新部门审批事项信息");	
			return partApprovalMatters;
			
		}
		logger.info("更新部门审批事项信息");
		return partApprovalMatters;
		
	}
	
	@Override
	@Transactional
	public void delete(String id) {		
		PartApprovalMatters partApprovalMatters = super.findById(id);
		super.repository.delete(partApprovalMatters);
		logger.info("删除部门审批事项信息");	
	}

	@Override
	public List<PartApprovalMattersDto> findByDto(ODataObj odataObj) {
		return null;
	}

	@Override
	@Transactional
	public PartApprovalMatters findPartApprovalMattersByName(String name) {
		PartApprovalMatters partApprovalMatters;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(PartApprovalMatters_.name.getName(), name);
		Optional<PartApprovalMatters>	query_PartApprovalMatters =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_PartApprovalMatters.isPresent()){
			partApprovalMatters = query_PartApprovalMatters.get();
			return partApprovalMatters;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public PartApprovalMatters findPartApprovalMattersByCode(String code) {
		PartApprovalMatters partApprovalMatters;
		//根据用户名来判断是否有该投资项目这条记录
		Criterion criterion=Restrictions.eq(PartApprovalMatters_.code.getName(), code);
		Optional<PartApprovalMatters>	query_partApprovalMatters =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_partApprovalMatters.isPresent()){
			partApprovalMatters = query_partApprovalMatters.get();
			return partApprovalMatters; 
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public void deletePartApprovalMattersCatalogs(String[] ids) {
		for (String id : ids) {
			delete(id);
		}
	}

}

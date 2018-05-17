package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.MediationUnit;
import cs.model.PageModelDto;
import cs.model.DomainDto.MediationUnitDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.MediationUnitService;

@Service
public class MediationUnitServiceImpl extends AbstractServiceImpl<MediationUnitDto,MediationUnit,String>  implements MediationUnitService{
	private static Logger logger = Logger.getLogger(MediationUnitServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private IRepository<MediationUnit, String> mediationUnitRepo;
	
	@Autowired
	private IMapper<MediationUnitDto, MediationUnit>  mediationUnitMapper;
	@Override
	@Transactional
	public PageModelDto<MediationUnitDto> get(ODataObj odataObj) {
		List<MediationUnitDto> mediationUnitDtos=new ArrayList<MediationUnitDto>();
		mediationUnitRepo.findByOdata(odataObj).forEach(x->{
			MediationUnitDto dto=mediationUnitMapper.toDto(x);
			mediationUnitDtos.add(dto);
		});
		PageModelDto<MediationUnitDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(mediationUnitDtos);
		return pageModelDto;	
	}
	@Override
	@Transactional
	public MediationUnit update(MediationUnitDto dto, String id) {
		logger.info(String.format("编辑中介单位信息,中介单位名称 %s",dto.getMediationUnitName()));
		MediationUnit mediationUnit=super.update(dto, id);
		return super.repository.save(mediationUnit);
	}
	@Override
	@Transactional
	public MediationUnit create(MediationUnitDto dto) {
		logger.info(String.format("新增中介单位信息,中介单位名称  %s",dto.getMediationUnitName()));
		MediationUnit mediationUnit=super.create(dto);
		return super.repository.save(mediationUnit);
	}
	@Override
	@Transactional
	public void delete(String id) {
    	MediationUnit  mediationUnit= mediationUnitRepo.findById(id);
		if(mediationUnit.getAssistReviews().size()>0){
			throw new IllegalArgumentException(String.format("该中介单位已有关联的协审活动，删除失败！"));	
		}
		else{
			logger.info(String.format("删除协审活动信息,评审活动id %s",id));
			super.delete(id);
		}
	}
	@Override
	@Transactional
	public void deletes(String[] ids) {
		super.deletes(ids);
	}

	@Override
	public List<MediationUnitDto> findByDto(ODataObj odataObj) {
		return null;
	}


}

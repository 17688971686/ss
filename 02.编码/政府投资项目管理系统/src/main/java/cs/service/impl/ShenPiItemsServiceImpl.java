package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.Project;
import cs.domain.ShenPiItems;
import cs.domain.ShenPiUnit;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenPiItemsDto;
import cs.model.DomainDto.ShenPiUnitDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenPiItemsService;
@Service
public class ShenPiItemsServiceImpl  extends AbstractServiceImpl<ShenPiItemsDto,ShenPiItems,String>  implements  ShenPiItemsService{
	private static Logger logger = Logger.getLogger(ShenPiItemsServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private IRepository<ShenPiItems, String> shenPiItemsRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<ShenPiUnit, String> shenpiUnitRepo;
	@Autowired
	private IMapper<ShenPiItemsDto, ShenPiItems>  shenPiItemsMapper;
	@Autowired
	private IMapper<ShenPiUnitDto, ShenPiUnit>  shenpiUnitMapper;
	@Autowired
	private IMapper<ProjectDto, Project>  projectMapper;
	@Override
	@Transactional
	public PageModelDto<ShenPiItemsDto> get(ODataObj odataObj) {
		List<ShenPiItemsDto> shenPiItemsDtos=new ArrayList<ShenPiItemsDto>();
		shenPiItemsRepo.findByOdata(odataObj).forEach(x->{
			ShenPiItemsDto dto=shenPiItemsMapper.toDto(x);
			if(x.getProjectId()!=null){
			Project project=projectRepo.findById(x.getProjectId());
			ProjectDto projectDto=projectMapper.toDto(project);
			dto.setProjectDto(projectDto);
			}
			if(x.getShenpiUnitId()!=null){
		    ShenPiUnit shenPiUnit=	shenpiUnitRepo.findById(x.getShenpiUnitId());
			ShenPiUnitDto shenPiUnitDto=shenpiUnitMapper.toDto(shenPiUnit);
			dto.setShenPiUnitDto(shenPiUnitDto);
			}
			shenPiItemsDtos.add(dto);
		});
		PageModelDto<ShenPiItemsDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenPiItemsDtos);
		return pageModelDto;	
	}
	@Override
	@Transactional
	public ShenPiItems update(ShenPiItemsDto dto, String id) {
		dto.setProjectId(dto.getProjectDto().getId());
		dto.setProjectName(dto.getProjectDto().getProjectName());
		dto.setShenpiUnitId(dto.getProjectDto().getId());
		dto.setShenpiUnitName(dto.getShenPiUnitDto().getShenpiUnitName());
		logger.info(String.format("编辑审批事项信息,审批事项名称 %s",dto.getShenpiName()));
		ShenPiItems shenpiItems=super.update(dto, id);
		return super.repository.save(shenpiItems);
	}
	@Override
	@Transactional
	public ShenPiItems create(ShenPiItemsDto dto) {
		dto.setShenpiState("zc");
		dto.setProjectId(dto.getProjectDto().getId());
		dto.setProjectName(dto.getProjectDto().getProjectName());
		dto.setShenpiUnitId(dto.getProjectDto().getId());
		dto.setShenpiUnitName(dto.getShenPiUnitDto().getShenpiUnitName());
		logger.info(String.format("新增审批事项,审批事项名称  %s",dto.getShenpiName()));
		ShenPiItems shenPiItems=super.create(dto);
		return super.repository.save(shenPiItems);
	}
	@Override
	@Transactional
	public void delete(String id) {
	   logger.info(String.format("删除审批事项,审批事项id %s",id));
	   super.delete(id);
	}
	@Override
	@Transactional
	public void deletes(String[] ids) {
		super.deletes(ids);
	}
	

}

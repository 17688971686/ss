package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.AssistReview;
import cs.domain.MediationUnit;
import cs.domain.Project;
import cs.model.PageModelDto;
import cs.model.DomainDto.AssistReviewDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AssistReviewService;

@Service
public class AssistReviewServiceImpl extends AbstractServiceImpl<AssistReviewDto,AssistReview,String>  implements  AssistReviewService{
	private static Logger logger = Logger.getLogger(AssistReviewServiceImpl.class);
	// 依赖注入持久层  
	@Autowired
	private IRepository<AssistReview, String> assistReviewRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IMapper<AssistReviewDto, AssistReview>  assistReviewMapper;
	@Autowired 
	private IMapper<ProjectDto, Project> projectMapper;
	@Autowired
	private IRepository<MediationUnit, String> mediationUnitRepo;
	
    @Override
	@Transactional
	public PageModelDto<AssistReviewDto> get(ODataObj odataObj) {
		List<AssistReviewDto> assistReviewDtos=new ArrayList<AssistReviewDto>();
		assistReviewRepo.findByOdata(odataObj).forEach(x->{
			AssistReviewDto dto=assistReviewMapper.toDto(x);
			if(x.getProjectId()!=null){
				ProjectDto projectDto=projectMapper.toDto(projectRepo.findById(x.getProjectId()));
				dto.setProjectDto(projectDto);			
			}
			assistReviewDtos.add(dto);
		});
		PageModelDto<AssistReviewDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(assistReviewDtos);
		return pageModelDto;	
	}
    @Override
	@Transactional
	public AssistReview update(AssistReviewDto dto, String id) {
		logger.info(String.format("编辑协审活动信息,协审活动名称 %s",dto.getAssistReviewName()));
		AssistReview assistReview=super.update(dto, id);
		assistReview.getMediationUnits().clear();
		dto.getMediationUnitDtos().forEach(x->{
			assistReview.getMediationUnits().add(mediationUnitRepo.findById(x.getId()));
		});
		assistReview.setProjectId(dto.getProjectDto().getId());
		return super.repository.save(assistReview);
	}
    @Override
	@Transactional
	public AssistReview create(AssistReviewDto dto) {
		logger.info(String.format("新增协审活动,协审活动名称 %s",dto.getAssistReviewName()));
		AssistReview assistReview=super.create(dto);
		assistReview.getMediationUnits().clear();
		dto.getMediationUnitDtos().forEach(x->{
			assistReview.getMediationUnits().add(mediationUnitRepo.findById(x.getId()));
		});
		assistReview.setProjectId(dto.getProjectDto().getId());
		return super.repository.save(assistReview);
	}
    @Override
	@Transactional
	public void delete(String id) {
		logger.info(String.format("删除协审活动信息,评审活动id %s",id));
		super.delete(id);
	}
	@Override
	@Transactional
	public void deletes(String[] ids) {
		super.deletes(ids);
	}
}

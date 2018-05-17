package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.AssistReview;
import cs.domain.Attachment;
import cs.domain.MediationUnit;
import cs.domain.Project;
import cs.domain.ServiceEvaluation;
import cs.domain.SubmitReviewEvaluation;
import cs.model.PageModelDto;
import cs.model.DomainDto.AssistReviewDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ServiceEvaluationDto;
import cs.model.DomainDto.SubmitReviewEvaluationDto;
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
	private IMapper<ServiceEvaluationDto, ServiceEvaluation> serviceEvaluationMapper;
	@Autowired 
	private IMapper<SubmitReviewEvaluationDto, SubmitReviewEvaluation> submitReviewEvaluationMapper;
	@Autowired
	private IRepository<MediationUnit, String> mediationUnitRepo;
	@Autowired
	private IRepository<ServiceEvaluation, String> serviceEvaluationRepo;
	@Autowired
	private IRepository<SubmitReviewEvaluation, String> submitReviewEvaluationRepo;
	@Autowired 
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	
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
   	public AssistReview updateAssistReview(AssistReviewDto dto, String id) {
    	logger.info(String.format("编辑协审活动信息,协审活动名称 %s",dto.getAssistReviewName()));
    	AssistReview assistReview1=super.update(dto, id);
    	assistReviewRepo.delete(assistReview1);
    	AssistReview assistReview=super.create(dto);
		assistReview.getMediationUnits().clear();
		dto.getMediationUnitDtos().forEach(x->{
			assistReview.getMediationUnits().add(mediationUnitRepo.findById(x.getId()));
			ServiceEvaluationDto evaluationDto=new ServiceEvaluationDto();
			evaluationDto.setMediationUnitId(x.getId());
			evaluationDto.setMediationUnitName(x.getMediationUnitName());
			SubmitReviewEvaluationDto reviewEvaluationDto=new SubmitReviewEvaluationDto();
			reviewEvaluationDto.setMediationUnitId(x.getId());
			reviewEvaluationDto.setMediationUnitName(x.getMediationUnitName());
			ServiceEvaluation evaluation=serviceEvaluationMapper.buildEntity(evaluationDto, new ServiceEvaluation());
			SubmitReviewEvaluation reviewEvaluation=submitReviewEvaluationMapper.buildEntity(reviewEvaluationDto, new SubmitReviewEvaluation());
			assistReview.getServiceEvaluation().add(evaluation);
			assistReview.getSubmitReviewEvaluation().add(reviewEvaluation);
		});
		dto.getServiceEvaluationDtos().forEach(x->{
			assistReview.getServiceEvaluation().add(serviceEvaluationRepo.findById(x.getId()));
		});
		assistReview.setProjectId(dto.getProjectDto().getId());
		return super.repository.save(assistReview);
    }
    @Override
	@Transactional
	public AssistReview update(AssistReviewDto dto, String id) {
		logger.info(String.format("编辑协审活动评价,协审活动名称 %s",dto.getAssistReviewName()));
		AssistReview assistReview=super.update(dto, id);
		//删除历史附件  
		assistReview.getServiceEvaluation().forEach(x->{
			serviceEvaluationRepo.delete(x);
		});
		assistReview.getSubmitReviewEvaluation().forEach(x->{
			submitReviewEvaluationRepo.delete(x);
		});
		assistReview.getMediationUnits().clear();
		assistReview.getServiceEvaluation().clear();
		assistReview.getSubmitReviewEvaluation().clear();
		dto.getMediationUnitDtos().forEach(x->{
			assistReview.getMediationUnits().add(mediationUnitRepo.findById(x.getId()));
		});
		//添加服务质量评价
		dto.getServiceEvaluationDtos().forEach(x->{
			ServiceEvaluation evaluation=serviceEvaluationMapper.buildEntity(x, new ServiceEvaluation());
			x.getAttachmentDtos().forEach(y->{
				evaluation.getAttachments().add(attachmentMapper.buildEntity(y, new Attachment()));
			});
			assistReview.getServiceEvaluation().add(evaluation);
		});
		//添加送审文章质量评价
		dto.getSubmitReviewEvaluationDtos().forEach(x->{
			SubmitReviewEvaluation evaluation=submitReviewEvaluationMapper.buildEntity(x, new SubmitReviewEvaluation());
			x.getAttachmentDtos().forEach(y->{
				evaluation.getAttachments().add(attachmentMapper.buildEntity(y, new Attachment()));
			});
			assistReview.getSubmitReviewEvaluation().add(evaluation);
		});
		assistReview.setProjectId(dto.getProjectDto().getId());
		assistReview.setIsEvaluation(true);
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
			ServiceEvaluationDto evaluationDto=new ServiceEvaluationDto();
			evaluationDto.setMediationUnitId(x.getId());
			evaluationDto.setMediationUnitName(x.getMediationUnitName());
			SubmitReviewEvaluationDto reviewEvaluationDto=new SubmitReviewEvaluationDto();
			reviewEvaluationDto.setMediationUnitId(x.getId());
			reviewEvaluationDto.setMediationUnitName(x.getMediationUnitName());
			ServiceEvaluation evaluation=serviceEvaluationMapper.buildEntity(evaluationDto, new ServiceEvaluation());
			SubmitReviewEvaluation reviewEvaluation=submitReviewEvaluationMapper.buildEntity(reviewEvaluationDto, new SubmitReviewEvaluation());
			assistReview.getServiceEvaluation().add(evaluation);
			assistReview.getSubmitReviewEvaluation().add(reviewEvaluation);
		});//submitReviewEvaluationMapper
		assistReview.setProjectId(dto.getProjectDto().getId());
		assistReview.setIsEvaluation(false);
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

	@Override
	public List<AssistReviewDto> findByDto(ODataObj odataObj) {
		return null;
	}
}

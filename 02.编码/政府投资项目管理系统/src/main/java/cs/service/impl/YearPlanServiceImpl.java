package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.common.SQLConfig;
import cs.domain.ShenBaoInfo;
import cs.domain.YearPlan;
import cs.domain.YearPlanCapital;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.YearPlanService;

@Service
public class YearPlanServiceImpl implements YearPlanService {
	private static Logger logger = Logger.getLogger(YearPlanServiceImpl.class);
	@Autowired
	private IRepository<YearPlan, String> yearPlanRepo;
	@Autowired
	private IRepository<YearPlanCapital, String> yearPlanCapitalRepo;
	@Autowired
	private IRepository<ShenBaoInfo, String> shenbaoInfoRepo;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private BasicDataService basicDataService;
	
	@Autowired
	private IMapper<YearPlanDto, YearPlan> yearPlanMapper;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoInfoMapper;

	@Override
	@Transactional
	public PageModelDto<YearPlanDto> get(ODataObj odataObj) {
		List<YearPlanDto> yearPlanDtos=new ArrayList<>();
		yearPlanRepo.findByOdata(odataObj).forEach(x->{
			
			YearPlanDto yearPlanDto=yearPlanMapper.toDto(x);			
			yearPlanDtos.add(yearPlanDto);	
			
		});
		PageModelDto<YearPlanDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(yearPlanDtos);
		logger.info("查询年度计划数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void create(YearPlanDto dto) {
		YearPlan entity=new YearPlan();
		yearPlanMapper.buildEntity(dto, entity);
		//设置创建人和修改人
		String loginName = currentUser.getLoginName();
		entity.setCreatedBy(loginName);
		entity.setModifiedBy(loginName);
		yearPlanRepo.save(entity);
		logger.info(String.format("创建年度计划,名称：%s",dto.getName()));
	}

	@Override
	@Transactional
	public void update(YearPlanDto dto) {
		YearPlan entity=yearPlanRepo.findById(dto.getId());
		if(entity!=null){
			entity.getYearPlanCapitals().clear();
			yearPlanMapper.buildEntity(dto, entity);
			//设置修改人和修改时间
			entity.setModifiedBy(currentUser.getLoginName());
			entity.setModifiedDate(new Date());
			yearPlanRepo.save(entity);
			logger.info(String.format("更新年度计划,名称：%s",dto.getName()));
		}
		
	}

	@Override
	@Transactional
	public List<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId) {	
		YearPlan yearPlan=yearPlanRepo.findById(planId);
		if(yearPlan!=null){
			List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
			
			List<ShenBaoInfo> shenBaoInfos=shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanProject)
					.setParameter("yearPlanId", planId)
					.addEntity(ShenBaoInfo.class)
					.getResultList();
			shenBaoInfos.forEach(x->{
				ShenBaoInfoDto shenBaoInfoDto = shenbaoInfoMapper.toDto(x);
				//获取项目相关类型的名称
				shenBaoInfoDto.setProjectClassifyDesc(basicDataService.getDescriptionById(x.getProjectClassify()));
				shenBaoInfoDto.setProjectIndustryDesc(basicDataService.getDescriptionById(x.getProjectIndustry()));
				shenBaoInfoDto.setProjectTypeDesc(basicDataService.getDescriptionById(x.getProjectType()));
				shenBaoInfoDto.setProjectFunctionClassifyDesc(basicDataService.getDescriptionById(x.getProjectFunctionClassify()));//功能分类科目名称
				shenBaoInfoDto.setProjectGoverEconClassifyDesc(basicDataService.getDescriptionById(x.getProjectGoverEconClassify()));//政府经济分类科目名称
				shenBaoInfoDto.setProjectCategoryDesc(basicDataService.getDescriptionById(x.getProjectCategory()));
				shenBaoInfoDto.setProjectStageDesc(basicDataService.getDescriptionById(x.getProjectStage()));
				shenBaoInfoDto.setProjectConstrCharDesc(basicDataService.getDescriptionById(x.getProjectConstrChar()));
				shenBaoInfoDto.setProjectShenBaoStageDesc(basicDataService.getDescriptionById(x.getProjectShenBaoStage()));
				shenBaoInfoDto.setCapitalOtherTypeDesc(basicDataService.getDescriptionById(x.getCapitalOtherType()));
				shenBaoInfoDtos.add(shenBaoInfoDto);
			});
			
			return shenBaoInfoDtos;
		}			
		return null;
	}

	@Override
	@Transactional
	public void addYearPlanCapitals(String planId,String[] ids) {
		//根据年度计划id查找到年度计划
		YearPlan yearPlan=yearPlanRepo.findById(planId);
		//根据申报信息id创建年度计划资金
		for (String id : ids) {
			this.addYearPlanCapital(planId,id);
		}
		logger.info(String.format("添加年度计划资金,名称：%s",yearPlan.getName()));	
	}

	@Override
	@Transactional
	public void addYearPlanCapital(String planId,String shenBaoId) {
		Boolean hasShenBaoInfo = false;
		//根据年度计划id查找到年度计划
		YearPlan yearPlan=yearPlanRepo.findById(planId);
		//判断年度计划编制中是否已有该项目申报
		List<YearPlanCapital> capitals = yearPlan.getYearPlanCapitals();
		for(YearPlanCapital capital:capitals){
			if(capital.getShenbaoInfoId().equals(shenBaoId)){
				hasShenBaoInfo = true;
			}
		}
		if(hasShenBaoInfo){
			//通过申报信息id获取项目名称
			String projectName = shenbaoInfoRepo.findById(shenBaoId).getProjectName();
			throw new IllegalArgumentException(String.format("申报项目：%s 已经存在编制计划中,请重新选择！", projectName));
		}else{
			//根据申报信息id创建年度计划资金
			YearPlanCapital entity = new YearPlanCapital();
				entity.setId(UUID.randomUUID().toString());
				//设置关联的申报信息id
				entity.setShenbaoInfoId(shenBaoId);
				//设置创建人和修改人
				String loginName = currentUser.getLoginName();
				entity.setCreatedBy(loginName);
				entity.setModifiedBy(loginName);
			//将新创建的计划资金对象保存到计划中
			if(yearPlan.getYearPlanCapitals() !=null){
				yearPlan.getYearPlanCapitals().add(entity);
			}else{
				List<YearPlanCapital> yearPlanCapitals = new ArrayList<>();
				yearPlanCapitals.add(entity);
			}		
			yearPlanRepo.save(yearPlan);
			logger.info(String.format("添加年度计划资金,名称：%s",yearPlan.getName()));	
		}			
	}
}

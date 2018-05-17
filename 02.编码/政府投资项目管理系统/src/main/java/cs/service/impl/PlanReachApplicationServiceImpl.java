package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.Util;
import cs.domain.PlanReachApplication;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApplicationService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;

@Service
public class PlanReachApplicationServiceImpl extends AbstractServiceImpl<PlanReachApplicationDto,PlanReachApplication,String> implements PlanReachApplicationService {
	private static Logger logger = Logger.getLogger(PlanReachApplicationServiceImpl.class);
	
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private IRepository<UserUnitInfo, String> userUnitInfoRepo;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenBaoInfoMapper;
	
	@Override
	@Transactional
	public PageModelDto<PlanReachApplicationDto> get(ODataObj odataObj) {
		logger.info("查询计划下达申请表数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public PlanReachApplication create(PlanReachApplicationDto dto) {
		PlanReachApplication entity=super.create(dto);
		entity.setCreatedDate(new Date());
		entity.setModifiedDate(new Date());
		//关联数据的处理
		if(dto.getShenBaoInfoDtos().size()>0){
			dto.getShenBaoInfoDtos().stream().forEach(x->{
				ShenBaoInfo shenBaoInfo=new ShenBaoInfo();
				ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
				//根据id判断是否为纳入年度计划的项目
				if(Util.isNotNull(x.getId())){
					shenBaoInfoDto=shenBaoInfoMapper.toDto(shenBaoInfoService.findById(x.getId()));
				}else{//非纳入年度计划库的项目
					shenBaoInfoDto=x;
					//查询项目的基础信息
					Project project=projectService.findById(shenBaoInfoDto.getProjectId());
					//基础信息进行转换
					projectToShenBaoInfo(project,shenBaoInfoDto);
					shenBaoInfoDto.setShenBaoUnitInfoDto(new ShenBaoUnitInfoDto());
					shenBaoInfoDto.setBianZhiUnitInfoDto(new ShenBaoUnitInfoDto());
					shenBaoInfoDto.setConstructionUnit(userUnitInfoRepo.findById(x.getUnitName()).getUnitName());
				}
				shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
				shenBaoInfoDto.setSqPlanReach_ggys(x.getSqPlanReach_ggys());
				shenBaoInfoDto.setSqPlanReach_gtzj(x.getSqPlanReach_gtzj());
				shenBaoInfo = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);//创建申报信息并开启工作流
				entity.getShenBaoInfos().add(shenBaoInfo);
			});
		}
		super.repository.save(entity);
		logger.info(String.format("创建计划下达申请表,名称 :%s",dto.getApplicationName()));
		return entity;
	}

	@Override
	@Transactional
	public PlanReachApplication update(PlanReachApplicationDto dto, String id) {
		PlanReachApplication entity=super.update(dto, id);
		//关联数据的处理
		//删除掉相应的申报记录以及工作流
		List<String> ids=new ArrayList<>();
		if(entity.getShenBaoInfos().size()>0){
			entity.getShenBaoInfos().stream().forEach(x->{
				ids.add(x.getId());
			});
			entity.getShenBaoInfos().clear();
			//重新关联创建申报信息和工作流
			if(dto.getShenBaoInfoDtos().size()>0){
				dto.getShenBaoInfoDtos().stream().forEach(x->{
					ShenBaoInfo shenBaoInfo=new ShenBaoInfo();
					ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
					//根据id判断是否为纳入年度计划的项目或者是之前就以关联上的申报信息
					if(Util.isNotNull(x.getId())){
						shenBaoInfoDto=shenBaoInfoMapper.toDto(shenBaoInfoService.findById(x.getId()));
					}else{//新添加的非纳入年度计划库的项目
						shenBaoInfoDto=x;
						//查询项目的基础信息
						Project project=projectService.findById(shenBaoInfoDto.getProjectId());
						//基础信息进行转换
						projectToShenBaoInfo(project,shenBaoInfoDto);
						shenBaoInfoDto.setShenBaoUnitInfoDto(new ShenBaoUnitInfoDto());
						shenBaoInfoDto.setBianZhiUnitInfoDto(new ShenBaoUnitInfoDto());
					}
					shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
					shenBaoInfoDto.setSqPlanReach_ggys(x.getSqPlanReach_ggys());
					shenBaoInfoDto.setSqPlanReach_gtzj(x.getSqPlanReach_gtzj());
					shenBaoInfo = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);//创建申报信息并开启工作流
					entity.getShenBaoInfos().add(shenBaoInfo);
				});
			}
			ids.stream().forEach(y->{
				shenBaoInfoService.delete(y);
			});
		}
		super.repository.save(entity);
		logger.info(String.format("更新计划下达申请表,名称 :%s",dto.getApplicationName()));
		return entity;
	}
	
	
	
	@Override
	@Transactional
	public void delete(String id) {
		//先根据id查找到对应的需要删除的对象
		PlanReachApplication entity=super.findById(id);
		//根据对象对应的申报信息，删除对应的申报信息和工作流信息
		List<String> ids=new ArrayList<>();
		entity.getShenBaoInfos().stream().forEach(x->{
			ids.add(x.getId());
		});
		entity.getShenBaoInfos().clear();
		ids.stream().forEach(y->{
			shenBaoInfoService.delete(y);
		});
		super.repository.delete(entity);
		logger.info(String.format("删除计划下达申请表,名称 :%s",entity.getApplicationName()));
	}

	@Override
	public List<PlanReachApplicationDto> findByDto(ODataObj odataObj) {
		return null;
	}

	private ShenBaoInfo projectToShenBaoInfo(Project dto,ShenBaoInfoDto shenBaoInfoDto){
		shenBaoInfoDto.setUnitName(dto.getUnitName());//项目所属单位
		shenBaoInfoDto.setProjectStage(dto.getProjectStage());//项目阶段
		shenBaoInfoDto.setProjectRepName(dto.getProjectRepName());//负责人名称
		shenBaoInfoDto.setProjectRepMobile(dto.getProjectRepMobile());//负责人手机
		shenBaoInfoDto.setProjectCategory(dto.getProjectCategory());//项目类别
		shenBaoInfoDto.setProjectClassify(dto.getProjectClassify());//项目分类
		shenBaoInfoDto.setProjectIndustry(dto.getProjectIndustry());//项目行业归口
		shenBaoInfoDto.setProjectType(dto.getProjectType());//项目类型
		shenBaoInfoDto.setDivisionId(dto.getDivisionId());//项目区域
		shenBaoInfoDto.setProjectAddress(dto.getProjectAddress());//项目地址
		shenBaoInfoDto.setBeginDate(dto.getBeginDate());//项目开工日期
		shenBaoInfoDto.setEndDate(dto.getEndDate());//项目竣工日期
		shenBaoInfoDto.setProjectInvestAccuSum(dto.getProjectInvestAccuSum());//累计完成投资
		shenBaoInfoDto.setProjectInvestmentType(dto.getProjectInvestmentType());//投资类型
		//资金来源
		shenBaoInfoDto.setCapitalSCZ_ggys(dto.getCapitalSCZ_ggys());//市财政--公共预算
		shenBaoInfoDto.setCapitalSCZ_gtzj(dto.getCapitalSCZ_gtzj());//市财政--国土基金
		shenBaoInfoDto.setCapitalSCZ_zxzj(dto.getCapitalSCZ_zxzj());//市财政--专项基金
		shenBaoInfoDto.setCapitalQCZ_gtzj(dto.getCapitalQCZ_gtzj());//区财政--国土基金
		shenBaoInfoDto.setCapitalQCZ_ggys(dto.getCapitalQCZ_ggys());//区财政--公共预算
		shenBaoInfoDto.setCapitalZYYS(dto.getCapitalZYYS());//中央预算
		shenBaoInfoDto.setCapitalSHTZ(dto.getCapitalSHTZ());//社会投资		
		shenBaoInfoDto.setCapitalOther(dto.getCapitalOther());//其他
		shenBaoInfoDto.setCapitalOtherDescription(dto.getCapitalOtherDescription());//其他来源说明
		shenBaoInfoDto.setProjectIntro(dto.getProjectIntro());//项目简介
		shenBaoInfoDto.setProjectGuiMo(dto.getProjectGuiMo());//项目规模
		shenBaoInfoDto.setRemark(dto.getRemark());//项目基本信息备注
		//批复日期&文号
		shenBaoInfoDto.setPifuJYS_date(dto.getPifuJYS_date());
		shenBaoInfoDto.setPifuCBSJYGS_date(dto.getPifuCBSJYGS_date());
		shenBaoInfoDto.setPifuKXXYJBG_date(dto.getPifuKXXYJBG_date());
		shenBaoInfoDto.setPifuJYS_wenhao(dto.getPifuJYS_wenhao());
		shenBaoInfoDto.setPifuCBSJYGS_wenhao(dto.getPifuCBSJYGS_wenhao());
		shenBaoInfoDto.setPifuKXXYJBG_wenhao(dto.getPifuKXXYJBG_wenhao());

		return shenBaoInfoDto;
	}
	
	

	

}

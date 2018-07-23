package cs.service.impl;

import java.text.SimpleDateFormat;
import java.util.*;

import javax.transaction.Transactional;

import org.activiti.engine.RuntimeService;
import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.SQLConfig;
import cs.domain.Attachment;
import cs.domain.PackPlan;
import cs.domain.PlanReachApplication;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.UserUnitInfo;
import cs.domain.YearPlan;
import cs.domain.YearPlan_;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.model.framework.UserDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PackPlanService;
import cs.service.interfaces.PlanReachApplicationService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

@Service
public class PlanReachApplicationServiceImpl extends AbstractServiceImpl<PlanReachApplicationDto, PlanReachApplication, String> implements PlanReachApplicationService {

    private static Logger logger = Logger.getLogger(PlanReachApplicationServiceImpl.class);

    @Autowired
    private ShenBaoInfoService shenBaoInfoService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private IRepository<UserUnitInfo, String> userUnitInfoRepo;
    @Autowired
    private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
    @Autowired
    private IRepository<PackPlan, String> packPlanRepo;
    @Autowired
    private IRepository<PlanReachApplication, String> planReachApplicationRepo;
    @Autowired
    private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenBaoInfoMapper;
    @Autowired
    ICurrentUser currentUser;
    @Autowired
    private UserUnitInfoService userUnitInfoService;
    @Autowired
    private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
    @Autowired
    private PackPlanService packPlanService;
    @Autowired
    private IMapper<PackPlanDto, PackPlan> packPlanMapper;
    @Autowired
    private IRepository<YearPlan, String> yearPlanRepo;
    @Autowired
    private IMapper<AttachmentDto, Attachment> attachmentMapper;
    @Autowired
    private RuntimeService runtimeService;

    @Override
    @Transactional
    public PageModelDto<PlanReachApplicationDto> get(ODataObj odataObj) {
        logger.info("查询计划下达申请表数据");
        return super.get(odataObj);
    }

    @Override
    @Transactional
    public PlanReachApplication create(PlanReachApplicationDto dto) {
        PlanReachApplication entity = super.create(dto);
        entity.setCreatedDate(new Date());
        entity.setModifiedDate(new Date());
        //关联数据的处理
//		if(dto.getShenBaoInfoDtos().size()>0){
//			dto.getShenBaoInfoDtos().stream().forEach(x->{
//				ShenBaoInfo shenBaoInfo=new ShenBaoInfo();
//				ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
//				//根据id判断是否为纳入年度计划的项目
//				if(Util.isNotNull(x.getId())){
//					shenBaoInfoDto=shenBaoInfoMapper.toDto(shenBaoInfoService.findById(x.getId()));
//				}else{//非纳入年度计划库的项目
//					shenBaoInfoDto=x;
//					//查询项目的基础信息
//					Project project=projectService.findById(shenBaoInfoDto.getProjectId());
//					//基础信息进行转换
//					projectToShenBaoInfo(project,shenBaoInfoDto);
//					shenBaoInfoDto.setShenBaoUnitInfoDto(new ShenBaoUnitInfoDto());
//					shenBaoInfoDto.setBianZhiUnitInfoDto(new ShenBaoUnitInfoDto());
//					shenBaoInfoDto.setConstructionUnit(userUnitInfoRepo.findById(x.getUnitName()).getUnitName());
//				}
//				shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
//				shenBaoInfoDto.setSqPlanReach_ggys(x.getSqPlanReach_ggys());
//				shenBaoInfoDto.setSqPlanReach_gtzj(x.getSqPlanReach_gtzj());
//				shenBaoInfoDto.setThisTaskId(null);
//				shenBaoInfoDto.setThisTaskName(null);
//				shenBaoInfoDto.setZong_processId(null);
//				shenBaoInfo = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);//创建申报信息并开启工作流
//				entity.getShenBaoInfos().add(shenBaoInfo);
//			});
//		}
        repository.save(entity);
        logger.info(String.format("创建计划下达申请表,名称 :%s", dto.getApplicationName()));
        return entity;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public PlanReachApplication update(PlanReachApplicationDto dto, String id) {
        PlanReachApplication entity = super.update(dto, id);
        //关联数据的处理
        //删除掉相应的申报记录以及工作流
//		List<String> ids=new ArrayList<>();
//		if(entity.getShenBaoInfos().size()>0){
//			entity.getShenBaoInfos().stream().forEach(x->{
//				ids.add(x.getId());
//			});
//			entity.getShenBaoInfos().clear();
//			//重新关联创建申报信息和工作流
//			if(dto.getShenBaoInfoDtos().size()>0){
//				dto.getShenBaoInfoDtos().stream().forEach(x->{
//					ShenBaoInfo shenBaoInfo=new ShenBaoInfo();
//					ShenBaoInfoDto shenBaoInfoDto=new ShenBaoInfoDto();
//					//根据id判断是否为纳入年度计划的项目或者是之前就以关联上的申报信息
//					if(Util.isNotNull(x.getId())){
//						shenBaoInfoDto=shenBaoInfoMapper.toDto(shenBaoInfoService.findById(x.getId()));
//					}else{//新添加的非纳入年度计划库的项目
//						shenBaoInfoDto=x;
//						//查询项目的基础信息
//						Project project=projectService.findById(shenBaoInfoDto.getProjectId());
//						//基础信息进行转换
//						projectToShenBaoInfo(project,shenBaoInfoDto);
//						shenBaoInfoDto.setShenBaoUnitInfoDto(new ShenBaoUnitInfoDto());
//						shenBaoInfoDto.setBianZhiUnitInfoDto(new ShenBaoUnitInfoDto());
//					}
//					shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
//					shenBaoInfoDto.setSqPlanReach_ggys(x.getSqPlanReach_ggys());
//					shenBaoInfoDto.setSqPlanReach_gtzj(x.getSqPlanReach_gtzj());
//					shenBaoInfo = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);//创建申报信息并开启工作流
//					entity.getShenBaoInfos().add(shenBaoInfo);
//				});
//			}
//			ids.stream().forEach(y->{
//				shenBaoInfoService.delete(y);
//			});
//		}
        super.repository.save(entity);
        logger.info(String.format("更新计划下达申请表,名称 :%s", dto.getApplicationName()));
        return entity;
    }


    @Override
    @Transactional(rollbackOn = Exception.class)
    public void delete(String id) {
        //先根据id查找到对应的需要删除的对象
        PlanReachApplication entity = super.findById(id);
        //根据对象对应的申报信息，删除对应的申报信息和工作流信息
//        List<String> ids = new ArrayList<>();
        entity.getShenBaoInfos().forEach(x -> {
            Assert.isTrue(!(x.getProcessState() > 0 && x.getProcessState() < 4), "计划包含审批中的项目，不可删除");
            shenBaoInfoRepo.delete(x);
        });
        entity.getShenBaoInfos().clear();
        repository.delete(entity);
        logger.info(String.format("删除计划下达申请表,名称 :%s", entity.getApplicationName()));
    }

    private ShenBaoInfoDto projectToShenBaoInfo(Project dto, ShenBaoInfoDto shenBaoInfoDto) {
        shenBaoInfoDto.setUnitName(dto.getUnitName());//项目所属单位
        shenBaoInfoDto.setProjectName(dto.getProjectName());
        shenBaoInfoDto.setProjectNumber(dto.getProjectNumber());
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

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public PageModelDto<ShenBaoInfoDto> getShenBaoInfo(String planReachId, ODataObj odataObj) {
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();
        PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
        PlanReachApplication planReachApplication = super.findById(planReachId);
        if (planReachApplication != null) {
            //分页查询数据
            List<ShenBaoInfoDto> shenBaoInfoDtos = new ArrayList<>();
            List<ShenBaoInfo> shenBaoInfos = ((SQLQuery) planReachApplicationRepo.getSession()
                    .createSQLQuery(SQLConfig.shenBaoInfoOfPlanReachApplication)
                    .setParameter("planReachId", planReachId)
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(ShenBaoInfo.class)
                    .getResultList();
//			shenBaoInfos.forEach(x->{
//				ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(x);
//				shenBaoInfos.add(shenBaoInfoDto);
//			});
//			Iterator<ShenBaoInfo> iterator = shenBaoInfos.iterator();
//			          while (iterator.hasNext()) {
//			        	  ShenBaoInfo x = iterator.next();
//			        	  ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(x);
//			        	  shenBaoInfos.add(shenBaoInfoDto);
//			                 iterator.remove();
//			         }
            for (int i = 0; i < shenBaoInfos.size(); i++) {
                ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(shenBaoInfos.get(i));
                shenBaoInfoDtos.add(shenBaoInfoDto);
            }
            //查询总数
            List<ShenBaoInfoDto> shenBaoInfoDtos2 = planReachApplicationRepo.getSession()
                    .createSQLQuery(SQLConfig.shenBaoInfoOfPlanReachApplication)
                    .setParameter("planReachId", planReachId)
                    .addEntity(ShenBaoInfo.class)
                    .getResultList();
            int count = shenBaoInfoDtos2.size();

            pageModelDto.setCount(count);
            pageModelDto.setValue(shenBaoInfoDtos);
            return pageModelDto;
        }
        pageModelDto.setCount(0);
        pageModelDto.setValue(null);
        return pageModelDto;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addShenBaoInfos(String planReachId, String[] ids) {
        for (int i = 0; i < ids.length; i++) {
            String id = ids[i];
            this.addShenBaoInfo(planReachId, id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addShenBaoInfo(String planReachId, String id) {
        PlanReachApplication planReach = super.findById(planReachId);
        ShenBaoInfo entity = shenBaoInfoRepo.findById(id);

        //TODO 按照申报类型和项目名称，查询是否有同名的计划下达
        //TODO 如果存在，说明其他编制中已有改项目，不能再次添加
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectName.getName(), entity.getProjectName());
        Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_planReach);
        Criterion criterion3 = Restrictions.and(criterion, criterion2);
        List<ShenBaoInfo> entity2 = shenBaoInfoRepo.findByCriteria(criterion3);

        if (entity2.size() == 0) {
            List<ShenBaoInfo> shenBaoInfoList = new ArrayList<>();
            // TODO 不存在，则生成一条计划下达的申报信息
            ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(entity);
            shenBaoInfoDto.setId(UUID.randomUUID().toString());
            shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
            shenBaoInfoDto.setThisTaskId(null);
            shenBaoInfoDto.setThisTaskName(null);
            shenBaoInfoDto.setReceiver(null);
            shenBaoInfoDto.setZong_processId(null);
            shenBaoInfoDto.setProcessStage("未开始");
            shenBaoInfoDto.setProcessState(BasicDataConfig.processState_weikaishi);
            shenBaoInfoDto.setModifiedDate(new Date());
            shenBaoInfoDto.setCreatedDate(new Date());
            shenBaoInfoDto.setCreatedBy(currentUser.getUserId());

            ShenBaoInfo shenBaoInfoentity = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);
            //处理关联信息
            //附件
            shenBaoInfoDto.getAttachmentDtos().forEach(x -> {
                Attachment attachment = new Attachment();
                attachmentMapper.buildEntity(x, attachment);
                attachment.setCreatedBy(entity.getCreatedBy());
                attachment.setModifiedBy(entity.getModifiedBy());
                entity.getAttachments().add(attachment);
            });
            //申报单位
            ShenBaoUnitInfoDto shenBaoUnitInfoDto = shenBaoInfoDto.getShenBaoUnitInfoDto();
            ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
            shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto, shenBaoUnitInfo);
            shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
            shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
            entity.setShenBaoUnitInfo(shenBaoUnitInfo);
            //编制单位
            ShenBaoUnitInfoDto bianZhiUnitInfoDto = shenBaoInfoDto.getBianZhiUnitInfoDto();
            ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
            shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto, bianZhiUnitInfo);
            bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
            bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
            entity.setBianZhiUnitInfo(bianZhiUnitInfo);
            entity.setIsIncludPack(true);
            shenBaoInfoRepo.save(entity);

            if (planReach.getShenBaoInfos() != null) {
                planReach.getShenBaoInfos().add(shenBaoInfoentity);
            } else {
                shenBaoInfoList.add(shenBaoInfoentity);
                planReach.setShenBaoInfos(shenBaoInfoList);
            }
        } else {
            throw new IllegalArgumentException(String.format("申报项目：%s 已经存在其他编制计划中,请重新选择！", entity.getProjectName()));
        }

        planReachApplicationRepo.save(planReach);
        logger.info(String.format("添加年度计划资金,名称：%s", planReach.getApplicationName()));
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public PageModelDto<PackPlanDto> getPackPlan(ODataObj odataObj) {
        YearPlan yearPlan = null;
        // TODO 查询下一年度计划编制
        Calendar cal = Calendar.getInstance();
        int nextYear = cal.get(Calendar.YEAR) + 1;

        Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), nextYear);
        List<YearPlan> yearPlanList = yearPlanRepo.findByCriteria(criterion);
        if (yearPlanList.size() > 0) {
            yearPlan = yearPlanList.get(0);

            // TODO 筛选出包含有本单位的编制
            if (!yearPlan.getPackPlans().isEmpty()) {
                UserUnitInfoDto userUnitInfoDto1 = null;
                List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
                for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
                    if (!userUnitInfoDto.getUserDtos().isEmpty()) {
                        for (UserDto user : userUnitInfoDto.getUserDtos()) {
                            if (user.getId().equals(currentUser.getUserId())) {
                                userUnitInfoDto1 = userUnitInfoDto;
                            }
                        }
                    }
                }
//                double d = 0.0;
//                double a = 0.0;
                boolean isOurUnit = false;
//                if (null != userUnitInfoDto1) {
//
//                }
                for (int i = 0; i < yearPlan.getPackPlans().size(); i++) {
                    if (yearPlan.getPackPlans().get(i) != null) {
                        for (int j = 0; j < yearPlan.getPackPlans().get(i).getAllocationCapitals().size(); j++) {
                            if (yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j) != null) {
                                if (yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getUnitName().equals(userUnitInfoDto1.getId())) {//如果有本单位的打包计划
//								d += yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getCapital_ggys();
//								a += yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getCapital_gtzj();
                                    isOurUnit = true;
                                }
                            }
                        }
                    }
                    if (isOurUnit == false) {
                        yearPlan.getPackPlans().remove(i);
                    }
                }
                List<PackPlanDto> packPlanList = new ArrayList<>();
                PackPlanDto packPlanDto = null;
                for (int i = 0; i < yearPlan.getPackPlans().size(); i++) {
                    PackPlan array_element = yearPlan.getPackPlans().get(i);
                    packPlanDto = packPlanMapper.toDto(array_element);
                    packPlanList.add(packPlanDto);
                }

                return new PageModelDto<>(packPlanList, yearPlan.getPackPlans().size());
            }
        }
        return new PageModelDto<>();
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addPackPlans(String planReachId, String[] ids) {
        for (String id : ids) {
            this.addPackPlan(planReachId, id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addShenBaoInfoToPacks(String packId, String[] ids) {
        for (String id : ids) {
            this.addShenBaoInfoToPack(packId, id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deleteShenBaoInfos(String packPlanId, String[] ids) {
        for (String id : ids) {
            this.deleteShenBaoInfo(packPlanId, id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deletePacks(String packPlanId, String[] ids) {
        for (String id : ids) {
            this.deletePack(packPlanId, id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deletePlanShenBaoInfos(String packPlanId, String[] ids) {
        for (String id : ids) {
            this.deletePlanShenBaoInfo(packPlanId, id);
        }
    }

    /**
     * 给打包信息添加申报项目
     */
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addShenBaoInfoToPack(String packId, String shenbaoId) {
        Boolean hasPackPlan = false;
        //根据计划下达id查找到计划下达信息
        PackPlan pack = packPlanRepo.findById(packId);

        //根据项目ID判断是否已有对应的计划下达申请
//		Criterion criterion=Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenbaoId);
//		List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion);
        ShenBaoInfo shenbaoinfo = shenBaoInfoRepo.findById(shenbaoId);//年度计划申报信息
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenbaoinfo.getProjectId());
        Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_planReach);
        Criterion criterion3 = Restrictions.and(criterion, criterion2);
        List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion3);
        if (shenbaoinfoList.size() > 0) {
            throw new IllegalArgumentException(String.format("申报项目：%s 已经存在其他编制计划中,请重新选择！", shenbaoinfo.getProjectName()));
        } else {
            List<ShenBaoInfo> shenBaoInfoList = new ArrayList<>();
            // TODO 不存在，则生成一条计划下达的申报信息
            ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(shenbaoinfo);
            shenBaoInfoDto.setId(UUID.randomUUID().toString());
            shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
            shenBaoInfoDto.setProcessStage("未开始");
            shenBaoInfoDto.setProcessState(BasicDataConfig.processState_weikaishi);
            shenBaoInfoDto.setThisTaskId(null);
            shenBaoInfoDto.setThisTaskName(null);
            shenBaoInfoDto.setZong_processId(null);
            shenbaoinfo.setReceiver(null);
            ShenBaoInfo shenBaoInfoentity = shenBaoInfoService.createShenBaoInfo(shenBaoInfoDto, false);
            shenbaoinfo.setIsIncludPack(true);
            shenBaoInfoRepo.save(shenbaoinfo);
            if (pack.getShenBaoInfos() != null) {
                pack.getShenBaoInfos().add(shenBaoInfoentity);
            } else {
                shenBaoInfoList.add(shenBaoInfoentity);
                pack.setShenBaoInfos(shenBaoInfoList);
            }
            packPlanRepo.save(pack);
        }
        logger.info(String.format("打包计划添加申报项目,名称：%s", pack.getName()));
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addPackPlan(String planReachId, String packPlanId) {
        Boolean hasPackPlan = false;
        // TODO 根据计划下达id查找到计划下达信息
        PlanReachApplication planReach = super.findById(planReachId);
        PackPlan entity = packPlanRepo.findById(packPlanId);
        if (planReach != null) {
            if (!entity.getIsInPlan()) {
                // TODO 判断年度计划编制中是否已有打包计划
                List<PackPlan> packPlans = planReach.getPackPlans();

                for (PackPlan packPlan : packPlans) {
                    if (packPlan.getId().equals(packPlanId)) {
                        hasPackPlan = true;
                    }
                }
                if (hasPackPlan) {
                    //通过打包计划id获取名称
                    throw new IllegalArgumentException(String.format("申报项目：%s 已经存在编制计划中,请重新选择！", entity.getName()));
                } else {
                    // TODO 统计包含有本单位打包计划的资金


                    UserUnitInfoDto userUnitInfoDto1 = null;
                    List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
                    for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
                        if (!userUnitInfoDto.getUserDtos().isEmpty()) {
                            for (UserDto user : userUnitInfoDto.getUserDtos()) {
                                if (user.getId().equals(currentUser.getUserId())) {
                                    userUnitInfoDto1 = userUnitInfoDto;
                                }
                            }
                        }
                    }
                    double d = 0.0;
                    double a = 0.0;
                    boolean isOurUnit = false;
                    if (entity != null) {
                        for (int j = 0; j < entity.getAllocationCapitals().size(); j++) {
                            if (entity.getAllocationCapitals().get(j) != null) {
                                if (entity.getAllocationCapitals().get(j).getUnitName().equals(userUnitInfoDto1.getId())) {//如果有本单位的打包计划
                                    d += entity.getAllocationCapitals().get(j).getCapital_ggys();
                                    a += entity.getAllocationCapitals().get(j).getCapital_gtzj();
                                    isOurUnit = true;
                                }
                            }
                        }
                    }
                    if (isOurUnit) {
                        entity.setCapitalSCZ_ggys_TheYear(d);
                        entity.setCapitalSCZ_gtzj_TheYear(a);
                    }
                    entity.setIsInPlan(true);
                    packPlanRepo.save(entity);
                    //将打包计划保存到年度计划中
                    if (planReach.getPackPlans() != null) {
                        planReach.getPackPlans().add(entity);
                    } else {
                        List<PackPlan> packPlans2 = new ArrayList<>();
                        packPlans2.add(entity);
                        planReach.setPakckPlans(packPlans2);
                    }
                    super.repository.save(planReach);
                    logger.info(String.format("添加年度计划资金,名称：%s", planReach.getApplicationName()));
                }
            } else {
                throw new IllegalArgumentException(String.format("申报项目：%s 已经存在编制计划中,请重新选择！", entity.getName()));
            }
        } else {
            throw new IllegalArgumentException("请先创建计划下达后添加！");
        }
    }

    @Override
    public PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(String packId, ODataObj odataObj) {
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();
        //根据登陆名查找到单位信息(因为可能一个打包项目会关联到多个申报项目，建设单位查询的时候会都查出来，加上本单位的限制条件只查属于本建设单位的，--放在SQL中用的)
//		UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
//		String userUnitId = userUnitInfo.getId();
        PackPlan packPlan = packPlanRepo.findById(packId);
        if (packPlan != null) {
            //分页查询数据
            List<ShenBaoInfoDto> shenBaoInfoDtos = new ArrayList<>();
            List<ShenBaoInfo> shenBaoInfos = ((SQLQuery) packPlanRepo.getSession()
                    .createSQLQuery(SQLConfig.shenBaoInfoOfPackPlanOfPlanReach)
                    .setParameter("packPlanId", packId)
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(ShenBaoInfo.class)
                    .getResultList();
            for (int i = 0; i < shenBaoInfos.size(); i++) {
                ShenBaoInfo array_element = shenBaoInfos.get(i);
                ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(array_element);
                shenBaoInfoDtos.add(shenBaoInfoDto);
            }
//			shenBaoInfos.forEach(x->{
//				ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(x);
//				shenBaoInfos.add(shenBaoInfoDto);
//			});
            //查询总数
            List<ShenBaoInfoDto> shenBaoInfoDtos2 = packPlanRepo.getSession()
                    .createSQLQuery(SQLConfig.shenBaoInfoOfPackPlanOfPlanReach)
                    .setParameter("packPlanId", packId)
                    .addEntity(ShenBaoInfo.class)
                    .getResultList();
            int count = shenBaoInfoDtos2.size();

            return new PageModelDto<>(shenBaoInfoDtos, count);
        }
        return new PageModelDto<>();
    }

    @Override
    public List<PlanReachApplicationDto> findByDto(ODataObj odataObj) {
        return null;
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void startProcess(String packId) {
//		PackPlan packPlan=packPlanRepo.findById(packId);
        PlanReachApplication planReachApplication = planReachApplicationRepo.findById(packId);
        List<ShenBaoInfo> shenbaoList = new ArrayList<ShenBaoInfo>();
        shenbaoList.addAll(planReachApplication.getShenBaoInfos());
        if (!CollectionUtils.isEmpty(planReachApplication.getPackPlans())) {
            for (int i = 0; i < planReachApplication.getPackPlans().size(); i++) {
                PackPlan array_element = planReachApplication.getPackPlans().get(i);
                shenbaoList.addAll(array_element.getShenBaoInfos());
            }
        }
        Assert.notEmpty(shenbaoList, "计划下达中没有申报项目,请重新选择！");
        for (int i = 0; i < shenbaoList.size(); i++) {
            ShenBaoInfo entity = shenbaoList.get(i);
            if ("".equals(entity.getThisTaskName()) || null == entity.getThisTaskName()) {
                shenBaoInfoService.startProcessShenbao("planreach", entity.getId());
            }
        }
        planReachApplication.setIsStartProcess(true);
        planReachApplicationRepo.save(planReachApplication);
        if (logger.isDebugEnabled()) {
            logger.debug("启动计划类审批流程");
        }
    }


//	@Override
//	@Transactional
//	public void startProcessShenbao(String shenbaoId) {
//		ShenBaoInfo entity=shenBaoInfoRepo.findById(shenbaoId);
//		entity.setProcessStage("");
//		shenBaoInfoService.startProcessShenbao("planreach",shenbaoId);
//		
//	}

    @Override
    @Transactional(rollbackOn = Exception.class)
    public PageModelDto<PackPlanDto> getPackPlan(String planReachId, ODataObj odataObj) {

        PlanReachApplication planReachApplication = super.findById(planReachId);
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();
        if (planReachApplication != null) {
            //分页查询数据
            List<PackPlanDto> packPlanDtos = new ArrayList<>();
            List<PackPlan> packPlans = ((SQLQuery) planReachApplicationRepo.getSession()
                    .createSQLQuery(SQLConfig.packPlanByPlanReachId)
                    .setParameter("planReachId", planReachId)
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(PackPlan.class)
                    .getResultList();
            packPlans.forEach(x -> {
                PackPlanDto packPlanDto = packPlanMapper.toDto(x);
                packPlanDtos.add(packPlanDto);
            });

            //查询总数
            List<PackPlanDto> packPlanDtos2 = planReachApplicationRepo.getSession()
                    .createSQLQuery(SQLConfig.packPlanByPlanReachId)
                    .setParameter("planReachId", planReachId)
                    .addEntity(PackPlan.class)
                    .getResultList();
            int count = packPlanDtos2.size();


//			PageModelDto<PackPlanDto> packPlanDtos = packPlanService.get(odataObj);

            UserUnitInfoDto userUnitInfoDto1 = null;
            List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
            for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
                if (!userUnitInfoDto.getUserDtos().isEmpty()) {
                    for (UserDto user : userUnitInfoDto.getUserDtos()) {
                        if (user.getId().equals(currentUser.getUserId())) {
                            userUnitInfoDto1 = userUnitInfoDto;
                        }
                    }
                }


            }
            double d = 0.0;
            double a = 0.0;
            boolean isOurUnit = false;
//			UserUnitInfo userUnitInfo = userUnitInfoService.getByUserName(currentUser.getUserId());
            for (int i = 0; i < packPlanDtos.size(); i++) {
                if (packPlanDtos.get(i) != null) {
                    for (int j = 0; j < packPlanDtos.get(i).getAllocationCapitals().size(); j++) {
                        if (packPlanDtos.get(i).getAllocationCapitals().get(j) != null) {
                            if (packPlanDtos.get(i).getAllocationCapitals().get(j).getUnitName().equals(userUnitInfoDto1.getId())) {//如果有本单位的打包计划
                                d += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_ggys();
                                a += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_gtzj();
                                isOurUnit = true;
                            }
                        }
                    }
                }
                if (!isOurUnit) {
//					packPlanDtos.remove(i);
                } else {
                    packPlanDtos.get(i).setCapitalSCZ_ggys_TheYear(d);
                    packPlanDtos.get(i).setCapitalSCZ_gtzj_TheYear(a);
                }
            }

            return new PageModelDto<>(packPlanDtos, count);
        }
        return new PageModelDto<>();
//		YearPlan yearPlan = null;
//		PageModelDto<PackPlanDto> pageModelDto = new PageModelDto<>();
//	
//		// TODO 查询下一年度计划,获取对应的打包信息
//		SimpleDateFormat sdf = new SimpleDateFormat("yyyy");
//        Date date = new Date();
//	        
//		int nextYear = Integer.parseInt(sdf.format(date)) +1;
//		Criterion criterion=Restrictions.eq(YearPlan_.year.getName(), nextYear);
//		List<YearPlan> yearPlanList = yearPlanRepo.findByCriteria(criterion);
//		if(yearPlanList.size() > 0){
//			yearPlan = yearPlanList.get(0);
//		}
//		
//		if(yearPlan != null){
//			
//			
//			List<PackPlan> packPlans = yearPlan.getPackPlans();
//			List<PackPlanDto> packPlanDtos=new ArrayList<>();
//			packPlans.forEach(x->{
//				PackPlanDto packPlanDto = packPlanMapper.toDto(x);
//				packPlanDtos.add(packPlanDto);
//			});
//			if(packPlanDtos != null){
//				//TODO 计算本单位，打包信息中的资金总值
//				UserUnitInfoDto userUnitInfoDto1 = null;
//				List<UserUnitInfoDto> userUnitInfo = userUnitInfoService.Get();
//				for (UserUnitInfoDto userUnitInfoDto : userUnitInfo) {
//					if(!userUnitInfoDto.getUserDtos().isEmpty()){
//						for (UserDto user : userUnitInfoDto.getUserDtos()) {
//							if(user.getId().equals(currentUser.getUserId())){
//								userUnitInfoDto1 =userUnitInfoDto;
//							}
//						} 
//					}
//				}
//				double d = 0.0;
//				double a = 0.0;
//				boolean isOurUnit = false;
//				for (int i = 0; i < packPlanDtos.size(); i++) {
//					if(packPlanDtos.get(i) != null){
//						for (int j = 0; j < packPlanDtos.get(i).getAllocationCapitals().size(); j++) {
//							if(packPlanDtos.get(i).getAllocationCapitals().get(j) != null){
//								if(packPlanDtos.get(i).getAllocationCapitals().get(j).getUnitName().equals(userUnitInfoDto1.getId())){//如果有本单位的打包计划
//									d += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_ggys();
//									a += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_gtzj();
//									isOurUnit = true;
//								}
//							}
//						}
//					}
//					if(isOurUnit == false){
////						packPlanDtos.remove(i);
//					}else{
//						packPlanDtos.get(i).setCapitalSCZ_ggys_TheYear(d);
//						packPlanDtos.get(i).setCapitalSCZ_gtzj_TheYear(a);
//					}
//				}
//			}
//			
//			pageModelDto.setCount(packPlanDtos.size());
//			pageModelDto.setValue(packPlanDtos);
//			
//			return pageModelDto;
//		}
//		return pageModelDto;			

    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney) {
        ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
        entity.setSqPlanReach_ggys(ggmoney);
        entity.setSqPlanReach_gtzj(gtmoney);
        shenBaoInfoRepo.save(entity);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deleteShenBaoInfo(String packPlanId, String shenbaoId) {
        //先根据id查找到对应的需要删除的对象
        PlanReachApplication entity = super.findById(packPlanId);
//        boolean canDelete = true;
        ShenBaoInfo shenbaoinfo = shenBaoInfoRepo.findById(shenbaoId);
        Assert.notNull(shenbaoinfo, "数据不存在");
        //根据对象对应的申报信息，删除对应的申报信息和工作流信息

        if (shenbaoinfo.getProcessState().equals(BasicDataConfig.processState_jinxingzhong)) {
            throw new IllegalArgumentException("包含正在审批的项目,请重新选择！");
        } else {
            for (int i = 0; i < entity.getShenBaoInfos().size(); i++) {
                ShenBaoInfo array_element = entity.getShenBaoInfos().get(i);

                if (shenbaoId.equals(array_element.getId())) {
                    entity.getShenBaoInfos().remove(i);
                }
            }
        }
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenbaoinfo.getProjectId());
        Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_nextYearPlan);
        Criterion criterion3 = Restrictions.and(criterion, criterion2);
        List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion3);
        if (!CollectionUtils.isEmpty(shenbaoinfoList)) {
            shenbaoinfoList.get(0).setIsIncludPack(false);
            shenBaoInfoRepo.save(shenbaoinfoList.get(0));
        }

        shenBaoInfoRepo.delete(shenbaoinfo);
        repository.save(entity);
        logger.info(String.format("删除计划下达申请表,名称 :%s", entity.getApplicationName()));
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deletePack(String packPlanId, String packId) {
        // TODO Auto-generated method stub
        PlanReachApplication entity = super.findById(packPlanId);
        PackPlan plan = packPlanRepo.findById(packId);

        for (int i = 0; i < plan.getShenBaoInfos().size(); i++) {
            ShenBaoInfo array_element = plan.getShenBaoInfos().get(i);
            shenBaoInfoRepo.delete(shenBaoInfoRepo.findById(array_element.getId()));
        }
        List<PackPlan> planList = entity.getPackPlans();


        for (int i = 0; i < planList.size(); i++) {
            PackPlan array_element = planList.get(i);

            if (array_element.getShenBaoInfos() != null) {
                for (int j = 0; j < array_element.getShenBaoInfos().size(); j++) {
                    ShenBaoInfo shenbaoInfo = array_element.getShenBaoInfos().get(j);
                    if (shenbaoInfo.getProcessState().equals(BasicDataConfig.processState_jinxingzhong)) {
                        throw new IllegalArgumentException(String.format("打包计划中存在审批中的项目,无法删除,请重新选着！", array_element.getName()));
                    }
                }
            }

            if (packId.equals(array_element.getId())) {
                array_element.setIsInPlan(false);

                packPlanRepo.save(array_element);
                planList.remove(i);
            }

        }
        entity.getPackPlans().clear();
        entity.setPackPlans(planList);
        super.repository.save(entity);

    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deletePlanShenBaoInfo(String packPlanId, String shenbaoId) {
        PackPlan plan = packPlanRepo.findById(packPlanId);
        ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
        for (int i = 0; i < plan.getShenBaoInfos().size(); i++) {
            ShenBaoInfo array_element = plan.getShenBaoInfos().get(i);

            if (shenbaoId.equals(array_element.getId())) {
                shenBaoInfoRepo.delete(entity);
                plan.getShenBaoInfos().remove(i);
            }
        }
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), entity.getProjectId());
        Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_nextYearPlan);
        Criterion criterion3 = Restrictions.and(criterion, criterion2);
        List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion3);
        shenbaoinfoList.get(0).setIsIncludPack(false);
        shenBaoInfoRepo.save(shenbaoinfoList.get(0));
        packPlanRepo.save(plan);
    }

    @Override
    public PageModelDto<ShenBaoInfoDto> getShenbaoInfoFromYearplan(ODataObj odataObj) {
        YearPlan yearPlan = null;
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();
        Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
        int nextYear = cal.get(Calendar.YEAR) + 1;
        Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), nextYear);
        List<YearPlan> yearPlanList = yearPlanRepo.findByCriteria(criterion);
        if (!CollectionUtils.isEmpty(yearPlanList)) {
            yearPlan = yearPlanList.get(0);
        }
        if (yearPlan != null) {
            //分页查询数据
            List<ShenBaoInfoDto> shenBaoInfoDtos = new ArrayList<>();
            List<ShenBaoInfo> shenBaoInfos = ((SQLQuery) shenBaoInfoRepo.getSession()
                    .createSQLQuery(SQLConfig.yearPlanProject)
                    .setParameter("yearPlanId", yearPlan.getId())
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(ShenBaoInfo.class)
                    .getResultList();
//			shenBaoInfos.forEach(x->{
//				ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(x);
//				shenBaoInfoDtos.add(shenBaoInfoDto);
//			});

            for (int i = 0; i < shenBaoInfos.size(); i++) {
                ShenBaoInfo array_element = shenBaoInfos.get(i);
                ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(array_element);
//				if(array_element.getUnitName().equals(id)){
                shenBaoInfoDtos.add(shenBaoInfoDto);
//				}
            }
            //查询总数
//            List<ShenBaoInfo> shenBaoInfos2 = shenBaoInfoRepo.getSession()
//                    .createSQLQuery(SQLConfig.yearPlanProject)
//                    .setParameter("yearPlanId", yearPlan.getId())
//                    .addEntity(ShenBaoInfo.class)
//                    .getResultList();
//            int count = shenBaoInfos2.size();

            return new PageModelDto<>(shenBaoInfoDtos, shenBaoInfoDtos.size());
        }
        return new PageModelDto<>();
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deleteProcessOne(String shenbaoId) {
        // TODO 撤销流程
        ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
        if ("投资科审核收件办理".equals(entity.getProcessStage()) || "".equals(entity.getProcessStage())) {
            runtimeService.deleteProcessInstance(entity.getZong_processId(), "建设单位主动撤销");
            Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), entity.getZong_processId());
            List<ShenBaoInfo> shenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
            shenBaoInfo.get(0).setProcessStage("建设单位主动撤销");
            shenBaoInfo.get(0).setProcessState(BasicDataConfig.processState_weikaishi);
            shenBaoInfo.get(0).setThisTaskName("");
            shenBaoInfo.get(0).setZong_processId("");
            shenBaoInfo.get(0).setThisTaskId("");
            shenBaoInfo.get(0).setReceiver(null);
            shenBaoInfoRepo.save(shenBaoInfo.get(0));
            logger.debug("======>卸载pricessId为 " + entity.getZong_processId() + " 的流程!");
        } else {
            throw new IllegalArgumentException("已签收项目或未开始审批，无法撤销！");
        }

    }


}

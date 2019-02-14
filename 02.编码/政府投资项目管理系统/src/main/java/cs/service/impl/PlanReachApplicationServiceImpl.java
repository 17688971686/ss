package cs.service.impl;

import static cs.common.BasicDataConfig.processState_jinxingzhong;
import static cs.common.SQLConfig.shenBaoInfoOfPackPlanOfPlanReach;
import static cs.common.SQLConfig.shenBaoInfoOfPackPlanOfPlanReach_count;
import static cs.common.SQLConfig.shenBaoInfoOfPlanReachApplication;
import static cs.common.SQLConfig.shenBaoInfoOfPlanReachApplication_count;

import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.Date;
import java.util.List;
import java.util.TimeZone;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import cs.model.DomainDto.*;
import org.activiti.engine.RuntimeService;
import org.apache.log4j.Logger;
import org.apache.poi.ss.formula.eval.BlankEval;
import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Restrictions;
import org.hibernate.criterion.SimpleExpression;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import com.sn.framework.common.IdWorker;
import com.sn.framework.common.StringUtil;

import cs.common.BasicDataConfig;
import cs.common.DateUtil;
import cs.common.SQLConfig;
import cs.domain.AllocationCapital;
import cs.domain.PackPlan;
import cs.domain.PlanReachApplication;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.YearPlan;
import cs.domain.YearPlanCapital;
import cs.domain.YearPlanCapital_;
import cs.domain.YearPlan_;
import cs.model.PageModelDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.framework.UserRepo;
import cs.repository.impl.ProjectRepoImpl;
import cs.repository.impl.ShenBaoInfoRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.PlanReachApplicationService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.UserUnitInfoService;
import cs.service.interfaces.YearPlanService;
import jxl.write.Blank;

@Service
public class PlanReachApplicationServiceImpl
		extends AbstractServiceImpl<PlanReachApplicationDto, PlanReachApplication, String>
		implements PlanReachApplicationService {

	private static Logger logger = Logger.getLogger(PlanReachApplicationServiceImpl.class);

	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
	@Autowired
	private IRepository<PackPlan, String> packPlanRepo;
	@Autowired
	private IRepository<PlanReachApplication, String> planReachApplicationRepo;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenBaoInfoMapper;
	@Autowired
	private UserUnitInfoService userUnitInfoService;
	@Autowired
	private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
	@Autowired
	private YearPlanService yearPlanService;
	@Autowired
	private IMapper<PackPlanDto, PackPlan> packPlanMapper;
	@Autowired
	private RuntimeService runtimeService;
	@Autowired
	private IRepository<YearPlanCapital, String> yearPlanCapitalRepo;
	@Autowired
	private ShenBaoInfoRepoImpl shenBaoInfoRepoImpl;
	@Autowired
	private IRepository<YearPlan, String> yearRepo;

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
		if(ObjectUtils.isEmpty(entity.getApplicationUnit())){
			throw new IllegalArgumentException("请绑定单位信息后创建！");
		}
		entity.setCreatedDate(new Date());
		entity.setModifiedDate(new Date());
		repository.save(entity);
		logger.info(String.format("创建计划下达申请表,名称 :%s", dto.getApplicationName()));
		return entity;
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public PlanReachApplication update(PlanReachApplicationDto dto, String id) {
		PlanReachApplication entity = super.update(dto, id);
		super.repository.save(entity);
		logger.info(String.format("更新计划下达申请表,名称 :%s", dto.getApplicationName()));
		return entity;
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void delete(String id) {
		// 先根据id查找到对应的需要删除的对象
		PlanReachApplication entity = super.findById(id);
		// 根据对象对应的申报信息，删除对应的申报信息和工作流信息
		// List<String> ids = new ArrayList<>();
		entity.getShenBaoInfos().forEach(x -> {
			Assert.isTrue(!(x.getProcessState() > 0 && x.getProcessState() < 4), "计划包含审批中的项目，不可删除");
			shenBaoInfoRepo.delete(x);
		});
		entity.getShenBaoInfos().clear();
		repository.delete(entity);
		logger.info(String.format("删除计划下达申请表,名称 :%s", entity.getApplicationName()));
	}

	// private ShenBaoInfoDto projectToShenBaoInfo(Project dto, ShenBaoInfoDto
	// shenBaoInfoDto) {
	// shenBaoInfoDto.setUnitName(dto.getUnitName());//项目所属单位
	// shenBaoInfoDto.setProjectName(dto.getProjectName());
	// shenBaoInfoDto.setProjectNumber(dto.getProjectNumber());
	// shenBaoInfoDto.setProjectStage(dto.getProjectStage());//项目阶段
	// shenBaoInfoDto.setProjectRepName(dto.getProjectRepName());//负责人名称
	// shenBaoInfoDto.setProjectRepMobile(dto.getProjectRepMobile());//负责人手机
	// shenBaoInfoDto.setProjectCategory(dto.getProjectCategory());//项目类别
	// shenBaoInfoDto.setProjectClassify(dto.getProjectClassify());//项目分类
	// shenBaoInfoDto.setProjectIndustry(dto.getProjectIndustry());//项目行业归口
	// shenBaoInfoDto.setProjectType(dto.getProjectType());//项目类型
	// shenBaoInfoDto.setDivisionId(dto.getDivisionId());//项目区域
	// shenBaoInfoDto.setProjectAddress(dto.getProjectAddress());//项目地址
	// shenBaoInfoDto.setBeginDate(dto.getBeginDate());//项目开工日期
	// shenBaoInfoDto.setEndDate(dto.getEndDate());//项目竣工日期
	// shenBaoInfoDto.setProjectInvestAccuSum(dto.getProjectInvestAccuSum());//累计完成投资
	// shenBaoInfoDto.setProjectInvestmentType(dto.getProjectInvestmentType());//投资类型
	// //资金来源
	// shenBaoInfoDto.setCapitalSCZ_ggys(dto.getCapitalSCZ_ggys());//市财政--公共预算
	// shenBaoInfoDto.setCapitalSCZ_gtzj(dto.getCapitalSCZ_gtzj());//市财政--国土基金
	// shenBaoInfoDto.setCapitalSCZ_zxzj(dto.getCapitalSCZ_zxzj());//市财政--专项基金
	// shenBaoInfoDto.setCapitalQCZ_gtzj(dto.getCapitalQCZ_gtzj());//区财政--国土基金
	// shenBaoInfoDto.setCapitalQCZ_ggys(dto.getCapitalQCZ_ggys());//区财政--公共预算
	// shenBaoInfoDto.setCapitalZYYS(dto.getCapitalZYYS());//中央预算
	// shenBaoInfoDto.setCapitalSHTZ(dto.getCapitalSHTZ());//社会投资
	// shenBaoInfoDto.setCapitalOther(dto.getCapitalOther());//其他
	// shenBaoInfoDto.setCapitalOtherDescription(dto.getCapitalOtherDescription());//其他来源说明
	// shenBaoInfoDto.setProjectIntro(dto.getProjectIntro());//项目简介
	// shenBaoInfoDto.setProjectGuiMo(dto.getProjectGuiMo());//项目规模
	// shenBaoInfoDto.setRemark(dto.getRemark());//项目基本信息备注
	// //批复日期&文号
	// shenBaoInfoDto.setPifuJYS_date(dto.getPifuJYS_date());
	// shenBaoInfoDto.setPifuCBSJYGS_date(dto.getPifuCBSJYGS_date());
	// shenBaoInfoDto.setPifuKXXYJBG_date(dto.getPifuKXXYJBG_date());
	// shenBaoInfoDto.setPifuJYS_wenhao(dto.getPifuJYS_wenhao());
	// shenBaoInfoDto.setPifuCBSJYGS_wenhao(dto.getPifuCBSJYGS_wenhao());
	// shenBaoInfoDto.setPifuKXXYJBG_wenhao(dto.getPifuKXXYJBG_wenhao());
	//
	// return shenBaoInfoDto;
	// }

	@Override
	public PageModelDto<ShenBaoInfoDto> getShenBaoInfo(String planReachId, ODataObj odataObj) {
		Session session = planReachApplicationRepo.getSession();

		// 查询总数
		BigInteger countQuery = (BigInteger) session.createNativeQuery(shenBaoInfoOfPlanReachApplication_count)
				.setParameter("planReachId", planReachId).getSingleResult();

		int count = countQuery == null ? 0 : countQuery.intValue();

		List<ShenBaoInfoDto> shenBaoInfoDtos = null;
		if (count > 0) {
			int skip = odataObj.getSkip(), stop = odataObj.getTop();
			// 分页查询数据
			List<ShenBaoInfo> shenBaoInfos = session
					.createNativeQuery(shenBaoInfoOfPlanReachApplication, ShenBaoInfo.class)
					.setParameter("planReachId", planReachId).setFirstResult(skip).setMaxResults(stop).getResultList();
			if (!CollectionUtils.isEmpty(shenBaoInfos)) {
				int len = shenBaoInfos.size();
				shenBaoInfoDtos = new ArrayList<>(len);
				for (int i = 0; i < len; i++) {
					ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(shenBaoInfos.get(i));
					shenBaoInfoDtos.add(shenBaoInfoDto);
				}
			}
		}

		return new PageModelDto<>(shenBaoInfoDtos, count);
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void addShenBaoInfos(String planReachId, String[] ids) {
		for (int i = 0; i < ids.length; i++) {
			this.addShenBaoInfo(planReachId, ids[i]);
		}
	}

	@SuppressWarnings("unchecked")
	@Override
	@Transactional(rollbackOn = Exception.class)
	public void addShenBaoInfo(String planReachId, String id) {
		PlanReachApplication planReach = super.findById(planReachId);
		// 查出下一年度计划信息
		ShenBaoInfo entity = shenBaoInfoRepo.findById(id);
		Assert.notNull(planReach, "请创建计划下达后添加项目！");
		Assert.notNull(entity, "添加的项目不存在");
		// 判断是否已存在同名的计划下达申请
		Criteria criteria = DetachedCriteria.forClass(ShenBaoInfo.class).getExecutableCriteria(repository.getSession())
				.add(Restrictions.eq(ShenBaoInfo_.projectId.getName(), entity.getProjectId())).add(Restrictions
						.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_planReach));

		List<ShenBaoInfo> entitys = criteria.list();
		// 每次添加都创建一条新的计划下达申请，根据ItemOrder区分，根据同名项目数量累加
		ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(entity);
		shenBaoInfoDto.setId(IdWorker.get32UUID());
		shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
		shenBaoInfoDto.setThisTaskId(null);
		shenBaoInfoDto.setThisTaskName(null);
		shenBaoInfoDto.setReceiver(null);
		shenBaoInfoDto.setZong_processId(null);
		shenBaoInfoDto.setProcessStage("未开始");
		shenBaoInfoDto.setProcessState(BasicDataConfig.processState_weikaishi);
		shenBaoInfoDto.setItemOrder(entitys.size()+1);
		if(StringUtil.isEmpty(shenBaoInfoDto.getRemark())){
			shenBaoInfoDto.setRemark("");
		}

		SimpleExpression criteria1 = Restrictions.eq(YearPlanCapital_.shenbaoInfoId.getName(), id);
		List<YearPlanCapital> list = yearPlanCapitalRepo.findByCriteria(criteria1);
		if (list.size() > 0) {
			Double a = list.get(0).getCapitalQCZ_ggys();
			Double b = list.get(0).getCapitalSCZ_ggys();
			Double c = list.get(0).getCapitalQCZ_gtzj();
			Double d = list.get(0).getCapitalSCZ_gtzj();
			if (a == null) {
				a = 0.0;
			}
			if (b == null) {
				b = 0.0;
			}
			if (c == null) {
				c = 0.0;
			}
			if (d == null) {
				d = 0.0;
			}

			shenBaoInfoDto.setApPlanReach_ggys(a + b);
			shenBaoInfoDto.setApPlanReach_gtzj(c + d);
		}
		shenBaoInfoDto.setPlanName("单列项目");
		shenBaoInfoDto.setPlanReachId(planReachId);
		shenBaoInfoDto.setCreatedDate(new Date());
		shenBaoInfoDto.setCreatedBy(currentUser.getUserId());
		shenBaoInfoDto.setReceiver(null);
		ShenBaoInfo shenBaoInfoentity = shenBaoInfoService.create(shenBaoInfoDto, false);
		

		if (planReach.getShenBaoInfos() == null) {
			planReach.setShenBaoInfos(new ArrayList<>(1));
		}
		planReach.getShenBaoInfos().add(shenBaoInfoentity);

		planReachApplicationRepo.save(planReach);
		logger.info(String.format("添加年度计划资金,名称：%s", planReach.getApplicationName()));
	}

	@Override
	public PageModelDto<PackPlanDto> getPackPlan(ODataObj odataObj,String planReachId) {
		PlanReachApplication entity = super.findById(planReachId);
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = null;
		Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), entity.getYear());
    	List<YearPlan> entitys = yearRepo.findByCriteria(criterion);
    	YearPlan yearPlan = null;
    	loop:for (int i = 0; i < entitys.size(); i++) {
    		if(entitys.get(i).getIsDraftOrPlan()){
    			yearPlan = entitys.get(i);
    			break loop;
    		}
		}
		if (yearPlan != null) {
			// 筛选出包含有本单位的编制
			if (!CollectionUtils.isEmpty(yearPlan.getPackPlans())) {
				UserUnitInfoDto userUnitInfoDto1 = userUnitInfoService.getByUserId(currentUser.getUserId());
				// double d = 0.0;
				// double a = 0.0;
				boolean isOurUnit = false;
				for (int i = 0; i < yearPlan.getPackPlans().size(); i++) {
					if (yearPlan.getPackPlans().get(i) != null) {
						for (int j = 0; j < yearPlan.getPackPlans().get(i).getAllocationCapitals().size(); j++) {
							if (yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j) != null) {
								if (yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getUnitName()
										.equals(userUnitInfoDto1.getId())) {// 如果有本单位的打包计划
									// d +=
									// yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getCapital_ggys();
									// a +=
									// yearPlan.getPackPlans().get(i).getAllocationCapitals().get(j).getCapital_gtzj();
									isOurUnit = true;
									break;
								}
							}
						}
					}
					if (isOurUnit == false) {
						yearPlan.getPackPlans().remove(i);
					}
				}
				List<PackPlanDto> packPlanList = new ArrayList<>();
				PackPlanDto packPlanDto;
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
	public void addPackPlans(String planReachId, String[] ids) {
		for (String id : ids) {
			this.addPackPlan(planReachId, id);
		}
	}

	@Override
	public void addShenBaoInfoToPacks(String packId, String[] ids) {
		for (String id : ids) {
			this.addShenBaoInfoToPack(packId, id);
		}
	}

	@Override
	public void deleteShenBaoInfos(String packPlanId, String[] ids) {
		for (String id : ids) {
			this.deleteShenBaoInfo(packPlanId, id);
		}
	}

	@Override
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
	@SuppressWarnings("unchecked")
	@Override
	public void addShenBaoInfoToPack(String packId, String shenbaoId) {
		// 根据计划下达id查找到计划下达信息
		PackPlan pack = packPlanRepo.findById(packId);

		// 年度计划申报信息
		ShenBaoInfo shenbaoinfo = shenBaoInfoRepo.findById(shenbaoId);
		
		Criteria criteria = DetachedCriteria.forClass(ShenBaoInfo.class).getExecutableCriteria(repository.getSession())
				.add(Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenbaoinfo.getProjectId())).add(Restrictions
						.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_planReach));

		List<ShenBaoInfo> entitys = criteria.list();
		
		// 生成一条计划下达的申报信息
		ShenBaoInfoDto shenBaoInfoDto = shenBaoInfoMapper.toDto(shenbaoinfo);
		shenBaoInfoDto.setId(IdWorker.get32UUID());
		shenBaoInfoDto.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
		shenBaoInfoDto.setProcessStage("未开始");
		shenBaoInfoDto.setProcessState(BasicDataConfig.processState_weikaishi);
		shenBaoInfoDto.setThisTaskId(null);
		shenBaoInfoDto.setThisTaskName(null);
		shenBaoInfoDto.setZong_processId(null);
		shenBaoInfoDto.setItemOrder(entitys.size()+1);
		shenBaoInfoDto.setPackPlanId(packId);
		shenBaoInfoDto.setPlanName(pack.getName());
		shenBaoInfoDto.setCreatedDate(new Date());
		shenBaoInfoDto.setCreatedBy(currentUser.getUserId());
		shenBaoInfoDto.setReceiver(null);
		if(StringUtil.isEmpty(shenBaoInfoDto.getRemark())){
			shenBaoInfoDto.setRemark("");
		}
		ShenBaoInfo shenBaoInfoentity = shenBaoInfoService.create(shenBaoInfoDto, false);
		if (pack.getShenBaoInfos() == null) {
			pack.setShenBaoInfos(new ArrayList<>(1));
		}
		pack.getShenBaoInfos().add(shenBaoInfoentity);
		packPlanRepo.save(pack);
		logger.info(String.format("打包计划添加申报项目,名称：%s", pack.getName()));
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void addPackPlan(String planReachId, String packPlanId) {
		// TODO 根据计划下达id查找到计划下达信息
		PlanReachApplication planReach = findById(planReachId);
		Assert.notNull(planReach, "请先创建计划下达后添加！");
		
		PackPlan entity = packPlanRepo.findById(packPlanId);
		Assert.notNull(entity, "数据不存在！");
		boolean isTrue = false;
		loop:for (int i = 0; i < planReach.getPackPlans().size(); i++) {
			PackPlan array_element = planReach.getPackPlans().get(i);
			if(array_element.getId().equals(packPlanId)){
				isTrue = true;
				break loop;
			}
		}

		if(isTrue){
			return;
		}
		// TODO 统计包含有本单位打包计划的资金

		UserUnitInfoDto userUnitInfoDto1 = userUnitInfoService.getByUserId(currentUser.getUserId());
		double d = 0.0, a = 0.0;
		boolean isOurUnit = false;
		if (entity != null) {
			AllocationCapital capital;
			for (int j = 0; j < entity.getAllocationCapitals().size(); j++) {
				capital = entity.getAllocationCapitals().get(j);
				if (capital != null) {
					// 如果有本单位的打包计划
					if (capital.getUnitName().equals(userUnitInfoDto1.getId())) {
						d += capital.getCapital_ggys();
						a += capital.getCapital_gtzj();
						isOurUnit = true;
					}
				}
			}
		}
		if (isOurUnit) {
			entity.setCapitalSCZ_ggys_TheYear(d);
			entity.setCapitalSCZ_gtzj_TheYear(a);
		}
		packPlanRepo.save(entity);
		// 将打包计划保存到年度计划中
		if (planReach.getPackPlans() == null) {
			planReach.setPakckPlans(new ArrayList<>(1));
		}
		planReach.getPackPlans().add(entity);
		repository.save(planReach);
		logger.info(String.format("添加年度计划资金,名称：%s", planReach.getApplicationName()));
	}

	@Override
	public PageModelDto<ShenBaoInfoDto> getShenBaoInfoFromPackPlan(String packId, ODataObj odataObj) {
		// 查询总数
		BigInteger countQuer = (BigInteger) packPlanRepo.getSession()
				.createNativeQuery(shenBaoInfoOfPackPlanOfPlanReach_count).setParameter("packPlanId", packId)
				.getSingleResult();
		int count = countQuer == null ? 0 : countQuer.intValue();

		List<ShenBaoInfoDto> shenBaoInfoDtos = null;
		if (count > 0) {
			int skip = odataObj.getSkip(), stop = odataObj.getTop();
			// 分页查询数据
			List<ShenBaoInfo> shenBaoInfos = packPlanRepo.getSession()
					.createNativeQuery(shenBaoInfoOfPackPlanOfPlanReach, ShenBaoInfo.class)
					.setParameter("packPlanId", packId).setFirstResult(skip).setMaxResults(stop).getResultList();
			int len = shenBaoInfos.size();
			shenBaoInfoDtos = new ArrayList<>(len);
			UserUnitInfoDto userUnitInfoDto = userUnitInfoService.getByUserId(currentUser.getUserId());
			for (int i = 0; i < len; i++) {
				//只显示自己单位的打包计划下达申请
				if(shenBaoInfos.get(i).getUnitName().equals(userUnitInfoDto.getId())){
					shenBaoInfoDtos.add(shenBaoInfoMapper.toDto(shenBaoInfos.get(i)));
				}
			}
		}

		return new PageModelDto<>(shenBaoInfoDtos, shenBaoInfoDtos == null?0:shenBaoInfoDtos.size());
	}

	@Override
	public List<PlanReachApplicationDto> findByDto(ODataObj odataObj) {
		return null;
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void startProcess(String packId) {
		// PackPlan packPlan=packPlanRepo.findById(packId);
		PlanReachApplication planReachApplication = planReachApplicationRepo.findById(packId);
		List<ShenBaoInfo> shenbaoList = planReachApplication.getShenBaoInfos();
		List<PackPlan> packPlans = planReachApplication.getPackPlans();
		if (!CollectionUtils.isEmpty(packPlans)) {
			for (int i = 0; i < packPlans.size(); i++) {
				PackPlan array_element = packPlans.get(i);
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

	// @Override
	// @Transactional
	// public void startProcessShenbao(String shenbaoId) {
	// ShenBaoInfo entity=shenBaoInfoRepo.findById(shenbaoId);
	// entity.setProcessStage("");
	// shenBaoInfoService.startProcessShenbao("planreach",shenbaoId);
	//
	// }

	@Override
	@Transactional(rollbackOn = Exception.class)
	public PageModelDto<PackPlanDto> getPackPlan(String planReachId, ODataObj odataObj) {
		PlanReachApplication planReachApplication = super.findById(planReachId);
		Integer skip = odataObj.getSkip();
		Integer stop = odataObj.getTop();
		if (planReachApplication != null) {
			// 查询总数
			BigInteger countQuery = (BigInteger) planReachApplicationRepo.getSession()
					.createNativeQuery(SQLConfig.packPlanByPlanReachId_count).setParameter("planReachId", planReachId)
					.getSingleResult();
			int count = countQuery == null ? 0 : countQuery.intValue();

			// 分页查询数据
			List<PackPlanDto> packPlanDtos = new ArrayList<>();
			if (count > 0) {
				List<PackPlan> packPlans = planReachApplicationRepo.getSession()
						.createNativeQuery(SQLConfig.packPlanByPlanReachId, PackPlan.class)
						.setParameter("planReachId", planReachId).setFirstResult(skip).setMaxResults(stop)
						.getResultList();
				packPlans.forEach(x -> {
					PackPlanDto packPlanDto = packPlanMapper.toDto(x);
					packPlanDtos.add(packPlanDto);
				});

				UserUnitInfoDto userUnitInfoDto1 = userUnitInfoService.getByUserId(currentUser.getUserId());
				double d = 0.0;
				double a = 0.0;
				boolean isOurUnit = false;
				for (int i = 0; i < packPlanDtos.size(); i++) {
					if (packPlanDtos.get(i) != null) {
						for (int j = 0; j < packPlanDtos.get(i).getAllocationCapitals().size(); j++) {
							if (packPlanDtos.get(i).getAllocationCapitals().get(j) != null) {
								// 如果有本单位的打包计划
								if (packPlanDtos.get(i).getAllocationCapitals().get(j).getUnitName()
										.equals(userUnitInfoDto1.getId())) {
									d += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_ggys();
									a += packPlanDtos.get(i).getAllocationCapitals().get(j).getCapital_gtzj();
									isOurUnit = true;
								}
							}
						}
					}
					if (isOurUnit) {
						packPlanDtos.get(i).setCapitalSCZ_ggys_TheYear(d);
						packPlanDtos.get(i).setCapitalSCZ_gtzj_TheYear(a);
					}
				}
			}

			return new PageModelDto<>(packPlanDtos, count);
		}
		return new PageModelDto<>();
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney) {
		ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
		
	    if(ggmoney+gtmoney+entity.getApInvestSum() > entity.getProjectInvestSum()){
       	 throw new IllegalArgumentException("超过总投资,请重新填写！");
       }
		entity.setSqPlanReach_ggys(ggmoney);
		entity.setSqPlanReach_gtzj(gtmoney);
		shenBaoInfoRepo.save(entity);
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void deleteShenBaoInfo(String packPlanId, String shenbaoId) {
		// 先根据id查找到对应的需要删除的对象
		PlanReachApplication entity = super.findById(packPlanId);
		// boolean canDelete = true;
		ShenBaoInfo shenbaoinfo = shenBaoInfoRepo.findById(shenbaoId);
		Assert.notNull(shenbaoinfo, "数据不存在");
		// 根据对象对应的申报信息，删除对应的申报信息和工作流信息

		Assert.isTrue(processState_jinxingzhong != shenbaoinfo.getProcessState(), "包含正在审批的项目,请重新选择！");
		if(!shenbaoinfo.getProcessState().equals(BasicDataConfig.processState_jinxingzhong) &&
				!shenbaoinfo.getProcessState().equals(BasicDataConfig.processState_pass)){
			List<ShenBaoInfo> shenBaoInfos = entity.getShenBaoInfos();
			ShenBaoInfo array_element;
			for (int i = 0; i < shenBaoInfos.size(); i++) {
				array_element = shenBaoInfos.get(i);
				if (shenbaoId.equals(array_element.getId())) {
					shenBaoInfos.remove(i);
				}
			}
	
			Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), shenbaoinfo.getProjectId());
			Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(),
					BasicDataConfig.projectShenBaoStage_nextYearPlan);
			List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion, criterion2);
			if (!CollectionUtils.isEmpty(shenbaoinfoList)) {
				array_element = shenbaoinfoList.get(0);
				array_element.setIsIncludPack(false);
				shenBaoInfoRepo.save(array_element);
			}
		
				shenBaoInfoRepo.delete(shenbaoinfo);
			
			repository.save(entity);
			logger.info(String.format("删除计划下达申请表,名称 :%s", entity.getApplicationName()));
		}else{
			Assert.isTrue(processState_jinxingzhong == shenbaoinfo.getProcessState(), "项目已发文,请重新选择！");
		}
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void deletePack(String packPlanId, String packId) {
		// TODO 单条删除计划下达中的打包信息
		PlanReachApplication entity = super.findById(packPlanId);

		// TODO 不能删除，否则其他计划下达添加的申报信息也会被删掉，打包作为公共信息
		List<PackPlan> planList = entity.getPackPlans();
		if(!CollectionUtils.isEmpty(planList)){
			for (int i = 0; i < planList.size(); i++) {
				PackPlan array_element = planList.get(i);
		
				if (packId.equals(array_element.getId())) {
					packPlanRepo.save(array_element);
					planList.remove(i);
				}
			}
			entity.getPackPlans().clear();
			entity.setPackPlans(planList);
			super.repository.save(entity);
		}
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public void deletePlanShenBaoInfo(String packPlanId, String shenbaoId) {
		PackPlan plan = packPlanRepo.findById(packPlanId);
		ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
		//进行中或者已审批通过的项目无法删除
		if(!entity.getProcessState().equals(BasicDataConfig.processState_jinxingzhong) &&
				!entity.getProcessState().equals(BasicDataConfig.processState_pass)){
		
			for (int i = 0; i < plan.getShenBaoInfos().size(); i++) {
				ShenBaoInfo array_element = plan.getShenBaoInfos().get(i);
	
				if (shenbaoId.equals(array_element.getId())) {
					shenBaoInfoRepo.delete(entity);
					plan.getShenBaoInfos().remove(i);
				}
			}
			Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), entity.getProjectId());
			Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(),
					BasicDataConfig.projectShenBaoStage_nextYearPlan);
			List<ShenBaoInfo> shenbaoinfoList = shenBaoInfoRepo.findByCriteria(criterion, criterion2);
			shenbaoinfoList.get(0).setIsIncludPack(false);
			shenBaoInfoRepo.save(shenbaoinfoList.get(0));
			packPlanRepo.save(plan);
		}else{
			new IllegalArgumentException("项目正在审批或者已发文，无法删除");
		}
	}

	/**
	 * 获取下一年计划
	 * 
	 * @return
	 */
	public YearPlan getYearPlan() {
		Calendar cal = Calendar.getInstance(TimeZone.getTimeZone("GMT+08:00"));
		int nextYear = cal.get(Calendar.YEAR) + 1;
		Criteria criteria = DetachedCriteria.forClass(YearPlan.class).getExecutableCriteria(repository.getSession())
				.add(Restrictions.eq(YearPlan_.year.getName(), nextYear)).setMaxResults(1);
		return (YearPlan) criteria.uniqueResult();
	}

	@Override
	@Transactional(rollbackOn = Exception.class)
	public PageModelDto<ShenBaoInfoDto> getShenbaoInfoFromYearplan(ODataObjNew odataObj) {
		String yearPlanId = getYearPlan().getId();

		return yearPlanService.getYearPlanShenBaoInfo(yearPlanId, odataObj, true);
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

	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional(rollbackOn = Exception.class)
	public PageModelDto<ShenBaoInfoDto> getShenBaoInfoOutOfPlanReach(ODataObjNew odataObj, String planReachId, boolean isPackPlan) {
		PlanReachApplication entity = super.findById(planReachId);
		
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = null;
		if(!ObjectUtils.isEmpty(entity)){
		
			Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), entity.getYear());
	    	List<YearPlan> entitys = yearRepo.findByCriteria(criterion);
	    	loop:for (int i = 0; i < entitys.size(); i++) {
	    		if(entitys.get(i).getIsDraftOrPlan()){
	    			shenBaoInfoDtos = yearPlanService.getYearPlanShenBaoInfo(entitys.get(i).getId(), odataObj, false);
	    			break loop;
	    		}
				
			}
		}
//		if(!ObjectUtils.isEmpty(shenBaoInfoDtos)){
//			UserUnitInfoDto userUnitInfoDto = userUnitInfoService.getByUserId(currentUser.getUserId());
//			List<ShenBaoInfoDto> shenBaoInfoDtoList = new ArrayList<>();
//			for (int i = 0; i < shenBaoInfoDtos.getValue().size(); i++) {
//				ShenBaoInfoDto array_element = shenBaoInfoDtos.getValue().get(i);
//				if(array_element.getUnitName().equals(userUnitInfoDto.getId())){
//					shenBaoInfoDtoList.add(array_element);
//				}
//			}
//			
//			return new PageModelDto<>(shenBaoInfoDtoList,shenBaoInfoDtoList==null?0:shenBaoInfoDtoList.size());
//		}
    	return shenBaoInfoDtos;
		// TODO Auto-generated method stub
//		List<String> projectsID = null;
//		List<ShenBaoInfo> shenBaoInfos = null;
//		if(!isPackPlan){
//			shenBaoInfos = super.findById(planReachId).getShenBaoInfos();
//		}else{
//			shenBaoInfos = packPlanRepo.findById(planReachId).getShenBaoInfos();
//		}
//		
//		projectsID = shenBaoInfos.stream().map(shenbaoinfo -> shenbaoinfo.getProjectId())
//				.collect(Collectors.toList());
//		List<ODataFilterItem> ODataFilterItemList = odataObj.getFilter();
//		if (CollectionUtils.isEmpty(ODataFilterItemList)) {
//			ODataFilterItemList = new ArrayList<ODataFilterItem>();
//		}
//
//		if (!CollectionUtils.isEmpty(projectsID)) {
//			for (int i = 0; i < projectsID.size(); i++) {
//				String array_element = projectsID.get(i);
//				ODataFilterItem item = new ODataFilterItem();
//				item.setField(ShenBaoInfo_.projectId.getName());
//				item.setOperator("notIn");
//				item.setValue(array_element);
//				ODataFilterItemList.add(item);
//			}
//		}
//		odataObj.setFilter(ODataFilterItemList);
//
//		return shenBaoInfoService.get(odataObj);
	}
	@SuppressWarnings({ "unchecked", "rawtypes" })
	@Override
	@Transactional(rollbackOn = Exception.class)
	public PageModelDto<ShenBaoInfoDto> getShenBaoInfoOutOfPackPlan(ODataObjNew odataObj, String packPlanId) {
		PackPlan entity = packPlanRepo.findById(packPlanId);
		
		PageModelDto<ShenBaoInfoDto> shenBaoInfoDtos = null;
		if(!ObjectUtils.isEmpty(entity)){
		
			Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), entity.getYear());
	    	List<YearPlan> entitys = yearRepo.findByCriteria(criterion);
	    	loop:for (int i = 0; i < entitys.size(); i++) {
	    		if(entitys.get(i).getIsDraftOrPlan()){
	    			shenBaoInfoDtos = yearPlanService.getYearPlanShenBaoInfo(entitys.get(i).getId(), odataObj, false);
	    			break loop;
	    		}
				
			}
		}
		
    	return shenBaoInfoDtos;
	}

	//根据计划下达id查询项目信息
	@Override
	@Transactional
	public List<ExcelReportPlanReachDto> findPlanreachBySql(String id) {
		List<ExcelReportPlanReachDto> list= new ArrayList<ExcelReportPlanReachDto>();
		StringBuffer sql = new StringBuffer();

		sql.append("select '0' as orderNum")
				.append(",'' as constructionUnit")
				.append(",'' as projectName")
				.append(",'' as projectCategory")
				.append(",'' projectIndustry")
				.append(",'' as pId")
				.append(",'' as projectCategoryDesc")
				.append(",'A' as projectIndustryDesc")
				.append(",'' as projectConstrChar")
				.append(",'' as projectGuiMo")
				.append(",sum(c.projectInvestSum) as projectInvestSum")
				.append(",sum(c.apInvestSum) as apInvestSum")
				.append(",sum(c.apPlanReach_ggys) as apPlanReach_ggys")
				.append(",sum(c.apPlanReach_gtzj) as apPlanReach_gtzj")
				.append(",'' as yearConstructionTask")
				.append(",'' as remark")
				.append(" from cs_planReachApplication a")
				.append(" left join cs_planReachApplication_cs_shenbaoinfo b on a.id = b.PlanReachApplication_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" where a.id = ").append("'").append(id).append("'")

				.append(" union all  ")

				.append("select '1' as orderNum")
				.append(",'' as constructionUnit")
				.append(",'' as projectName")
				.append(",'' as projectCategory")
				.append(",c.projectIndustry")
				.append(",'' as pId")
				.append(",'' as projectCategoryDesc")
				.append(",e.description as projectIndustryDesc")
				.append(",'' as projectConstrChar")
				.append(",'' as projectGuiMo")
				.append(",sum(c.projectInvestSum) as projectInvestSum")
				.append(",sum(c.apInvestSum) as apInvestSum")
				.append(",sum(c.apPlanReach_ggys) as apPlanReach_ggys")
				.append(",sum(c.apPlanReach_gtzj) as apPlanReach_gtzj")
				.append(",'' as yearConstructionTask")
				.append(",'' as remark")
				.append(" from cs_planReachApplication a")
				.append(" left join cs_planReachApplication_cs_shenbaoinfo b on a.id = b.PlanReachApplication_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" left join cs_basicdata e on c.projectIndustry = e.id ")
				.append(" where a.id = ").append("'").append(id).append("'")
				.append(" group by c.projectIndustry ")

				.append(" union all ")

				.append(" select '2' as orderNum")
				.append(",c.constructionUnit")
				.append(",CONCAT_WS(':',c.projectName,c.countryNumber)")
				.append(",c.projectCategory")
				.append(",c.projectIndustry")
				.append(",d.pId")
				.append(",d.description as projectCategoryDesc")
				.append(",e.description as projectIndustryDesc")
				.append(",c.projectConstrChar")
				.append(",c.projectGuiMo")
				.append(",c.projectInvestSum")
				.append(",c.apInvestSum")
				.append(",c.apPlanReach_ggys")
				.append(",c.apPlanReach_gtzj")
				.append(",c.yearConstructionTask")
				.append(",c.remark")
				.append(" from cs_planReachApplication a")
				.append(" left join cs_planReachApplication_cs_shenbaoinfo b on a.id = b.PlanReachApplication_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" left join cs_basicdata d on c.projectCategory = d.id ")
				.append(" left join cs_basicdata e on c.projectIndustry = e.id ")
				.append(" where a.id = ").append("'").append(id).append("'")

				.append(" order by projectIndustryDesc,orderNum ");

		NativeQuery query = super.repository.getSession().createNativeQuery(sql.toString());
		query.addScalar("orderNum", new IntegerType());
		query.addScalar("constructionUnit", new StringType());
		query.addScalar("projectName", new StringType());
		query.addScalar("projectCategory", new StringType());
		query.addScalar("projectIndustry",new StringType());
		query.addScalar("projectIndustryDesc",new StringType());
		query.addScalar("pId", new StringType());
		query.addScalar("projectCategoryDesc", new StringType());
		query.addScalar("projectConstrChar", new StringType());
		query.addScalar("projectGuiMo", new StringType());
		query.addScalar("projectInvestSum", new DoubleType());
		query.addScalar("apInvestSum", new DoubleType());
		query.addScalar("apPlanReach_ggys", new DoubleType());
		query.addScalar("apPlanReach_gtzj", new DoubleType());
		query.addScalar("yearConstructionTask", new StringType());
		query.addScalar("remark", new StringType());

		list = query.setResultTransformer(Transformers.aliasToBean(ExcelReportPlanReachDto.class)).list();
		logger.info("计划下达Excel导出! sql================>>"+sql.toString());
		return list;
	}


	//根据计划下达id查询项目信息
	@Override
	@Transactional
	public List<ExcelReportPlanReachDto> findPlanBySql(String id) {
		List<ExcelReportPlanReachDto> list= new ArrayList<ExcelReportPlanReachDto>();
		StringBuffer sql = new StringBuffer();

		sql.append("select '0' as orderNum")
				.append(",'' as constructionUnit")
				.append(",'' as projectName")
				.append(",'' as projectCategory")
				.append(",'' projectIndustry")
				.append(",'' as pId")
				.append(",'' as projectCategoryDesc")
				.append(",'A' as projectIndustryDesc")
				.append(",'' as projectConstrChar")
				.append(",'' as projectGuiMo")
				.append(",sum(c.projectInvestSum) as projectInvestSum")
				.append(",sum(c.apInvestSum) as apInvestSum")
				.append(",sum(c.apPlanReach_ggys) as apPlanReach_ggys")
				.append(",sum(c.apPlanReach_gtzj) as apPlanReach_gtzj")
				.append(",'' as yearConstructionTask")
				.append(",'' as remark")
				.append(" from cs_packPlan a")
				.append(" left join cs_packPlan_cs_shenbaoinfo b on a.id = b.PackPlan_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" where a.id = ").append("'").append(id).append("'")

				.append(" union all  ")

				.append("select '1' as orderNum")
				.append(",'' as constructionUnit")
				.append(",'' as projectName")
				.append(",'' as projectCategory")
				.append(",c.projectIndustry")
				.append(",'' as pId")
				.append(",'' as projectCategoryDesc")
				.append(",e.description as projectIndustryDesc")
				.append(",'' as projectConstrChar")
				.append(",'' as projectGuiMo")
				.append(",sum(c.projectInvestSum) as projectInvestSum")
				.append(",sum(c.apInvestSum) as apInvestSum")
				.append(",sum(c.apPlanReach_ggys) as apPlanReach_ggys")
				.append(",sum(c.apPlanReach_gtzj) as apPlanReach_gtzj")
				.append(",'' as yearConstructionTask")
				.append(",'' as remark")
				.append(" from cs_packPlan a")
				.append(" left join cs_packPlan_cs_shenbaoinfo b on a.id = b.PackPlan_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" left join cs_basicdata e on c.projectIndustry = e.id ")
				.append(" where a.id = ").append("'").append(id).append("'")
				.append(" group by c.projectIndustry ")

				.append(" union all ")

				.append(" select '2' as orderNum")
				.append(",c.constructionUnit")
				.append(",CONCAT_WS(':',c.projectName,c.countryNumber)")
				.append(",c.projectCategory")
				.append(",c.projectIndustry")
				.append(",d.pId")
				.append(",d.description as projectCategoryDesc")
				.append(",e.description as projectIndustryDesc")
				.append(",c.projectConstrChar")
				.append(",c.projectGuiMo")
				.append(",c.projectInvestSum")
				.append(",c.apInvestSum")
				.append(",c.apPlanReach_ggys")
				.append(",c.apPlanReach_gtzj")
				.append(",c.yearConstructionTask")
				.append(",c.remark")
				.append(" from cs_packPlan a")
				.append(" left join cs_packPlan_cs_shenbaoinfo b on a.id = b.PackPlan_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" left join cs_basicdata d on c.projectCategory = d.id ")
				.append(" left join cs_basicdata e on c.projectIndustry = e.id ")
				.append(" where a.id = ").append("'").append(id).append("'")

				.append(" order by projectIndustryDesc,orderNum ");

		NativeQuery query = super.repository.getSession().createNativeQuery(sql.toString());
		query.addScalar("orderNum", new IntegerType());
		query.addScalar("constructionUnit", new StringType());
		query.addScalar("projectName", new StringType());
		query.addScalar("projectCategory", new StringType());
		query.addScalar("projectIndustry",new StringType());
		query.addScalar("projectIndustryDesc",new StringType());
		query.addScalar("pId", new StringType());
		query.addScalar("projectCategoryDesc", new StringType());
		query.addScalar("projectConstrChar", new StringType());
		query.addScalar("projectGuiMo", new StringType());
		query.addScalar("projectInvestSum", new DoubleType());
		query.addScalar("apInvestSum", new DoubleType());
		query.addScalar("apPlanReach_ggys", new DoubleType());
		query.addScalar("apPlanReach_gtzj", new DoubleType());
		query.addScalar("yearConstructionTask", new StringType());
		query.addScalar("remark", new StringType());

		list = query.setResultTransformer(Transformers.aliasToBean(ExcelReportPlanReachDto.class)).list();
		logger.info("计划下达Excel导出! sql================>>"+sql.toString());
		return list;
	}


}

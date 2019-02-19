package cs.service.impl;

import com.sn.framework.common.IdWorker;
import cs.common.SQLConfig;
import cs.domain.*;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.model.PageModelDto;
import cs.model.Statistics.sttisticsData;
import cs.model.exportExcel.*;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;
import cs.service.interfaces.YearPlanService;
import net.sf.ehcache.concurrent.ConcurrencyUtil;

import org.apache.log4j.Logger;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hibernate.query.Query;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DateType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Optional;

import static cs.common.SQLConfig.getYearPlanProject;
import static cs.common.SQLConfig.getYearPlanProjectCount;

/**
 * @Description: 年度计划服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@SuppressWarnings({"deprecation", "unused"})
@Service
public class YearPlanServiceImpl extends AbstractServiceImpl<YearPlanDto, YearPlan, String> implements YearPlanService {
    private static Logger logger = Logger.getLogger(YearPlanServiceImpl.class);

    @Autowired
    private IRepository<YearPlanCapital, String> yearPlanCapitalRepo;
    @Autowired
    private IRepository<ShenBaoInfo, String> shenbaoInfoRepo;
    @Autowired
    private IRepository<PackPlan, String> packPlanRepo;
    @Autowired
    private IRepository<Project, String> projectRepo;
    @Autowired
    private IRepository<UserUnitInfo, String> userUnitInfoRepo;
    @Autowired
    private IMapper<YearPlanCapitalDto, YearPlanCapital> yearPlanCapitalMapper;
    @Autowired
    private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoInfoMapper;
    @Autowired
    private IMapper<PackPlanDto, PackPlan> packPlanMapper;

    Calendar c = Calendar.getInstance();//可以对每个时间域单独修改
    int year = c.get(Calendar.YEAR);


    @Override
    @Transactional
    public PageModelDto<YearPlanDto> get(ODataObj odataObj) {
        logger.info("查询年度计划数据");
        return super.get(odataObj);
    }

    @Override
    @Transactional
    public YearPlan create(YearPlanDto dto) {
    	Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), dto.getYear());
    	List<YearPlan> entitys = super.repository.findByCriteria(criterion);
    	for (int i = 0; i < entitys.size(); i++) {
    		YearPlan yearPlan = entitys.get(i);
    		if(dto.getYear().equals(yearPlan.getYear()) && dto.getIsDraftOrPlan() && yearPlan.getIsDraftOrPlan()){
    			throw new IllegalArgumentException("当前年份："+yearPlan.getYear()+"已存在计划下达编制，其他编制信息只能用作草稿！");
    		}
			
		}
//        Criterion criterion = Restrictions.eq(YearPlan_.name.getName(), dto.getName());
//        Criterion criterion2 = Restrictions.eq(YearPlan_.year.getName(), dto.getYear());
//        Optional<YearPlan> yearPlan = repository.findByCriteria(criterion).stream().findFirst();
//        Optional<YearPlan> yearPlan2 = repository.findByCriteria(criterion2).stream().findFirst();
//        if (yearPlan.isPresent()) {
//            throw new IllegalArgumentException(String.format("项目代码：%s 已经存在,请重新输入！", dto.getName()));
//        }
//        if (yearPlan2.isPresent()) {
//            throw new IllegalArgumentException(String.format("当前年份：%s 的编制已经存在,请创建其他年份！", dto.getYear()));
//        } else {
            YearPlan entity = super.create(dto);
            //关联信息资金安排
            dto.getYearPlanCapitalDtos().stream().forEach(x -> {
                YearPlanCapital yearPlanCapital = new YearPlanCapital();
                yearPlanCapitalMapper.buildEntity(x, yearPlanCapital);
                entity.getYearPlanCapitals().add(yearPlanCapital);
            });
            logger.info(String.format("创建年度计划,名称：%s", dto.getName()));
            super.repository.save(entity);
            return entity;
//        }
    }

    @Override
    @Transactional
    public YearPlan update(YearPlanDto dto, String id) {
    	Criterion criterion = Restrictions.eq(YearPlan_.year.getName(), dto.getYear());
    	List<YearPlan> entitys = super.repository.findByCriteria(criterion);
    	for (int i = 0; i < entitys.size(); i++) {
    		YearPlan yearPlan = entitys.get(i);
    		if(dto.getYear().equals(yearPlan.getYear()) && dto.getIsDraftOrPlan() && yearPlan.getIsDraftOrPlan()){
    			throw new IllegalArgumentException("当前年份："+yearPlan.getYear()+"已存在计划下达编制，其他编制信息只能用作草稿！");
    		}
			
		}
    	
        YearPlan entity = super.update(dto, id);
        //关联信息资金安排
        entity.getYearPlanCapitals().forEach(x -> {//删除历史资金安排记录
            yearPlanCapitalRepo.delete(x);
        });
        entity.getYearPlanCapitals().clear();
        dto.getYearPlanCapitalDtos().forEach(x -> {//添加新的资金安排记录
            entity.getYearPlanCapitals().add(yearPlanCapitalMapper.buildEntity(x, new YearPlanCapital()));
        });

        logger.info(String.format("更新年度计划,名称：%s", dto.getName()));
        super.repository.save(entity);
        return entity;
    }


    @Override
    @Transactional
    public void delete(String id) {
        YearPlan yearPlan = super.findById(id);
        if (yearPlan.getPackPlans().size() > 0) {
            for (int i = 0; i < yearPlan.getPackPlans().size(); i++) {
                yearPlan.getPackPlans().remove(i);
            }
            yearPlan.getPackPlans().clear();
        }
        super.delete(id);
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId, ODataObjNew odataObj, boolean exclude) {
//        YearPlan yearPlan = super.repository.findById(planId);
//        if (yearPlan != null) {
    	//查询总数
	    	BigInteger countQuery= null;
	    	 if(odataObj.getFilterList().size()>0){
                 String projectName = odataObj.getFilterList().get(0).getValue().toString();

	    		 countQuery = (BigInteger) shenbaoInfoRepo.getSession()
	                     .createNativeQuery(SQLConfig.getYearPlanProjectForPageCount(exclude))
	                     .setParameter("yearPlanId", planId)
	                     .setParameter("unitName", odataObj.getFilterList().get(0).getValue())
	                     .getSingleResult();
	    	 }else{
	    		  countQuery = (BigInteger) shenbaoInfoRepo.getSession()
	                      .createNativeQuery(getYearPlanProjectCount(exclude))
	                      .setParameter("yearPlanId", planId)
	                      .getSingleResult();
	    	 }
            
          
            int count = countQuery == null ? 0 : countQuery.intValue();
            List<ShenBaoInfoDto> shenBaoInfoDtos = new ArrayList<>();
            if (count > 0) {
                int skip = odataObj.getSkip(), stop = odataObj.getTop();
                if(odataObj.getFilterList().size()>0){
//                    String unitName=null;
//                    String projectName=null;
//                    for(int i=0;i<odataObj.getFilterList().size();i++){
//                        if(odataObj.getFilterList().get(i).getFiledName().equals("unitName")){
//                            unitName = odataObj.getFilterList().get(i).getValue().toString();
//                        }if(odataObj.getFilterList().get(i).getFiledName().equals("projectName")){
//                            projectName = odataObj.getFilterList().get(i).getValue().toString();
//                        }
//                    }
                	 //分页查询数据
                    List<ShenBaoInfo> shenBaoInfos = shenbaoInfoRepo.getSession()
                            .createNativeQuery(SQLConfig.getYearPlanProjectForPage(exclude), ShenBaoInfo.class)
                            .setParameter("yearPlanId", planId)
                            .setParameter("unitName", odataObj.getFilterList().get(0).getValue())
                            .setFirstResult(skip).setMaxResults(stop)
                            .getResultList();
                    shenBaoInfos.forEach(x -> shenBaoInfoDtos.add(shenbaoInfoMapper.toDto(x)));
                }else{
                	 //分页查询数据
                    List<ShenBaoInfo> shenBaoInfos = shenbaoInfoRepo.getSession()
                            .createNativeQuery(getYearPlanProject(exclude), ShenBaoInfo.class)
                            .setParameter("yearPlanId", planId)
                            .setFirstResult(skip).setMaxResults(stop)
                            .getResultList();
                    shenBaoInfos.forEach(x -> shenBaoInfoDtos.add(shenbaoInfoMapper.toDto(x)));
                }
               
            }

            return new PageModelDto<>(shenBaoInfoDtos, count);
//        }
//        return null;
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public PageModelDto<PackPlanDto> getYearPlanPack(String planId, ODataObj odataObj) {
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();
        YearPlan yearPlan = super.findById(planId);
        if (yearPlan != null) {
            //分页查询数据
            List<PackPlanDto> packPlanDtos = new ArrayList<>();
            List<PackPlan> packPlans = ((SQLQuery) packPlanRepo.getSession()
                    .createSQLQuery(SQLConfig.packPlanByYearPlanId)
                    .setParameter("yearPlanId", planId)
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(PackPlan.class)
                    .getResultList();
            packPlans.forEach(x -> {
                PackPlanDto packPlanDto = packPlanMapper.toDto(x);
                packPlanDtos.add(packPlanDto);
            });
            //查询总数
            List<PackPlan> packPlans2 = packPlanRepo.getSession()
                    .createSQLQuery(SQLConfig.packPlanByYearPlanId)
                    .setParameter("yearPlanId", planId)
                    .addEntity(PackPlan.class)
                    .getResultList();
            int count = packPlans2.size();

            PageModelDto<PackPlanDto> pageModelDto = new PageModelDto<>();
            pageModelDto.setCount(count);
            pageModelDto.setValue(packPlanDtos);
            return pageModelDto;
        }
        return null;
    }

    @Override
    @Transactional
    public void addYearPlanCapitals(String planId, String[] ids) {
        //根据申报信息id创建年度计划资金
        for (String id : ids) {
            this.addYearPlanCapital(planId, id);
        }

    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void addYearPlanCapital(String planId, String shenBaoId) {
        Boolean hasShenBaoInfo = false;
        //根据年度计划id查找到年度计划
        YearPlan yearPlan = super.findById(planId);
        if (yearPlan != null) {
            //判断年度计划编制中是否已有该项目申报
            List<YearPlanCapital> capitals = yearPlan.getYearPlanCapitals();
            String shenbaoName = null;
            for (YearPlanCapital capital : capitals) {
                if (capital.getShenbaoInfoId().equals(shenBaoId)) {
                    hasShenBaoInfo = true;
                    break;
                }
            }
            if (hasShenBaoInfo) {
                //通过申报信息id获取项目名称
                //String projectName = shenbaoInfoRepo.findById(shenBaoId).getProjectName();
//                throw new IllegalArgumentException("已经存在编制计划中,请重新选择！");
            	return;
            } else {
                //根据申报信息id创建年度计划资金
                YearPlanCapital entity = new YearPlanCapital();
                entity.setId(IdWorker.get32UUID());
                //设置关联的申报信息id
                entity.setShenbaoInfoId(shenBaoId);
                //设置安排资金
                ShenBaoInfo shenBaoInfo = shenbaoInfoRepo.findById(shenBaoId);
                if (shenBaoInfo != null) {
                    Project project = projectRepo.findById(shenBaoInfo.getProjectId());
                    //区财政--公共预算
                    entity.setCapitalQCZ_ggys(shenBaoInfo.getCapitalAP_ggys_TheYear());
                    //区财政--国土资金
                    entity.setCapitalQCZ_gtzj(shenBaoInfo.getCapitalAP_gtzj_TheYear());
                    //安排资金总计
                    entity.setCapitalSum(shenBaoInfo.getYearInvestApproval());
                    shenBaoInfo.setIsIncludYearPlan(true);
                    shenbaoInfoRepo.save(shenBaoInfo);
                    if (project != null) {
                        project.setIsIncludYearPlan(true);
                        projectRepo.save(project);
                    }
                }
                //设置创建人和修改人
                String loginName = currentUser.getUserId();
                entity.setCreatedBy(loginName);
                entity.setModifiedBy(loginName);
                //将新创建的计划资金对象保存到计划中
                if (yearPlan.getYearPlanCapitals() != null) {
                    yearPlan.getYearPlanCapitals().add(entity);
                } else {
                    List<YearPlanCapital> yearPlanCapitals = new ArrayList<>();
                    yearPlanCapitals.add(entity);
                    yearPlan.setYearPlanCapitals(yearPlanCapitals);
                }
                super.repository.save(yearPlan);
                logger.info(String.format("添加年度计划资金,名称：%s", yearPlan.getName()));
            }
        }

    }

    @Override
    @Transactional
    public void removeYearPlanCapital(String planId, String[] yearPlanCapitalId) {
        YearPlan yearPlan = super.repository.findById(planId);
        List<YearPlanCapital> yearPlanCapitals = yearPlan.getYearPlanCapitals();
        if (yearPlan != null) {

            List<YearPlanCapital> removeItems = new ArrayList<>();
            yearPlanCapitals.forEach(x -> {
                for (String capitalId : yearPlanCapitalId) {
                    if (x.getId().equals(capitalId)) {
                        removeItems.add(x);
                        ShenBaoInfo entity = shenbaoInfoRepo.findById(x.getShenbaoInfoId());
                        if (entity != null) {
                            Project project = projectRepo.findById(entity.getProjectId());
                            entity.setIsIncludYearPlan(false);
                            shenbaoInfoRepo.save(entity);
                            if (project != null) {
                                project.setIsIncludYearPlan(false);
                                projectRepo.save(project);
                            }
                        }
                    }
                }
            });
            yearPlanCapitals.removeAll(removeItems);

        }
//		yearPlan.getYearPlanCapitals().clear();
        yearPlan.setYearPlanCapitals(yearPlanCapitals);
        super.repository.save(yearPlan);
        logger.info(String.format("移除年度计划资金,名称：%s", yearPlan.getName()));
    }


    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<YearPlanStatistics> getStatistics(String planId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {
            Query<YearPlanStatistics> query = repository.getSession().createNativeQuery(SQLConfig.yearPlanStatistics)
                    .setParameter("yearPlanId", planId.trim())
                    .addScalar("total", new IntegerType())
                    .addScalar("qianQiTotal", new IntegerType())
                    .addScalar("newStratTotal", new IntegerType())
                    .addScalar("xuJianTotal", new IntegerType())
                    .addScalar("chuBeiTotal", new IntegerType())
                    .addScalar("investTotal", new DoubleType())
                    .addScalar("applyTotal", new DoubleType())
                    .addScalar("arrangeTotal", new DoubleType())
                    .addScalar("capitalSCZ_ggysTotal", new DoubleType())
                    .addScalar("capitalSCZ_gtzjTotal", new DoubleType())
                    .addScalar("capitalSCZ_zxzjTotal", new DoubleType())
                    .addScalar("capitalQCZ_ggysTotal", new DoubleType())
                    .addScalar("capitalQCZ_gtzjTotal", new DoubleType())
                    .addScalar("capitalZYYSTotal", new DoubleType())
                    .addScalar("capitalSHTZTotal", new DoubleType())
                    .addScalar("capitalOtherTotal", new DoubleType())
                    .setResultTransformer(Transformers.aliasToBean(YearPlanStatistics.class));
            List<YearPlanStatistics> list = query.list();
            return list;
        } else {
            return null;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public List<ExcelDataLBTJ> getYearPlanShenBaoInfoByLBTJ(String planId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {//判空处理
            List<ExcelDataLBTJ> excelDataLBTJList = new ArrayList<>();
            List query = shenbaoInfoRepo.getSession()
                    .createNativeQuery(SQLConfig.yearPlanByLBTJ)
                    .setParameter("yearPlanId", planId)
                    .addScalar("planYear", new IntegerType()) //计划年度
                    .addScalar("projectCategory", new StringType())
                    .addScalar("projectSum", new IntegerType())
                    .addScalar("investSum", new DoubleType())
                    .addScalar("investAccuSum", new DoubleType())
                    .addScalar("apInvestSum", new DoubleType())
                    .addScalar("yearInvestApprovalSum", new DoubleType())
                    .setResultTransformer(Transformers.aliasToBean(ExcelDataLBTJ.class))
                    .list();

            excelDataLBTJList = query;
            logger.info(String.format("根据项目类别统计年度计划,名称：%s", yearPlan.getName()));
            return excelDataLBTJList;
        } else {
            return null;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public List<ExcelDataHYTJ> getYearPlanShenBaoInfoByHYTJ(String planId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {//判空处理
            List query = shenbaoInfoRepo.getSession()
                    .createSQLQuery(SQLConfig.yearPlanByHYTJ)
                    .setParameter("yearPlanId", planId)
                    .addScalar("planYear", new IntegerType())  //计划年度
                    .addScalar("projectIndustry", new StringType())  //项目行业
                    .addScalar("projectSum", new IntegerType())  //项目行业合计
                    .addScalar("projectCategory_ASum", new IntegerType()) //A类数量
                    .addScalar("projectCategory_BSum", new IntegerType()) //B类数量
                    .addScalar("projectCategory_CSum", new IntegerType()) //C类数量
                    .addScalar("projectCategory_DSum", new IntegerType()) //D类数量
                    .addScalar("investSum", new DoubleType())  //总投资
                    .addScalar("investAccuSum", new DoubleType()) //累计拨付
                    .addScalar("apInvestSum", new DoubleType())  //累计下达
                    .addScalar("yapInvestSum", new DoubleType())  //安排年度投资
                    .addScalar("yearAp_ggysSum", new DoubleType())  //年度预安排资金--公共预算
                    .addScalar("yearAp_gtjjSum", new DoubleType())  //年度预安排资金--国土基金
                    .addScalar("yearAp_qitaSum", new DoubleType())  //年度预安排资金--其他
                    .addScalar("yearApSum", new DoubleType())  //年度预安排资金--合计
                    .setResultTransformer(Transformers.aliasToBean(ExcelDataHYTJ.class))
                    .list();

            logger.info(String.format("根据项目行业统计年度计划,名称：%s", yearPlan.getName()));
            return query;
        } else {
            return null;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public List<ExcelDataDWTJ> getYearPlanShenBaoInfoByDWTJ(String planId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {//判空处理
            List query = shenbaoInfoRepo.getSession()
                    .createSQLQuery(SQLConfig.yearPlanByDWTJ)
                    .setParameter("yearPlanId", planId)
                    .addScalar("planYear", new IntegerType())  //计划年度
                    .addScalar("constrctionUnit", new StringType())  //建设单位
                    .addScalar("yearApSum", new DoubleType())  //年度预安排资金--合计
                    .addScalar("yearAp_danLie", new DoubleType())  //年度预安排资金--单列项目
                    .addScalar("yearAp_jieSunKuan", new DoubleType())  //年度预安排资金--结算款
                    .addScalar("yearAp_xiaohe", new DoubleType())  //年度预安排资金--小额
                    .addScalar("yearAp_weiLiXYuLiu", new DoubleType())  //年度预安排资金--未立项项目预留
                    .setResultTransformer(Transformers.aliasToBean(ExcelDataDWTJ.class))
                    .list();

            logger.info(String.format("根据建设单位统计年度计划,名称：%s", yearPlan.getName()));
            return query;
        } else {
            return null;
        }
    }

    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public List<ExcelDataYS> getYearPlanShenBaoInfoByYS(String planId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {//判空处理
            List query = shenbaoInfoRepo.getSession()
                    .createSQLQuery(SQLConfig.yearPlanByYS)
                    .setParameter("yearPlanId", planId)
                    .addScalar("planYear", new IntegerType())  //计划年度
                    .addScalar("ConstructionUnit", new StringType())  //建设单位
                    .addScalar("ProjectName", new StringType())  //项目名称
                    .addScalar("ProjectCode", new StringType())  //项目代码
                    .addScalar("ProjectType", new StringType())  //项目类别
                    .addScalar("ProjectIndustry", new StringType())  //项目行业
                    .addScalar("ConstructionScale", new StringType())  //建设规模
                    .addScalar("ConstructionType", new StringType())  //建设性质
                    .addScalar("beginDate", new StringType())  //开工日期
                    .addScalar("endDate", new StringType())  //竣工日期
                    .addScalar("TotalInvest", new DoubleType())  //总投资
                    .addScalar("investAccuSum", new DoubleType())  //累计投资
                    .addScalar("apInvestSum", new DoubleType())  //累计安排
                    .addScalar("applyYearInvest", new DoubleType())  //本年度申请资金
                    .addScalar("yearApSum", new DoubleType())  //年度安排资金总计
                    .addScalar("capitalAP_gtzj_TheYear", new DoubleType())  //本年度安排资金_国土
                    .addScalar("capitalAP_ggys_TheYear", new DoubleType())  //本年度安排资金_公共预算
                    .addScalar("yearAp_qitaSum", new DoubleType())  //本年度安排资金_其他
                    .addScalar("ConstructionContent", new StringType())  //主要建设内容
                    .addScalar("Remark", new StringType())  //备注
                    .setResultTransformer(Transformers.aliasToBean(ExcelDataYS.class))
                    .list();

            logger.info(String.format("年度计划印刷版统计,名称：%s", yearPlan.getName()));
            return query;
        } else {
            return null;
        }
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<sttisticsData> getyearPlanByHYData() {
        List<sttisticsData> list = new ArrayList<>();
        list = repository.getSession().createNativeQuery(SQLConfig.yearPlanByHY)
                .setParameter("year", year)
                .addScalar("projectIndustry", new StringType())
                .addScalar("projectInvestSum", new DoubleType())
                .addScalar("projectInvestAccuSum", new DoubleType())
                .addScalar("apCapital", new DoubleType())
                .setResultTransformer(Transformers.aliasToBean(sttisticsData.class))
                .list();
        return list;
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public List<sttisticsData> getyearPlanInvestSourceData() {
        List<sttisticsData> list = repository.getSession().createNativeQuery(SQLConfig.yearPlanInvestSourceData)
                .setParameter("year", year)
                .addScalar("capitalSCZ_ggys", new DoubleType())
                .addScalar("capitalSCZ_gtzj", new DoubleType())
                .addScalar("capitalSCZ_zxzj", new DoubleType())
                .addScalar("capitalQCZ_ggys", new DoubleType())
                .addScalar("capitalQCZ_gtzj", new DoubleType())
                .addScalar("capitalZYYS", new DoubleType())
                .addScalar("capitalSHTZ", new DoubleType())
                .addScalar("capitalOther", new DoubleType())
                .setResultTransformer(Transformers.aliasToBean(sttisticsData.class))
                .list();
        return list;
    }


    @SuppressWarnings({"unchecked", "rawtypes"})
    @Override
    @Transactional
    public PageModelDto<YearPlanDto> getYearPlanAllocationCapital(String unitId, ODataObj odataObj) {
        Integer skip = odataObj.getSkip();
        Integer stop = odataObj.getTop();

        UserUnitInfo userUnitInfo = userUnitInfoRepo.findById(unitId);
        if (userUnitInfo != null) {
            //分页查询数据
            List<YearPlanDto> yearPlanDtos = new ArrayList<>();
            List<YearPlan> yearPlans = ((SQLQuery) super.repository.getSession()
                    .createSQLQuery(SQLConfig.packPlanByUnit)
                    .setParameter("unitId", unitId)
                    .setFirstResult(skip).setMaxResults(stop))
                    .addEntity(YearPlan.class)
                    .getResultList();
            yearPlans.forEach(x -> {
                YearPlanDto yearPlanDto = super.mapper.toDto(x);
                yearPlanDtos.add(yearPlanDto);
            });
            //查询总数
            List<YearPlan> yearPlans2 = super.repository.getSession()
                    .createSQLQuery(SQLConfig.packPlanByUnit)
                    .setParameter("unitId", unitId)
                    .addEntity(YearPlan.class)
                    .getResultList();
            int count = yearPlans2.size();

            PageModelDto<YearPlanDto> pageModelDto = new PageModelDto<>();
            pageModelDto.setCount(count);
            pageModelDto.setValue(yearPlanDtos);
            return pageModelDto;
        }
        return null;
    }

    @Override
    @Transactional
    public void addYearPlanPacks(String planId, String[] ids) {
        //根据申报信息id创建年度计划资金
        for (String id : ids) {
            this.addYearPlanPack(planId, id);
        }
    }

    @Override
    @Transactional
    public void addYearPlanPack(String planId, String packId) {
        Boolean hasShenBaoInfo = false;
        //根据年度计划id查找到年度计划
        YearPlan yearPlan = super.findById(planId);
        if (yearPlan != null) {
            //判断年度计划编制中是否已有打包计划
            List<PackPlan> packPlans = yearPlan.getPackPlans();
            for (PackPlan packPlan : packPlans) {
                if (packPlan != null) {
                    if (packPlan.getId().equals(packId)) {
                        hasShenBaoInfo = true;
                    }
                }

            }

            if (hasShenBaoInfo) {
                //通过打包计划id获取名称
                //String name= packPlanRepo.findById(packId).getName();
                throw new IllegalArgumentException("打包计划已经存在编制计划中,请重新选择！");
            } else {
                //根据申报信息id创建年度计划资金
                PackPlan entity = packPlanRepo.findById(packId);
                //将打包计划保存到年度计划中
                if (yearPlan.getPackPlans() != null) {
                    yearPlan.getPackPlans().add(entity);
                } else {
                    List<PackPlan> yearPlanPackPlans = new ArrayList<>();
                    yearPlanPackPlans.add(entity);
                    yearPlan.setPackPlans(yearPlanPackPlans);
                }
                super.repository.save(yearPlan);
                logger.info(String.format("添加年度计划资金,名称：%s", yearPlan.getName()));
            }
        }

    }

    @Override
    @Transactional
    public void removeYearPlanPack(String planId, String[] yearPlanPackId) {
        YearPlan yearPlan = super.repository.findById(planId);
        if (yearPlan != null) {
            List<PackPlan> packPlans = yearPlan.getPackPlans();
            List<PackPlan> removeItems = new ArrayList<>();
            packPlans.forEach(x -> {
                for (String packPlanId : yearPlanPackId) {
                    if (x.getId().equals(packPlanId)) {
                        removeItems.add(x);
                    }
                }
            });
            packPlans.removeAll(removeItems);
        }
        super.repository.save(yearPlan);
        logger.info(String.format("移除年度计划资金,名称：%s", yearPlan.getName()));

    }

    @Override
    public List<YearPlanDto> findByDto(ODataObj odataObj) {
        return null;
    }


}

package cs.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.SQLQuery;
import org.hibernate.criterion.Projections;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.common.SQLConfig;
import cs.domain.ShenBaoInfo;
import cs.domain.YearPlan;
import cs.domain.YearPlanCapital;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.model.exportExcel.ExcelDataDWTJ;
import cs.model.exportExcel.ExcelDataHYTJ;
import cs.model.exportExcel.ExcelDataLBTJ;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.YearPlanService;
/**
 * @Description: 年度计划服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class YearPlanServiceImpl extends AbstractServiceImpl<YearPlanDto, YearPlan, String>implements YearPlanService {
	private static Logger logger = Logger.getLogger(YearPlanServiceImpl.class);

	@Autowired
	private IRepository<YearPlanCapital, String> yearPlanCapitalRepo;
	@Autowired
	private IRepository<ShenBaoInfo, String> shenbaoInfoRepo;
	@Autowired
	private IMapper<YearPlanCapitalDto, YearPlanCapital> yearPlanCapitalMapper;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoInfoMapper;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private BasicDataService basicDataService;
	

	@Override
	@Transactional
	public PageModelDto<YearPlanDto> get(ODataObj odataObj){
		logger.info("查询年度计划数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public YearPlan create (YearPlanDto dto){		
		YearPlan entity = super.create(dto);
		//关联信息资金安排
		dto.getYearPlanCapitalDtos().stream().forEach(x->{
			YearPlanCapital yearPlanCapital = new YearPlanCapital();
			yearPlanCapitalMapper.buildEntity(x,yearPlanCapital);
			entity.getYearPlanCapitals().add(yearPlanCapital);
		});
		logger.info(String.format("创建年度计划,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;				
	}

	@Override
	@Transactional
	public YearPlan update(YearPlanDto dto,String id) {		
		YearPlan entity =  super.update(dto, id);
		//关联信息资金安排
		entity.getYearPlanCapitals().forEach(x->{//删除历史资金安排记录
			yearPlanCapitalRepo.delete(x);
		});
		entity.getYearPlanCapitals().clear();
		dto.getYearPlanCapitalDtos().forEach(x->{//添加新的资金安排记录
			entity.getYearPlanCapitals().add(yearPlanCapitalMapper.buildEntity(x, new YearPlanCapital()));
		});
		logger.info(String.format("更新年度计划,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;		
	}
	
	

	@Override
	@Transactional
	public void delete(String id) {
		super.delete(id);
	}

	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId,ODataObj odataObj) {
		Integer skip = odataObj.getSkip();
		Integer stop = odataObj.getTop();

		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan!=null){
			//分页查询数据
			List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
			List<ShenBaoInfo> shenBaoInfos=((SQLQuery) shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanProject)
					.setParameter("yearPlanId", planId)
					.setFirstResult(skip).setMaxResults(stop)) 
					.addEntity(ShenBaoInfo.class)
					.getResultList();
			shenBaoInfos.forEach(x->{
				ShenBaoInfoDto shenBaoInfoDto = shenbaoInfoMapper.toDto(x);
				shenBaoInfoDtos.add(shenBaoInfoDto);
			});
			//查询总数
			List<ShenBaoInfo> shenBaoInfos2=shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanProject)
					.setParameter("yearPlanId", planId)
					.addEntity(ShenBaoInfo.class)
					.getResultList();
			int count = shenBaoInfos2.size();
			
			PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
			pageModelDto.setCount(count);
			pageModelDto.setValue(shenBaoInfoDtos);
			return pageModelDto;
		}			
		return null;
	}

	@Override
	@Transactional
	public void addYearPlanCapitals(String planId,String[] ids) {
		//根据申报信息id创建年度计划资金
		for (String id : ids) {
			this.addYearPlanCapital(planId,id);
		}
		
	}

	@Override
	@Transactional
	public void addYearPlanCapital(String planId,String shenBaoId) {
		Boolean hasShenBaoInfo = false;
		//根据年度计划id查找到年度计划
		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan !=null){
			//判断年度计划编制中是否已有该项目申报
			List<YearPlanCapital> capitals = yearPlan.getYearPlanCapitals();
			for(YearPlanCapital capital:capitals){
				if(capital.getShenbaoInfoId().equals(shenBaoId)){
					hasShenBaoInfo = true;
				}
			}
			if(hasShenBaoInfo){
				//通过申报信息id获取项目名称
				//String projectName = shenbaoInfoRepo.findById(shenBaoId).getProjectName();
				//throw new IllegalArgumentException(String.format("申报项目：%s 已经存在编制计划中,请重新选择！", projectName));
			}else{
				//根据申报信息id创建年度计划资金
				YearPlanCapital entity = new YearPlanCapital();
					entity.setId(UUID.randomUUID().toString());
					//设置关联的申报信息id
					entity.setShenbaoInfoId(shenBaoId);
					//设置安排资金
					ShenBaoInfo shenBaoInfo = shenbaoInfoRepo.findById(shenBaoId);
					if(shenBaoInfo !=null){
						entity.setCapitalQCZ_ggys(shenBaoInfo.getCapitalAP_ggys_TheYear());//区财政--公共预算
						entity.setCapitalQCZ_gtzj(shenBaoInfo.getCapitalAP_gtzj_TheYear());//区财政--国土资金
						entity.setCapitalSum(shenBaoInfo.getYearInvestApproval());//安排资金总计
					}
					//设置创建人和修改人
					String loginName = currentUser.getUserId();
					entity.setCreatedBy(loginName);
					entity.setModifiedBy(loginName);
				//将新创建的计划资金对象保存到计划中
				if(yearPlan.getYearPlanCapitals() !=null){
					yearPlan.getYearPlanCapitals().add(entity);
				}else{
					List<YearPlanCapital> yearPlanCapitals = new ArrayList<>();
					yearPlanCapitals.add(entity);
					yearPlan.setYearPlanCapitals(yearPlanCapitals);
				}		
				super.repository.save(yearPlan);
				logger.info(String.format("添加年度计划资金,名称：%s",yearPlan.getName()));	
			}
		}
					
	}

	@Override
	@Transactional
	public void removeYearPlanCapital(String planId, String[] yearPlanCapitalId) {
		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan!=null){
			List<YearPlanCapital> yearPlanCapitals=yearPlan.getYearPlanCapitals();
			List<YearPlanCapital> removeItems=new ArrayList<>();
			yearPlanCapitals.forEach(x->{
				for (String capitalId : yearPlanCapitalId) {
					if(x.getId().equals(capitalId)){
						removeItems.add(x);						
					}
				}
			});
			yearPlanCapitals.removeAll(removeItems);
					
		}
		super.repository.save(yearPlan);
		
	}

	@Override
	@Transactional
	public List<ExcelDataLBTJ> getYearPlanShenBaoInfoByLBTJ(String planId) {
		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan!=null){//判空处理
			List<ExcelDataLBTJ> excelDataLBTJList = new ArrayList<>();
			List query = shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanByLBTJ)
					.setParameter("yearPlanId",planId)
					.addScalar("planYear",new IntegerType()) //计划年度
					.addScalar("projectCategory",new StringType())
					.addScalar("projectSum",new IntegerType())
					.addScalar("investSum",new DoubleType())
					.addScalar("investAccuSum",new DoubleType())
					.addScalar("apInvestSum",new DoubleType())
					.addScalar("yearInvestApprovalSum",new DoubleType())
					.setResultTransformer(Transformers.aliasToBean(ExcelDataLBTJ.class))
					.list();

			excelDataLBTJList = query;
			logger.info(String.format("根据项目类别统计年度计划,名称：%s",yearPlan.getName()));	
			return excelDataLBTJList;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public List<ExcelDataHYTJ> getYearPlanShenBaoInfoByHYTJ(String planId) {
		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan!=null){//判空处理
			List<ExcelDataHYTJ> excelDataHYTJList = new ArrayList<>();
			List query = shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanByHYTJ)
					.setParameter("yearPlanId",planId)
					.addScalar("planYear",new IntegerType())  //计划年度
					.addScalar("projectIndustry",new StringType())  //项目行业
					.addScalar("projectSum",new IntegerType())  //项目行业合计
					.addScalar("projectCategory_ASum",new IntegerType()) //A类数量
					.addScalar("projectCategory_BSum",new IntegerType()) //B类数量
					.addScalar("projectCategory_CSum",new IntegerType()) //C类数量
					.addScalar("projectCategory_DSum",new IntegerType()) //D类数量
					.addScalar("investSum",new DoubleType())  //总投资
					.addScalar("investAccuSum",new DoubleType()) //累计拨付
					.addScalar("apInvestSum",new DoubleType())  //累计下达
					.addScalar("sqInvestSum",new DoubleType())  //申请年度投资
					.addScalar("yearAp_ggysSum",new DoubleType())  //年度预安排资金--公共预算
					.addScalar("yearAp_gtjjSum",new DoubleType())  //年度预安排资金--国土基金
					.addScalar("yearAp_qitaSum",new DoubleType())  //年度预安排资金--其他
					.addScalar("yearApSum",new DoubleType())  //年度预安排资金--合计
					.setResultTransformer(Transformers.aliasToBean(ExcelDataHYTJ.class))
					.list();

			excelDataHYTJList = query;
			logger.info(String.format("根据项目行业统计年度计划,名称：%s",yearPlan.getName()));	
			return excelDataHYTJList;
		}else{
			return null;
		}
	}

	@Override
	@Transactional
	public List<ExcelDataDWTJ> getYearPlanShenBaoInfoByDWTJ(String planId) {
		YearPlan yearPlan=super.repository.findById(planId);
		if(yearPlan!=null){//判空处理
			List<ExcelDataDWTJ> excelDataDWTJList = new ArrayList<>();
			List query = shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanByDWTJ)
					.setParameter("yearPlanId",planId)
					.addScalar("planYear",new IntegerType())  //计划年度
					.addScalar("constrctionUnit",new StringType())  //建设单位
					.addScalar("yearApSum",new DoubleType())  //年度预安排资金--合计
					.addScalar("yearAp_danLie",new DoubleType())  //年度预安排资金--单列项目
					.addScalar("yearAp_jieSunKuan",new DoubleType())  //年度预安排资金--结算款
					.addScalar("yearAp_xiaohe",new DoubleType())  //年度预安排资金--小额
					.addScalar("yearAp_weiLiXYuLiu",new DoubleType())  //年度预安排资金--未立项项目预留
					.setResultTransformer(Transformers.aliasToBean(ExcelDataDWTJ.class))
					.list();

			excelDataDWTJList = query;
			logger.info(String.format("根据建设单位统计年度计划,名称：%s",yearPlan.getName()));	
			return excelDataDWTJList;
		}else{
			return null;
		}
	}
	
	
}

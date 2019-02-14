package cs.service.impl;


import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.Response;
import cs.common.SQLConfig;
import cs.domain.PlanReachApproval;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.model.DomainDto.ExcelReportPlanReachDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.PageModelDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ShenBaoInfoService;
import org.activiti.engine.TaskService;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.task.Task;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.ObjectUtils;

import javax.transaction.Transactional;
import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;

@Service
public class PlanReachApprovalServiceImpl extends AbstractServiceImpl<PlanReachApprovalDto, PlanReachApproval, String> implements PlanReachApprovalService {
    private static Logger logger = Logger.getLogger(PlanReachApprovalServiceImpl.class);

    @Autowired
    private ShenBaoInfoService shenBaoInfoService;
    @Autowired
    private IRepository<PlanReachApproval, String> planReachApprovalRepo;
    @Autowired
    private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
    @Autowired
	private TaskService taskService;
	@Autowired
	private ActivitiService activitiService;
	
    @Override
    @Transactional
    public PageModelDto<PlanReachApprovalDto> get(ODataObj odataObj) {
        logger.info("获取计划下达批复数据");
        return super.get(odataObj);
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    @Transactional
    public void create(Map data) throws ParseException {
        PlanReachApproval entity = new PlanReachApproval();
        PlanReachApprovalDto dto = new PlanReachApprovalDto();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
        dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
        dto.setTitle((String) data.get("title"));
        dto.setCreatedBy(currentUser.getUserId());
        dto.setCreatedDate(new Date());
        List<String> idStrings = (List<String>) data.get("ids");
        entity = super.create(dto);
        for (int i = 0; i < idStrings.size(); i++) {
            String array_element = idStrings.get(i);
            ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(array_element);
            entity.getShenBaoInfos().add(shenBaoInfo);
        }
        super.repository.save(entity);
        logger.info(String.format("创建计划下达批复表,名称 :%s", dto.getTitle()));
    }

    @SuppressWarnings({ "unchecked", "rawtypes" })
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void update(Map data) throws ParseException {
        PlanReachApprovalDto dto = new PlanReachApprovalDto();
		SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
		dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
		dto.setId((String) data.get("id"));
		dto.setTitle((String) data.get("title"));

		List<String> idStrings = (List<String>) data.get("ids");
		PlanReachApproval entity = super.update(dto, (String) data.get("id"));
		// 处理关联信息
		entity.getShenBaoInfos().clear();
		for (int i = 0; i < idStrings.size(); i++) {
			String id = idStrings.get(i);
				ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(id);
//				shenBaoInfo.setIsFaWen(true);
				entity.getShenBaoInfos().add(shenBaoInfo);

		}
		repository.save(entity);
		logger.info(String.format("更新计划下达批复表,名称 :%s", dto.getTitle()));
	}

    @SuppressWarnings("unchecked")
	@Override
    @Transactional
    public Response checkIsOnlys (String id,String planID){
    	Response resp = new Response();
    	resp.setSuccess(false);
    	PlanReachApproval planReachApproval = planReachApprovalRepo.findById(planID);
    	Session session = planReachApprovalRepo.getSession();
		// 处理关联信息
		BigInteger countQuery = (BigInteger) session.createNativeQuery(SQLConfig.planReachApproval_count)
				.setParameter("shenBaoInfos_id", id).getSingleResult();

		int count = countQuery == null ? 0 : countQuery.intValue();
		ShenBaoInfo shenBaoInfo =shenBaoInfoService.findById(id);
		if (count > 0) {
			resp.setMessage(String.format("项目：%s已存在其他表单中，请重新选择",shenBaoInfo.getProjectName()));
			resp.setSuccess(true);
		}else{
			if(!ObjectUtils.isEmpty(planReachApproval)){
				Map map = new HashMap<>();
				List<String> ids = new ArrayList<>();
				map.put("id", planReachApproval.getId());
				map.put("approvalTime", planReachApproval.getApprovalTime().toString());
				map.put("title", planReachApproval.getTitle());
				ids.add(shenBaoInfo.getId());
				for (ShenBaoInfo shenBaoInfos : planReachApproval.getShenBaoInfos()) {
					ids.add(shenBaoInfos.getId());
				}
				map.put("ids", ids);
				try {
					this.update(map);
				} catch (ParseException e) {
					// TODO Auto-generated catch block
					e.printStackTrace();
				}
			}
		}
		return resp;
    }

	//根据计划下达id查询项目信息
	@Override
	@Transactional
	public List<ExcelReportPlanReachDto> findBySql(String id) {
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
				.append(" from cs_planreachapproval a")
				.append(" left join cs_planreachapproval_cs_shenbaoinfo b on a.id = b.PlanReachApproval_id ")
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
				.append(" from cs_planreachapproval a")
				.append(" left join cs_planreachapproval_cs_shenbaoinfo b on a.id = b.PlanReachApproval_id ")
				.append(" left join cs_shenbaoinfo c on b.shenBaoInfos_id = c.id ")
				.append(" left join cs_basicdata e on c.projectIndustry = e.id ")
				.append(" where a.id = ").append("'").append(id).append("'")
				.append(" group by c.projectIndustry ")

				.append(" union all ")

		        .append(" select '2' as orderNum")
				.append(",c.constructionUnit")
				.append(",c.projectName")
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
				.append(" from cs_planreachapproval a")
				.append(" left join cs_planreachapproval_cs_shenbaoinfo b on a.id = b.PlanReachApproval_id ")
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

	@Override
    @Transactional
    public void endProcesss (String id){
    	 PlanReachApproval entity = super.findById(id);
    	 for (int i = 0; i < entity.getShenBaoInfos().size(); i++) {
			ShenBaoInfo shenbaoInfo = entity.getShenBaoInfos().get(i);
			if("usertask5".equals(shenbaoInfo.getThisTaskName())){
				endProcess(shenbaoInfo.getId());
			}
		}
    	 
    }
    
    @Override
    @Transactional
    public void endProcess (String id){
    	 ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(id);
    	 
    	 Map<String, Object> variables = new HashMap<String, Object>();
    	 
    	 variables.put("shenpi", 8);
    	 variables.put("isPass", 1);
    	 List<Task> task = null;
    	 task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
					.taskCandidateUser(currentUser.getUserId()).orderByDueDate().desc().list();
			if (task.size() == 0) {
				task = taskService.createTaskQuery().processInstanceId(shenBaoInfo.getZong_processId())
						.taskAssignee(currentUser.getUserId()).orderByDueDate().desc().list();

			}
    	 Authentication.setAuthenticatedUserId(currentUser.getUserId());
		activitiService.setTaskComment(task.get(0).getId(), shenBaoInfo.getZong_processId(), "批复意见：" + "已办结");

		activitiService.claimTask(task.get(0).getId(), currentUser.getUserId());
		activitiService.taskComplete(task.get(0).getId(), variables);
		shenBaoInfo.setThisTaskId("00000");
		shenBaoInfo.setThisTaskName("已办结");
		shenBaoInfo.setProcessState(BasicDataConfig.processState_pass);
		shenBaoInfo.setProcessStage("已办结");
		shenBaoInfo.setIsIncludLibrary(true);
//		shenBaoInfo.setComplate(true);
//		shenBaoInfo.setEndDate(new SimpleDateFormat("yyyy-MM").format(new Date()));
		
		return;
    }
    
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void delete(String id) {
        PlanReachApproval entity = super.findById(id);
        entity.getShenBaoInfos().forEach(x -> {
            
        });
        entity.getShenBaoInfos().clear();
        repository.delete(entity);
        logger.info(String.format("删除下达批复表,名称 :%s", entity.getTitle()));
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void updateShnebaoInfo(String shenbaoId, Double ggmoney, Double gtmoney) {
        ShenBaoInfo entity = shenBaoInfoRepo.findById(shenbaoId);
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), entity.getProjectId());
       List<ShenBaoInfo> shenbaoList = shenBaoInfoRepo.findByCriteria(criterion);
       double count_ggys = 0;
       double count_gtzj = 0;
       for (int i = 0; i < shenbaoList.size(); i++) {
    	   ShenBaoInfo array_element = shenbaoList.get(i);
    	   if(array_element.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_planReach)){
    		   count_ggys += array_element.getXdPlanReach_ggys();
    		   count_gtzj += array_element.getXdPlanReach_gtzj();
    	   }
		
       }
        if(ggmoney+entity.getApInvestSum() -entity.getXdPlanReach_ggys() > entity.getProjectInvestSum() || 
        		gtmoney+entity.getApInvestSum() -entity.getXdPlanReach_gtzj()> entity.getProjectInvestSum()){
        	 throw new IllegalArgumentException("超过总投资,请重新填写！");
        }
        entity.setApPlanReach_ggys(entity.getApPlanReach_ggys()+ggmoney-entity.getXdPlanReach_ggys());
        entity.setApPlanReach_gtzj(entity.getApPlanReach_gtzj()+gtmoney-entity.getXdPlanReach_gtzj());
        entity.setApInvestSum(entity.getApInvestSum()+gtmoney+ggmoney-entity.getXdPlanReach_ggys()-entity.getXdPlanReach_gtzj());
        entity.setXdPlanReach_ggys(ggmoney);
        entity.setXdPlanReach_gtzj(gtmoney);
       
        shenBaoInfoRepo.save(entity);
    }
    
    @Override
    public List<PlanReachApprovalDto> findByDto(ODataObj odataObj) {
        return null;
    }


}

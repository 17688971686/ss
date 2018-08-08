package cs.service.impl;


import java.math.BigInteger;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.activiti.engine.TaskService;
import org.activiti.engine.impl.identity.Authentication;
import org.activiti.engine.task.Task;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.activiti.service.ActivitiService;
import cs.common.SQLConfig;
import cs.domain.PlanReachApproval;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ShenBaoInfoService;

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
        dto.setResPerson((String) data.get("resPerson"));
        dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
        dto.setResPersonTel((String) data.get("resPersonTel"));
        dto.setTitle((String) data.get("title"));
        List<String> idStrings = (List<String>) data.get("ids");
        dto.setCreatedBy(currentUser.getUserId());
        dto.setCreatedDate(new Date());
        entity = super.create(dto);
        
        Session session = planReachApprovalRepo.getSession();
        Map ggs =  (Map)data.get("gg");
        Map gts =  (Map)data.get("gt");
        //处理关联信息
        for (int i = 0; i < idStrings.size(); i++) {
            String array_element = idStrings.get(i);
            BigInteger countQuery = (BigInteger) session.createNativeQuery(SQLConfig.planReachApproval_count)
                    .setParameter("shenBaoInfos_id", array_element)
                    .getSingleResult();

            int count = countQuery == null ? 0 : countQuery.intValue();
            if(count<1){
            	  ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(array_element);
            	  if(!ggs.isEmpty()){
            		  if(ggs.get(shenBaoInfo.getId()) != null){
            			  shenBaoInfo.setXdPlanReach_ggys(Double.parseDouble(ggs.get(shenBaoInfo.getId()).toString()));
            		  }
            	  }else if(!gts.isEmpty()){
            		  if(gts.get(shenBaoInfo.getId()) != null){
            			  shenBaoInfo.setXdPlanReach_gtzj(Double.parseDouble(gts.get(shenBaoInfo.getId()).toString()));
            		  }
            	  }
                  entity.getShenBaoInfos().add(shenBaoInfo);
            }
          
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
        dto.setResPerson((String) data.get("resPerson"));
        dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
        dto.setId((String) data.get("id"));
        dto.setResPersonTel((String) data.get("resPersonTel"));
        dto.setTitle((String) data.get("title"));
        
		Map ggs =  (Map)data.get("gg");
		Map gts =  (Map)data.get("gt");
        List<String> idStrings = (List<String>) data.get("ids");
        PlanReachApproval entity = super.update(dto, (String) data.get("id"));
        //处理关联信息
        entity.getShenBaoInfos().clear();
        for (int i = 0; i < idStrings.size(); i++) {
            String array_element = idStrings.get(i);
            ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(array_element);
            if(!ggs.isEmpty()){
      		  if(ggs.get(shenBaoInfo.getId()) != null){
      			  shenBaoInfo.setXdPlanReach_ggys(Double.parseDouble(ggs.get(shenBaoInfo.getId()).toString()));
      		  }
      	  }else if(!gts.isEmpty()){
      		  if(gts.get(shenBaoInfo.getId()) != null){
      			  shenBaoInfo.setXdPlanReach_gtzj(Double.parseDouble(gts.get(shenBaoInfo.getId()).toString()));
      		  }
      	  }
            entity.getShenBaoInfos().add(shenBaoInfo);
        }
        repository.save(entity);
        logger.info(String.format("更新计划下达批复表,名称 :%s", dto.getTitle()));
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
        Double cont = ggmoney + gtmoney;
//        if(ggmoney > entity.getApPlanReach_ggys()){
//        	 throw new IllegalArgumentException("申请公共资金不能大于安排资金,请重新填写！");
//        }else if(gtmoney > entity.getApPlanReach_gtzj()){
//        	throw new IllegalArgumentException("申请国土资金不能大于安排资金,请重新填写！");
//        }
        entity.setXdPlanReach_ggys(ggmoney);
        entity.setXdPlanReach_gtzj(gtmoney);
        shenBaoInfoRepo.save(entity);
    }
    
    @Override
    public List<PlanReachApprovalDto> findByDto(ODataObj odataObj) {
        return null;
    }


}

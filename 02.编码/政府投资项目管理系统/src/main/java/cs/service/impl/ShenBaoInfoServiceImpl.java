package cs.service.impl;

import java.io.File;
import java.math.BigInteger;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.annotation.Resource;
import javax.transaction.Transactional;

import com.sn.framework.common.IdWorker;
import com.sn.framework.common.StringUtil;
import cs.common.*;
import cs.service.framework.UserService;
import cs.service.sms.SmsService;
import cs.service.sms.exception.SMSException;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.runtime.ProcessInstance;
import org.activiti.engine.task.Task;
import org.activiti.spring.ProcessEngineFactoryBean;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang3.StringUtils;
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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cs.activiti.service.ActivitiService;
import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.domain.Project;
import cs.domain.Project_;
import cs.domain.ReplyFile;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.TaskHead;
import cs.domain.TaskHead_;
import cs.domain.TaskRecord;
import cs.domain.framework.Org;
import cs.domain.framework.Org_;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.model.Statistics.ProjectStatisticsBean;
import cs.repository.framework.OrgRepo;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ProcessService;
import cs.service.interfaces.ShenBaoInfoService;
import org.springframework.util.Assert;
import org.springframework.util.CollectionUtils;

/**
 * @Description: 申报信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class ShenBaoInfoServiceImpl extends AbstractServiceImpl<ShenBaoInfoDto, ShenBaoInfo, String> implements ShenBaoInfoService {
    private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);

    @Autowired
    private IRepository<ShenBaoInfo, String> shenbaoInfoRepo;
    @Autowired
    private IRepository<Attachment, String> attachmentRepo;
    @Autowired
    private IRepository<ShenBaoUnitInfo, String> shenBaoUnitInfoRepo;
    @Autowired
    private IRepository<Project, String> projectRepo;
    @Autowired
    private IRepository<BasicData, String> basicDataRepo;
    @Autowired
    private IRepository<ReplyFile, String> replyFileRepo;
    @Autowired
    private IRepository<SysConfig, String> sysConfigRepo;
    @Autowired
    private IMapper<AttachmentDto, Attachment> attachmentMapper;
    @Autowired
    private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
    @Autowired
    private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
    @Autowired
    private BasicDataService basicDataService;
    @Autowired
    private OrgRepo orgRepo;
    @Autowired
    private ActivitiService activitiService;
    @Autowired
    ProcessEngineFactoryBean processEngine;
    @Autowired
    private RuntimeService runtimeService;
    @Autowired
    private SmsService smsService;
    @Autowired
    private UserService userService;
    @Resource
    private Map<String, String> shenbaoSMSContent;
    @Autowired
    private ProcessService processService;
    
    private String processDefinitionKey = "ShenpiReview";
    private String processDefinitionKey_monitor_fjxm = "ShenpiMonitor_fjxm";
    private String processDefinitionKey_plan = "ShenpiPlan";
    private String processDefinitionKey_yearPlan = "yearPlan";

    @Value("${projectShenBaoStage_JYS}")
    private String projectShenBaoStage_JYS;//申报阶段：建议书
    @Value("${projectShenBaoStage_KXXYJBG}")
    private String projectShenBaoStage_KXXYJBG;//申报阶段：可行性研究报告
    @Value("${projectShenBaoStage_CBSJYGS}")
    private String projectShenBaoStage_CBSJYGS;//申报阶段：初步设计与概算
    @Value("${projectShenBaoStage_ZJSQBG}")
    private String projectShenBaoStage_ZJSQBG;//申报阶段：资金申请报告
    @Value("${projectShenBaoStage_planReach}")
    private String projectShenBaoStage_planReach;//申报阶段：计划下达
    @Value("${taskType_JYS}")
    private String taskType_JYS;//任务类型：建议书
    @Value("${taskType_KXXYJBG}")
    private String taskType_KXXYJBG;//任务类型：可行性研究报告
    @Value("${taskType_CBSJYGS}")
    private String taskType_CBSJYGS;//任务类型：初步设计与概算
    @Value("${taskType_ZJSQBG}")
    private String taskType_ZJSQBG;//任务类型：资金申请报告
    @Value("${taskType_JH}")
    private String taskType_JH;//任务类型：计划下达
    @Value("${diskPath}")
	private String diskPath;//
    @Value("${projectShenBaoStage_2}")
    private String projectShenBaoStage_2;
    @Value("${projectShenBaoStage_3}")
    private String projectShenBaoStage_3;
    @Value("${projectShenBaoStage_4}")
    private String projectShenBaoStage_4;
    @Value("${projectShenBaoStage_6}")
    private String projectShenBaoStage_6;
    @Value("${projectShenBaoStage_7}")
    private String projectShenBaoStage_7;

    @Override
    @Transactional
    public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
        logger.info("查询申报数据");
        return super.get(odataObj);
    }

    @Override
    @Transactional
    public void reback(String pricessId) {
        runtimeService.deleteProcessInstance(pricessId, "建设单位主动撤销");
        Criterion criterion = Restrictions.eq(ShenBaoInfo_.zong_processId.getName(), pricessId);
        List<ShenBaoInfo> shenBaoInfo = super.repository.findByCriteria(criterion);
        shenBaoInfo.get(0).setProcessStage("建设单位主动撤销");
        shenBaoInfo.get(0).setProcessState(BasicDataConfig.processState_weikaishi);
        shenBaoInfo.get(0).setThisTaskName("");
        shenBaoInfo.get(0).setZong_processId("");
        shenBaoInfo.get(0).setThisTaskId("");
        shenBaoInfo.get(0).setReceiver(null);
        repository.save(shenBaoInfo.get(0));
        logger.debug("======>卸载pricessId为 " + pricessId + " 的流程!");
    }

    @Override
    public ShenBaoInfo create(ShenBaoInfoDto dto, Boolean isAdminCreate) {
        //创建申报信息
        ShenBaoInfo entity = super.create(dto);
        //初始化审核状态--未审核
//        entity.setAuditState(BasicDataConfig.auditState_noAudit);
        //初始化--申报时间
        entity.setShenbaoDate(new Date());
        //如果为后台管理员创建
        if (isAdminCreate) {
            //创建项目
            //首先验证项目名称是否重复
            Criterion criterion = Restrictions.eq(Project_.projectName.getName(), dto.getProjectName());
            List<Project> findProjects = projectRepo.findByCriteria(criterion);
            //如果为空集合
            if (CollectionUtils.isEmpty(findProjects)) {
                Project project = new Project();
                project.setCreatedBy(currentUser.getUserId());
                project.setModifiedBy(currentUser.getUserId());
                project.setId(UUID.randomUUID().toString());
                shenBaoChangeToProject(dto, project);
                //新创建的项目需要设置项目代码,根据行业类型id查询出基础数据
                BasicData basicData = basicDataRepo.findById(project.getProjectIndustry());
                Assert.notNull(basicData, "项目代码生成故障，请确认项目行业选择是否正确！");
//					String number = Util.getProjectNumber(project.getProjectInvestmentType(), basicData);
//					project.setProjectNumber(number);
                //行业项目统计累加
                basicData.setCount(basicData.getCount() + 1);
                basicData.setModifiedBy(currentUser.getUserId());
                basicData.setModifiedDate(new Date());
                basicDataRepo.save(basicData);

                //批复文件
                if (dto.getAttachmentDtos() != null && !dto.getAttachmentDtos().isEmpty()) {
                    dto.getAttachmentDtos().stream().forEach(x -> {
                        if (x.getType().equals(BasicDataConfig.attachment_type_jys) ||
                                x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg) ||
                                x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)) {
                            Attachment attachment = new Attachment();
                            attachmentMapper.buildEntity(x, attachment);
                            attachment.setCreatedBy(currentUser.getUserId());
                            attachment.setModifiedBy(currentUser.getUserId());

                            project.getAttachments().add(attachment);
                        }
                    });
                }
                projectRepo.save(project);
                entity.setProjectId(project.getId());
                entity.setProjectNumber(project.getProjectNumber());
                //设置相关的默认信息
                entity.setProcessStage("投资科审核收件办理");//处理阶段为签收阶段
                entity.setProcessState(BasicDataConfig.processState_pass);//状态为已签收通过
                entity.setIsIncludLibrary(false);//设置初始化为未纳入项目库
                logger.info(String.format("创建申报信息,项目名称 %s", project.getProjectName()));
            } else {
                throw new IllegalArgumentException(String.format("项目：%s 已存在,请重新确认！", dto.getProjectName()));
            }
        } else {
            //如果前台申报单位创建
            //因dto中创建时间和修改时间为项目的相关时间，需从新设置
            Project project = projectRepo.findById(entity.getProjectId());
            if (project != null && entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_planReach)) {
                project.setIsPlanReach(true);
                projectRepo.save(project);
            }
        }
        //处理关联信息
        dto.getAttachmentDtos().forEach(x -> {
            Attachment attachment = new Attachment();
            attachmentMapper.buildEntity(x, attachment);
            attachment.setId(UUID.randomUUID().toString());
            attachment.setCreatedBy(entity.getCreatedBy());
            attachment.setModifiedBy(entity.getModifiedBy());
            entity.getAttachments().add(attachment);
        });

        if(entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_KXXYJBG) ||
                entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS) ||
                entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_ZJSQBG)||
                entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)){

            try {
                Attachment att = DocUtil.createDoc(entity.getProjectName(), entity.getProjectShenBaoStage());
                Assert.notNull(att, "正文生成失败！");
                entity.getAttachments().add(att);
            } catch (Exception e) {
                // TODO Auto-generated catch block
                e.printStackTrace();
            }

        }
        Project project = projectRepo.findById(entity.getProjectId());
        project.getAttachments().forEach(x -> {//删除历史附件
            attachmentRepo.delete(x);
        });
        project.getAttachments().clear();
        //添加新附件
        dto.getAttachmentDtos().forEach(x -> {
    		  Attachment attachment = new Attachment();
              attachmentMapper.buildEntity(x, attachment);
              attachment.setId(IdWorker.get32UUID());
              attachment.setCreatedBy(project.getCreatedBy());
              attachment.setModifiedBy(project.getModifiedBy());
              project.getAttachments().add(attachment);
        });

        //申报单位
        ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
        ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
        shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto, shenBaoUnitInfo);
        shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
        shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
        entity.setShenBaoUnitInfo(shenBaoUnitInfo);
        //编制单位
        ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
        ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
        shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto, bianZhiUnitInfo);
        bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
        bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
        entity.setBianZhiUnitInfo(bianZhiUnitInfo);
        super.repository.save(entity);
        projectRepo.save(project);
        //处理批复文件库
        handlePiFuFile(entity);
        return entity;
    }
    
    @SuppressWarnings({ "unchecked", "rawtypes" })
	@Transactional
    public Map isRecords(ShenBaoInfoDto dto){
    	boolean hasBG = false;
    	double pfMoney = 0.0;
    	if(dto.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_CBSJGS)){
    		Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), dto.getProjectId());
    		List<ShenBaoInfo> entitys = shenbaoInfoRepo.findByCriteria(criterion);
    		for (ShenBaoInfo shenBaoInfo : entitys) {
				if(shenBaoInfo.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_KXXYJBG)
						&&shenBaoInfo.getProcessState().equals(BasicDataConfig.processState_pass)){
					pfMoney = shenBaoInfo.getPfProjectInvestSum();
					hasBG = true;
					break;
				}
			}
    	}else{
    		hasBG = true;
    	}
		
    	Map map = new HashMap<>();
    	if(hasBG){
    		map.put("hasBG", true);
    		map.put("pfMoney", pfMoney);
    		if(dto.getProjectInvestSum()<pfMoney ){
    			dto.setIsRecords(false);
    		}else {
    			dto.setIsRecords(true);
    		}
          
    	}else{
    		map.put("hasBG", false);
    	}
    	 return map;
    }
    
    /**
     * @param dto           申报信息数据
     * @param isAdminCreate 是否是管理员创建
     * @description 创建申报信息
     */
    @SuppressWarnings("rawtypes")
	@Override
    public ShenBaoInfo createShenBaoInfo(ShenBaoInfoDto dto, Boolean isAdminCreate) {
    	ShenBaoInfo entity = null;
    
//    	Map map = isRecords(dto);
//    	
//    	if((boolean) map.get("hasBG")){
    		 // 创建申报数据
            entity = create(dto, isAdminCreate);
//    	}else{
//    		throw new IllegalArgumentException("未申请可研或可研审批未结束，无法创建概算申请！");
//    	}
        //1为保存申请不提交，2 为提交申请，走审批流程
        if(dto.getIsUpdateOrSubmit().equals(2)){
            createProcessShenbao(entity,dto);
        }

        logger.info(String.format("创建申报信息,项目名称 :%s,申报阶段：%s", entity.getProjectName(),
                basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
        return entity;
    }

    private void createProcessShenbao (ShenBaoInfo entity,ShenBaoInfoDto dto){
        //启动申报审批流程
        if (entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_planReach)) {
//			startProcessShenbao(processDefinitionKey_plan,entity.getId());
        } else if (entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)) {
            entity.setProcessStage("投资科审核收件办理");
            startProcessShenbao(processDefinitionKey_yearPlan, entity.getId());
        } else {
            startProcessShenbao(processDefinitionKey, entity.getId());
            //设置申报信息的阶段为待签收
            entity.setProcessStage("投资科审核收件办理");
            entity.setProcessState(BasicDataConfig.processState_jinxingzhong);
            entity.setCreatedDate(new Date());
            entity.setModifiedDate(new Date());
        }

        if ("projectClassify_1_1".equalsIgnoreCase(dto.getProjectClassify())) {
            //设置申报信息的阶段为待签收
            entity.setProcessStage("投资科审核收件办理");
            entity.setProcessState(BasicDataConfig.processState_jinxingzhong);
            entity.setCreatedDate(new Date());
            entity.setModifiedDate(new Date());
            startProcessMonitor_fjxm(processDefinitionKey_monitor_fjxm, entity.getId());
        }
    }

    @Override
    public void delete(String id) {
        ShenBaoInfo entity = super.repository.findById(id);
        if (entity != null) {
            //判断申报信息的处理阶段
            if (BasicDataConfig.processStage_tianbao.equals(entity.getProcessStage()) ||
                    (BasicDataConfig.processStage_qianshou.equals(entity.getProcessStage()) && BasicDataConfig.processState_pass != entity.getProcessState())) {
                logger.info(String.format("删除申报信息,项目名称： %s，申报阶段：%s", entity.getProjectName(),
                        basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
                super.repository.delete(entity);
            } else {
                throw new IllegalArgumentException(String.format("申报信息不可删除！项目名称：%s，申报阶段：%s", entity.getProjectName(),
                        basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
            }

        }

    }

    @Override
    @Transactional
    public void addProjectToLibrary(String shenbaoInfoId) {
        ShenBaoInfo shenbaoInfo = super.findById(shenbaoInfoId);
        if (shenbaoInfo != null) {
            Project project = projectRepo.findById(shenbaoInfo.getProjectId());
            if (project != null) {
                if (shenbaoInfo.getIsIncludLibrary() && project.getIsIncludLibrary()) {
                    throw new IllegalArgumentException(String.format("项目：%s 已纳入项目库", project.getProjectName()));
                } else {
                    shenbaoInfo.setIsIncludLibrary(true);
                    shenbaoInfo.setModifiedBy(currentUser.getUserId());
                    shenbaoInfo.setModifiedDate(new Date());
                    super.repository.save(shenbaoInfo);

                    project.setIsIncludLibrary(true);
                    project.setModifiedBy(currentUser.getUserId());
                    project.setModifiedDate(new Date());
                    projectRepo.save(project);
                    logger.info(String.format("项目纳入项目库,项目名称 %s", project.getProjectName()));
                }
            } else {
                throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
            }
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的申报信息"));
        }
    }

    @Override
    @Transactional
    public void updateProjectBasic(ShenBaoInfoDto dto) {
        Project project = projectRepo.findById(dto.getProjectId());
        if (project != null) {
            //更新项目基本信息
            this.shenBaoChangeToProject(dto, project);
            //更新项目批复文件信息
            project.getAttachments().forEach(x -> {//删除历史附件
                attachmentRepo.delete(x);
            });
            project.getAttachments().clear();
            if (dto.getAttachmentDtos() != null && !dto.getAttachmentDtos().isEmpty()) {
                dto.getAttachmentDtos().stream().forEach(x -> {
                    if (x.getType().equals(BasicDataConfig.attachment_type_jys) ||
                            x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg) ||
                            x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)) {
                        Attachment attachment = new Attachment();
                        attachmentMapper.buildEntity(x, attachment);
                        attachment.setId(UUID.randomUUID().toString());
                        attachment.setCreatedBy(currentUser.getUserId());
                        attachment.setModifiedBy(currentUser.getUserId());

                        project.getAttachments().add(attachment);
                    }
                });
            }
            //修改人&修改时间
            project.setModifiedBy(currentUser.getUserId());
            project.setModifiedDate(new Date());
            projectRepo.save(project);
            logger.info(String.format("更新项目基本信息,项目名称 %s", project.getProjectName()));
            //同步更新申报信息
            updateShenBaoInfo(dto, true);
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
        }
    }

    /**
     * @param dto 退文信息
     * @Title: updateShenBaoInfoState
     * @Description: 管理端退回已签收的下一年度计划申报
     */
    @Override
    @Transactional
    public void updateShenBaoInfoState(ShenBaoInfoDto dto) {
        //更新申报信息的状态
        ShenBaoInfo shenbaoInfo = super.repository.findById(dto.getId());
        if (shenbaoInfo != null) {
            shenbaoInfo.setProcessState(BasicDataConfig.processState_notpass);//设置状态为不通过
            shenbaoInfo.setAuditState(BasicDataConfig.auditState_noAudit);//审核不通过
            shenbaoInfo.setProcessStage("已退文");
            shenbaoInfo.setModifiedBy(currentUser.getUserId());
            shenbaoInfo.setModifiedDate(new Date());

            super.repository.save(shenbaoInfo);
            //同时更新任务的状态
            //查询系统配置是否需要发送短信
            Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), BasicDataConfig.taskType_sendMesg);
            SysConfig entityQuery = sysConfigRepo.findByCriteria(criterion).stream().findFirst().get();
            if (entityQuery.getEnable()) {
                SendMsg sendMsg = new SendMsg();
                sendMsg.setMobile(shenbaoInfo.getProjectRepMobile());
//                String content = entity.getTitle() + ":" + basicDataService.getDescriptionById(entity.getThisProcess());
//                sendMsg.setContent(content);
                Util.sendShortMessage(sendMsg);
            }
            logger.info(String.format("更新申报信息状态,项目名称 %s", shenbaoInfo.getProjectName()));
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的申报信息"));
        }

    }

    /**
     * @param isManage true：代表安排 false：代表申请
     * @param map      资金封装数据
     * @Title: comfirmPlanReach
     * @Description: 保存计划下达申请资金
     * @author:cx
     */
    @SuppressWarnings("rawtypes")
    @Override
    @Transactional
    public void comfirmPlanReach(Map map, Boolean isManage) {
        String id = map.get("id").toString();
        ShenBaoInfo entity = super.findById(id);
        if (entity != null) {
            if (isManage) {
                Double apPlanReach_ggys = (Double) map.get("apPlanReach_ggys");
                Double apPlanReach_gtzj = (Double) map.get("apPlanReach_gtzj");
                int processState = 1;
                String isPass = (String) map.get("isPass");
                if (isPass.equals("pass")) {
                    processState = BasicDataConfig.processState_pass;
                } else if (isPass.equals("notpass")) {
                    processState = BasicDataConfig.processState_notpass;
                }
                entity.setProcessState(processState);
                entity.setApPlanReach_ggys(apPlanReach_ggys);
                entity.setApPlanReach_gtzj(apPlanReach_gtzj);
                entity.setPifuDate(new Date());
                logger.info(String.format("保存计划下达安排资金,项目名称 %s", entity.getProjectName()));
            } else {
                Double sqPlanReach_ggys = (Double) map.get("sqPlanReach_ggys");
                Double sqPlanReach_gtzj = (Double) map.get("sqPlanReach_gtzj");

                entity.setSqPlanReach_ggys(sqPlanReach_ggys);
                entity.setSqPlanReach_gtzj(sqPlanReach_gtzj);

                //查询本年度是否存在计划下达
                Criterion criterion1 = Restrictions.eq(ShenBaoInfo_.projectShenBaoStage.getName(), BasicDataConfig.projectShenBaoStage_planReach);
                Criterion criterion2 = Restrictions.eq(ShenBaoInfo_.projectNumber.getName(), entity.getProjectNumber());
                Criterion criterion3 = Restrictions.eq(ShenBaoInfo_.planYear.getName(), entity.getPlanYear());
                List<ShenBaoInfo> query = super.repository.findByCriteria(criterion1, criterion2, criterion3);
                if (query.isEmpty()) {
                    entity.setIsPlanReach(true);
                    ShenBaoInfoDto dto = super.mapper.toDto(entity);
                    ShenBaoInfo newEntity = new ShenBaoInfo();
                    newEntity = super.mapper.buildEntity(dto, newEntity);
                    //关联关系
                    for (int i = 0; i < dto.getAttachmentDtos().size(); i++) {
                        Attachment attachment = new Attachment();
                        attachmentMapper.buildEntity(dto.getAttachmentDtos().get(i), attachment);
                        newEntity.getAttachments().add(attachment);
                    }
                    ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
                    ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
                    newEntity.setShenBaoUnitInfo(shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto, new ShenBaoUnitInfo()));
                    newEntity.setBianZhiUnitInfo(shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto, new ShenBaoUnitInfo()));

                    newEntity.setProjectShenBaoStage(BasicDataConfig.projectShenBaoStage_planReach);
                    newEntity.setProcessStage(BasicDataConfig.processStage_qianshou);
                    newEntity.setProcessState(BasicDataConfig.processState_jinxingzhong);
                    newEntity.setShenbaoDate(new Date());
                    newEntity.setCreatedBy(currentUser.getUserId());
                    newEntity.setModifiedBy(currentUser.getUserId());
                    newEntity.setCreatedDate(new Date());
                    newEntity.setModifiedDate(new Date());
                    super.repository.save(newEntity);
                } else {
                    ShenBaoInfo oldEntity = query.get(0);
                    oldEntity.setShenbaoDate(new Date());
                    oldEntity.setSqPlanReach_ggys(sqPlanReach_ggys);
                    oldEntity.setSqPlanReach_gtzj(sqPlanReach_gtzj);
                    super.repository.save(oldEntity);
                }
                logger.info(String.format("保存计划下达申请资金,项目名称 %s", entity.getProjectName()));
            }
            super.repository.save(entity);
        } else {
            throw new IllegalArgumentException(String.format("查找申报信息故障，请重新尝试！"));
        }
    }


    @Override
    @Transactional
    public void updateShenBaoInfo(ShenBaoInfoDto dto, Boolean isAdminUpdate) {
    	Map map = isRecords(dto);
        ShenBaoInfo entity = super.update(dto, dto.getId());
        //处理关联信息
        //附件
        entity.getAttachments().forEach(x -> {//删除历史附件
            attachmentRepo.delete(x);
        });
        entity.getAttachments().clear();
        dto.getAttachmentDtos().forEach(x -> {//添加新附件
            Attachment attachment = new Attachment();
            attachmentMapper.buildEntity(x, attachment);
            attachment.setCreatedBy(entity.getModifiedBy());
            attachment.setModifiedBy(entity.getModifiedBy());
            entity.getAttachments().add(attachment);
        });

        //申报单位
        shenBaoUnitInfoRepo.delete(entity.getShenBaoUnitInfo());//删除申报单位
        ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
        ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
        shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto, shenBaoUnitInfo);
        shenBaoUnitInfo.setCreatedBy(entity.getModifiedBy());
        shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
        entity.setShenBaoUnitInfo(shenBaoUnitInfo);
        //编制单位
        shenBaoUnitInfoRepo.delete(entity.getBianZhiUnitInfo());//删除编制单位
        ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
        ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
        shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto, bianZhiUnitInfo);
        bianZhiUnitInfo.setCreatedBy(entity.getModifiedBy());
        bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
        entity.setBianZhiUnitInfo(bianZhiUnitInfo);
        // 2更新并提交流程
        if(dto.getIsUpdateOrSubmit().equals(2)) {
            if (!isAdminUpdate) {
                //第一次走审批流程
                if (entity.getZong_processId() == null) {
                    createProcessShenbao(entity, dto);
                } else {
                    //更新申报信息的审批阶段和审批状态
                    entity.setProcessStage("投资科审核收件办理");
                    entity.setProcessState(BasicDataConfig.processState_jinxingzhong);

                    if (entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_planReach)) {
                        startProcessShenbao(processDefinitionKey_plan, entity.getId());
                    } else if (entity.getProjectShenBaoStage().equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)) {
                        entity.setProcessStage("投资科审核收件办理");
                        startProcessShenbao(processDefinitionKey_yearPlan, entity.getId());
                    } else {
                        startProcessShenbao(processDefinitionKey, entity.getId());
                        if ("projectClassify_1_1".equalsIgnoreCase(dto.getProjectClassify())) {
                            startProcessMonitor_fjxm(processDefinitionKey_monitor_fjxm, entity.getId());
                        }
                    }
                }
            }
        }
        super.repository.save(entity);
        //处理批复文件库
        handlePiFuFile(entity);
        logger.info(String.format("更新申报信息,项目名称: %s,申报阶段：%s", entity.getProjectName(),
                basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
    }

    private String getTaskType(String shenbaoStage) {
        if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)) {//如果是下一年度计划
            return BasicDataConfig.taskType_nextYearPlan;
        } else if (shenbaoStage.equals(projectShenBaoStage_JYS)) {//如果申报阶段：是项目建议书
            return taskType_JYS;
        } else if (shenbaoStage.equals(projectShenBaoStage_KXXYJBG)) {//如果申报阶段：是可行性研究报告
            return taskType_KXXYJBG;
        } else if (shenbaoStage.equals(projectShenBaoStage_CBSJYGS)) {//如果申报阶段：是初步概算与设计
            return taskType_CBSJYGS;
        } else if (shenbaoStage.equals(projectShenBaoStage_ZJSQBG)) {//如果申报阶段：是资金申请报告
            return taskType_ZJSQBG;
        } else if (shenbaoStage.equals(projectShenBaoStage_planReach)) {//如果申报阶段：是计划下达
            return taskType_JH;
        } else if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)) {//如果申报阶段：是计划下达
            return BasicDataConfig.taskType_SCQQJFXD;
        }
        return "";
    }


    /**
     * 批复文件库处理
     */
    public void handlePiFuFile(ShenBaoInfo shenBaoInfo) {
        //获取文件库中所有的批复文件(map)
        List<ReplyFile> replyFiles = replyFileRepo.findAll();
        Map<String, Object> replyFileMap = new HashMap<String, Object>();
        replyFiles.stream().forEach(x -> {
            String key = x.getNumber();//文号
            String value = x.getName();//文件名
            replyFileMap.put(key, value);
        });
        //获取项目中批复文件以及文号(map)
        Map<String, Attachment> pifuMap = new HashMap<>();
        if(shenBaoInfo.getAttachments()!=null){
        	shenBaoInfo.getAttachments().stream().forEach(x -> {
                if (Util.isNotNull(x.getType())) {//非空判断
                    if (x.getType().equals(BasicDataConfig.attachment_type_jys)) {
                        pifuMap.put(shenBaoInfo.getPifuJYS_wenhao(), x);
                    }
                    if (x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)) {
                        pifuMap.put(shenBaoInfo.getPifuKXXYJBG_wenhao(), x);
                    }
                    if (x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)) {
                        pifuMap.put(shenBaoInfo.getPifuCBSJYGS_wenhao(), x);
                    }
                }
            });
       
	        //判断项目中批复文件在文件库中是否存在
	        List<Map<String, Object>> needList = Util.getCheck(pifuMap, replyFileMap);
	        //更新文件库
	        needList.stream().forEach(x -> {
	            for (String key : x.keySet()) {
	                Attachment obj = (Attachment) x.get(key);
	                ReplyFile replyfile = new ReplyFile();
	                replyfile.setId(UUID.randomUUID().toString());
	                replyfile.setNumber(key);
	                replyfile.setCreatedBy(obj.getCreatedBy());
	                replyfile.setName(obj.getName());
	                replyfile.setFullName(obj.getUrl());
	                replyfile.setItemOrder(obj.getItemOrder());
	                replyfile.setModifiedBy(obj.getModifiedBy());
	                replyfile.setType(obj.getType());
	                replyFileRepo.save(replyfile);//更新文件库
	            }
	        });
        }
        
    }


    private Project shenBaoChangeToProject(ShenBaoInfoDto dto, Project project) {
        project.setUnitName(dto.getUnitName());//项目所属单位
        project.setProjectName(dto.getProjectName());//项目名称
        project.setProjectStage(dto.getProjectStage());//项目阶段
        project.setProjectRepName(dto.getProjectRepName());//负责人名称
        project.setProjectRepMobile(dto.getProjectRepMobile());//负责人手机
        project.setProjectCategory(dto.getProjectCategory());//项目类别
        project.setProjectClassify(dto.getProjectClassify());//项目分类
        project.setProjectIndustry(dto.getProjectIndustry());//项目行业归口
        project.setProjectType(dto.getProjectType());//项目类型
        project.setDivisionId(dto.getDivisionId());//项目区域
        project.setProjectAddress(dto.getProjectAddress());//项目地址
        project.setBeginDate(dto.getBeginDate());//项目开工日期
        project.setEndDate(dto.getEndDate());//项目竣工日期
        project.setProjectInvestSum(dto.getProjectInvestSum());//项目总投资
        project.setProjectInvestAccuSum(dto.getProjectInvestAccuSum());//累计完成投资
        project.setProjectInvestmentType(dto.getProjectInvestmentType());//投资类型
        //资金来源
        project.setCapitalSCZ_ggys(dto.getCapitalSCZ_ggys());//市财政--公共预算
        project.setCapitalSCZ_gtzj(dto.getCapitalSCZ_gtzj());//市财政--国土基金
        project.setCapitalSCZ_zxzj(dto.getCapitalSCZ_zxzj());//市财政--专项基金
        project.setCapitalQCZ_gtzj(dto.getCapitalQCZ_gtzj());//区财政--国土基金
        project.setCapitalQCZ_ggys(dto.getCapitalQCZ_ggys());//区财政--公共预算
        project.setCapitalZYYS(dto.getCapitalZYYS());//中央预算
        project.setCapitalSHTZ(dto.getCapitalSHTZ());//社会投资
        project.setCapitalOther(dto.getCapitalOther());//其他
        project.setCapitalOtherDescription(dto.getCapitalOtherDescription());//其他来源说明
        project.setProjectIntro(dto.getProjectIntro());//项目简介
        project.setProjectGuiMo(dto.getProjectGuiMo());//项目规模
        project.setRemark(dto.getRemark());//项目基本信息备注
        //批复日期&文号
        project.setPifuJYS_date(dto.getPifuJYS_date());
        project.setPifuCBSJYGS_date(dto.getPifuCBSJYGS_date());
        project.setPifuKXXYJBG_date(dto.getPifuKXXYJBG_date());
        project.setPifuJYS_wenhao(dto.getPifuJYS_wenhao());
        project.setPifuCBSJYGS_wenhao(dto.getPifuCBSJYGS_wenhao());
        project.setPifuKXXYJBG_wenhao(dto.getPifuKXXYJBG_wenhao());

        return project;
    }

    /**
     * @param type     分类类型
     * @param pifuDate 批复时间
     * @return 查询到的数据集合
     * @Title: getApprovalStatistics
     * @Description: 统计分析审批类分类统计
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getApprovalStatistics(String type, int pifuDate) {
        List<ProjectStatisticsBean> list = new ArrayList<>();
        String Sql = "";
        switch (type) {
            case "approval":
                Sql += SQLConfig.approvalStatisticsByStage;
                break;
            case "industry":
                Sql += SQLConfig.approvalStatisticsByIndustry;
                break;
            case "unit":
                Sql += SQLConfig.approvalStatisticsByUnit;
                break;
            default:
                break;
        }

        NativeQuery query = super.repository.getSession().createSQLQuery(Sql);
        query.setParameter("pifuDate", pifuDate);
        query.addScalar("classDesc", new StringType());
        query.addScalar("projectNumbers", new IntegerType());
        query.addScalar("projectInvestSum", new DoubleType());
        if (type.equals("unit")) {
            query.addScalar("approvalStageXMJYSNumbers", new IntegerType());
            query.addScalar("approvalStageKXXYJBGNumbers", new IntegerType());
            query.addScalar("approvalStageCBSJGSNumbers", new IntegerType());
            query.addScalar("approvalStageZJSQBGNumbers", new IntegerType());
        }
        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        switch (type) {
            case "approval":
                logger.info("审批类信息审批阶段分类统计报表导出");
                break;
            case "industry":
                logger.info("审批类信息项目行业分类统计报表导出");
                break;
            case "unit":
                logger.info("审批类信息申报单位分类统计报表导出");
                break;
            default:
                break;
        }
        return list;
    }

    /**
     * @param pifuDateBegin    筛选条件：批复时间开始范围
     * @param pifuDateEnd      筛选条件：批复时间结束范围
     * @param industrySelected 筛选条件：行业
     * @param stageSelected    筛选条件：申报阶段
     * @param unitSelected     筛选条件：申报单位
     * @param investSumBegin   筛选条件：总投资开始范围
     * @param investSumEnd     筛选条件：总投资结束范围
     * @param projectName      筛选条件：项目名称关键字
     * @return list 查询出来的数据集合
     * @throws
     * @Title: getShenBaoInfoStatisticsByCustom
     * @Description: 统计分析审批类自定义条件统计
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getApprovalStatisticsByCustom(Integer pifuDateBegin, Integer pifuDateEnd,
                                                                     String[] industrySelected, String[] stageSelected, String[] unitSelected, Double investSumBegin,
                                                                     Double investSumEnd, String projectName) {
        List<ProjectStatisticsBean> list = new ArrayList<>();
        String Sql = "SELECT sbi.projectName,u.unitName,b1.description AS projectStageDesc,b2.description AS projectIndustryDesc,sbi.projectInvestSum,sbi.projectGuiMo";
        Sql += " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b1,cs_basicdata AS b2,cs_userunitinfo AS u";
        Sql += " WHERE";
        if (industrySelected != null && industrySelected.length > 0) {
            Sql += " sbi.projectIndustry IN (";
            for (int i = 0; i < industrySelected.length; i++) {
                if (i == industrySelected.length - 1) {
                    Sql += "'" + industrySelected[i].trim() + "'";
                } else {
                    Sql += "'" + industrySelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        }
        if (unitSelected != null && unitSelected.length > 0) {
            Sql += " sbi.unitName IN (";
            for (int i = 0; i < unitSelected.length; i++) {
                if (i == unitSelected.length - 1) {
                    Sql += "'" + unitSelected[i].trim() + "'";
                } else {
                    Sql += "'" + unitSelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        }
        if (stageSelected != null && stageSelected.length > 0) {
            Sql += " sbi.projectShenBaoStage IN (";
            for (int i = 0; i < stageSelected.length; i++) {
                if (i == stageSelected.length - 1) {
                    Sql += "'" + stageSelected[i].trim() + "'";
                } else {
                    Sql += "'" + stageSelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        } else {
            Sql += " sbi.projectShenBaoStage IN ('" + BasicDataConfig.projectShenBaoStage_XMJYS + "','" + BasicDataConfig.projectShenBaoStage_KXXYJBG + "','" + BasicDataConfig.projectShenBaoStage_CBSJGS + "','" + BasicDataConfig.projectShenBaoStage_ZJSQBG + "') AND";
        }

        if (investSumBegin != null && investSumEnd != null) {
            Sql += " sbi.projectInvestSum BETWEEN " + investSumBegin + " AND " + investSumEnd + " AND";
        } else if (investSumBegin != null && investSumEnd == null) {
            Sql += " sbi.projectInvestSum >=" + investSumBegin + " AND";
        } else if (investSumBegin == null && investSumEnd != null) {
            Sql += " sbi.projectInvestSum <=" + investSumEnd + " AND";
        }

        if (pifuDateBegin != null && pifuDateEnd != null) {
            Sql += " YEAR(sbi.pifuDate) BETWEEN " + pifuDateBegin + " AND " + pifuDateEnd + " AND";
        } else if (pifuDateBegin != null && pifuDateEnd == null) {
            Sql += " YEAR(sbi.pifuDate) >= " + pifuDateBegin + " AND";
        } else if (pifuDateBegin == null && pifuDateEnd != null) {
            Sql += " YEAR(sbi.pifuDate) <= " + pifuDateEnd + " AND";
        }

        if (Util.isNotNull(projectName)) {
            Sql += " sbi.projectName like \'%" + projectName + "%\' AND";
        }

        Sql += " sbi.projectShenBaoStage = b1.id AND sbi.projectIndustry = b2.id AND sbi.unitName = u.id ORDER BY b2.itemOrder";

        NativeQuery query = super.repository.getSession().createSQLQuery(Sql);
        query.addScalar("projectName", new StringType());
        query.addScalar("unitName", new StringType());
        query.addScalar("projectStageDesc", new StringType());
        query.addScalar("projectIndustryDesc", new StringType());
        query.addScalar("projectInvestSum", new DoubleType());
        query.addScalar("projectGuiMo", new StringType());
        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        logger.info("审批类信息自定义分类统计报表导出");
        return list;
    }

    /**
     * @param type     分类类型
     * @param planYear 批复时间
     * @return 查询到数据集合
     * @throws
     * @Title: getPlanStatistics
     * @Description: 计划类分类统计
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getPlanStatistics(String type, int planYear) {
        List<ProjectStatisticsBean> list = new ArrayList<>();
        String Sql = "";
        switch (type) {
            case "industry":
                Sql += SQLConfig.planStatisticsByIndustry;
                break;
            case "unit":
                Sql += SQLConfig.planStatisticsByUnit;
                break;
            case "plan":
                Sql += SQLConfig.planStatisticsByPlanType;
                break;
            default:
                break;
        }

        NativeQuery query = super.repository.getSession().createSQLQuery(Sql);
        query.setParameter("pifuDate", planYear);
        query.addScalar("classDesc", new StringType());
        query.addScalar("projectNumbers", new IntegerType());
        query.addScalar("projectInvestSum", new DoubleType());
        query.addScalar("projectInvestAccuSum", new DoubleType());
        query.addScalar("apPlanReachTheYear", new DoubleType());

        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        switch (type) {
            case "plan":
                logger.info("计划类信息计划类型分类统计报表导出");
                break;
            case "industry":
                logger.info("审批类信息项目行业分类统计报表导出");
                break;
            case "unit":
                logger.info("计划类信息建设单位分类统计报表导出");
                break;
            default:
                break;
        }
        return list;
    }

    /**
     * @param planYearBegin       筛选条件：计划下达开始时间
     * @param planYearEnd         筛选条件：计划下达结束时间
     * @param industrySelected    筛选条件：项目行业
     * @param stageSelected       筛选条件：项目阶段
     * @param unitSelected        筛选条件：建设单位
     * @param investSumBegin      筛选条件：总投资开始范围
     * @param investSumEnd        筛选条件：总投资结束范围
     * @param apPlanReachSumBegin 筛选条件：下达资金开始范围
     * @param apPlanReachSumEnd   筛选条件：下达资金结束范围
     * @param projectName         筛选条件：项目名称关键字
     * @return 查询到数据集合
     * @throws
     * @Title: getPlanStatisticsByCustom
     * @Description: 计划类自定义条件统计
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getPlanStatisticsByCustom(Integer planYearBegin, Integer planYearEnd,
                                                                 String[] industrySelected, String[] stageSelected, String[] unitSelected, Double investSumBegin,
                                                                 Double investSumEnd, Double apPlanReachSumBegin, Double apPlanReachSumEnd, String projectName) {
        List<ProjectStatisticsBean> list = new ArrayList<>();
        String Sql = "SELECT sbi.projectName,u.unitName,b.description AS projectConstrCharDesc,sbi.beginDate,sbi.endDate,sbi.projectGuiMo,";
        Sql += " sbi.projectInvestSum,sbi.apInvestSum,sbi.yearInvestApproval,sbi.apPlanReach_ggys,sbi.apPlanReach_gtzj,";
        Sql += " sbi.yearConstructionContent,sbi.yearConstructionContentShenBao";
        Sql += " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b,cs_userunitinfo AS u";
        Sql += " WHERE";
        if (industrySelected != null && industrySelected.length > 0) {
            Sql += " sbi.projectIndustry IN (";
            for (int i = 0; i < industrySelected.length; i++) {
                if (i == industrySelected.length - 1) {
                    Sql += "'" + industrySelected[i].trim() + "'";
                } else {
                    Sql += "'" + industrySelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        }
        if (stageSelected != null && stageSelected.length > 0) {
            Sql += " sbi.projectStage IN (";
            for (int i = 0; i < stageSelected.length; i++) {
                if (i == stageSelected.length - 1) {
                    Sql += "'" + stageSelected[i].trim() + "'";
                } else {
                    Sql += "'" + stageSelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        }
        if (unitSelected != null && unitSelected.length > 0) {
            Sql += " sbi.unitName IN (";
            for (int i = 0; i < unitSelected.length; i++) {
                if (i == unitSelected.length - 1) {
                    Sql += "'" + unitSelected[i].trim() + "'";
                } else {
                    Sql += "'" + unitSelected[i].trim() + "',";
                }
            }
            Sql += " ) AND";
        }

        if (investSumBegin != null && investSumEnd != null) {
            Sql += " sbi.projectInvestSum BETWEEN " + investSumBegin + " AND " + investSumEnd + " AND";
        } else if (investSumBegin != null && investSumEnd == null) {
            Sql += " sbi.projectInvestSum >= " + investSumBegin + " AND";
        } else if (investSumBegin == null && investSumEnd != null) {
            Sql += " sbi.projectInvestSum <= " + investSumEnd + " AND";
        }

        if (apPlanReachSumBegin != null && apPlanReachSumEnd != null) {
            Sql += " (IFNULL(sbi.apPlanReach_ggys, 0) + IFNULL(sbi.apPlanReach_gtzj, 0)) BETWEEN " + apPlanReachSumBegin + " AND " + apPlanReachSumEnd + " AND";
        } else if (apPlanReachSumBegin != null && apPlanReachSumEnd == null) {
            Sql += " (IFNULL(sbi.apPlanReach_ggys, 0) + IFNULL(sbi.apPlanReach_gtzj, 0)) >= " + apPlanReachSumBegin + " AND";
        } else if (apPlanReachSumBegin == null && apPlanReachSumEnd != null) {
            Sql += " (IFNULL(sbi.apPlanReach_ggys, 0) + IFNULL(sbi.apPlanReach_gtzj, 0)) <= " + apPlanReachSumEnd + " AND";
        }

        if (planYearBegin != null && planYearEnd != null) {
            Sql += " YEAR(sbi.pifuDate) BETWEEN " + planYearBegin + " AND " + planYearEnd + " AND";
        } else if (planYearBegin != null && planYearEnd == null) {
            Sql += " YEAR(sbi.pifuDate) >= " + planYearBegin + " AND";
        } else if (planYearBegin == null && planYearEnd != null) {
            Sql += " YEAR(sbi.pifuDate) <= " + planYearEnd + " AND";
        }

        if (Util.isNotNull(projectName)) {
            Sql += " sbi.projectName like \'%" + projectName + "%\' AND";
        }

        Sql += " sbi.projectShenBaoStage = '" + BasicDataConfig.projectShenBaoStage_planReach + "'";

        Sql += " AND sbi.unitName = u.id AND sbi.projectConstrChar = b.id ORDER BY b.itemOrder";

        NativeQuery query = super.repository.getSession().createSQLQuery(Sql);
        query.addScalar("projectName", new StringType());
        query.addScalar("unitName", new StringType());
        query.addScalar("projectConstrCharDesc", new StringType());
        query.addScalar("beginDate", new StringType());
        query.addScalar("endDate", new StringType());
        query.addScalar("projectGuiMo", new StringType());
        query.addScalar("projectInvestSum", new DoubleType());
        query.addScalar("apInvestSum", new DoubleType());
        query.addScalar("yearInvestApproval", new DoubleType());
        query.addScalar("apPlanReach_ggys", new DoubleType());
        query.addScalar("apPlanReach_gtzj", new DoubleType());
        query.addScalar("yearConstructionContent", new StringType());
        query.addScalar("yearConstructionContentShenBao", new StringType());
        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        logger.info("计划类信息自定义分类统计报表导出");
        return list;
    }

    @Override
    @Transactional
    public void startProcessShenbao(String processDefinitionKey, String id) {
        ShenBaoInfo entity = super.repository.findById(id);
        //获取系统配置中工作流类型的第一处理人
        Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), BasicDataConfig.taskType_shenpiFenBan);
        SysConfig sysConfg = sysConfigRepo.findByCriteria(criterion).stream().findFirst().get();

        Map<String, Object> variables = new HashMap<String, Object>();

        variables.put("shenbaoInfoId", id);
        activitiService.setStartProcessUserId(currentUser.getUserId());//谁启动的流程

        List<Org> findProjects = new ArrayList<>();
        List<String> useridList = new ArrayList<>();

        if (BasicDataConfig.projectShenBaoStage_nextYearPlan.equals(entity.getProjectShenBaoStage())) {

            Criterion criterion1 = Restrictions.eq(Org_.name.getName(), "投资科");
            findProjects = orgRepo.findByCriteria(criterion1);
            for (Org org : findProjects) {
                for (User user : org.getUsers()) {
                    useridList.add(user.getId().trim());
                }
            }
            if (!useridList.isEmpty()) {
                variables.put("users", useridList);
            }
        } else {
            if (sysConfg != null && !"".equals(sysConfg.getConfigValue())) {
                if (sysConfg.getEnable()) {
                    variables.put("users", sysConfg.getConfigValue());
                    entity.setThisUser(sysConfg.getConfigValue());
//					processEngine.getProcessEngineConfiguration().getTaskService().setAssignee(task.getId(), sysConfg.getConfigValue());
                } else {
                    throw new IllegalArgumentException(String.format("审批申报端口已关闭，请联系管理员！"));
                }
            } else {
                throw new IllegalArgumentException(String.format("没有配置申报信息审核分办人员，请联系管理员！"));
            }
        }
        ProcessInstance process = activitiService.startProcess(processDefinitionKey, variables);
        String executionId = process.getId();

        Task task = activitiService.getTaskByExecutionId(executionId);
        entity.setProcessStage("投资科审核收件办理");
        entity.setProcessState(BasicDataConfig.processState_jinxingzhong);
        entity.setZong_processId(task.getProcessInstanceId());
        entity.setThisTaskId(task.getId());
        entity.setThisTaskName(task.getTaskDefinitionKey());
        super.repository.save(entity);

        // 发送短信给第一处理人
        try {
            User user = userService.findById(sysConfg.getConfigValue());
            if (user != null
                    && StringUtils.isNotBlank(user.getMobilePhone())) {
                String content = String.format(shenbaoSMSContent.get(entity.getThisTaskName()) == null ? shenbaoSMSContent.get("default") : shenbaoSMSContent.get(entity.getThisTaskName()), user.getDisplayName(),entity.getProjectName(),getStageType(entity.getProjectShenBaoStage()),entity.getProcessStage());
                SendMsg msg = new SendMsg(user.getMobilePhone(), content);
                String resultXml =  smsService.insertDownSms(null, msg);
    			System.out.println(resultXml);
    			System.out.println(resultXml);
            }
        } catch (SMSException e) {
            logger.error("发送短信异常：" + e.getMessage(), e);
        }

        logger.info(String.format("启动审批流程,用户名:%s", currentUser.getLoginName()));
    }

    @SuppressWarnings({"rawtypes", "unchecked"})
    @Transactional
    public void startProcessMonitor_fjxm(String processDefinitionKey, String id) {
        ShenBaoInfo entity = super.repository.findById(id);
        Map<String, Object> variables = new HashMap<String, Object>();

        variables.put("shenbaoInfoId", id);
        //谁启动的流程
        activitiService.setStartProcessUserId(currentUser.getUserId());

        String projectShenBaoStage = entity.getProjectShenBaoStage();
        String executionId = null;
        if (StringUtil.isNotBlank(projectShenBaoStage) && "projectShenBaoStage_1".equalsIgnoreCase(projectShenBaoStage)) {
            ProcessInstance process = activitiService.startProcess(processDefinitionKey, variables);
            executionId = process.getId();
        } else {
            String projectId = entity.getProjectId();
            ODataObj odataObj = new ODataObj();
            List<ODataFilterItem> ODataFilterItemList = new ArrayList<>();
            ODataFilterItem filterItem0 = new ODataFilterItem();
            filterItem0.setField("projectId");
            filterItem0.setOperator("eq");
            filterItem0.setValue(projectId);
            ODataFilterItemList.add(filterItem0);

            ODataFilterItem filterItem1 = new ODataFilterItem();
            filterItem1.setField("projectShenBaoStage");
            filterItem1.setOperator("eq");
            filterItem1.setValue("projectShenBaoStage_1");
            ODataFilterItemList.add(filterItem1);

            odataObj.setFilter(ODataFilterItemList);
            List<ShenBaoInfo> shenBaoInfos = repository.findByOdata(odataObj);
            if (shenBaoInfos.size() > 0) {
                executionId = shenBaoInfos.get(0).getMonitor_processId();
            }
        }

        //Task task = activitiService.getTaskByExecutionId(executionId);
        entity.setMonitor_processId(executionId);
        super.repository.save(entity);
        logger.info(String.format("启动监控流程,用户名:%s", currentUser.getLoginName()));

        //更新项目的流程监控ID

    }
    @Override
    public List<ShenBaoInfoDto> findByDto(ODataObj odataObj) {
        // TODO Auto-generated method stub
        return null;
    }

    @Override
    @Transactional
    public ShenBaoInfoDto getShenBaoInfoDtoById(String shenbaoInfoId) {
        ShenBaoInfo shenBaoInfo = super.repository.findById(shenbaoInfoId);
        return mapper.toDto(shenBaoInfo);

    }
    
    private String getStageType(String shenbaoStage) {
        if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)) {//如果是下一年度计划
            return projectShenBaoStage_7;
        }  else if (shenbaoStage.equals(projectShenBaoStage_KXXYJBG)) {//如果申报阶段：是可行性研究报告
            return  projectShenBaoStage_2;
        } else if (shenbaoStage.equals(projectShenBaoStage_CBSJYGS)) {//如果申报阶段：是初步概算与设计
            return projectShenBaoStage_3;
        } else if (shenbaoStage.equals(projectShenBaoStage_ZJSQBG)) {//如果申报阶段：是资金申请报告
            return projectShenBaoStage_4;
        } else if (shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_oncePlanReach)) {//如果申报阶段：是计划下达
            return projectShenBaoStage_6;
        }
        return "";
    }
}


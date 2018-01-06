package cs.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.domain.Project;
import cs.domain.Project_;
import cs.domain.ReplyFile;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.TaskHead;
import cs.domain.TaskHead_;
import cs.domain.TaskRecord;
import cs.domain.framework.Role;
import cs.domain.framework.Role_;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.model.PageModelDto;
import cs.model.SendMsg;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ShenBaoInfoService;
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
	private IRepository<TaskHead, String> taskHeadRepo;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IRepository<ShenBaoUnitInfo, String> shenBaoUnitInfoRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<ReplyFile, String> replyFileRepo;
	@Autowired
	private IRepository<Role, String> RoleRepo;
	@Autowired
	private IRepository<SysConfig, String> sysConfigRepo;
	@Autowired
	private IRepository<BasicData, String> basicDataRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
	@Autowired
	private IMapper<TaskRecordDto, TaskRecord> taskRecordMapper;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ICurrentUser currentUser;

	@Value("${projectShenBaoStage_JYS}")
	private String projectShenBaoStage_JYS;//申报阶段：建议书
	@Value("${projectShenBaoStage_KXXYJBG}")
	private String projectShenBaoStage_KXXYJBG;//申报阶段：可行性研究报告
	@Value("${projectShenBaoStage_CBSJYGS}")
	private String projectShenBaoStage_CBSJYGS;//申报阶段：初步设计与概算
	@Value("${projectShenBaoStage_prePlanFee}")
	private String projectShenBaoStage_prePlanFee;//申报阶段：规划设计前期费
	@Value("${projectShenBaoStage_newStart}")
	private String projectShenBaoStage_newStart;//申报阶段：新开工计划
	@Value("${projectShenBaoStage_xuJian}")
	private String projectShenBaoStage_xuJian;//申报阶段：续建计划
	@Value("${projectShenBaoStage_jueSuan}")
	private String projectShenBaoStage_jueSuan;//申报阶段：竣工决算
	@Value("${projectShenBaoStage_baoGao}")
	private String projectShenBaoStage_baoGao;//申报阶段：资金申请报告
	@Value("${projectShenBaoStage_jihua}")
	private String projectShenBaoStage_jihua;//申报阶段：计划下达
	@Value("${taskType_JYS}")
	private String taskType_JYS;//任务类型：建议书
	@Value("${taskType_KXXYJBG}")
	private String taskType_KXXYJBG;//任务类型：可行性研究报告
	@Value("${taskType_CBSJYGS}")
	private String taskType_CBSJYGS;//任务类型：初步设计与概算
	@Value("${taskType_prePlanFee}")
	private String taskType_prePlanFee;//任务类型：规划设计前期费
	@Value("${taskType_newStart}")
	private String taskType_newStart;//任务类型：新开工计划
	@Value("${taskType_xuJian}")
	private String taskType_xuJian;//任务类型：续建计划
	@Value("${taskType_jueSuan}")
	private String taskType_jueSuan;//任务类型：竣工决算
	@Value("${taskType_ZJSQBG}")
	private String taskType_ZJSQBG;//任务类型：资金申请报告
	@Value("${taskType_JH}")
	private String taskType_JH;//任务类型：计划下达
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		logger.info("查询申报数据");
		return super.get(odataObj);				
	}
	
	/**
	 * @description 创建申报信息
	 * @param dto 申报信息数据
	 * @param isAdminCreate 是否是管理员创建
	 */
	@Override
	@Transactional
	public void createShenBaoInfo(ShenBaoInfoDto dto,Boolean isAdminCreate) {
		//创建申报信息
		ShenBaoInfo entity=super.create(dto);
		entity.setAuditState(BasicDataConfig.auditState_noAudit);//初始化审核状态--未审核
		if(isAdminCreate){//如果为后台管理员创建
			//创建项目
			//首先验证项目名称是否重复
			Criterion criterion=Restrictions.eq(Project_.projectName.getName(), dto.getProjectName());
			List<Project> findProjects = projectRepo.findByCriteria(criterion);
			if(findProjects.isEmpty()){//如果为空集合
				Project project = new Project();
				project.setCreatedBy(currentUser.getUserId());
				project.setModifiedBy(currentUser.getUserId());
				project.setId(UUID.randomUUID().toString());
				shenBaoChangeToProject(dto,project);
				//新创建的项目需要设置项目代码,根据行业类型id查询出基础数据
				BasicData basicData = basicDataRepo.findById(project.getProjectIndustry());
				if(basicData !=null){
					String number = Util.getProjectNumber(project.getProjectInvestmentType(), basicData);
					project.setProjectNumber(number);
					//行业项目统计累加
					basicData.setCount(basicData.getCount()+1);
					basicData.setModifiedBy(currentUser.getUserId());
					basicData.setModifiedDate(new Date());
					basicDataRepo.save(basicData);
				}else{
					throw new IllegalArgumentException(String.format("项目代码生成故障，请确认项目行业选择是否正确！"));
				}
				//批复文件
				if(dto.getAttachmentDtos() !=null && !dto.getAttachmentDtos().isEmpty()){
					dto.getAttachmentDtos().stream().forEach(x->{
						if(x.getType().equals(BasicDataConfig.attachment_type_jys) ||
								x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg) ||
								x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){
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
				entity.setProcessState(BasicDataConfig.processState_qianShou);//设置申报信息的状态为签收状态
				entity.setReceiver(currentUser.getUserId());//设置默认签收人
				entity.setIsIncludLibrary(false);//设置初始化为未纳入项目库
				logger.info(String.format("创建项目信息,项目名称 %s",project.getProjectName()));
			}else{
				throw new IllegalArgumentException(String.format("项目：%s 已存在,请重新确认！",dto.getProjectName()));
			}
		}
		if(!isAdminCreate){//如果前台申报单位创建
			//因dto中创建时间和修改时间为项目的相关时间，需从新设置
			entity.setProcessState(BasicDataConfig.processState_tianBao);//设置申报信息的状态
			entity.setCreatedDate(new Date());
			entity.setModifiedDate(new Date());
		}
		//处理关联信息
		//附件
		dto.getAttachmentDtos().forEach(x -> {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(entity.getCreatedBy());
			attachment.setModifiedBy(entity.getModifiedBy());
			entity.getAttachments().add(attachment);
		});
		//申报单位
		ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
		ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		super.repository.save(entity);
		//初始化工作流
		initWorkFlow(entity,isAdminCreate);
		//处理批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("创建申报信息,项目名称 :%s,申报阶段：%s",entity.getProjectName(),
				basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
	}

	@Override
	@Transactional
	public ShenBaoInfo create(ShenBaoInfoDto dto) {
		ShenBaoInfo entity=super.create(dto);
		//因dto中创建时间和修改时间为项目的相关时间，需从新设置
		entity.setCreatedDate(new Date());
		entity.setModifiedDate(new Date());
		entity.setAuditState(BasicDataConfig.auditState_noAudit);//初始化审核状态--未审核
		//处理关联信息
		//begin#关联信息
		//附件
		dto.getAttachmentDtos().forEach(x -> {
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
			attachment.setCreatedBy(entity.getCreatedBy());
			attachment.setModifiedBy(entity.getModifiedBy());
			entity.getAttachments().add(attachment);
		});
		//申报单位
		ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
		ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		//设置申报信息的状态
		entity.setProcessState(BasicDataConfig.processState_tianBao);
		super.repository.save(entity);
		//初始化工作流
		initWorkFlow(entity,false);
		//处理批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("创建申报信息,项目名称 :%s,申报阶段：%s",entity.getProjectName(),
				basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));		
		return entity;
		
	}
	
	@Override
	@Transactional
	public ShenBaoInfo update(ShenBaoInfoDto dto,String id) {
		ShenBaoInfo entity=super.update(dto,id);
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
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		shenBaoUnitInfo.setCreatedBy(entity.getModifiedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		shenBaoUnitInfoRepo.delete(entity.getBianZhiUnitInfo());//删除编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedBy(entity.getModifiedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		//更新申报信息的状态
		entity.setProcessState(BasicDataConfig.processState_tianBao);
		super.repository.save(entity);
		//更新任务状态
		updeteWorkFlow(entity,false);

		//更新批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("更新申报信息,项目名称: %s,申报阶段：%s",entity.getProjectName(),
				basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));		
		return entity;		
	}
	

	@Override
	@Transactional
	public void delete(String id) {
		ShenBaoInfo entity=super.repository.findById(id);
		if(entity !=null){
			//判断申报信息的处理状态
			if(entity.getProcessState().equals(BasicDataConfig.processState_tianBao) ||
					entity.getProcessState().equals(BasicDataConfig.processState_tuiWen)){
				//查询关联taskHead并且删除
				Criterion criterion = Restrictions.eq("relId", id);
				TaskHead task =	taskHeadRepo.findByCriteria(criterion).stream().findFirst().get();
				taskHeadRepo.delete(task);
				
				logger.info(String.format("删除申报信息,项目名称： %s，申报阶段：%s",entity.getProjectName(),
						basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));	
				super.repository.delete(entity);
			}else{
				throw new IllegalArgumentException(String.format("申报信息不可删除！项目名称：%s，申报阶段：%s",entity.getProjectName(),
						basicDataService.getDescriptionById(entity.getProjectShenBaoStage())));
			}
			
		}
		
	}

	@Override
	@Transactional
	public void addProjectToLibrary(String shenbaoInfoId) {
		ShenBaoInfo shenbaoInfo = super.findById(shenbaoInfoId);
		if(shenbaoInfo !=null){
			Project project = projectRepo.findById(shenbaoInfo.getProjectId());
			if(project !=null){
				if(shenbaoInfo.getIsIncludLibrary() && project.getIsIncludLibrary()){
					throw new IllegalArgumentException(String.format("项目：%s 已纳入项目库",project.getProjectName()));
				}else{
					shenbaoInfo.setIsIncludLibrary(true);
					shenbaoInfo.setModifiedBy(currentUser.getUserId());
					shenbaoInfo.setModifiedDate(new Date());
					super.repository.save(shenbaoInfo);
					
					project.setIsIncludLibrary(true);
					project.setModifiedBy(currentUser.getUserId());
					project.setModifiedDate(new Date());
					projectRepo.save(project);
					logger.info(String.format("项目纳入项目库,项目名称 %s",project.getProjectName()));
				}
			}else{
				throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
			}
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的申报信息"));
		}
	}
	
	@Override
	@Transactional
	public void updateProjectBasic(ShenBaoInfoDto dto) {
		Project project = projectRepo.findById(dto.getProjectId());
		if(project !=null){
			//更新项目基本信息
			this.shenBaoChangeToProject(dto, project);
			//更新项目批复文件信息
			project.getAttachments().forEach(x -> {//删除历史附件
				attachmentRepo.delete(x);
			});
			project.getAttachments().clear();
			if(dto.getAttachmentDtos() !=null && !dto.getAttachmentDtos().isEmpty()){
				dto.getAttachmentDtos().stream().forEach(x->{
					if(x.getType().equals(BasicDataConfig.attachment_type_jys) ||
							x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg) ||
							x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){
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
			logger.info(String.format("更新项目基本信息,项目名称 %s",project.getProjectName()));
			//同步更新申报信息
			updateShenBaoInfo(dto);
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
		}
	}

	/**
	 * 后台退文
	 */
	@Override
	@Transactional
	public void updateShenBaoInfoState(TaskRecordDto dto) {
		//更新申报信息的状态
		ShenBaoInfo shenbaoInfo = super.repository.findById(dto.getRelId());
		if(shenbaoInfo !=null){
			shenbaoInfo.setProcessState(dto.getProcessState());
			shenbaoInfo.setModifiedBy(currentUser.getUserId());
			shenbaoInfo.setModifiedDate(new Date());
			
			super.repository.save(shenbaoInfo);
			//同时更新任务的状态
			TaskRecord entity = updeteWorkFlowByretreat(dto);
			//查询系统配置是否需要发送短信
			Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), BasicDataConfig.taskType_sendMesg);
			SysConfig entityQuery = sysConfigRepo.findByCriteria(criterion).stream().findFirst().get();
			if(entityQuery.getEnable()){
				SendMsg sendMsg = new SendMsg();
				sendMsg.setMobile(shenbaoInfo.getProjectRepMobile());
				String content = entity.getTitle()+":"+basicDataService.getDescriptionById(entity.getProcessState());
				if(entity.getProcessState().equals(BasicDataConfig.processState_tuiWen)){//如果为退文
					content += ";处理意见："+entity.getProcessSuggestion();
				}
				sendMsg.setContent(content);
				Util.sendShortMessage(sendMsg);
			}
			logger.info(String.format("更新申报信息状态,项目名称 %s",shenbaoInfo.getProjectName()));
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的申报信息"));
		}
		
	}
	
	@Override
	@Transactional
	public void updateShenBaoInfo(ShenBaoInfoDto dto) {
		ShenBaoInfo entity=super.update(dto,dto.getId());
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
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		shenBaoUnitInfo.setCreatedBy(entity.getModifiedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		shenBaoUnitInfoRepo.delete(entity.getBianZhiUnitInfo());//删除编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedBy(entity.getModifiedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		super.repository.save(entity);
		//更新任务状态
//		updeteWorkFlow(entity,true);
		//处理批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("后台管理员更新申报信息,项目名称 %s",entity.getProjectName()));		
	}

	private String getTaskType(String shenbaoStage){
		if(shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)){//如果是下一年度计划
			return BasicDataConfig.taskType_nextYearPlan;
		}else if(shenbaoStage.equals(projectShenBaoStage_JYS)){//如果申报阶段：是项目建议书
			return taskType_JYS;
		}else if(shenbaoStage.equals(projectShenBaoStage_KXXYJBG)){//如果申报阶段：是可行性研究报告
			return taskType_KXXYJBG;
		}else if(shenbaoStage.equals(projectShenBaoStage_CBSJYGS)){//如果申报阶段：是初步概算与设计
			return taskType_CBSJYGS;
		}else if(shenbaoStage.equals(projectShenBaoStage_prePlanFee)){//如果申报阶段：是前期计划
			return taskType_prePlanFee;
		}else if(shenbaoStage.equals(projectShenBaoStage_newStart)){//如果申报阶段：是新开工计划
			return taskType_newStart;
		}else if(shenbaoStage.equals(projectShenBaoStage_xuJian)){//如果申报阶段：是续建计划
			return taskType_xuJian;
		}else if(shenbaoStage.equals(projectShenBaoStage_jueSuan)){//如果申报阶段：是竣工决算
			return taskType_jueSuan;
		}else if(shenbaoStage.equals(projectShenBaoStage_baoGao)){//如果申报阶段：是资金申请报告
			return taskType_ZJSQBG;
		}else if(shenbaoStage.equals(projectShenBaoStage_jihua)){//如果申报阶段：是资金申请报告
			return taskType_JH;
		}
		return "";
	}
	
	/**
	* @Title: initWorkFlow 
	* @Description: 创建申报信息时初始化工作流 
	* @param shenBaoInfo 申报信息
	* @param isAdminCreate  是否为管理员创建 
	 */
	private void initWorkFlow(ShenBaoInfo shenBaoInfo,Boolean isAdminCreate){
		//获取系统配置中工作流类型的第一处理人
		Criterion criterion = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.msFenBanRole);
		Role role = RoleRepo.findByCriteria(criterion).stream().findFirst().get();
		if(role !=null){
			//创建工作流
			TaskHead taskHead=new TaskHead();
			taskHead.setId(UUID.randomUUID().toString());
			//设置任务标题格式为：“项目申报：项目名称--申报阶段”
			taskHead.setTitle("项目申报："+shenBaoInfo.getProjectName()+"--"+basicDataService.getDescriptionById(shenBaoInfo.getProjectShenBaoStage()));
			//taskHead.setNextUser(startUser);//设置下一处理人
			taskHead.setRelId(shenBaoInfo.getId());//设置关联的id
			taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态
			taskHead.setNextProcess(BasicDataConfig.processState_MiShuFenBan);//设置下一工作流状态
			taskHead.setProcessRole(role.getId());
			taskHead.setItemOrder(1);
			taskHead.setProcessSuggestion("材料填报");//设置处理意见
			taskHead.setTaskType(this.getTaskType(shenBaoInfo.getProjectShenBaoStage()));//设置工作流的类型
			taskHead.setUnitName(shenBaoInfo.getConstructionUnit());//设置建设单位
			taskHead.setProjectIndustry(shenBaoInfo.getProjectIndustry());//设置项目行业
			//设置创建者与修改者
			taskHead.setCreatedBy(currentUser.getUserId());
			taskHead.setModifiedBy(currentUser.getUserId());
			if(isAdminCreate){//如果为后台管理员创建
				taskHead.setProcessSuggestion("管理员--材料填报");//设置处理意见
				taskHead.setProcessState(BasicDataConfig.processState_qianShou);//设置工作流的状态--已签收
				taskHead.setComplete(true);
			}else{
				taskHead.setProcessSuggestion("申报单位--材料填报");//设置处理意见
				taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态--填报待签收
			}
			
			//record
			TaskRecord taskRecord=new TaskRecord();
			taskRecord.setId(UUID.randomUUID().toString());
			taskRecord.setTitle(taskHead.getTitle());
			taskRecord.setItemOrder(1);
			//taskRecord.setNextUser(startUser);//设置下一处理人
			taskRecord.setRelId(taskHead.getRelId());//设置关联id
			taskRecord.setTaskId(taskHead.getId());//设置任务Id
			taskRecord.setProcessState(taskHead.getProcessState());//设置工作流的状态
			taskRecord.setProcessRole(role.getId());
			taskRecord.setTaskType(taskHead.getTaskType());//设置工作流的类型
			taskRecord.setProcessSuggestion(taskHead.getProcessSuggestion());//设置处理意见
			taskRecord.setUnitName(taskHead.getUnitName());//设置建设单位
			taskRecord.setProjectIndustry(taskHead.getProjectIndustry());//设置项目行业
			taskRecord.setCreatedBy(taskHead.getCreatedBy());
			taskRecord.setModifiedBy(taskHead.getModifiedBy());

			taskHead.getTaskRecords().add(taskRecord);
			taskHeadRepo.save(taskHead);
		}else{
			throw new IllegalArgumentException(String.format("没有查找到秘书科分办人员这个角色！"));
		}
	}
	
	private void updeteWorkFlow(ShenBaoInfo entity,Boolean isManageChange){
		//查找到对应的任务
		Criterion criterion = Restrictions.eq(TaskHead_.relId.getName(), entity.getId());
		List<TaskHead> taskHeads = taskHeadRepo.findByCriteria(criterion);
		if(taskHeads !=null && taskHeads.size()>0){
			TaskHead taskHead = taskHeads.stream().findFirst().get();
			//添加一条流转记录
			//获取系统配置中工作流类型的第一处理人
			Criterion criterion2 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.msFenBanRole);
			Role role = RoleRepo.findByCriteria(criterion2).stream().findFirst().get();

		   //更新taskHead
		   taskHead.setTitle("项目申报："+entity.getProjectName()+"--"+basicDataService.getDescriptionById(entity.getProjectShenBaoStage()));//更新标题
		   taskHead.setUnitName(entity.getConstructionUnit());//更新建设单位
		   taskHead.setModifiedDate(new Date());
		   taskHead.setModifiedBy(currentUser.getUserId());
			
			if(!isManageChange){//如果是申报端修改
				taskHead.setComplete(false);
				taskHead.setProcessState(BasicDataConfig.processState_tianBao);

				taskHead.setNextProcess(BasicDataConfig.processState_MiShuFenBan);//设置下一工作流状态
				taskHead.setProcessRole(role.getId());
			}
			taskHeadRepo.save(taskHead);
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的任务"));
		}
	}
	
	/**
	 * 批复文件库处理
	 */
	public void handlePiFuFile(ShenBaoInfo shenBaoInfo){
		//获取文件库中所有的批复文件(map)
		List<ReplyFile> replyFiles = replyFileRepo.findAll();
		Map<String,Object> replyFileMap = new HashMap<String,Object>();
		replyFiles.stream().forEach(x->{
			String key = x.getNumber();//文号
			String value = x.getName();//文件名
			replyFileMap.put(key, value);
		});
		//获取项目中批复文件以及文号(map)
		Map<String,Attachment> pifuMap = new HashMap<>();
		shenBaoInfo.getAttachments().stream().forEach(x->{
			if(Util.isNotNull(x.getType())){//非空判断
				if(x.getType().equals(BasicDataConfig.attachment_type_jys)){
					pifuMap.put(shenBaoInfo.getPifuJYS_wenhao(), x);
				}
				if(x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)){
					pifuMap.put(shenBaoInfo.getPifuKXXYJBG_wenhao(), x);
				}
				if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){
					pifuMap.put(shenBaoInfo.getPifuCBSJYGS_wenhao(), x);
				}
			}
		});
		//判断项目中批复文件在文件库中是否存在
		List<Map<String,Object>> needList = Util.getCheck(pifuMap,replyFileMap);
		//更新文件库
		needList.stream().forEach(x->{
			for(String key:x.keySet()){
				Attachment obj = (Attachment)x.get(key);
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

	private TaskRecord updeteWorkFlowByretreat(TaskRecordDto dto){
		//查找到对应的任务
		Criterion criterion = Restrictions.eq(TaskHead_.relId.getName(), dto.getRelId());
		List<TaskHead> taskHeads = taskHeadRepo.findByCriteria(criterion);
		if(taskHeads !=null && taskHeads.size()>0){
			TaskHead taskHead = taskHeads.stream().findFirst().get();
			//新增一条处理流程记录
			TaskRecord taskRecord=new TaskRecord();
			taskRecordMapper.buildEntity(dto, taskRecord);
			taskRecord.setTitle(taskHead.getTitle());
			taskRecord.setNextUser(taskHead.getCreatedBy());//设置下一处理人为初始创建人
			taskRecord.setTaskId(taskHead.getId());//设置任务Id
			taskRecord.setTaskType(taskHead.getTaskType());
			taskRecord.setUnitName(taskHead.getUnitName());
			taskRecord.setProjectIndustry(taskHead.getProjectIndustry());
			//设置创建者与修改者
			taskRecord.setCreatedBy(currentUser.getUserId());
			taskRecord.setModifiedBy(currentUser.getUserId());
			
			taskHead.getTaskRecords().add(taskRecord);
			//更新任务状态
			taskHead.setProcessState(dto.getProcessState());
			taskHead.setProcessSuggestion(dto.getProcessSuggestion());
			taskHeadRepo.save(taskHead);
			return taskRecord;
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的任务"));
		}
	}
	
	private Project shenBaoChangeToProject(ShenBaoInfoDto dto,Project project){
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
}

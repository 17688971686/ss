package cs.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;
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
import cs.domain.ReplyFile;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.TaskHead;
import cs.domain.TaskHead_;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.SysService;
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
	private IRepository<ReplyFile, String> replyFileRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
	@Autowired
	private SysService sysService;
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
	@Value("${projectShenBaoStage_qianQi}")
	private String projectShenBaoStage_qianQi;//申报阶段：前期计划
	@Value("${projectShenBaoStage_newStart}")
	private String projectShenBaoStage_newStart;//申报阶段：新开工计划
	@Value("${projectShenBaoStage_xuJian}")
	private String projectShenBaoStage_xuJian;//申报阶段：续建计划
	@Value("${projectShenBaoStage_jueSuan}")
	private String projectShenBaoStage_jueSuan;//申报阶段：竣工决算
	@Value("${taskType_JYS}")
	private String taskType_JYS;//任务类型：建议书
	@Value("${taskType_KXXYJBG}")
	private String taskType_KXXYJBG;//任务类型：可行性研究报告
	@Value("${taskType_CBSJYGS}")
	private String taskType_CBSJYGS;//任务类型：初步设计与概算
	@Value("${taskType_qianQi}")
	private String taskType_qianQi;//任务类型：前期计划
	@Value("${taskType_newStart}")
	private String taskType_newStart;//任务类型：新开工计划
	@Value("${taskType_xuJian}")
	private String taskType_xuJian;//任务类型：续建计划
	@Value("${taskType_jueSuan}")
	private String taskType_jueSuan;//任务类型：竣工决算
	
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		logger.info("查询申报数据");
		return super.get(odataObj);				
	}

	@Override
	@Transactional
	public ShenBaoInfo create(ShenBaoInfoDto dto) {
		ShenBaoInfo entity=super.create(dto);
		entity.setCreatedDate(new Date());
		entity.setModifiedDate(new Date());
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
		shenBaoUnitInfo.setCreatedDate(new Date());
		shenBaoUnitInfo.setModifiedDate(new Date());
		shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedDate(new Date());
		bianZhiUnitInfo.setModifiedDate(new Date());
		bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		//设置申报信息的状态
		entity.setProcessState(BasicDataConfig.processState_tianBao);
		
		super.repository.save(entity);
		//初始化工作流
		initWorkFlow(entity);
		//处理批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("创建申报信息,项目名称 %s",entity.getProjectName()));		
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
		shenBaoUnitInfo.setCreatedDate(new Date());
		shenBaoUnitInfo.setModifiedDate(new Date());
		shenBaoUnitInfo.setCreatedBy(entity.getModifiedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		shenBaoUnitInfoRepo.delete(entity.getBianZhiUnitInfo());//删除编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedDate(new Date());
		bianZhiUnitInfo.setModifiedDate(new Date());
		bianZhiUnitInfo.setCreatedBy(entity.getModifiedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		//更新申报信息的状态
		entity.setProcessState(BasicDataConfig.processState_tianBao);
		super.repository.save(entity);
		//更新任务状态
		updeteWorkFlow(entity);
		//更新批复文件库
		handlePiFuFile(entity);
		logger.info(String.format("更新申报信息,项目名称 %s",entity.getProjectName()));		
		return entity;		
	}
	

	private String getTaskType(String shenbaoStage){
		if(shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)){//如果申报阶段：是下一年度计划
			return BasicDataConfig.taskType_nextYearPlan;
		}else if(shenbaoStage.equals(projectShenBaoStage_JYS)){//如果申报阶段：是项目建议书
			return taskType_JYS;
		}else if(shenbaoStage.equals(projectShenBaoStage_KXXYJBG)){//如果申报阶段：是可行性研究报告
			return taskType_KXXYJBG;
		}else if(shenbaoStage.equals(projectShenBaoStage_CBSJYGS)){//如果申报阶段：是初步概算与设计
			return taskType_CBSJYGS;
		}else if(shenbaoStage.equals(projectShenBaoStage_qianQi)){//如果申报阶段：是前期计划
			return taskType_qianQi;
		}else if(shenbaoStage.equals(projectShenBaoStage_newStart)){//如果申报阶段：是新开工计划
			return taskType_newStart;
		}else if(shenbaoStage.equals(projectShenBaoStage_xuJian)){//如果申报阶段：是续建计划
			return taskType_xuJian;
		}else if(shenbaoStage.endsWith(projectShenBaoStage_jueSuan)){//如果申报阶段：是竣工决算
			return taskType_jueSuan;
		}
		return "";
	}
	
	private void initWorkFlow(ShenBaoInfo shenBaoInfo){
		//获取系统配置中工作流类型的第一处理人
		 String startUser="";
		 List<SysConfigDto> configDtos=sysService.getSysConfigs();
		  Optional<SysConfigDto> systemConfigDto=configDtos.stream().filter((x)->
		  			BasicDataConfig.taskType.equals(x.getConfigType())
					&&getTaskType(shenBaoInfo.getProjectShenBaoStage()).equals(x.getConfigName()
							)
					).findFirst();
		  
		   if(systemConfigDto.isPresent()){
			   startUser=systemConfigDto.get().getConfigValue();
		   }
		   
		
		//创建工作流
		TaskHead taskHead=new TaskHead();
		taskHead.setId(UUID.randomUUID().toString());
		//设置任务标题格式为：“项目申报：项目名称--申报阶段”
		taskHead.setTitle("项目申报："+shenBaoInfo.getProjectName()+"--"+basicDataService.getDescriptionById(shenBaoInfo.getProjectShenBaoStage()));
		taskHead.setNextUser(startUser);//设置下一处理人
		taskHead.setRelId(shenBaoInfo.getId());//设置关联的id
		taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态
		taskHead.setProcessSuggestion("材料填报");//设置处理意见
		taskHead.setTaskType(this.getTaskType(shenBaoInfo.getProjectShenBaoStage()));//设置工作流的类型
		taskHead.setUnitName(shenBaoInfo.getUnitName());//设置建设单位
		taskHead.setProjectIndustry(shenBaoInfo.getProjectIndustry());//设置项目行业
		taskHead.setCreatedBy(currentUser.getLoginName());
		taskHead.setModifiedBy(currentUser.getLoginName());
				
		//record
		TaskRecord taskRecord=new TaskRecord();
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setTitle(taskHead.getTitle());
		taskRecord.setNextUser(startUser);//设置下一处理人
		taskRecord.setRelId(taskHead.getRelId());//设置关联id
		taskRecord.setTaskId(taskHead.getId());//设置任务Id
		taskRecord.setProcessState(taskHead.getProcessState());//设置工作流的状态
		taskRecord.setTaskType(taskHead.getTaskType());//设置工作流的类型
		taskRecord.setProcessSuggestion("材料填报");//设置处理意见
		taskRecord.setUnitName(taskHead.getUnitName());//设置建设单位
		taskRecord.setProjectIndustry(taskHead.getProjectIndustry());//设置项目行业
		taskRecord.setCreatedBy(currentUser.getLoginName());
		taskRecord.setModifiedBy(currentUser.getLoginName());

		taskHead.getTaskRecords().add(taskRecord);
		taskHeadRepo.save(taskHead);
	}
	
	private void updeteWorkFlow(ShenBaoInfo entity){
		//查找到对应的任务
		Criterion criterion = Restrictions.eq(TaskHead_.relId.getName(), entity.getId());
		TaskHead taskHead = taskHeadRepo.findByCriteria(criterion).stream().findFirst().get();
						
		//添加一条流转记录
		//获取系统配置中工作流类型的第一处理人
		String startUser="";
	    List<SysConfigDto> configDtos=sysService.getSysConfigs();
	    Optional<SysConfigDto> systemConfigDto=configDtos.stream().filter((x)->
	  			BasicDataConfig.taskType.equals(x.getConfigType())
				&&getTaskType(entity.getProjectShenBaoStage()).equals(x.getConfigName()
							)
					).findFirst();
				  
	   if(systemConfigDto.isPresent()){
		   startUser=systemConfigDto.get().getConfigValue();
	   }
						
		TaskRecord taskRecord=new TaskRecord();
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setTitle(taskHead.getTitle());
		taskRecord.setNextUser(startUser);//设置下一处理人
		taskRecord.setRelId(entity.getId());
		taskRecord.setTaskId(taskHead.getId());//设置任务Id
		taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
		taskRecord.setTaskType(this.getTaskType(entity.getProjectShenBaoStage()));
		taskRecord.setProcessSuggestion("材料填报");
		taskRecord.setUnitName(entity.getUnitName());
		taskRecord.setProjectIndustry(entity.getProjectIndustry());
		taskRecord.setCreatedBy(currentUser.getLoginName());
		taskRecord.setModifiedBy(currentUser.getLoginName());
						
		taskHead.getTaskRecords().add(taskRecord);
		//更新任务的状态以及是否完成
		taskHead.setComplete(false);
		taskHead.setProcessState(BasicDataConfig.processState_tianBao);
		taskHeadRepo.save(taskHead);
	}
	
	/**
	 * 批复文件库处理
	 */
	public void handlePiFuFile(ShenBaoInfo shenBaoInfo){
		//获取文件库中所有的批复文件(map)
		List<ReplyFile> replyFiles = replyFileRepo.findAll();
		Map<String,Object> replyFileMap = new HashMap();
		replyFiles.stream().forEach(x->{
			String key = x.getNumber();//文号
			String value = x.getName();//文件名
			replyFileMap.put(key, value);
		});
		//获取项目中批复文件以及文号(map)
		Map<String,Attachment> pifuMap = new HashMap<>();
		shenBaoInfo.getAttachments().stream().forEach(x->{
			if(x.getType() !=null && !x.getType().isEmpty()){//非空判断
				if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs) ||
						x.getType().equals(BasicDataConfig.attachment_type_jys) ||
						x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)
						){
					if(x.getType().equals(BasicDataConfig.attachment_type_jys)){
						pifuMap.put(shenBaoInfo.getPifuJYS_wenhao(), x);
					}
					else if(x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)){
						pifuMap.put(shenBaoInfo.getPifuKXXYJBG_wenhao(), x);
					}
					else if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){
						pifuMap.put(shenBaoInfo.getPifuCBSJYGS_wenhao(), x);
					}
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
}

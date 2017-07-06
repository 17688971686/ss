package cs.service.impl;

import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.Attachment;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoUnitInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.framework.SysService;
import cs.service.interfaces.ShenBaoInfoService;


@Service
public class ShenBaoInfoServiceImpl extends AbstractServiceImpl<ShenBaoInfoDto, ShenBaoInfo, String> implements ShenBaoInfoService {
	private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);
	
	@Autowired
	private SysService sysService;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private IRepository<TaskHead, String> taskHeadRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IMapper<ShenBaoUnitInfoDto, ShenBaoUnitInfo> shenBaoUnitInfoMapper;
	@Autowired
	private IRepository<ShenBaoUnitInfo, String> shenBaoUnitInfoRepo;
	
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
			attachment.setCreatedBy(entity.getCreatedBy());
			attachment.setModifiedBy(entity.getModifiedBy());
			entity.getAttachments().add(attachmentMapper.buildEntity(x, attachment));
		});
		//申报单位
		ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
		ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		shenBaoUnitInfo.setCreatedBy(entity.getCreatedBy());
		shenBaoUnitInfo.setModifiedBy(entity.getModifiedBy());
		shenBaoUnitInfo.setModifiedDate(entity.getModifiedDate());
		shenBaoUnitInfo.setCreatedDate(entity.getCreatedDate());
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		bianZhiUnitInfo.setCreatedBy(entity.getCreatedBy());
		bianZhiUnitInfo.setModifiedBy(entity.getModifiedBy());
		bianZhiUnitInfo.setModifiedDate(entity.getModifiedDate());
		bianZhiUnitInfo.setCreatedDate(entity.getCreatedDate());
		entity.setBianZhiUnitInfo(bianZhiUnitInfo);
		
		super.repository.save(entity);
		//初始化工作流
		initWorkFlow(entity);
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
			entity.getAttachments().add(attachmentMapper.buildEntity(x, new Attachment()));
		});
		//申报单位
		shenBaoUnitInfoRepo.delete(entity.getShenBaoUnitInfo());//删除申报单位
		ShenBaoUnitInfoDto shenBaoUnitInfoDto = dto.getShenBaoUnitInfoDto();
		ShenBaoUnitInfo shenBaoUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(shenBaoUnitInfoDto,shenBaoUnitInfo);
		entity.setShenBaoUnitInfo(shenBaoUnitInfo);
		//编制单位
		shenBaoUnitInfoRepo.delete(entity.getBianZhiUnitInfo());//删除申报单位
		ShenBaoUnitInfoDto bianZhiUnitInfoDto = dto.getBianZhiUnitInfoDto();
		ShenBaoUnitInfo bianZhiUnitInfo = new ShenBaoUnitInfo();
		shenBaoUnitInfoMapper.buildEntity(bianZhiUnitInfoDto,bianZhiUnitInfo);
		entity.setShenBaoUnitInfo(bianZhiUnitInfo);
			
		super.repository.save(entity);
		initWorkFlow(entity);
		logger.info(String.format("更新申报信息,项目名称 %s",entity.getProjectName()));			
		return entity;		
	}
	
	
	private String getTaskType(String shenbaoStage){
		if(shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)){//如果是下一年度计划
			return BasicDataConfig.taskType_nextYearPlan;
		}
		return "";
	}
	
	private void initWorkFlow(ShenBaoInfo shenBaoInfo){
		//获取系统配置中工作流类型的第一处理人
		 String startUser="";
		 List<SysConfigDto> configDtos=sysService.getSysConfigs();
		  Optional<SysConfigDto> systemConfigDto=	configDtos.stream().filter((x)->
		  			BasicDataConfig.taskType.equals(x.getConfigType())
					&&getTaskType(shenBaoInfo.getProjectShenBaoStage()).equals(x.getConfigName()
							)
					).findFirst();
		  
		   if(systemConfigDto.isPresent()){
			   startUser=systemConfigDto.get().getConfigValue();
		   }
		   
		
		//创建工作流
		TaskHead taskHead=new TaskHead();
		taskHead.setUserName(startUser);//设置下一处理人
		taskHead.setCreatedBy(currentUser.getLoginName());
		taskHead.setModifiedBy(currentUser.getLoginName());
		taskHead.setRelId(shenBaoInfo.getId());
		taskHead.setTitle("项目申报："+shenBaoInfo.getProjectName());
		taskHead.setProcessState(BasicDataConfig.processState_tianBao);//设置工作流的状态
		taskHead.setTaskType(this.getTaskType(shenBaoInfo.getProjectShenBaoStage()));//设置工作流的类型
		taskHead.setId(UUID.randomUUID().toString());
				
		//record
		TaskRecord taskRecord=new TaskRecord();
		taskRecord.setUserName(currentUser.getLoginName());
		taskRecord.setCreatedBy(currentUser.getLoginName());
		taskRecord.setModifiedBy(currentUser.getLoginName());
		taskRecord.setRelId(shenBaoInfo.getId());
		taskRecord.setTitle("项目申报："+shenBaoInfo.getProjectName());
		taskRecord.setProcessState(BasicDataConfig.processState_tianBao);
		taskRecord.setTaskType(this.getTaskType(shenBaoInfo.getProjectShenBaoStage()));
		taskRecord.setId(UUID.randomUUID().toString());
		taskRecord.setProcessSuggestion("材料填报");

		taskHead.getTaskRecords().add(taskRecord);
		taskHeadRepo.save(taskHead);
	}
}

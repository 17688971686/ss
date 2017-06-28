package cs.service.impl;

import java.util.ArrayList;
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
import cs.domain.ShenBaoInfo;
import cs.domain.TaskHead;
import cs.domain.TaskRecord;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
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
	IRepository<TaskHead, String> taskHeadRepo;
	
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
		//todo
		
		super.repository.save(entity);
		//初始化工作流
		initWorkFlow(entity);
		logger.info(String.format("创建申报信息,项目名称 %s",entity.getProjectName()));		
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

	@Override
	@Transactional
	public ShenBaoInfo update(ShenBaoInfoDto dto,String id) {
		ShenBaoInfo entity=super.update(dto,id);
		//todo
		
		super.repository.save(entity);
		initWorkFlow(entity);
		logger.info(String.format("更新申报信息,项目名称 %s",entity.getProjectName()));			
		return entity;		
	}
	
	
	
	

}

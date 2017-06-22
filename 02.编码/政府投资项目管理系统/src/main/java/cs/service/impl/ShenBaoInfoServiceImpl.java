package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

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
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.TaskHeadService;

@Service
public class ShenBaoInfoServiceImpl implements ShenBaoInfoService {
	private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoMapper;	
	@Autowired
	private ShenBaoInfoRepo shenBaoInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private TaskHeadService taskHeadService;
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
		shenBaoInfoRepo.findByOdata(odataObj).forEach(x->{			
			ShenBaoInfoDto shenBaoInfoDto=shenbaoMapper.toDto(x);
			//获取项目相关类型的名称
			shenBaoInfoDto.setProjectClassifyDesc(basicDataService.getDescriptionById(x.getProjectClassify()));//项目分类名称
			shenBaoInfoDto.setProjectIndustryDesc(basicDataService.getDescriptionById(x.getProjectIndustry()));//项目行业领域名称
			shenBaoInfoDto.setProjectTypeDesc(basicDataService.getDescriptionById(x.getProjectType()));//项目类型名称
			shenBaoInfoDto.setProjectCategoryDesc(basicDataService.getDescriptionById(x.getProjectCategory()));//项目类别名称
			shenBaoInfoDto.setProjectStageDesc(basicDataService.getDescriptionById(x.getProjectStage()));//项目阶段名称
			shenBaoInfoDto.setProjectConstrCharDesc(basicDataService.getDescriptionById(x.getProjectConstrChar()));//项目建设性质名称
			shenBaoInfoDto.setProjectShenBaoStageDesc(basicDataService.getDescriptionById(x.getProjectShenBaoStage()));//项目申报阶段名称
			shenBaoInfoDto.setCapitalOtherTypeDesc(basicDataService.getDescriptionById(x.getCapitalOtherType()));//资金其他来源名称
			//获取单位相关类型的名称
			shenBaoInfoDto.getShenBaoUnitInfoDto().setUnitPropertyDesc(basicDataService.getDescriptionById(x.getShenBaoUnitInfo().getUnitProperty()));
			shenBaoInfoDto.getShenBaoUnitInfoDto().setDivisionDesc(basicDataService.getDescriptionById(x.getShenBaoUnitInfo().getDivisionId()));
			shenBaoInfoDto.getBianZhiUnitInfoDto().setUnitPropertyDesc(basicDataService.getDescriptionById(x.getBianZhiUnitInfo().getUnitProperty()));
			shenBaoInfoDto.getBianZhiUnitInfoDto().setDivisionDesc(basicDataService.getDescriptionById(x.getBianZhiUnitInfo().getDivisionId()));
			
			shenBaoInfoDtos.add(shenBaoInfoDto);			
		});
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenBaoInfoDtos);
		logger.info("查询申报数据");
		return pageModelDto;	
	}

	@Override
	@Transactional
	public void createShenBaoInfo(ShenBaoInfoDto shenBaoInfoDto) {
		//进行数据转换
		ShenBaoInfo shenBaoInfo = new ShenBaoInfo();
		shenbaoMapper.buildEntity(shenBaoInfoDto, shenBaoInfo);
		String loginName = currentUser.getLoginName();		
		shenBaoInfo.setCreatedBy(loginName);
		shenBaoInfo.setModifiedBy(loginName);
		
		//创建一条申报信息的同时新建一条任务
		TaskHeadDto taskHeadDto = new TaskHeadDto();
		taskHeadDto.setCreatedBy(loginName);
		taskHeadDto.setModifiedBy(loginName);
		taskHeadDto.setProcessState(BasicDataConfig.processState_JSDWTB);//设置任务的状态为建设单位填报
		taskHeadDto.setRelId(shenBaoInfo.getId());//同步关联上申报信息的id
		//TODO 根据申报阶段设置任务类型
		if(BasicDataConfig.projectShenBaoStage_nextYearPlan.equals(shenBaoInfoDto.getProjectShenBaoStage())){
			taskHeadDto.setTaskType(BasicDataConfig.task_yearPlan);//设置任务类型
		}		
		taskHeadDto.setTitle("申报信息："+shenBaoInfo.getProjectName()+"--"+basicDataService.getDescriptionById(shenBaoInfoDto.getProjectShenBaoStage()));
		taskHeadDto.setUserName("admin");//TODO 设置下一处理人
		
		//给新建的任务创建一条流转记录
		TaskRecordDto taskRecordDto = new TaskRecordDto();
		taskRecordDto.setCreatedBy(loginName);
		taskRecordDto.setModifiedBy(loginName);
		taskRecordDto.setProcessState(BasicDataConfig.processState_JSDWTB);
		taskRecordDto.setProcessSuggestion("建设单位填报信息");
		taskRecordDto.setRelId(shenBaoInfo.getId());
		taskRecordDto.setTaskType(taskHeadDto.getTaskType());
		taskRecordDto.setTitle(taskHeadDto.getTitle());
		taskRecordDto.setUserName("admin");//TODO 设置下一处理人
		
		taskHeadDto.getTaskRecordDtos().add(taskRecordDto);
		
		taskHeadService.create(taskHeadDto);
		
		shenBaoInfoRepo.save(shenBaoInfo);
		logger.info(String.format("创建申报信息,项目名称 %s",shenBaoInfoDto.getProjectName()));		
	}

	@Override
	@Transactional
	public void updateShenBaoInfo(ShenBaoInfoDto shenBaoInfoDto) {
		//根据id查找到到此申报信息
		ShenBaoInfo findShenBaoInfo = shenBaoInfoRepo.findById(shenBaoInfoDto.getId());
		//清空附件
		findShenBaoInfo.getAttachments().clear();
		//进行数据转换
		shenbaoMapper.buildEntity(shenBaoInfoDto, findShenBaoInfo);
		//设置修改人
		String longinName = currentUser.getLoginName();
		findShenBaoInfo.setModifiedBy(longinName);
		findShenBaoInfo.setModifiedDate(new Date());
		//保存数据
		shenBaoInfoRepo.save(findShenBaoInfo);
		logger.info(String.format("更新申报信息,项目名称 %s",shenBaoInfoDto.getProjectName()));
	}
	
	
	
	

}

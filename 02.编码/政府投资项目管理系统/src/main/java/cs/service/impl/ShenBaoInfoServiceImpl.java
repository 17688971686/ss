package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
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
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.interfaces.TaskHeadRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.framework.SysService;
import cs.service.interfaces.ShenBaoInfoService;


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
	private SysService sysService;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	TaskHeadRepo taskHeadRepo;
	
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
			shenBaoInfoDto.setProjectFunctionClassifyDesc(basicDataService.getDescriptionById(x.getProjectFunctionClassify()));//功能分类科目名称
			shenBaoInfoDto.setProjectGoverEconClassifyDesc(basicDataService.getDescriptionById(x.getProjectGoverEconClassify()));//政府经济分类科目名称
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
		shenBaoInfoRepo.save(shenBaoInfo);
		
		//初始化工作流
		initWorkFlow(shenBaoInfo);
		
		logger.info(String.format("创建申报信息,项目名称 %s",shenBaoInfoDto.getProjectName()));		
	}
	private String getTaskType(String shenbaoStage){
		if(shenbaoStage.equals(BasicDataConfig.projectShenBaoStage_nextYearPlan)){//如果是下一年度计划
			return BasicDataConfig.taskType_nextYearPlan;
		}
		return "";
	}
	
	private void initWorkFlow(ShenBaoInfo shenBaoInfo){
		//获取系统配置中工作流类型的第一处理人
		String configValue = sysService.getConfigValue(
				this.getTaskType(shenBaoInfo.getProjectShenBaoStage())).getConfigValue();
		//创建工作流
		TaskHead taskHead=new TaskHead();		
		taskHead.setUserName(configValue);//设置下一处理人
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
		initWorkFlow(findShenBaoInfo);
		logger.info(String.format("更新申报信息,项目名称 %s",shenBaoInfoDto.getProjectName()));
	}
	
	
	
	

}

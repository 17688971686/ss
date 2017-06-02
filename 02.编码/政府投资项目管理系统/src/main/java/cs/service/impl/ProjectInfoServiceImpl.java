package cs.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.ProjectInfo;
import cs.domain.ProjectInfo_;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectInfoDto;
import cs.model.DomainDto.UnitInfoDto;
import cs.model.DtoMapper.ProjectInfoMapper;
import cs.repository.interfaces.ProjectInfoRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ProjectInfoService;


/**
 * @Description: 
 * @author: cx
 * @Date：2017年5月10日
 * @version：0.1
 */
@Service
public class ProjectInfoServiceImpl implements ProjectInfoService{
	private static Logger logger = Logger.getLogger(ProjectInfoServiceImpl.class);
	//依赖注入持久层
	@Autowired
	private ProjectInfoRepo projectInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ICurrentUser currentUser;
	
	/**
	 * 查询项目的信息集合
	 */
	@Override
	@Transactional
	public PageModelDto<ProjectInfoDto> get(ODataObj odataObj) {
		//通过条件查询出申报项目的信息
		 List<ProjectInfo> projectInfoList = projectInfoRepo.findByOdata(odataObj);
		 List<ProjectInfoDto> projectInfoDtoList = new ArrayList<>();
		 projectInfoList.forEach(x->{
			ProjectInfoDto projectInfoDto = ProjectInfoMapper.toDto(x);
			projectInfoDto.setProjectStageValue(basicDataService.getDescriptionById(x.getProjectStage()));//获取申报阶段的名称
			projectInfoDto.setInvestTypeValue(basicDataService.getDescriptionById(x.getInvestType()));//获取投资类型的名称
			projectInfoDto.setProjectStatusValue(basicDataService.getDescriptionById(x.getProjectStatus()));//获取项目状态的名称
			projectInfoDto.setProjectClassifyValue(basicDataService.getDescriptionById(x.getProjectClassify()));//获取项目分类的名称
			projectInfoDto.setIndustryValue(basicDataService.getDescriptionById(x.getIndustry()));//获取国民经济分类的名称
			projectInfoDto.setProjectIndustryValue(basicDataService.getDescriptionById(x.getProjectIndustry()));//获取项目行业归口名称
			projectInfoDto.setProjectTypeValue(basicDataService.getDescriptionById(x.getProjectType()));//获取项目类型的名称
			projectInfoDto.setProjectStatusValue(basicDataService.getDescriptionById(x.getProjectStatus()));//获取项目状态的名称
			projectInfoDto.setJianSheXingZhiValue(basicDataService.getDescriptionById(x.getJianSheXingZhi()));//获取建设性质的名称
			
			UnitInfoDto shenBaoUnit =projectInfoDto.getShenBaoUnitDto();			
			shenBaoUnit.setUnitPropertyValue(basicDataService.getDescriptionById(shenBaoUnit.getUnitProperty()));//获取单位性质的名称
			
			//获取月报相关类型的名称
			List<MonthReportDto> monthReportDtos = projectInfoDto.getMonthReportDtos();
			monthReportDtos.forEach(y->{
//				y.setProposalsTypeDisplay(basicDataService.getDescriptionById(y.getProposalsType()));//获取项目建议书批复类型名称
//				y.setReportTypeDisplay(basicDataService.getDescriptionById(y.getReportType()));//获取可行性研究报告批复类型名称
//				y.setAllEstimateTypeDisplay(basicDataService.getDescriptionById(y.getAllEstimateType()));//获取总概算批复类型名称
//				y.setSelfReviewDisplay(basicDataService.getDescriptionById(y.getSelfReview()));//获取项目进度安排名称
			});
			
			List<AttachmentDto> attachmentDtos = projectInfoDto.getAttachmentDtos();
			attachmentDtos.forEach(y->{				
				y.setTypeValue(basicDataService.getDescriptionById(y.getType()));//获取附件类型名称
			});			
				
			projectInfoDtoList.add(projectInfoDto);
		 });
		 
		
		PageModelDto<ProjectInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(projectInfoDtoList);
		return pageModelDto;		
	}

	/**
	 * @descripted 删除项目信息
	 * @param id 项目编号
	 * @author cx
	 * @date 2017-05-17
	 */
	@Override
	@Transactional
	public void deleteProjectInfo(String id) {
		ProjectInfo projectInfo = projectInfoRepo.findById(id);
		if (projectInfo != null) {			
				projectInfoRepo.delete(projectInfo);
				logger.info("删除项目信息");
			}					
	}

	/**
	 * @descripted 批量删除项目信息
	 * @param ids 项目编号
	 * @author cx
	 * @date 2017-05-17
	 */
	@Override
	@Transactional
	public void deleteProjectInfos(String[] ids) {
		for (String id : ids) {
			this.deleteProjectInfo(id);
		}
		logger.info("批量删除项目信息");		
	}

	/**
	 * @descripted 更新项目信息
	 * @param projectInfoDto 项目数据对象
	 * @author cx
	 * @date 2017-05-17
	 */
	@Override
	@Transactional
	public void updateProjectInfo(ProjectInfoDto projectInfoDto) {
		ProjectInfo projectInfo = projectInfoRepo.findById(projectInfoDto.getId());		
		
//		//进行数据的转换
//		projectInfo = DtoFactory.projectInfoDtoToprojectInfo(projectInfoDto);
//		projectInfo.setIndustry(projectInfoDto.getIndustry());//国民经济行业分类(代码)		
//		projectInfo.setProjectIndustry(projectInfoDto.getProjectIndustry());//项目行业归口(代码)
//		//获取当前登录用户设置修改人
//		projectInfo.setModifiedBy(currentUser.getLoginName());
		projectInfoRepo.save(projectInfo);
		logger.info("更新项目信息");
	}

	/**
	 * @descripted 创建项目信息
	 * @param projectInfoDto 项目数据对象
	 * @author cx
	 * @date 2017-05-17
	 */
	@Override
	@Transactional
	public void createProjectInfo(ProjectInfoDto projectInfoDto) {
		//通过项目代码查找项目
		Criterion criterion=Restrictions.eq(ProjectInfo_.projectNumber.getName(), projectInfoDto.getId());
		Optional<ProjectInfo> findProjectInfo = projectInfoRepo.findByCriteria(criterion).stream().findFirst();
		if(findProjectInfo.isPresent()){
			throw new IllegalArgumentException(String.format("项目：%s 已经存在,请重新输入！", projectInfoDto.getProjectName()));
		}else{
			ProjectInfo projectInfo = new ProjectInfo();
			//进行数据转换
			ProjectInfoMapper.buildEntity(projectInfoDto,projectInfo);
			
			//设置创建人和修改人
			String longinName = currentUser.getLoginName();
			projectInfo.setCreatedBy(longinName);
			projectInfo.setModifiedBy(longinName);
			//保存数据
			projectInfoRepo.save(projectInfo);
			logger.info("创建项目信息");
		}
		
	}
}

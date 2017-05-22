package cs.service.shenbaoAdmin;

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
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.ProjectInfo;
import cs.domain.ProjectInfo_;
import cs.domain.UnitInfo;
import cs.model.PageModelDto;
import cs.model.management.AttachmentDto;
import cs.model.management.BasicDataDto;
import cs.model.management.ProjectInfoDto;
import cs.model.management.UnitInfoDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.shenbaoAdmin.ProjectInfoRepo;
import cs.service.common.BasicDataService;


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
		 List<BasicDataDto> basicDataDtos=basicDataService.Get(null);
		 
		 
		 projectInfoList.forEach(x->{
			ProjectInfoDto projectInfoDto = DtoFactory.projectInfoToprojectInfoDto(x);
			projectInfoDto.setProjectStageValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectStage()));//获取申报阶段的名称
			projectInfoDto.setInvestTypeValue(basicDataService.GetDescriptionById(basicDataDtos,x.getInvestType()));//获取投资类型的名称
			projectInfoDto.setProjectStatusValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectStatus()));//获取项目状态的名称
			projectInfoDto.setProjectClassifyValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectClassify()));//获取项目分类的名称
			projectInfoDto.setIndustryValue(basicDataService.GetDescriptionById(basicDataDtos,x.getIndustry()));//获取国民经济分类的名称
			projectInfoDto.setProjectIndustryValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectIndustry()));//获取项目行业归口名称
			projectInfoDto.setProjectTypeValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectType()));//获取项目类型的名称
			projectInfoDto.setProjectStatusValue(basicDataService.GetDescriptionById(basicDataDtos,x.getProjectStatus()));//获取项目状态的名称
			projectInfoDto.setJianSheXingZhiValue(basicDataService.GetDescriptionById(basicDataDtos,x.getJianSheXingZhi()));//获取建设性质的名称
			
			UnitInfoDto shenBaoUnit =projectInfoDto.getShenBaoUnit();			
			shenBaoUnit.setUnitPropertyValue(basicDataService.GetDescriptionById(basicDataDtos,shenBaoUnit.getUnitProperty()));//获取单位性质的名称
			
			
			List<AttachmentDto> attachmentDtos = projectInfoDto.getAttachmentDtos();
			attachmentDtos.forEach(y->{				
				y.setTypeValue(basicDataService.GetDescriptionById(basicDataDtos,y.getType()));//获取附件类型名称
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
			projectInfo = DtoFactory.projectInfoDtoToprojectInfo(projectInfoDto);
			projectInfo.setIndustry(projectInfoDto.getIndustry());//国民经济行业分类(代码)		
			projectInfo.setProjectIndustry(projectInfoDto.getProjectIndustry());//项目行业归口(代码)
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

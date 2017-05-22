package cs.service.shenbaoAdmin;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.ProjectInfo;
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
	
}

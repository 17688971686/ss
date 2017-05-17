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
		 if(projectInfoList != null){
			//将对象进行数据转换			
				for (ProjectInfo projectInfoEntity : projectInfoList){	
					ProjectInfoDto projectInfoDto = DtoFactory.projectInfoToprojectInfoDto(projectInfoEntity);
					//设置类型的value值
					projectInfoDto.setProjectStageValue(basicDataService.queryValueById(projectInfoEntity.getProjectStage()));//获取申报阶段的名称
					projectInfoDto.setInvestTypeValue(basicDataService.queryValueById(projectInfoEntity.getInvestType()));//获取投资类型的名称
					projectInfoDto.setProjectStatusValue(basicDataService.queryValueById(projectInfoEntity.getProjectStatus()));//获取项目状态的名称
					projectInfoDto.setProjectClassifyValue(basicDataService.queryValueById(projectInfoEntity.getProjectClassify()));//获取项目分类的名称
					projectInfoDto.setIndustryValue(basicDataService.queryValueById(projectInfoEntity.getIndustry()));//获取国民经济分类的名称
					projectInfoDto.setProjectIndustryValue(basicDataService.queryValueById(projectInfoEntity.getProjectIndustry()));//获取项目行业归口名称
					projectInfoDto.setProjectTypeValue(basicDataService.queryValueById(projectInfoEntity.getProjectType()));//获取项目类型的名称
					projectInfoDto.setProjectStatusValue(basicDataService.queryValueById(projectInfoEntity.getProjectStatus()));//获取项目状态的名称
					projectInfoDto.setJianSheXingZhiValue(basicDataService.queryValueById(projectInfoEntity.getJianSheXingZhi()));//获取建设性质的名称
					
					UnitInfoDto shenBaoUnit = (UnitInfoDto) projectInfoDto.getShenBaoUnit();
					shenBaoUnit.setUnitPropertyValue(basicDataService.queryValueById(shenBaoUnit.getUnitProperty()));//获取单位性质的名称
					projectInfoDto.setShenBaoUnit(shenBaoUnit);
					
					List<AttachmentDto> attachmentDtos = projectInfoDto.getAttachmentDtos();
					if(attachmentDtos != null && attachmentDtos.size()>0){
						for(AttachmentDto attachmentDto:attachmentDtos){
							attachmentDto.setTypeValue(basicDataService.queryValueById(attachmentDto.getType()));//获取附件类型名称
						}
					}
					projectInfoDto.setAttachmentDtos(attachmentDtos);
					
					
					projectInfoDtoList.add(projectInfoDto);
				}		 																																																														
		}
		PageModelDto<ProjectInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(projectInfoDtoList);
		return pageModelDto;		
	}
	
}

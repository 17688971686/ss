package cs.model.DtoMapper;

import java.util.UUID;

import cs.domain.Attachment;
import cs.domain.Project;
import cs.model.DomainDto.ProjectDto;

public class ProjectMapper {
	public static ProjectDto toDto(Project project){
		ProjectDto projectDto=new ProjectDto();
		if(project!=null){
			projectDto.setId(project.getId());
			projectDto.setProjectName(project.getProjectName());
			projectDto.setProjectNumber(project.getProjectNumber());
			projectDto.setProjectStage(project.getProjectStage());
			projectDto.setProjectClassify(project.getProjectClassify());
			projectDto.setProjectIndustry(project.getProjectIndustry());
			projectDto.setProjectType(project.getProjectType());
			projectDto.setProjectCategory(project.getProjectCategory());
			projectDto.setProjectFunctionClassify(project.getProjectFunctionClassify());
			projectDto.setProjectGoverEconClassify(project.getProjectGoverEconClassify());
			projectDto.setProjectInvestSum(project.getProjectInvestSum());
			projectDto.setProjectInvestAccuSum(project.getProjectInvestAccuSum());
			projectDto.setProjectAddress(project.getProjectAddress());			
			projectDto.setProjectIntro(project.getProjectIntro());
			projectDto.setProjectGuiMo(project.getProjectGuiMo());
			projectDto.setRemark(project.getRemark());
			projectDto.setEndDate(project.getEndDate());
			projectDto.setBeginDate(project.getBeginDate());
			projectDto.setUnitName(project.getUnitName());
			
			
			projectDto.setCapitalQCZ_gtzj(project.getCapitalQCZ_gtzj());
			projectDto.setCapitalQCZ_ggys(project.getCapitalQCZ_ggys());
			projectDto.setCapitalSCZ_gtzj(project.getCapitalSCZ_gtzj());
			projectDto.setCapitalSCZ_ggys(project.getCapitalSCZ_ggys());
			projectDto.setCapitalSCZ_zxzj(project.getCapitalSCZ_zxzj());
			projectDto.setCapitalSHTZ(project.getCapitalSHTZ());			
			projectDto.setCapitalOther(project.getCapitalOther());
			projectDto.setCapitalOtherType(project.getCapitalOtherType());
			projectDto.setCapitalOtherDescription(project.getCapitalOtherDescription());
			
			projectDto.setPifuCBSJYGS_date(project.getPifuCBSJYGS_date());
			projectDto.setPifuKXXYJBG_date(project.getPifuKXXYJBG_date());
			projectDto.setPifuJYS_date(project.getPifuJYS_date());
			projectDto.setPifuCBSJYGS_wenhao(project.getPifuCBSJYGS_wenhao());
			projectDto.setPifuKXXYJBG_wenhao(project.getPifuKXXYJBG_wenhao());
			projectDto.setPifuJYS_wenhao(project.getPifuJYS_wenhao());
			
			projectDto.setModifiedDate(project.getModifiedDate());
			projectDto.setModifiedBy(project.getModifiedBy());
			projectDto.setCreatedBy(project.getCreatedBy());
			projectDto.setCreatedDate(project.getCreatedDate());
			projectDto.setItemOrder(project.getItemOrder());
						
			//begin#关联信息
			//附件
			project.getAttachments().stream().forEach(x->{
				projectDto.getAttachmentDtos().add(AttachmentMapper.toDto(x));				
			});
			//月报
			project.getMonthReports().stream().forEach(x->{
				projectDto.getMonthReportDtos().add(MonthReportMapper.toDto(x));
			});
			
		}
		return projectDto;
	}
	
	public static void buildEntity(ProjectDto projectDto,Project project){
		if(projectDto!=null&&project!=null){
			if(project.getId()==null||project.getId().isEmpty()){
				project.setId(UUID.randomUUID().toString());
			}
			//TODO 需要完成项目代码的格式设计
			if(project.getProjectNumber()==null||project.getProjectNumber().isEmpty()){
				project.setProjectNumber(UUID.randomUUID().toString());
			}
			project.setUnitName(projectDto.getUnitName());
			project.setProjectName(projectDto.getProjectName());
			project.setProjectInvestSum(projectDto.getProjectInvestSum());
			project.setProjectInvestAccuSum(projectDto.getProjectInvestAccuSum());
			project.setProjectAddress(projectDto.getProjectAddress());
			project.setProjectStage(projectDto.getProjectStage());
			project.setProjectClassify(projectDto.getProjectClassify());
			project.setProjectIndustry(projectDto.getProjectIndustry());
			project.setProjectType(projectDto.getProjectType());
			project.setProjectFunctionClassify(projectDto.getProjectFunctionClassify());
			project.setProjectGoverEconClassify(projectDto.getProjectGoverEconClassify());
			project.setProjectCategory(projectDto.getProjectCategory());
			project.setProjectIntro(projectDto.getProjectIntro());
			project.setProjectGuiMo(projectDto.getProjectGuiMo());			
			project.setEndDate(projectDto.getEndDate());
			project.setBeginDate(projectDto.getBeginDate());
			project.setRemark(projectDto.getRemark());
			
			project.setCapitalQCZ_gtzj(projectDto.getCapitalQCZ_gtzj());
			project.setCapitalQCZ_ggys(projectDto.getCapitalQCZ_ggys());
			project.setCapitalSCZ_gtzj(projectDto.getCapitalSCZ_gtzj());
			project.setCapitalSCZ_ggys(projectDto.getCapitalSCZ_ggys());
			project.setCapitalSCZ_zxzj(projectDto.getCapitalSCZ_zxzj());
			project.setCapitalSHTZ(projectDto.getCapitalSHTZ());			
			project.setCapitalOther(projectDto.getCapitalOther());
			project.setCapitalOtherType(projectDto.getCapitalOtherType());
			project.setCapitalOtherDescription(projectDto.getCapitalOtherDescription());
			
			project.setPifuCBSJYGS_date(projectDto.getPifuCBSJYGS_date());
			project.setPifuJYS_date(projectDto.getPifuJYS_date());			
			project.setPifuKXXYJBG_date(projectDto.getPifuKXXYJBG_date());
			project.setPifuJYS_wenhao(projectDto.getPifuJYS_wenhao());
			project.setPifuKXXYJBG_wenhao(projectDto.getPifuKXXYJBG_wenhao());
			project.setPifuCBSJYGS_wenhao(projectDto.getPifuCBSJYGS_wenhao());
			
			project.setModifiedDate(projectDto.getModifiedDate());
			project.setModifiedBy(projectDto.getModifiedBy());
			project.setCreatedBy(projectDto.getCreatedBy());
			project.setCreatedDate(projectDto.getCreatedDate());
			project.setItemOrder(projectDto.getItemOrder());
			
			project.setAttachments(projectDto.getAttachments());
						
			//begin#关联信息
			//附件			
			projectDto.getAttachmentDtos().stream().forEach(x->{
				Attachment attachment=new Attachment();
				AttachmentMapper.buildEntity(x, attachment);
				project.getAttachments().add(attachment);
			});			
		}
	}
}

package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.Project;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectDto;
@Component
public class ProjectMapper implements IMapper<ProjectDto, Project>  {
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	IMapper<MonthReportDto, MonthReport> monthReportMapper;
	
	public  ProjectDto toDto(Project project){
		ProjectDto projectDto=new ProjectDto();
		if(project!=null){
			projectDto.setUnitName(project.getUnitName());
			projectDto.setProjectName(project.getProjectName());
			projectDto.setCapitalQCZ_gtzj(project.getCapitalQCZ_gtzj());
			projectDto.setCapitalSCZ_gtzj(project.getCapitalSCZ_gtzj());
			projectDto.setPifuCBSJYGS_date(project.getPifuCBSJYGS_date());
			projectDto.setModifiedDate(project.getModifiedDate());
			projectDto.setModifiedBy(project.getModifiedBy());			
			projectDto.setCapitalSHTZ(project.getCapitalSHTZ());
			projectDto.setRemark(project.getRemark());
			projectDto.setCapitalSCZ_zxzj(project.getCapitalSCZ_zxzj());
			projectDto.setCapitalOther(project.getCapitalOther());
			projectDto.setProjectInvestSum(project.getProjectInvestSum());
			projectDto.setProjectInvestAccuSum(project.getProjectInvestAccuSum());
			projectDto.setProjectAddress(project.getProjectAddress());
			projectDto.setPifuJYS_date(project.getPifuJYS_date());
			projectDto.setProjectIntro(project.getProjectIntro());
			projectDto.setCapitalQCZ_ggys(project.getCapitalQCZ_ggys());
			projectDto.setCreatedBy(project.getCreatedBy());
			projectDto.setProjectNumber(project.getProjectNumber());
			projectDto.setProjectStage(project.getProjectStage());
			projectDto.setProjectClassify(project.getProjectClassify());
			projectDto.setPifuKXXYJBG_wenhao(project.getPifuKXXYJBG_wenhao());
			projectDto.setItemOrder(project.getItemOrder());
			projectDto.setCapitalSCZ_ggys(project.getCapitalSCZ_ggys());
			projectDto.setEndDate(project.getEndDate());
			projectDto.setBeginDate(project.getBeginDate());
			projectDto.setProjectIndustry(project.getProjectIndustry());
			projectDto.setPifuCBSJYGS_wenhao(project.getPifuCBSJYGS_wenhao());
			projectDto.setProjectType(project.getProjectType());
			projectDto.setCreatedDate(project.getCreatedDate());
			projectDto.setCapitalOtherDescription(project.getCapitalOtherDescription());
			projectDto.setId(project.getId());
			projectDto.setPifuJYS_wenhao(project.getPifuJYS_wenhao());
			projectDto.setProjectGuiMo(project.getProjectGuiMo());
			projectDto.setPifuKXXYJBG_date(project.getPifuKXXYJBG_date());
			
			//begin#关联信息
			//附件
			project.getAttachments().stream().forEach(x->{
				projectDto.getAttachmentDtos().add(attachmentMapper.toDto(x));				
			});
			//月报
			project.getMonthReports().stream().forEach(x->{
				projectDto.getMonthReportDtos().add(monthReportMapper.toDto(x));
			});
			
		}
		return projectDto;
	}
	
	public  Project buildEntity(ProjectDto projectDto,Project project){
		if(projectDto!=null&&project!=null){
			if(project.getId()==null||project.getId().isEmpty()){
				project.setId(UUID.randomUUID().toString());
			}
			project.setUnitName(projectDto.getUnitName());
			project.setProjectName(projectDto.getProjectName());
			project.setCapitalQCZ_gtzj(projectDto.getCapitalQCZ_gtzj());
			project.setCapitalSCZ_gtzj(projectDto.getCapitalSCZ_gtzj());
			project.setPifuCBSJYGS_date(projectDto.getPifuCBSJYGS_date());
			project.setModifiedDate(projectDto.getModifiedDate());
			project.setModifiedBy(projectDto.getModifiedBy());
			project.setAttachments(projectDto.getAttachments());
			project.setCapitalSHTZ(projectDto.getCapitalSHTZ());
			project.setRemark(projectDto.getRemark());
			project.setCapitalSCZ_zxzj(projectDto.getCapitalSCZ_zxzj());
			project.setCapitalOther(projectDto.getCapitalOther());
			project.setProjectInvestSum(projectDto.getProjectInvestSum());
			project.setProjectInvestAccuSum(projectDto.getProjectInvestAccuSum());
			project.setProjectAddress(projectDto.getProjectAddress());
			project.setPifuJYS_date(projectDto.getPifuJYS_date());
			project.setProjectIntro(projectDto.getProjectIntro());
			project.setCapitalQCZ_ggys(projectDto.getCapitalQCZ_ggys());
			project.setCreatedBy(projectDto.getCreatedBy());
			project.setProjectNumber(projectDto.getProjectNumber());
			project.setProjectStage(projectDto.getProjectStage());
			project.setProjectClassify(projectDto.getProjectClassify());
			project.setPifuKXXYJBG_wenhao(projectDto.getPifuKXXYJBG_wenhao());
			project.setItemOrder(projectDto.getItemOrder());
			project.setCapitalSCZ_ggys(projectDto.getCapitalSCZ_ggys());
			project.setEndDate(projectDto.getEndDate());
			project.setBeginDate(projectDto.getBeginDate());
			project.setProjectIndustry(projectDto.getProjectIndustry());
			project.setPifuCBSJYGS_wenhao(projectDto.getPifuCBSJYGS_wenhao());
			project.setProjectType(projectDto.getProjectType());
			project.setCreatedDate(projectDto.getCreatedDate());
			project.setCapitalOtherDescription(projectDto.getCapitalOtherDescription());
			project.setPifuJYS_wenhao(projectDto.getPifuJYS_wenhao());
			project.setProjectGuiMo(projectDto.getProjectGuiMo());
			project.setPifuKXXYJBG_date(projectDto.getPifuKXXYJBG_date());
			
			//begin#关联信息
			//附件			
			projectDto.getAttachmentDtos().stream().forEach(x->{
				Attachment attachment=new Attachment();
				attachmentMapper.buildEntity(x, attachment);
				project.getAttachments().add(attachment);
			});			
		}
		return project;
	}
}

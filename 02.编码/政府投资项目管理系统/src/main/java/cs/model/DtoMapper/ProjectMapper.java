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
/**
 * @Description: 项目信息实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class ProjectMapper implements IMapper<ProjectDto, Project> {
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	IMapper<MonthReportDto, MonthReport> monthReportMapper;
	
	@Override
	public  ProjectDto toDto(Project project){
		ProjectDto projectDto=new ProjectDto();
		if(project!=null){
			//项目信息
			projectDto.setId(project.getId());
			projectDto.setProjectNumber(project.getProjectNumber());//项目代码
			projectDto.setProjectName(project.getProjectName());//项目名称
			projectDto.setIsLatestVersion(project.getIsLatestVersion());//是否是最新版本
			projectDto.setIsMonthReport(project.getIsMonthReport());//是否月报
			projectDto.setProjectInvestmentType(project.getProjectInvestmentType());//项目投资类型
			projectDto.setProjectStage(project.getProjectStage());//项目阶段
			projectDto.setProjectClassify(project.getProjectClassify());//项目分类
			projectDto.setProjectIndustry(project.getProjectIndustry());//项目行业
			projectDto.setNationalIndustry(project.getNationalIndustry());//国民经济行业分类
			projectDto.setProjectType(project.getProjectType());//项目类型
			projectDto.setProjectCategory(project.getProjectCategory());//项目类别
			projectDto.setProjectInvestSum(project.getProjectInvestSum());//项目总投资
			projectDto.setProjectInvestAccuSum(project.getProjectInvestAccuSum());//项目累计投资
			projectDto.setDivisionId(project.getDivisionId());//项目建设区域
			projectDto.setProjectAddress(project.getProjectAddress());//项目建设地址		
			projectDto.setProjectIntro(project.getProjectIntro());//项目简介
			projectDto.setProjectGuiMo(project.getProjectGuiMo());//项目规模			
			projectDto.setProjectRepName(project.getProjectRepName());//项目负责人名称
			projectDto.setProjectRepMobile(project.getProjectRepMobile());//项目负责人电话
			projectDto.setRemark(project.getRemark());//备注
			projectDto.setEndDate(project.getEndDate());//开工时间
			projectDto.setBeginDate(project.getBeginDate());//竣工时间
			projectDto.setUnitName(project.getUnitName());//项目所属单位名称-对应用户单位中的userName
			projectDto.setIsIncludYearPlan(project.getIsIncludYearPlan());
			projectDto.setIsPlanReach(project.getIsPlanReach());
			project.setAlreadyDisbursed(projectDto.getAlreadyDisbursed());
			//资金来源			
			projectDto.setCapitalQCZ_gtzj(project.getCapitalQCZ_gtzj());
			projectDto.setCapitalQCZ_ggys(project.getCapitalQCZ_ggys());
			projectDto.setCapitalSCZ_gtzj(project.getCapitalSCZ_gtzj());
			projectDto.setCapitalSCZ_ggys(project.getCapitalSCZ_ggys());
			projectDto.setCapitalSCZ_zxzj(project.getCapitalSCZ_zxzj());
			projectDto.setCapitalZYYS(project.getCapitalZYYS());//中央预算
			projectDto.setCapitalSHTZ(project.getCapitalSHTZ());			
			projectDto.setCapitalOther(project.getCapitalOther());
			projectDto.setCapitalOtherType(project.getCapitalOtherType());
			projectDto.setCapitalOtherDescription(project.getCapitalOtherDescription());
			//批复信息
			projectDto.setPifuCBSJYGS_date(project.getPifuCBSJYGS_date());
			projectDto.setPifuKXXYJBG_date(project.getPifuKXXYJBG_date());
			projectDto.setPifuJYS_date(project.getPifuJYS_date());
			projectDto.setPifuCBSJYGS_wenhao(project.getPifuCBSJYGS_wenhao());
			projectDto.setPifuKXXYJBG_wenhao(project.getPifuKXXYJBG_wenhao());
			projectDto.setPifuJYS_wenhao(project.getPifuJYS_wenhao());
			projectDto.setPifuZJSQBG_date(project.getPifuZJSQBG_date());
			projectDto.setPifuZJSQBG_wenhao(project.getPifuZJSQBG_wenhao());
			//基础数据
			projectDto.setModifiedDate(project.getModifiedDate());
			projectDto.setModifiedBy(project.getModifiedBy());
			projectDto.setCreatedBy(project.getCreatedBy());
			projectDto.setCreatedDate(project.getCreatedDate());
			projectDto.setItemOrder(project.getItemOrder());
			//为保存客户提供的数据添加字段
			projectDto.setConstructionCycle(project.getConstructionCycle());//建设周期
			projectDto.setFinalAmount(project.getFinalAmount());//决算金额
			projectDto.setFinanceProjectNumber(project.getFinanceProjectNumber());//财政项目代码
			projectDto.setIsIncludLibrary(project.getIsIncludLibrary());//是否纳入项目库
			//社投独立
			projectDto.setConstructionLand(project.getConstructionLand());//建设用地情况
			projectDto.setApproval_pzwh(project.getApproval_pzwh());//核准/备案批准文号
			projectDto.setUseBenefits(project.getUseBenefits());//投入使用后的效益
			projectDto.setLandPrice(project.getLandPrice());//总投资--地价
			projectDto.setEquipmentInvestment(project.getEquipmentInvestment());//总投资--设备投资
			projectDto.setBuidSafeInvestment(project.getBuidSafeInvestment());//总投资--建安投资
			projectDto.setRepUnitRepName(project.getRepUnitRepName());//责任单位联系人
			projectDto.setRepUnitRepMobile(project.getRepUnitRepMobile());//责任单位联系人电话
			projectDto.setCompanyName(project.getCompanyName());//企业名称
								
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
	
	@Override
	public Project  buildEntity(ProjectDto projectDto,Project project){
		if(projectDto!=null&&project!=null){			
			if(project.getId()==null||project.getId().isEmpty()){
				project.setId(UUID.randomUUID().toString());
			}
			//项目基本信息
			project.setProjectNumber(projectDto.getProjectNumber());
			project.setUnitName(projectDto.getUnitName());
			project.setProjectName(projectDto.getProjectName());
			project.setIsLatestVersion(projectDto.getIsLatestVersion());
			project.setIsMonthReport(projectDto.getIsMonthReport());
			project.setProjectStage(projectDto.getProjectStage());
			project.setProjectInvestmentType(projectDto.getProjectInvestmentType());//项目投资类型
			project.setProjectClassify(projectDto.getProjectClassify());
			project.setProjectIndustry(projectDto.getProjectIndustry());
			project.setNationalIndustry(projectDto.getNationalIndustry());//国民经济行业分类
			project.setProjectType(projectDto.getProjectType());
			project.setProjectCategory(projectDto.getProjectCategory());
			project.setProjectInvestSum(projectDto.getProjectInvestSum());
			project.setProjectInvestAccuSum(projectDto.getProjectInvestAccuSum());
			project.setDivisionId(projectDto.getDivisionId());//项目建设区域
			project.setProjectAddress(projectDto.getProjectAddress());
			project.setProjectIntro(projectDto.getProjectIntro());
			project.setProjectGuiMo(projectDto.getProjectGuiMo());
			project.setProjectRepName(projectDto.getProjectRepName());//项目负责人名称
			project.setProjectRepMobile(projectDto.getProjectRepMobile());//项目负责人电话
			project.setEndDate(projectDto.getEndDate());
			project.setBeginDate(projectDto.getBeginDate());
			project.setRemark(projectDto.getRemark());
			project.setIsIncludYearPlan(projectDto.getIsIncludYearPlan());
			project.setIsPlanReach(projectDto.getIsPlanReach());
			//资金来源			
			project.setCapitalQCZ_gtzj(projectDto.getCapitalQCZ_gtzj());
			project.setCapitalQCZ_ggys(projectDto.getCapitalQCZ_ggys());
			project.setCapitalSCZ_gtzj(projectDto.getCapitalSCZ_gtzj());
			project.setCapitalSCZ_ggys(projectDto.getCapitalSCZ_ggys());
			project.setCapitalSCZ_zxzj(projectDto.getCapitalSCZ_zxzj());
			project.setCapitalZYYS(projectDto.getCapitalZYYS());//中央预算
			project.setCapitalSHTZ(projectDto.getCapitalSHTZ());			
			project.setCapitalOther(projectDto.getCapitalOther());
			project.setCapitalOtherType(projectDto.getCapitalOtherType());
			project.setCapitalOtherDescription(projectDto.getCapitalOtherDescription());
			//批复信息
			project.setPifuCBSJYGS_date(projectDto.getPifuCBSJYGS_date());
			project.setPifuJYS_date(projectDto.getPifuJYS_date());			
			project.setPifuKXXYJBG_date(projectDto.getPifuKXXYJBG_date());
			project.setPifuJYS_wenhao(projectDto.getPifuJYS_wenhao());
			project.setPifuKXXYJBG_wenhao(projectDto.getPifuKXXYJBG_wenhao());
			project.setPifuCBSJYGS_wenhao(projectDto.getPifuCBSJYGS_wenhao());
			project.setPifuZJSQBG_date(projectDto.getPifuZJSQBG_date());
			project.setPifuZJSQBG_wenhao(projectDto.getPifuZJSQBG_wenhao());
			//基础信息
			project.setCreatedDate(projectDto.getCreatedDate());
			project.setModifiedDate(projectDto.getModifiedDate());
			project.setModifiedBy(projectDto.getModifiedBy());
			project.setCreatedBy(projectDto.getCreatedBy());
			project.setItemOrder(projectDto.getItemOrder());
			//为保存客户提供的数据添加字段
			project.setConstructionCycle(projectDto.getConstructionCycle());//建设周期
			project.setFinalAmount(projectDto.getFinalAmount());//决算金额
			project.setFinanceProjectNumber(projectDto.getFinanceProjectNumber());//财政项目代码
			project.setIsIncludLibrary(projectDto.getIsIncludLibrary());//是否纳入项目库
			//社投独立字段
			project.setConstructionLand(projectDto.getConstructionLand());//建设用地情况
			project.setApproval_pzwh(projectDto.getApproval_pzwh());//核准/备案批准文号
			project.setUseBenefits(projectDto.getUseBenefits());//投入使用后的效益
			project.setLandPrice(projectDto.getLandPrice());//总投资--地价
			project.setEquipmentInvestment(projectDto.getEquipmentInvestment());//总投资--设备投资
			project.setBuidSafeInvestment(projectDto.getBuidSafeInvestment());//总投资--建安投资
			project.setRepUnitRepName(projectDto.getRepUnitRepName());//责任单位联系人
			project.setRepUnitRepMobile(projectDto.getRepUnitRepMobile());//责任单位联系人电话
			project.setCompanyName(projectDto.getCompanyName());//企业名称
			//begin#关联信息：外部根据需要自己创建
		}
		return project;
	}
}

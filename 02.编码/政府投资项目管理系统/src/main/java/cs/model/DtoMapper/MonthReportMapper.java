package cs.model.DtoMapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.MonthReportProblemDto;
/**
 * @Description: 月报实体类与数据库资源转换类
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Component
public class MonthReportMapper implements IMapper<MonthReportDto, MonthReport> {
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	IMapper<MonthReportProblemDto, MonthReportProblem> monthReportProblemMapper;
	
	@Override
	public  MonthReportDto toDto(MonthReport monthReport) {
		MonthReportDto monthReportDto = new MonthReportDto();
		if (monthReport != null) {
			//月报数据信息
			monthReportDto.setId(monthReport.getId());// 获取月报id
			monthReportDto.setProjectId(monthReport.getProjectId());//项目ID
			monthReportDto.setProjectNumber(monthReport.getProjectNumber());// 获取项目代码
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());// 获取计划总投资			
			monthReportDto.setIsLatestVersion(monthReport.getIsLatestVersion());//是否是更新版月报
			// begin#月报联系人信息
			monthReportDto.setFillName(monthReport.getFillName());// 填报人名称
			monthReportDto.setFillMobile(monthReport.getFillMobile());// 填报人手机
			monthReportDto.setProjectRepName(monthReport.getProjectRepName());//项目负责人名称
			monthReportDto.setProjectRepMobile(monthReport.getProjectRepMobile());//项目负责人手机
			// end#联系人信息
			// begin#开工时间
			monthReportDto.setBeginDate(monthReport.getBeginDate());
			monthReportDto.setEndDate(monthReport.getEndDate());
			// end#开工时间
			// begin#投资情况
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());//计划总投资--对应页面的项目总投资
			monthReportDto.setReleasePlanTotal(monthReport.getReleasePlanTotal());//截止上年底累计下达计划
			monthReportDto.setThisYearPlanInvestment(monthReport.getThisYearPlanInvestment());//本年度计划安排投资
			monthReportDto.setThisYearPlanHasInvestment(monthReport.getThisYearPlanHasInvestment());//本年度已下达计划
			monthReportDto.setActuallyFinishiInvestment(monthReport.getActuallyFinishiInvestment());//实际(累计)完成投资	
			monthReportDto.setThisMonthPlanInvestTotal(monthReport.getThisMonthPlanInvestTotal());//本月计划完成投资
			monthReportDto.setThisMonthInvestTotal(monthReport.getThisMonthInvestTotal());//本月完成投资
			monthReportDto.setThisYearAccumulatedInvestment(monthReport.getThisYearAccumulatedInvestment());//本年度累计完成投资
			// end#投资情况

			// begin#进度情况
			monthReportDto.setProjectApprovalProgress(monthReport.getProjectApprovalProgress());// 项目审批进度
			monthReportDto.setProjectImageProgress(monthReport.getProjectImageProgress());// 工程形象进度或项目进展情况
			monthReportDto.setSelfReview(monthReport.getSelfReview());// 项目进度
			monthReportDto.setFirstQuarCompInvestment(monthReport.getFirstQuarCompInvestment());// 预计第一季度完成投资
			monthReportDto.setSecondQuarCompInvestment(monthReport.getSecondQuarCompInvestment());// 预计第二季度完成投资
			monthReportDto.setThirdQuarCompInvestment(monthReport.getThirdQuarCompInvestment());// 预计第三季度完成投资
			monthReportDto.setFourthQuarCompInvestment(monthReport.getFourthQuarCompInvestment());// 预计第四季度完成投资
			monthReportDto.setWorkTargets(monthReport.getWorkTargets());// 年度工作目标
			// end#进度情况
			monthReportDto.setSubmitMonth(monthReport.getSubmitMonth());// 提交月
			monthReportDto.setSubmitYear(monthReport.getSubmitYear());// 提交月
			monthReportDto.setSubmitDate(monthReport.getSubmitDate());// 提交日期		
			monthReportDto.setCompletion(monthReport.isCompletion());// 是否完工(1:完工，0：未完工)
			monthReportDto.setRemark(monthReport.getRemark());// 备注

			//begin#审批状态
			monthReportDto.setProcessState(monthReport.getProcessState());
			//关联信息
			 //月报问题
			List<MonthReportProblem> monthReportProblems = monthReport.getMonthReportProblems();
			List<MonthReportProblemDto> monthReportProblemDtos = new ArrayList<>();
			if (monthReportProblems != null && monthReportProblems.size() > 0) {
				for (MonthReportProblem monthReportProblem : monthReportProblems) {
					MonthReportProblemDto monthReportProblemDto = monthReportProblemMapper.toDto(monthReportProblem);
					monthReportProblemDtos.add(monthReportProblemDto);
				}
			}
			monthReportDto.setMonthReportProblemDtos(monthReportProblemDtos);
			// 附件
			List<Attachment> attachments = monthReport.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			if (attachments != null && attachments.size() > 0) {
				for (Attachment attachment : attachments) {
					AttachmentDto attachmentDto =attachmentMapper.toDto(attachment);
					attachmentDtos.add(attachmentDto);
				}
			}
			monthReportDto.setAttachmentDtos(attachmentDtos);
		
			//基础数据
			monthReportDto.setModifiedBy(monthReport.getModifiedBy());
			monthReportDto.setCreatedBy(monthReport.getCreatedBy());
			monthReportDto.setCreatedDate(monthReport.getCreatedDate());
			monthReportDto.setModifiedDate(monthReport.getModifiedDate());
			monthReportDto.setItemOrder(monthReport.getItemOrder());
		}
		return monthReportDto;

	}

	@Override
	public  MonthReport buildEntity(MonthReportDto monthReportDto, MonthReport monthReport) {
		if (monthReportDto != null && monthReport != null) {			
			if(monthReport.getId() ==null || monthReport.getId().isEmpty()){
				monthReport.setId(UUID.randomUUID().toString());
			}
			//月报数据信息
			monthReport.setProjectNumber(monthReportDto.getProjectNumber());
			monthReport.setProjectId(monthReportDto.getProjectId());
			//是否是更新版月报
			monthReport.setIsLatestVersion(monthReportDto.getIsLatestVersion());
			// begin#联系人信息
			monthReport.setFillName(monthReportDto.getFillName());
			monthReport.setFillMobile(monthReportDto.getFillMobile());
			monthReport.setProjectRepName(monthReportDto.getProjectRepName());
			monthReport.setProjectRepMobile(monthReportDto.getProjectRepMobile());
			// end#联系人信息
			// begin#开工时间
			monthReport.setBeginDate(monthReportDto.getBeginDate());
			monthReport.setEndDate(monthReportDto.getEndDate());			
			// end#开工时间
			// begin#投资情况
			monthReport.setInvertPlanTotal(monthReportDto.getInvertPlanTotal());// 对应页面的项目总投资
			monthReport.setReleasePlanTotal(monthReportDto.getReleasePlanTotal());//截止上年底累计下达计划
			monthReport.setThisYearPlanInvestment(monthReportDto.getThisYearPlanInvestment());//本年度计划安排投资
			monthReport.setThisYearPlanHasInvestment(monthReportDto.getThisYearPlanHasInvestment());//本年度已下达计划
			monthReport.setActuallyFinishiInvestment(monthReportDto.getActuallyFinishiInvestment());//实际(累计)完成投资	
			monthReport.setThisMonthPlanInvestTotal(monthReportDto.getThisMonthPlanInvestTotal());//本月计划完成投资
			monthReport.setThisMonthInvestTotal(monthReportDto.getThisMonthInvestTotal());//本月完成投资
			monthReport.setThisYearAccumulatedInvestment(monthReportDto.getThisYearAccumulatedInvestment());//本年度累计完成投资
			// end#投资情况
			// begin#进度情况
			monthReport.setProjectApprovalProgress(monthReportDto.getProjectApprovalProgress());
			monthReport.setProjectImageProgress(monthReportDto.getProjectImageProgress());
			monthReport.setSelfReview(monthReportDto.getSelfReview());
			monthReport.setFirstQuarCompInvestment(monthReportDto.getFirstQuarCompInvestment());
			monthReport.setSecondQuarCompInvestment(monthReportDto.getSecondQuarCompInvestment());
			monthReport.setThirdQuarCompInvestment(monthReportDto.getThirdQuarCompInvestment());
			monthReport.setFourthQuarCompInvestment(monthReportDto.getFourthQuarCompInvestment());
			monthReport.setWorkTargets(monthReportDto.getWorkTargets());
			// end#进度情况
			//begin#审批状态
			monthReport.setProcessState(monthReportDto.getProcessState());
			
			monthReport.setSubmitMonth(monthReportDto.getSubmitMonth());
			monthReport.setSubmitYear(monthReportDto.getSubmitYear());
			monthReport.setSubmitDate(monthReportDto.getSubmitDate());
			monthReport.setCompletion(monthReportDto.isCompletion());
			monthReport.setRemark(monthReportDto.getRemark());
			//基础数据
			monthReport.setModifiedBy(monthReportDto.getModifiedBy());
			monthReport.setCreatedBy(monthReportDto.getCreatedBy());
			monthReport.setCreatedDate(monthReportDto.getCreatedDate());
			monthReport.setModifiedDate(monthReportDto.getModifiedDate());
			monthReport.setItemOrder(monthReportDto.getItemOrder());
			//关联信息#根据需求在外面添加
		}
		return monthReport;

	}

}

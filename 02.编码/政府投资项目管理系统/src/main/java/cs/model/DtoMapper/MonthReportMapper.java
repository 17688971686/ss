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
@Component
public class MonthReportMapper implements IMapper<MonthReportDto, MonthReport> {
	@Autowired
	IMapper<AttachmentDto, Attachment> attachmentMapper;
	
	public  MonthReportDto toDto(MonthReport monthReport) {
		MonthReportDto monthReportDto = new MonthReportDto();
		if (monthReport != null) {

			monthReportDto.setId(monthReport.getId());// 获取月报id
			monthReportDto.setProjectId(monthReport.getProjectId());//项目ID
			monthReportDto.setProjectNumber(monthReport.getProjectNumber());// 获取项目代码
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());// 获取计划总投资

			//是否是更新版月报
			monthReportDto.setIsLatestVersion(monthReport.getIsLatestVersion());
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
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());// 对应页面的项目总投资
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

			monthReportDto.setCompletion(monthReport.isCompletion());// 是否完工(1:完工
																			// 0：未完工)
			monthReportDto.setRemark(monthReport.getRemark());// 备注

			//begin#审批状态
			monthReportDto.setProcessState(monthReport.getProcessState());
		

			// 月报问题
			// 将月报问题进行数据转换
			List<MonthReportProblem> monthReportProblems = monthReport.getMonthReportProblems();
			List<MonthReportProblemDto> monthReportProblemDtos = new ArrayList<>();
			if (monthReportProblems != null && monthReportProblems.size() > 0) {
				for (MonthReportProblem monthReportProblem : monthReportProblems) {
					MonthReportProblemDto monthReportProblemDto = MonthReportProblemMapper.toDto(monthReportProblem);
					monthReportProblemDtos.add(monthReportProblemDto);
				}
			}
			monthReportDto.setMonthReportProblemDtos(monthReportProblemDtos);

			// 月报附件
			// 将月报附件进行数据格式转换
			List<Attachment> attachments = monthReport.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			if (attachments != null && attachments.size() > 0) {
				for (Attachment attachment : attachments) {
					AttachmentDto attachmentDto =attachmentMapper.toDto(attachment);
					attachmentDtos.add(attachmentDto);
				}
			}
			monthReportDto.setAttachmentDtos(attachmentDtos);
		

			
			monthReportDto.setModifiedBy(monthReport.getModifiedBy());
			monthReportDto.setCreatedBy(monthReport.getCreatedBy());
			monthReportDto.setCreatedDate(monthReport.getCreatedDate());
			monthReportDto.setModifiedDate(monthReport.getModifiedDate());
		}
		return monthReportDto;

	}

	public  MonthReport buildEntity(MonthReportDto monthReportDto, MonthReport monthReport) {
		if (monthReportDto != null && monthReport != null) {
			
			if(monthReport.getId() ==null || monthReport.getId().isEmpty()){
				monthReport.setId(UUID.randomUUID().toString());
			}
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

			monthReportDto.getMonthReportProblemDtos().forEach(x -> {
				MonthReportProblem monthReportProblem = new MonthReportProblem();
				monthReportProblem.setId(UUID.randomUUID().toString());
				monthReportProblem.setCreatedBy(monthReportDto.getFillName());
				monthReportProblem.setModifiedBy(monthReportDto.getFillName());
				monthReportProblem.setProblemIntroduction(x.getProblemIntroduction());
				monthReportProblem.setSolutionsAndSuggest(x.getSolutionsAndSuggest());
				monthReportProblem.setMonthReport(monthReport);
				monthReport.getMonthReportProblems().add(monthReportProblem);
			});

			monthReportDto.getAttachmentDtos().forEach(x -> {
				Attachment attachment = new Attachment();
				attachment.setId(UUID.randomUUID().toString());
				attachment.setName(x.getName());
				attachment.setType(x.getType());
				attachment.setUrl(x.getUrl());
				attachment.setCreatedBy(monthReportDto.getFillName());
				attachment.setModifiedBy(monthReportDto.getFillName());
				monthReport.getAttachments().add(attachment);
			});
			monthReport.setModifiedDate(new Date());
		}
		return monthReport;

	}

}

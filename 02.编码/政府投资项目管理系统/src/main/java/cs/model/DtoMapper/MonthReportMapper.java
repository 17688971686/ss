package cs.model.DtoMapper;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.MonthReportProblemDto;

public class MonthReportMapper {
	public static MonthReportDto toDto(MonthReport monthReport) {
		MonthReportDto monthReportDto = new MonthReportDto();
		if (monthReport != null) {

			monthReportDto.setId(monthReport.getId());// 获取月报id
			monthReportDto.setProjectId(monthReport.getProjectId());// 获取项目id
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());// 获取计划总投资

			// begin#月报联系人信息
			monthReportDto.setFillName(monthReport.getFillName());// 填报人名称
			monthReportDto.setFillMobile(monthReport.getFillMobile());// 填报人手机
			monthReportDto.setMonRepManagerName(monthReport.getMonRepManagerName());// 月报负责人姓名
			monthReportDto.setMonRepManagerTel(monthReport.getMonRepManagerTel());// 月报负责人手机号
			monthReportDto.setMonRepManagerFax(monthReport.getMonRepManagerFax());// 月报负责人传真号
			monthReportDto.setMonRepManagUnitName(monthReport.getMonRepManagUnitName());// 月报负责单位名称
			monthReportDto.setRespUnitManagerName(monthReport.getRespUnitManagerName());// 责任单位负责人名称
			monthReportDto.setRespUnitManagerTel(monthReport.getRespUnitManagerTel());// 责任单位负责人电话
			// end#联系人信息

			// begin#批文日期和文号
			// 日期
			monthReportDto.setProposalsReplyDate(monthReport.getProposalsReplyDate());// 项目建议书批复日期
			monthReportDto.setFeaStyRepoReplyDate(monthReport.getFeaStyRepoReplyDate());// 可行性研究报告批复日期
			monthReportDto.setAllEstimateReplyDate(monthReport.getAllEstimateReplyDate());// 项目总概算批复日期
			monthReportDto.setPrePlanReplyDate(monthReport.getPrePlanReplyDate());// 前期工作计划批复日期
			// 文号
			monthReportDto.setProposalsType(monthReport.getProposalsType());// 项目建议书批复类型
			monthReportDto.setProposalsYear(monthReport.getProposalsYear());// 项目建议书批复年份
			monthReportDto.setProposalsNum(monthReport.getProposalsNum());// 项目建议书批复文号

			monthReportDto.setReportType(monthReport.getReportType());// 可行性研究报告批复类型
			monthReportDto.setReportYear(monthReport.getReportYear());// 可行性研究报告批复年份
			monthReportDto.setReportNum(monthReport.getReportNum());// 可行性研究报告批复文号

			monthReportDto.setAllEstimateType(monthReport.getAllEstimateType());// 项目总概算批复类型
			monthReportDto.setAllEstimateYear(monthReport.getAllEstimateYear());// 项目总概算批复年份
			monthReportDto.setAllEstimateNum(monthReport.getAllEstimateNum());// 项目总概算批复文号

			monthReportDto.setPrePlanType(monthReport.getPrePlanType());// 前期工作计划批复类型
			monthReportDto.setPrePlanYear(monthReport.getPrePlanYear());// 前期工作计划批复年份
			monthReportDto.setPrePlanNum(monthReport.getPrePlanNum());// 前期工作计划批复文号
			// end#批文日期和文号

			// begin#开工时间
			monthReportDto.setCommencementDate(monthReport.getCommencementDate());// 预计开工日期没有
			monthReportDto.setActuallyDate(monthReport.getActuallyDate());// 对应页面的开工日期
			monthReportDto.setCompletedDate(monthReport.getCompletedDate());// 竣工日期
			// end#开工时间

			// begin#投资情况
			monthReportDto.setInvertPlanTotal(monthReport.getInvertPlanTotal());// 对应页面的项目总投资
			monthReportDto.setActuallyFinishiInvestment(monthReport.getActuallyFinishiInvestment());// 实际完成投资
			monthReportDto.setSinceLastYearCompletInvestment(monthReport.getSinceLastYearCompletInvestment());// 对应页面至今完成投资
			monthReportDto.setThisYearPlanInvestment(monthReport.getThisYearPlanInvestment());// 本年计划投资
			monthReportDto.setThisMonthInvestTotal(monthReport.getThisMonthInvestTotal());// 本月完成投资
			monthReportDto.setBuildAndInstallInvest(monthReport.getBuildAndInstallInvest());// 建筑安装工程投资
			monthReportDto.setEquipmentInvest(monthReport.getEquipmentInvest());// 设备投资
			monthReportDto.setOtherInvest(monthReport.getOtherInvest());// 其他投资
			monthReportDto.setThisYearAccumulatedInvestment(monthReport.getThisYearAccumulatedInvestment());// 本年度累计完成投资
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

			// begin#拆迁情况
			monthReportDto.setRequisitionLandArea(monthReport.getRequisitionLandArea());// 征用土地面积
			monthReportDto.setDemolitionArea(monthReport.getDemolitionArea());// 拆迁面积
			// end#拆迁情况

			monthReportDto.setSubmitMonth(monthReport.getSubmitMonth());// 提交月
			monthReportDto.setSubmitYear(monthReport.getSubmitYear());// 提交月
			monthReportDto.setSubmitDate(monthReport.getSubmitDate());// 提交日期
			monthReportDto.setApprovalDate(monthReport.getApprovalDate());// 立项日期

			monthReportDto.setIsCompletion(monthReport.getIsCompletion());// 是否完工(1:完工
																			// 0：未完工)
			monthReportDto.setRemark(monthReport.getRemark());// 备注

			

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
			monthReportDto.setMonthReportProblemsDto(monthReportProblemDtos);

			// 月报附件
			// 将月报附件进行数据格式转换
			List<Attachment> attachments = monthReport.getAttachments();
			List<AttachmentDto> attachmentDtos = new ArrayList<>();
			if (attachments != null && attachments.size() > 0) {
				for (Attachment attachment : attachments) {
					AttachmentDto attachmentDto = AttachmentMapper.toDto(attachment);
					attachmentDtos.add(attachmentDto);
				}
			}
			monthReportDto.setAttachmentsDto(attachmentDtos);
		

			
			monthReportDto.setModifiedBy(monthReport.getModifiedBy());
			monthReportDto.setCreatedBy(monthReport.getCreatedBy());
			monthReportDto.setCreatedDate(monthReport.getCreatedDate());
			monthReportDto.setModifiedDate(monthReport.getModifiedDate());
		}
		return monthReportDto;

	}

	public static void buildEntity(MonthReportDto monthReportDto, MonthReport monthReport) {
		if (monthReportDto != null && monthReport != null) {
			
			if(monthReport.getId() ==null || monthReport.getId().isEmpty()){
				monthReport.setId(UUID.randomUUID().toString());
			}
			monthReport.setProjectId(monthReportDto.getProjectId());

			// begin#联系人信息
			monthReport.setFillName(monthReportDto.getFillName());
			monthReport.setFillMobile(monthReportDto.getFillMobile());
			monthReport.setMonRepManagerName(monthReportDto.getMonRepManagerName());
			monthReport.setMonRepManagerTel(monthReportDto.getMonRepManagerTel());
			monthReport.setMonRepManagerFax(monthReportDto.getMonRepManagerFax());
			monthReport.setMonRepManagUnitName(monthReportDto.getMonRepManagUnitName());
			monthReport.setRespUnitManagerName(monthReportDto.getRespUnitManagerName());
			monthReport.setRespUnitManagerTel(monthReportDto.getRespUnitManagerTel());
			// end#联系人信息

			// begin#批文日期和文号
			// 日期
			monthReport.setProposalsReplyDate(monthReportDto.getProposalsReplyDate());
			monthReport.setFeaStyRepoReplyDate(monthReportDto.getFeaStyRepoReplyDate());
			monthReport.setAllEstimateReplyDate(monthReportDto.getAllEstimateReplyDate());
			monthReport.setPrePlanReplyDate(monthReportDto.getPrePlanReplyDate());
			// 文号
			monthReport.setProposalsType(monthReportDto.getProposalsType());
			monthReport.setProposalsYear(monthReportDto.getProposalsYear());
			monthReport.setProposalsNum(monthReportDto.getProposalsNum());

			monthReport.setReportType(monthReportDto.getReportType());
			monthReport.setReportYear(monthReportDto.getReportYear());
			monthReport.setReportNum(monthReportDto.getReportNum());

			monthReport.setAllEstimateType(monthReportDto.getAllEstimateType());
			monthReport.setAllEstimateYear(monthReportDto.getAllEstimateYear());
			monthReport.setAllEstimateNum(monthReportDto.getAllEstimateNum());

			monthReport.setPrePlanType(monthReportDto.getPrePlanType());
			monthReport.setPrePlanYear(monthReportDto.getPrePlanYear());
			monthReport.setPrePlanNum(monthReportDto.getPrePlanNum());
			// end#批文日期和文号

			// begin#开工时间
			monthReport.setCommencementDate(monthReportDto.getCommencementDate());// 预计开工日期没有
			monthReport.setActuallyDate(monthReportDto.getActuallyDate());// 对应页面的开工日期
			monthReport.setCompletedDate(monthReportDto.getCompletedDate());
			// end#开工时间

			// begin#投资情况
			monthReport.setInvertPlanTotal(monthReportDto.getInvertPlanTotal());// 对应页面的项目总投资
			monthReport.setActuallyFinishiInvestment(monthReportDto.getActuallyFinishiInvestment());
			monthReport.setSinceLastYearCompletInvestment(monthReportDto.getSinceLastYearCompletInvestment());// 对应页面至今完成投资
			monthReport.setThisYearPlanInvestment(monthReportDto.getThisYearPlanInvestment());
			monthReport.setThisMonthInvestTotal(monthReportDto.getThisMonthInvestTotal());
			monthReport.setBuildAndInstallInvest(monthReportDto.getBuildAndInstallInvest());
			monthReport.setEquipmentInvest(monthReportDto.getEquipmentInvest());
			monthReport.setOtherInvest(monthReportDto.getOtherInvest());
			monthReport.setThisYearAccumulatedInvestment(monthReportDto.getThisYearAccumulatedInvestment());
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

			// begin#拆迁情况
			monthReport.setRequisitionLandArea(monthReportDto.getRequisitionLandArea());
			monthReport.setDemolitionArea(monthReportDto.getDemolitionArea());
			// end#拆迁情况

			

			monthReport.setSubmitMonth(monthReportDto.getSubmitMonth());
			monthReport.setSubmitYear(monthReportDto.getSubmitYear());
			monthReport.setSubmitDate(monthReportDto.getSubmitDate());
			monthReport.setApprovalDate(monthReportDto.getApprovalDate());

			monthReport.setIsCompletion(monthReportDto.getIsCompletion());
			monthReport.setRemark(monthReportDto.getRemark());

			monthReportDto.getMonthReportProblems().forEach(x -> {
				MonthReportProblem monthReportProblem = new MonthReportProblem();
				monthReportProblem.setId(UUID.randomUUID().toString());
				monthReportProblem.setProblemIntroduction(x.getProblemIntroduction());
				monthReportProblem.setSolutionsAndSuggest(x.getSolutionsAndSuggest());
				monthReportProblem.setMonthReport(monthReport);
				monthReport.getMonthReportProblems().add(monthReportProblem);
			});

			monthReportDto.getAttachments().forEach(x -> {
				Attachment attachment = new Attachment();
				attachment.setId(UUID.randomUUID().toString());
				attachment.setName(x.getName());
				attachment.setUrl(x.getUrl());

				monthReport.getAttachments().add(attachment);
			});
			monthReport.setModifiedDate(new Date());
		}

	}

}

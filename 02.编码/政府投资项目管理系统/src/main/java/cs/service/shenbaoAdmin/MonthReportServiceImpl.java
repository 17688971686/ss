package cs.service.shenbaoAdmin;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.BasicDataIdentity;
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.MonthReport;
import cs.domain.MonthReportProblem;
import cs.domain.MonthReport_;
import cs.domain.ProjectInfo;
import cs.domain.UnitInfo;
import cs.domain.framework.User_;
import cs.model.PageModelDto;
import cs.model.management.AttachmentDto;
import cs.model.management.BasicDataDto;
import cs.model.management.MonthReportDto;
import cs.model.management.MonthReportProblemDto;
import cs.model.management.ProjectInfoDto;
import cs.model.management.UnitInfoDto;
import cs.repository.common.BasicDataRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.shenbaoAdmin.MonthReportRepo;
import cs.repository.repositoryImpl.shenbaoAdmin.ProjectInfoRepo;
import cs.service.common.BasicDataService;
import cs.service.framework.UserServiceImpl;

@Service
public class MonthReportServiceImpl implements MonthReportService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	//依赖注入持久层
	@Autowired
	private MonthReportRepo monthReportRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ProjectInfoRepo projectInfoRepo;
	@Autowired
	private ICurrentUser currentUser;
	
	/**
	 * 分页查询月报数据
	 */
	@Override
	@Transactional
	public PageModelDto<MonthReportDto> get(ODataObj odataObj) {		
      List<MonthReport> monthReportList = monthReportRepo.findByOdata(odataObj); //查询出所有的月报数据和关联上的项目信息数据
		List<MonthReportDto> monthReportDtoList = new ArrayList<MonthReportDto>(); //将月报数据用实体类集合封装
		if(monthReportList !=null && monthReportList.size()>0){//如果有月报数据
			for (MonthReport monthReport : monthReportList) {
				MonthReportDto monthReportDto =DtoFactory.monthReportTomonthReportDto(monthReport);		
				
				//begin#关联信息
				//项目
				ProjectInfo projectInfo=projectInfoRepo.findById(monthReport.getProjectId());
				monthReportDto.setProjectName(projectInfo.getProjectName());
				
				//基础数据:approvalType
				List<BasicDataDto> basicDataDtos_approvalType=basicDataService.queryByIdentity(BasicDataIdentity.approvalType);
				Map<String, String> basicDataMap_approvalType=basicDataDtos_approvalType.stream()
						.collect(Collectors.toMap(
								x->x.getId(),
								x->x.getDescription()
								));				
				monthReportDto.setAllEstimateTypeDisplay(basicDataMap_approvalType.get(monthReport.getAllEstimateType()));
				monthReportDto.setPrePlanTypeDisplay(basicDataMap_approvalType.get(monthReport.getPrePlanType()));
				monthReportDto.setProposalsTypeDisplay(basicDataMap_approvalType.get(monthReport.getProposalsType()));
				monthReportDto.setReportTypeDisplay(basicDataMap_approvalType.get(monthReport.getReportType()));
				//基础数据：projectProgress
				List<BasicDataDto> basicDataDtos_projectProgress=basicDataService.queryByIdentity(BasicDataIdentity.projectProgress);
				Map<String, String> basicDataMap_projectProgress=basicDataDtos_projectProgress.stream()
						.collect(Collectors.toMap(
								x->x.getId(),
								x->x.getDescription()
								));	
				//end#关联信息
				monthReportDto.setSelfReviewDisplay(basicDataMap_projectProgress.get(monthReport.getSelfReview()));
				
				
				monthReportDtoList.add(monthReportDto);
			}
			
		}
				
		PageModelDto<MonthReportDto> pageModelDto = new PageModelDto<MonthReportDto>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(monthReportDtoList);
		
		logger.info("查询月报数据");
		return pageModelDto;		
	}
		

	/**
	 * @deprecated 填写的月报信息进行保存
	 * @param monthReportDto 填报信息对象
	 * @author cx
	 * @Date 2017-05-09  
	 */
	@Override
	@Transactional
	public void saveMonthReport(MonthReportDto monthReportDto) {
		//判断数据库是否存在月报
		Criterion criterion1=Restrictions.eq(MonthReport_.submitMonth.getName(), monthReportDto.getSubmitMonth());
		Criterion criterion2=Restrictions.eq(MonthReport_.projectId.getName(), monthReportDto.getProjectId());
		MonthReport monthReport;
		Optional<MonthReport> monthReportQuery=monthReportRepo.findByCriteria(criterion1,criterion2).stream().findFirst();
		if(!monthReportQuery.isPresent()){
			monthReport=new MonthReport();
			createMonthReport(monthReportDto,monthReport);
		}else{
			monthReport=monthReportQuery.get();
			updateMonthReport(monthReportDto,monthReport);
		}
		
		
	}
	
	private void createMonthReport(MonthReportDto monthReportDto,MonthReport monthReport){
				monthReport.setId(UUID.randomUUID().toString());	
				buildMonthReport(monthReportDto,monthReport);
				monthReport.setCreatedBy(currentUser.getLoginName());		
				monthReport.setCreatedDate(new Date());
				
				
				//monthReportRepo.save(monthReport);
				
				//从项目表进行保存
				ProjectInfo projectInfo=projectInfoRepo.findById(monthReportDto.getProjectId());
				projectInfo.getMonthReports().add(monthReport);				
				projectInfoRepo.save(projectInfo);
				
				logger.info("创建月报数据");
	}
	
	private void updateMonthReport(MonthReportDto monthReportDto,MonthReport monthReport){		
		monthReport.getAttachments().clear();
		monthReport.getMonthReportProblems().clear();
		
		buildMonthReport(monthReportDto,monthReport);		
		monthReportRepo.save(monthReport);
		logger.info("更新月报数据");
	}
	
	private void buildMonthReport(MonthReportDto monthReportDto,MonthReport monthReport){
		monthReport.setProjectId(monthReportDto.getProjectId());
		
		//begin#联系人信息
		monthReport.setFillName(monthReportDto.getFillName());
		monthReport.setFillMobile(monthReportDto.getFillMobile());
		monthReport.setMonRepManagerName(monthReportDto.getMonRepManagerName());
		monthReport.setMonRepManagerTel(monthReportDto.getMonRepManagerTel());
		monthReport.setMonRepManagerFax(monthReportDto.getMonRepManagerFax());
		monthReport.setMonRepManagUnitName(monthReportDto.getMonRepManagUnitName());
		monthReport.setRespUnitManagerName(monthReportDto.getRespUnitManagerName());
		monthReport.setRespUnitManagerTel(monthReportDto.getRespUnitManagerTel());		
		//end#联系人信息
		
		//begin#批文日期和文号
		//日期
		monthReport.setProposalsReplyDate(monthReportDto.getProposalsReplyDate());
		monthReport.setFeaStyRepoReplyDate(monthReportDto.getFeaStyRepoReplyDate());
		monthReport.setAllEstimateReplyDate(monthReportDto.getAllEstimateReplyDate());
		monthReport.setPrePlanReplyDate(monthReportDto.getPrePlanReplyDate());
		//文号
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
		//end#批文日期和文号
		
		//begin#开工时间
		monthReport.setCommencementDate(monthReportDto.getCommencementDate());//预计开工日期没有
		monthReport.setActuallyDate(monthReportDto.getActuallyDate());//对应页面的开工日期
		monthReport.setCompletedDate(monthReportDto.getCompletedDate());
		//end#开工时间
		
		//begin#投资情况
		monthReport.setInvertPlanTotal(monthReportDto.getInvertPlanTotal());//对应页面的项目总投资
		monthReport.setActuallyFinishiInvestment(monthReportDto.getActuallyFinishiInvestment());
		monthReport.setSinceLastYearCompletInvestment(monthReportDto.getSinceLastYearCompletInvestment());//对应页面至今完成投资
		monthReport.setThisYearPlanInvestment(monthReportDto.getThisYearPlanInvestment());
		monthReport.setThisMonthInvestTotal(monthReportDto.getThisMonthInvestTotal());
		monthReport.setBuildAndInstallInvest(monthReportDto.getBuildAndInstallInvest());
		monthReport.setEquipmentInvest(monthReportDto.getEquipmentInvest());
		monthReport.setOtherInvest(monthReportDto.getOtherInvest());
		monthReport.setThisYearAccumulatedInvestment(monthReportDto.getThisYearAccumulatedInvestment());
		//end#投资情况
		
		//begin#进度情况
		monthReport.setProjectApprovalProgress(monthReportDto.getProjectApprovalProgress());
		monthReport.setProjectImageProgress(monthReportDto.getProjectImageProgress());
		monthReport.setSelfReview(monthReportDto.getSelfReview());
		monthReport.setFirstQuarCompInvestment(monthReportDto.getFirstQuarCompInvestment());
		monthReport.setSecondQuarCompInvestment(monthReportDto.getSecondQuarCompInvestment());
		monthReport.setThirdQuarCompInvestment(monthReportDto.getThirdQuarCompInvestment());
		monthReport.setFourthQuarCompInvestment(monthReportDto.getFourthQuarCompInvestment());
		//end#进度情况
		
		//begin#拆迁情况
		monthReport.setRequisitionLandArea(monthReportDto.getRequisitionLandArea());
		monthReport.setDemolitionArea(monthReportDto.getDemolitionArea());
		//end#拆迁情况
		
		monthReport.setSubmitMonth(monthReportDto.getSubmitMonth());
		monthReport.setSubmitDate(monthReportDto.getSubmitDate());
		monthReport.setApprovalDate(monthReportDto.getApprovalDate());
		
		monthReport.setIsCompletion(monthReportDto.getIsCompletion());
		monthReport.setRemark(monthReportDto.getRemark());
		
		
		monthReportDto.getMonthReportProblems().forEach(x->{
			MonthReportProblem monthReportProblem=new MonthReportProblem();			
			monthReportProblem.setId(UUID.randomUUID().toString());
			monthReportProblem.setProblemIntroduction(x.getProblemIntroduction());
			monthReportProblem.setSolutionsAndSuggest(x.getSolutionsAndSuggest());
			monthReportProblem.setMonthReport(monthReport);
			monthReport.getMonthReportProblems().add(monthReportProblem);			
		});
	
		monthReportDto.getAttachments().forEach(x->{
			Attachment attachment=new Attachment();
			attachment.setId(UUID.randomUUID().toString());
			attachment.setName(x.getName());
			attachment.setUrl(x.getUrl());
	
			monthReport.getAttachments().add(attachment);
		});
		monthReport.setModifiedBy(currentUser.getLoginName());		
		monthReport.setModifiedDate(new Date());	
	}
	
	
}


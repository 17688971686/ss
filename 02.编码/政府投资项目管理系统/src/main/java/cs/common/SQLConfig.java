package cs.common;

public class SQLConfig {
 public static String yearPlanProject=String.format("SELECT"
 		+ " t1.id,t1.CapitalQCZ_gtzj,t1.CapitalSCZ_gtzj,t1.ModifiedBy,t1.YearConstructionTask,t1.YearConstructionContent,t1.CapitalSHTZ,t1.CapitalZYYS,t1.Remark,t1.CapitalSCZ_zxzj,t1.ProjectShenBaoStage,t1.ProjectAddress,t1.PlanYear,t1.CreatedBy,t1.ProjectCategory,t1.ProjectStage,t1.UnitName,t1.ItemOrder,t1.CapitalOtherType,t1.BeginDate,t1.ProjectInvestAccuSum,t1.ProjectIndustry,t1.PifuCBSJYGS_wenhao,t1.ProjectType,t1.CreatedDate,t1.CapitalOtherDescription,t1.Id,t1.PifuJYS_wenhao,t1.ProjectGuiMo,t1.PifuKXXYJBG_date,t1.econClassSubjects,t1.ProjectName,t1.PifuCBSJYGS_date,t1.ModifiedDate,t1.ProjectConstrChar,t1.CapitalOther,t1.ProjectInvestSum,t1.ApplyYearInvest,t1.PifuJYS_date,t1.functionSubjects,t1.ProjectIntro,t1.CapitalQCZ_ggys,t1.ProjectNumber,t1.ProjectId,t1.ProjectClassify,t1.PifuKXXYJBG_wenhao,t1.CapitalSCZ_ggys,t1.EndDate"	
 		+ ",t1.bianZhiUnitInfo_id,t1.shenBaoUnitInfo_id,t1.processState,t1.divisionId,t1.projectInvestmentType,t1.projectRepName,t1.projectRepMobile"
 		+ ",t2.capitalSum YearInvestApproval, t2.id yearPlanCapitalId"
 			+ " FROM cs_shenbaoinfo t1 "
			+ " inner join cs_yearplancapital t2 "
			+ " on t1.id = t2.shenbaoInfoId "
			+ " inner join cs_yearplan_cs_yearplancapital t3 "
			+ " on t2.id=t3.yearPlanCapitals_id "
			+ " inner join cs_yearplan t4 "
			+ " on t3.yearplan_id=t4.id "
			+ " where t4.id=:yearPlanId");
}

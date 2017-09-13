package cs.common;

public class SQLConfig {
 public static String yearPlanProject=String.format("SELECT"
 		+ " t1.id,t1.CapitalQCZ_gtzj,t1.CapitalSCZ_gtzj,t1.ModifiedBy,t1.YearConstructionTask,t1.YearConstructionContent,t1.CapitalSHTZ,t1.CapitalZYYS,t1.Remark,t1.CapitalSCZ_zxzj,t1.ProjectShenBaoStage,t1.ProjectAddress,t1.PlanYear,t1.CreatedBy,t1.ProjectCategory,t1.ProjectStage,t1.UnitName,t1.ItemOrder,t1.CapitalOtherType,t1.BeginDate,t1.ProjectInvestAccuSum,t1.ProjectIndustry,t1.PifuCBSJYGS_wenhao,t1.ProjectType,t1.CreatedDate,t1.CapitalOtherDescription,t1.Id,t1.PifuJYS_wenhao,t1.ProjectGuiMo,t1.PifuKXXYJBG_date,t1.econClassSubjects,t1.ProjectName,t1.PifuCBSJYGS_date,t1.ModifiedDate,t1.ProjectConstrChar,t1.CapitalOther,t1.ProjectInvestSum,t1.ApplyYearInvest,t1.PifuJYS_date,t1.functionSubjects,t1.ProjectIntro,t1.CapitalQCZ_ggys,t1.ProjectNumber,t1.ProjectId,t1.ProjectClassify,t1.PifuKXXYJBG_wenhao,t1.CapitalSCZ_ggys,t1.EndDate,t1.yearInvestApproval_lastYear,t1.yearInvestApproval_lastTwoYear"	
 		+ ",t1.bianZhiUnitInfo_id,t1.shenBaoUnitInfo_id,t1.processState,t1.divisionId,t1.projectInvestmentType,t1.projectRepName,t1.projectRepMobile,t1.constructionCycle,t1.finalAmount,t1.financeProjectNumber,t1.auditState,t1.isIncludLibrary,t1.applyYearInvest_LastTwoYear,t1.applyYearInvest_LastYear,t1.yearConstructionContentLastYear,t1.yearConstructionContentLastTwoYear,t1.yearConstructionContentShenBao,t1.capitalSCZ_ggys_LastYear,t1.capitalSCZ_gtzj_LastYear,t1.capitalSCZ_ggys_TheYear,t1.capitalSCZ_gtzj_TheYear,t1.capitalSCZ_ggys_LastTwoYear,t1.capitalSCZ_gtzj_LastTwoYear,t1.capitalSCZ_qita_LastYear,t1.capitalSCZ_qita,t1.capitalSCZ_qita_LastTwoYear,t1.capitalOtherDescriptionShenBao_LastYear,t1.capitalOtherDescriptionShenBao,t1.capitalOtherDescriptionShenBao_LastTwoYear"
 		+ ",t1.capitalAP_ggys_TheYear,t1.capitalAP_gtzj_TheYear,t1.capitalAP_qita,t1.capitalAP_ggys_LastYear,t1.capitalAP_gtzj_LastYear,t1.capitalAP_qita_LastYear,t1.capitalAP_ggys_LastTwoYear,t1.capitalAP_gtzj_LastTwoYear,t1.capitalAP_qita_LastTwoYear,t1.constructionUnit,t1.apInvestSum,t1.receiver,t1.packageType"
 		+ ",t2.capitalSum YearInvestApproval, t2.id yearPlanCapitalId"
 			+ " FROM cs_shenbaoinfo t1 "
			+ " inner join cs_yearplancapital t2 "
			+ " on t1.id = t2.shenbaoInfoId "
			+ " inner join cs_yearplan_cs_yearplancapital t3 "
			+ " on t2.id=t3.yearPlanCapitals_id "
			+ " inner join cs_yearplan t4 "
			+ " on t3.yearplan_id=t4.id "
			+ " where t4.id=:yearPlanId"
			+ " order by t1.ProjectIndustry desc");
 
 public static String yearPlanByLBTJ = String.format("SELECT yp.year as planYear,bs.description as projectCategory,count(sbi.id) as projectSum,"+
		 		" sum(IFNULL(sbi.projectInvestSum,0)) as investSum,"+
		 		" sum(IFNULL(sbi.projectInvestAccuSum,0)) as investAccuSum,"+
		 		" sum(IFNULL(sbi.apInvestSum,0)) as apInvestSum,"+
		 		" sum(IFNULL(ypl.capitalSum,0)) as yearInvestApprovalSum"+
				" FROM cs_yearplan as yp,"+
				" cs_yearplan_cs_yearplancapital as ypy,"+
				" cs_yearplancapital as ypl,"+
				" cs_shenbaoinfo as sbi,"+
				" cs_basicdata as bs"+
				" where yp.id = ypy.YearPlan_id"+
				" and ypl.id = ypy.yearPlanCapitals_id"+
				" and ypl.shenbaoInfoId = sbi.id"+
				" and sbi.projectCategory = bs.id"+
				" and yp.id = :yearPlanId"+
				" group by sbi.projectCategory");
 public static String yearPlanByHYTJ = String.format("SELECT yp.year as planYear,bs.description as projectIndustry,"+
				" count(sbi.id) AS projectSum,"+
		 		" sum(CASE WHEN sbi.projectCategory = 'projectCategory_1' THEN 1 ELSE 0 END ) AS projectCategory_ASum,"+
		 		" sum(CASE WHEN sbi.projectCategory = 'projectCategory_2' THEN 1 ELSE 0 END ) AS projectCategory_BSum,"+
		 		" sum(CASE WHEN sbi.projectCategory = 'projectCategory_3' THEN 1 ELSE 0 END ) AS projectCategory_CSum,"+
		 		" sum(CASE WHEN sbi.projectCategory = 'projectCategory_4' THEN 1 ELSE 0 END ) AS projectCategory_DSum,"+
		 		" sum(IFNULL(sbi.projectInvestSum,0)) as investSum,"+
		 		" sum(IFNULL(sbi.projectInvestAccuSum,0)) as investAccuSum,"+
		 		" sum(IFNULL(sbi.apInvestSum,0)) as apInvestSum,"+
		 		" sum(IFNULL(sbi.yearInvestApproval,0)) as sqInvestSum,"+
		 		" sum(IFNULL(ypl.capitalQCZ_ggys,0)) as yearAp_ggysSum,"+
		 		" sum(IFNULL(ypl.capitalQCZ_gtzj,0)) as yearAp_gtjjSum,"+
		 		" sum(IFNULL(ypl.capitalOther,0)) as yearAp_qitaSum,"+
		 		" sum(IFNULL(ypl.capitalQCZ_ggys,0)+IFNULL(ypl.capitalQCZ_gtzj,0)+IFNULL(ypl.capitalOther,0)) as yearApSum"+
		 		" FROM cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypy,cs_yearplancapital AS ypl,cs_shenbaoinfo AS sbi,cs_basicdata AS bs"+
		 		" WHERE yp.id = ypy.YearPlan_id AND ypl.id = ypy.yearPlanCapitals_id AND ypl.shenbaoInfoId = sbi.id AND sbi.projectIndustry = bs.id"+
		 		" AND yp.id = :yearPlanId"+
		 		" GROUP BY sbi.projectIndustry"+
		 		" ORDER BY bs.itemOrder");
 public static String yearPlanByDWTJ = String.format("SELECT a.planYear,a.constructionunit AS constrctionUnit,"+
		 " SUM(a.packagetype_1 + a.packagetype_2 + a.packagetype_3 + a.packagetype_4) AS yearApSum,"+
		 " SUM(a.packagetype_1) AS yearAp_danLie,"+
		 " SUM(a.packagetype_2) AS yearAp_jieSunKuan,"+
		 " SUM(a.packagetype_3) AS yearAp_xiaohe,"+
		 " SUM(a.packagetype_4) AS yearAp_weiLiXYuLiu"+
		 " FROM("+
			 " SELECT SUBSTRING_INDEX(sbi.constructionunit,',',1) AS 'constructionunit',"+
			 " CASE WHEN sbi.packagetype = 'packagetype_1' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_1',"+
		     " CASE WHEN sbi.packagetype = 'packagetype_2' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_2',"+
		     " CASE WHEN sbi.packagetype = 'packagetype_3' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_3',"+
		     " CASE WHEN sbi.packagetype = 'packagetype_4' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_4',"+
		     " yp.year as planYear"+
		     " FROM cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypy,cs_yearplancapital AS ypl,cs_shenbaoinfo sbi"+
		     " WHERE yp.id = ypy.YearPlan_id"+
		     " AND ypl.id = ypy.yearPlanCapitals_id"+
		     " AND ypl.shenbaoInfoId = sbi.id"+
		     " AND yp.id = :yearPlanId"+
		     " ) a"+
		     " GROUP BY a.constructionunit");
}

package cs.common;

public class SQLConfig {

 public static String yearPlanProject=String.format("SELECT"
		 	+ " t1.id,t1.createdBy,t1.createdDate,t1.itemOrder,t1.modifiedBy,t1.modifiedDate,"
		 	+ " t1.approval_pzwh,t1.beginDate,t1.buidSafeInvestment,t1.capitalOther,t1.capitalOtherType,t1.capitalOtherDescription,"
		 	+ " t1.CapitalQCZ_gtzj,t1.capitalQCZ_ggys,t1.capitalSCZ_ggys,t1.CapitalSCZ_gtzj,t1.capitalSCZ_zxzj,t1.capitalSHTZ,t1.capitalZYYS,"
		 	+ " t1.companyName,t1.constructionCycle,t1.constructionLand,t1.divisionId,t1.endDate,t1.equipmentInvestment,t1.finalAmount,t1.financeProjectNumber,"
		 	+ " t1.landPrice,t1.pifuCBSJYGS_date,t1.pifuCBSJYGS_wenhao,t1.pifuJYS_date,t1.pifuJYS_wenhao,t1.pifuKXXYJBG_date,t1.pifuKXXYJBG_wenhao,t1.projectAddress,"
		 	+ " t1.projectCategory,t1.projectClassify,t1.projectGuiMo,t1.projectIndustry,t1.projectIntro,t1.projectInvestAccuSum,t1.projectInvestSum,t1.projectInvestmentType,"
		 	+ " t1.projectName,t1.projectNumber,t1.projectRepMobile,t1.projectRepName,t1.projectStage,t1.projectType,t1.remark,t1.repUnitRepMobile,t1.repUnitRepName,t1.unitName,"
		 	+ " t1.useBenefits,t1.apInvestSum,t1.applyYearInvest,t1.applyYearInvest_LastYear,t1.applyYearInvest_LastTwoYear,t1.auditState,t1.capitalAP_ggys_LastYear,t1.capitalAP_ggys_LastTwoYear,"
		 	+ " t1.capitalAP_ggys_TheYear,t1.capitalAP_gtzj_LastTwoYear,t1.capitalAP_gtzj_LastYear,t1.capitalAP_gtzj_TheYear,t1.capitalAP_qita,t1.capitalAP_qita_LastTwoYear,t1.capitalAP_qita_LastYear,"
		 	+ " t1.capitalOtherDescriptionShenBao,t1.capitalSCZ_ggys_LastTwoYear,t1.capitalSCZ_ggys_LastYear,t1.capitalSCZ_ggys_TheYear,t1.capitalSCZ_gtzj_LastTwoYear,t1.capitalSCZ_gtzj_LastYear,t1.capitalSCZ_gtzj_TheYear,"
		 	+ " t1.capitalSCZ_qita,t1.capitalSCZ_qita_LastTwoYear,t1.capitalSCZ_qita_LastYear,t1.constructionUnit,t1.econClassSubjects,t1.existingProblem,t1.functionSubjects,t1.isApplyQianQiFei,t1.isIncludLibrary,t1.lastYearImageSchedule,"
		 	+ " t1.moveSuggestion,t1.planYear,t1.processStage,t1.processState,t1.projectConstrBasis,t1.projectConstrChar,t1.projectId,t1.projectShenBaoStage,t1.qianQiFeiApply,t1.recomProgram,t1.socialAndEconomic,t1.yearConstructionContent,"
		 	+ " t1.yearConstructionContentLastTwoYear,t1.yearConstructionContentLastYear,t1.yearConstructionContentShenBao,t1.yearConstructionTask,t1.yearImageSchedule,t1.yearInvestApproval,t1.yearInvestApproval_lastTwoYear,t1.yearInvestApproval_lastYear,"
		 	+ " t1.bianZhiUnitInfo_id,t1.shenBaoUnitInfo_id,t1.packageType,t1.receiver,t1.capitalOtherDescriptionShenBao_LastYear,t1.capitalOtherDescriptionShenBao_LastTwoYear,t1.isApplyOutsideCapital,t1.applyOutsideCapital,t1.isIncludYearPlan,"
		 	+ " t1.sqPlanReach_ggys,t1.sqPlanReach_gtzj,t1.isPlanReach,t1.apPlanReach_ggys,t1.apPlanReach_gtzj,t1.shenbaoDate,t1.qianshouDate,t1.pifuDate,t1.nationalIndustry,t1.complate,t1.thisTaskId,t1.thisTaskName,t1.zong_processId,"
	 		+ " t2.capitalSum YearInvestApproval,t2.id yearPlanCapitalId,t1.complate,t1.thisTaskId,t1.thisTaskName,t1.zong_processId,t1.isIncludPack,t1.pifuZJSQBG_date,t1.pifuZJSQBG_wenhao,t1.monitor_processId,t1.isSubShenBaoAtt,t1.isLeaderHasRead,t1.thisUser,t1.monitor_status"
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
 		" sum(CASE WHEN sbi.projectCategory = '"+BasicDataConfig.projectCategory_A+"' THEN 1 ELSE 0 END ) AS projectCategory_ASum,"+
 		" sum(CASE WHEN sbi.projectCategory = '"+BasicDataConfig.projectCategory_B+"' THEN 1 ELSE 0 END ) AS projectCategory_BSum,"+
 		" sum(CASE WHEN sbi.projectCategory = '"+BasicDataConfig.projectCategory_C+"' THEN 1 ELSE 0 END ) AS projectCategory_CSum,"+
 		" sum(CASE WHEN sbi.projectCategory = '"+BasicDataConfig.projectCategory_D+"' THEN 1 ELSE 0 END ) AS projectCategory_DSum,"+
 		" sum(IFNULL(sbi.projectInvestSum,0)) as investSum,"+
 		" sum(IFNULL(sbi.projectInvestAccuSum,0)) as investAccuSum,"+
 		" sum(IFNULL(sbi.apInvestSum,0)) as apInvestSum,"+
 		" sum(IFNULL(ypl.capitalSum,0)) as yapInvestSum,"+
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
			 " CASE WHEN sbi.packagetype = '"+BasicDataConfig.packageType_danLie+"' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_1',"+
		     " CASE WHEN sbi.packagetype = '"+BasicDataConfig.packageType_jieSuanKuan+"' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_2',"+
		     " CASE WHEN sbi.packagetype = '"+BasicDataConfig.packageType_xiaoEr+"' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_3',"+
		     " CASE WHEN sbi.packagetype = '"+BasicDataConfig.packageType_weiLiXian+"' THEN IFNULL(ypl.capitalSum,0) ELSE 0 END AS 'packagetype_4',"+
		     " yp.year as planYear"+
		     " FROM cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypy,cs_yearplancapital AS ypl,cs_shenbaoinfo sbi"+
		     " WHERE yp.id = ypy.YearPlan_id"+
		     " AND ypl.id = ypy.yearPlanCapitals_id"+
		     " AND ypl.shenbaoInfoId = sbi.id"+
		     " AND yp.id = :yearPlanId"+
		     " ) a"+
		     " GROUP BY a.constructionunit");

 public static String yearPlanByYS = String.format("SELECT yp.year AS planYear,"+
	     " IFNULL(sbi.constructionUnit,\"\") AS ConstructionUnit,"+
	     " IFNULL(sbi.projectName,\"\") AS ProjectName,"+
	     " IFNULL(sbi.projectNumber,\"\") AS ProjectCode,"+
	     " IFNULL(bs.description,\"\") AS ProjectType,"+
	     " IFNULL(sbi.projectIndustry,\"\") AS ProjectIndustry,"+
	     " IFNULL(sbi.projectGuiMo,\"\") AS ConstructionScale,"+
	     " IFNULL(sbi.projectConstrChar,\"\") AS ConstructionType,"+
	     " IFNULL(sbi.beginDate,\"\") AS beginDate,"+
	     " IFNULL(sbi.endDate,\"\") AS endDate,"+
	     " IFNULL(sbi.projectInvestSum, 0)AS TotalInvest,"+
	     " IFNULL(sbi.projectInvestAccuSum, 0)AS investAccuSum,"+
	     " IFNULL(sbi.apInvestSum, 0) AS apInvestSum,"+
	     " IFNULL(sbi.yearInvestApproval, 0)AS applyYearInvest,"+
	     " IFNULL(ypl.capitalSum, 0)AS yearApSum,"+
	     " IFNULL(ypl.capitalQCZ_gtzj, 0)AS capitalAP_gtzj_TheYear,"+
	     " IFNULL(ypl.capitalQCZ_ggys, 0)AS capitalAP_ggys_TheYear,"+
	     " IFNULL(ypl.capitalOther, 0) AS yearAp_qitaSum,"+
	     " IFNULL(sbi.yearConstructionContent,\"\") AS ConstructionContent,"+
	     " IFNULL(sbi.yearConstructionContentShenBao,\"\") AS Remark"+
	     " FROM"+
	     " cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypy,cs_yearplancapital AS ypl,cs_shenbaoinfo AS sbi,cs_basicdata AS bs"+
	     " WHERE"+
	     " yp.id = ypy.YearPlan_id"+
	     " AND ypl.id = ypy.yearPlanCapitals_id"+
	     " AND ypl.shenbaoInfoId = sbi.id"+ 
	     " AND sbi.projectCategory = bs.id"+
	     " AND yp.id = :yearPlanId"+
	     " ORDER BY sbi.projectCategory,sbi.projectConstrChar desc,sbi.projectInvestSum desc");

 public static String yearPlanStatistics = String.format("SELECT"
 		+ " count(ypyc.yearPlanCapitals_id) AS total,"
		+ " SUM( CASE WHEN sbi.projectConstrChar = 'projectConstrChar_1' THEN 1 ELSE 0 END ) AS qianQiTotal,"
 		+ " SUM( CASE WHEN sbi.projectConstrChar = 'projectConstrChar_2' THEN 1 ELSE 0 END ) AS newStratTotal,"
		+ " SUM( CASE WHEN sbi.projectConstrChar = 'projectConstrChar_3' THEN 1 ELSE 0 END ) AS xuJianTotal,"
		+ " SUM( CASE WHEN sbi.projectConstrChar = 'projectConstrChar_4' THEN 1 ELSE 0 END ) AS chuBeiTotal,"
		+ " SUM( IFNULL(sbi.projectInvestSum,0)) AS investTotal,"
		+ " SUM( IFNULL(sbi.applyYearInvest,0)) AS applyTotal,"
		+ " SUM( IFNULL(yc.capitalSum,0)) AS arrangeTotal,"
		+ " SUM( IFNULL(yc.capitalSCZ_ggys,0)) AS capitalSCZ_ggysTotal,"
		+ " SUM( IFNULL(yc.capitalSCZ_gtzj,0)) AS capitalSCZ_gtzjTotal,"
		+ " SUM( IFNULL(yc.capitalSCZ_zxzj,0)) AS capitalSCZ_zxzjTotal,"
		+ " SUM( IFNULL(yc.capitalQCZ_ggys,0)) AS capitalQCZ_ggysTotal,"
		+ " SUM( IFNULL(yc.capitalQCZ_gtzj,0)) AS capitalQCZ_gtzjTotal,"
		+ " SUM( IFNULL(yc.capitalZYYS,0)) AS capitalZYYSTotal,"
		+ " SUM( IFNULL(yc.capitalSHTZ,0)) AS capitalSHTZTotal,"
		+ " SUM( IFNULL(yc.capitalOther,0)) AS capitalOtherTotal"
		+ " FROM cs_yearplan as yp,cs_yearplan_cs_yearplancapital as ypyc,cs_yearplancapital as yc,cs_shenbaoinfo as sbi"
		+ " WHERE yp.id = ypyc.YearPlan_id AND yc.id = ypyc.yearPlanCapitals_id AND yc.shenbaoInfoId = sbi.id"
		+ " AND yp.id=:yearPlanId");

 public static String projectByHY = String.format("SELECT"
 		+ " b.description AS projectIndustry,"
 		+ " SUM(IFNULL(p.projectInvestSum,0)) AS projectInvestSum,"
 		+ " SUM(IFNULL(p.projectInvestAccuSum,0)) AS projectInvestAccuSum"
 		+ " FROM cs_project as p,cs_basicdata as b"
 		+ " WHERE b.id=p.projectIndustry AND p.isIncludLibrary=TRUE"
 		+ " GROUP BY p.projectIndustry");
 
 public static String projectInvestSourceData = String.format("SELECT"
 		+ " SUM(IFNULL(P.capitalSCZ_ggys,0)) AS capitalSCZ_ggys,"
 		+ " SUM(IFNULL(P.capitalSCZ_gtzj,0)) AS capitalSCZ_gtzj,"
 		+ " SUM(IFNULL(P.capitalSCZ_zxzj,0)) AS capitalSCZ_zxzj,"
 		+ " SUM(IFNULL(P.capitalQCZ_ggys,0)) AS capitalQCZ_ggys,"
 		+ " SUM(IFNULL(P.capitalQCZ_gtzj,0)) AS capitalQCZ_gtzj,"
 		+ " SUM(IFNULL(P.capitalZYYS,0)) AS capitalZYYS,"
 		+ " SUM(IFNULL(P.capitalSHTZ,0)) AS capitalSHTZ,"
 		+ " SUM(IFNULL(P.capitalOther,0)) AS capitalOther"
 		+ " FROM cs_project as p"
 		+ " WHERE p.isIncludLibrary=TRUE");
 
 public static String yearPlanByHY = String.format("SELECT"
 		+ " b.description AS projectIndustry,"
 		+ " SUM(IFNULL(sbi.projectInvestSum, 0)) AS projectInvestSum,"
 		+ " SUM(IFNULL(sbi.projectInvestAccuSum, 0)) AS projectInvestAccuSum,"
 		+ " SUM(IFNULL(ypc.capitalSum, 0)) AS apCapital"
 		+ " FROM cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypyc,cs_yearplancapital AS ypc,cs_shenbaoinfo AS sbi,cs_basicdata AS b"
 		+ " WHERE b.id = sbi.projectIndustry AND sbi.id = ypc.shenbaoInfoId AND ypc.id = ypyc.yearPlanCapitals_id AND ypyc.YearPlan_id = yp.id AND yp.`year` = :year"
 		+ " GROUP BY sbi.projectIndustry");
 
 public static String yearPlanInvestSourceData = String.format("SELECT"
 		+ " SUM(IFNULL(ypc.capitalSCZ_ggys,0)) AS capitalSCZ_ggys,"
 		+ " SUM(IFNULL(ypc.capitalSCZ_gtzj,0)) AS capitalSCZ_gtzj,"
 		+ " SUM(IFNULL(ypc.capitalSCZ_zxzj,0)) AS capitalSCZ_zxzj,"
 		+ " SUM(IFNULL(ypc.capitalQCZ_ggys,0)) AS capitalQCZ_ggys,"
 		+ " SUM(IFNULL(ypc.capitalQCZ_gtzj,0)) AS capitalQCZ_gtzj,"
 		+ " SUM(IFNULL(ypc.capitalZYYS,0)) AS capitalZYYS,"
 		+ " SUM(IFNULL(ypc.capitalSHTZ,0)) AS capitalSHTZ,"
 		+ " SUM(IFNULL(ypc.capitalOther,0)) AS capitalOther"
 		+ " FROM cs_yearplan AS yp,cs_yearplan_cs_yearplancapital AS ypyc,cs_yearplancapital AS ypc"
 		+ " WHERE ypc.id = ypyc.yearPlanCapitals_id AND ypyc.YearPlan_id = yp.id AND yp.`year` = :year");
 
 public static String projectStatisticsByUnit = String.format("SELECT"
 		+ " u.unitName AS classDesc,COUNT(p.id) AS projectNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_qianqichubei+"' THEN 1 ELSE 0 END) AS prereserveNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_qianqi+"' THEN 1 ELSE 0 END) AS preNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_shigong+"' THEN 1 ELSE 0 END) AS constructionNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_tinggong+"' THEN 1 ELSE 0 END) AS shutdownNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_jungong+"' THEN 1 ELSE 0 END) AS completedNumbers,"
 		+ " SUM(CASE WHEN p.projectStage = '"+BasicDataConfig.projectStage_gudingzicandengji+"' THEN 1 ELSE 0 END) AS fixedAssetsNumbers,"
 		+ " SUM( IFNULL(p.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_project AS p,cs_userunitinfo AS u"
 		+ " WHERE p.unitName = u.id and p.isIncludLibrary = :isIncluded"
 		+ " GROUP BY p.unitName");
 
 public static String projectStatisticsByCategory = String.format("SELECT"
 		+ " b.description AS classDesc,count(p.id) AS projectNumbers,SUM( IFNULL(p.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_project AS p,cs_basicdata AS b"
 		+ " WHERE p.projectCategory = b.id and p.isIncludLibrary = :isIncluded"
 		+ " GROUP BY p.projectCategory");
 
 public static String projectStatisticsByIndustry = String.format("SELECT"
 		+ " b.description AS classDesc,count(p.id) AS projectNumbers,SUM( IFNULL(p.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_project AS p,cs_basicdata AS b"
 		+ " WHERE p.projectIndustry = b.id and p.isIncludLibrary = :isIncluded"
 		+ " GROUP BY p.projectIndustry");
 
 public static String projectStatisticsByStage = String.format("SELECT"
 		+ " b.description AS classDesc,count(p.id) AS projectNumbers,SUM( IFNULL(p.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_project AS p,cs_basicdata AS b"
 		+ " WHERE p.projectStage = b.id and p.isIncludLibrary = :isIncluded"
 		+ " GROUP BY p.projectStage");
 
 public static String approvalStatisticsByStage = String.format("SELECT"
 		+ " b.description AS classDesc,count(sbi.id) AS projectNumbers,SUM(IFNULL(sbi.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b"
 		+ " WHERE sbi.projectShenBaoStage = b.id AND sbi.projectShenBaoStage IN ('"+BasicDataConfig.projectShenBaoStage_XMJYS+"','"+BasicDataConfig.projectShenBaoStage_KXXYJBG+"','"+BasicDataConfig.projectShenBaoStage_CBSJGS+"','"+BasicDataConfig.projectShenBaoStage_ZJSQBG+"')"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.projectShenBaoStage ORDER BY b.itemOrder");
 
 public static String approvalStatisticsByIndustry = String.format("SELECT"
 		+ " b.description AS classDesc,count(sbi.id) AS projectNumbers,SUM(IFNULL(sbi.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b"
 		+ " WHERE sbi.projectIndustry = b.id AND sbi.projectShenBaoStage IN ('"+BasicDataConfig.projectShenBaoStage_XMJYS+"','"+BasicDataConfig.projectShenBaoStage_KXXYJBG+"','"+BasicDataConfig.projectShenBaoStage_CBSJGS+"','"+BasicDataConfig.projectShenBaoStage_ZJSQBG+"')"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.projectIndustry ORDER BY b.itemOrder");
 
 public static String approvalStatisticsByUnit = String.format("SELECT"
 		+ " u.unitName AS classDesc,count(sbi.id) AS projectNumbers,"
 		+ " SUM(CASE WHEN sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_XMJYS+"' THEN 1 ELSE 0 END) AS approvalStageXMJYSNumbers,"
 		+ " SUM(CASE WHEN sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_KXXYJBG+"' THEN 1 ELSE 0 END) AS approvalStageKXXYJBGNumbers,"
 		+ " SUM(CASE WHEN sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_CBSJGS+"' THEN 1 ELSE 0 END) AS approvalStageCBSJGSNumbers,"
 		+ " SUM(CASE WHEN sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_ZJSQBG+"' THEN 1 ELSE 0 END) AS approvalStageZJSQBGNumbers,"
 		+ " SUM(IFNULL(sbi.projectInvestSum,0)) AS projectInvestSum"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b,cs_userunitinfo AS u"
 		+ " WHERE sbi.projectShenBaoStage = b.id AND sbi.unitName=u.id AND sbi.projectShenBaoStage IN ('"+BasicDataConfig.projectShenBaoStage_XMJYS+"','"+BasicDataConfig.projectShenBaoStage_KXXYJBG+"','"+BasicDataConfig.projectShenBaoStage_CBSJGS+"','"+BasicDataConfig.projectShenBaoStage_ZJSQBG+"')"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.unitName ORDER BY b.itemOrder");
 
 public static String planStatisticsByIndustry = String.format("SELECT"
 		+ " b.description AS classDesc,COUNT(sbi.id) AS projectNumbers,"
 		+ " SUM(IFNULL(sbi.projectInvestSum, 0)) AS projectInvestSum,"
 		+ " SUM(IFNULL(sbi.projectInvestAccuSum,0)) AS projectInvestAccuSum,"
 		+ " SUM(IFNULL(sbi.apPlanReach_ggys, 0)) +"
 		+ " SUM(IFNULL(sbi.apPlanReach_gtzj, 0)) AS apPlanReachTheYear"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b"
 		+ " WHERE sbi.projectIndustry = b.id AND sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_planReach+"'"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.projectIndustry ORDER BY b.itemOrder");
 		
 public static String planStatisticsByUnit = String.format("SELECT"
 		+ " u.unitName AS classDesc,COUNT(sbi.id) AS projectNumbers,"
 		+ " SUM(IFNULL(sbi.projectInvestSum, 0)) AS projectInvestSum,"
 		+ " SUM(IFNULL(sbi.projectInvestAccuSum,0)) AS projectInvestAccuSum,"
 		+ " SUM(IFNULL(sbi.apPlanReach_ggys, 0)) +"
 		+ " SUM(IFNULL(sbi.apPlanReach_gtzj, 0)) AS apPlanReachTheYear"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_userunitinfo AS u"
 		+ " WHERE sbi.unitName = u.id AND sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_planReach+"'"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.unitName");
 
 public static String planStatisticsByPlanType= String.format("SELECT"
 		+ " b.description AS classDesc,COUNT(sbi.id) AS projectNumbers,"
 		+ " SUM(IFNULL(sbi.projectInvestSum, 0)) AS projectInvestSum,"
 		+ " SUM(IFNULL(sbi.projectInvestAccuSum,0)) AS projectInvestAccuSum,"
 		+ " SUM(IFNULL(sbi.apPlanReach_ggys, 0)) +"
 		+ " SUM(IFNULL(sbi.apPlanReach_gtzj, 0)) AS apPlanReachTheYear"
 		+ " FROM cs_shenbaoinfo AS sbi,cs_basicdata AS b"
 		+ " WHERE sbi.projectConstrChar = b.id AND sbi.projectShenBaoStage = '"+BasicDataConfig.projectShenBaoStage_planReach+"'"
 		+ " AND YEAR(sbi.pifuDate) = :pifuDate"
 		+ " GROUP BY sbi.projectConstrChar ORDER BY b.itemOrder");
 
 public static String packPlanByUnit = String.format("SELECT"
	 		+ 	" p.id,p.createdBy,p.createdDate,p.itemOrder,p.modifiedBy,p.modifiedDate,p.name,p.remark,p.year,p.totalMoney,p.isInPlan"
//	 		+ 	" ,t3.capital_ggys,t3.capital_gtzj,t3.unitName,"
	 		+ " FROM cs_packPlan p"
	 		+ " LEFT JOIN cs_packplan_cs_allocationcapital t2"
	 		+ " ON p.id=t2.PackPlan_id"
	 		+ " LEFT JOIN cs_allocationcapital t3"
	 		+ " ON t2.allocationCapitals_id=t3.id"
	 		+ " WHERE t3.unitName=:unitId");

public static String packPlanByYearPlanId = String.format("SELECT"
	 		+ 	" p.id,p.createdBy,p.createdDate,p.itemOrder,p.modifiedBy,p.modifiedDate,p.name,p.remark,p.year,p.totalMoney,p.capitalSCZ_ggys_TheYear,p.capitalSCZ_gtzj_TheYear,p.isInPlan"
//	 		+ 	" t3.id yearPlanId"
	 		+ " FROM cs_packPlan p"
	 		+ " LEFT JOIN cs_yearplan_cs_packplan t2"
	 		+ " ON p.id=t2.packPlans_id"
	 		+ " LEFT JOIN cs_yearplan t3"
	 		+ " ON t2.YearPlan_id=t3.id"
	 		+ " WHERE t3.id=:yearPlanId");

public static String shenBaoInfoOfPlanReachApplication = String.format("SELECT"
		 	+ " t1.id,t1.createdBy,t1.createdDate,t1.itemOrder,t1.modifiedBy,t1.modifiedDate,t1.thisUser,"
		 	+ " t1.approval_pzwh,t1.beginDate,t1.buidSafeInvestment,t1.capitalOther,t1.capitalOtherType,t1.capitalOtherDescription,"
		 	+ " t1.CapitalQCZ_gtzj,t1.capitalQCZ_ggys,t1.capitalSCZ_ggys,t1.CapitalSCZ_gtzj,t1.capitalSCZ_zxzj,t1.capitalSHTZ,t1.capitalZYYS,"
		 	+ " t1.companyName,t1.constructionCycle,t1.constructionLand,t1.divisionId,t1.endDate,t1.equipmentInvestment,t1.finalAmount,t1.financeProjectNumber,"
		 	+ " t1.landPrice,t1.pifuCBSJYGS_date,t1.pifuCBSJYGS_wenhao,t1.pifuJYS_date,t1.pifuJYS_wenhao,t1.pifuKXXYJBG_date,t1.pifuKXXYJBG_wenhao,t1.projectAddress,"
		 	+ " t1.projectCategory,t1.projectClassify,t1.projectGuiMo,t1.projectIndustry,t1.projectIntro,t1.projectInvestAccuSum,t1.projectInvestSum,t1.projectInvestmentType,"
		 	+ " t1.projectName,t1.projectNumber,t1.projectRepMobile,t1.projectRepName,t1.projectStage,t1.projectType,t1.remark,t1.repUnitRepMobile,t1.repUnitRepName,t1.unitName,"
		 	+ " t1.useBenefits,t1.apInvestSum,t1.applyYearInvest,t1.applyYearInvest_LastYear,t1.applyYearInvest_LastTwoYear,t1.auditState,t1.capitalAP_ggys_LastYear,t1.capitalAP_ggys_LastTwoYear,"
		 	+ " t1.capitalAP_ggys_TheYear,t1.capitalAP_gtzj_LastTwoYear,t1.capitalAP_gtzj_LastYear,t1.capitalAP_gtzj_TheYear,t1.capitalAP_qita,t1.capitalAP_qita_LastTwoYear,t1.capitalAP_qita_LastYear,"
		 	+ " t1.capitalOtherDescriptionShenBao,t1.capitalSCZ_ggys_LastTwoYear,t1.capitalSCZ_ggys_LastYear,t1.capitalSCZ_ggys_TheYear,t1.capitalSCZ_gtzj_LastTwoYear,t1.capitalSCZ_gtzj_LastYear,t1.capitalSCZ_gtzj_TheYear,"
		 	+ " t1.capitalSCZ_qita,t1.capitalSCZ_qita_LastTwoYear,t1.capitalSCZ_qita_LastYear,t1.constructionUnit,t1.econClassSubjects,t1.existingProblem,t1.functionSubjects,t1.isApplyQianQiFei,t1.isIncludLibrary,t1.lastYearImageSchedule,"
		 	+ " t1.moveSuggestion,t1.planYear,t1.processStage,t1.processState,t1.projectConstrBasis,t1.projectConstrChar,t1.projectId,t1.projectShenBaoStage,t1.qianQiFeiApply,t1.recomProgram,t1.socialAndEconomic,t1.yearConstructionContent,"
		 	+ " t1.yearConstructionContentLastTwoYear,t1.yearConstructionContentLastYear,t1.yearConstructionContentShenBao,t1.yearConstructionTask,t1.yearImageSchedule,t1.yearInvestApproval,t1.yearInvestApproval_lastTwoYear,t1.yearInvestApproval_lastYear,"
		 	+ " t1.bianZhiUnitInfo_id,t1.shenBaoUnitInfo_id,t1.packageType,t1.receiver,t1.capitalOtherDescriptionShenBao_LastYear,t1.capitalOtherDescriptionShenBao_LastTwoYear,t1.isApplyOutsideCapital,t1.applyOutsideCapital,t1.isIncludYearPlan,"
		 	+ " t1.sqPlanReach_ggys,t1.sqPlanReach_gtzj,t1.isPlanReach,t1.apPlanReach_ggys,t1.apPlanReach_gtzj,t1.shenbaoDate,t1.qianshouDate,t1.pifuDate,t1.nationalIndustry,t1.complate,t1.thisTaskId,t1.thisTaskName,t1.zong_processId,t1.yearPlanCapitalId,"
		 	+ "t1.isIncludPack,t1.pifuZJSQBG_date,t1.pifuZJSQBG_wenhao,t1.monitor_processId,t1.isSubShenBaoAtt,t1.isLeaderHasRead,t1.thisUser,t1.monitor_status"
//	 		+ " p.id,p.createdBy,p.createdDate,p.itemOrder,p.modifiedBy,p.modifiedDate,"
//	 		+ " p.applicationName,p.applicationTime,p.applicationUnit,p.resPerson,p.resPersonTel"
	 		+ " FROM cs_shenbaoinfo t1"
	 		+ " LEFT JOIN cs_planreachapplication_cs_shenbaoinfo t2"
	 		+ " ON t1.id=t2.shenBaoInfos_id"
	 		+ " LEFT JOIN cs_planreachapplication t3"
	 		+ " ON t2.PlanReachApplication_id=t3.id"
	 		+ " WHERE t3.id=:planReachId AND t1.projectShenBaoStage='projectShenBaoStage_5'");

public static String packPlanByPlanReachId = String.format("SELECT"
	 		+ " p.id,p.createdBy,p.createdDate,p.itemOrder,p.modifiedBy,p.modifiedDate,p.name,p.remark,p.year,p.totalMoney,p.capitalSCZ_ggys_TheYear,p.capitalSCZ_gtzj_TheYear,p.isInPlan"
//	 		+ " t3.id yearPlanId"
	 		+ " FROM cs_packPlan p"
	 		+ " LEFT JOIN cs_planreachapplication_cs_packplan t2"
	 		+ " ON p.id=t2.packPlans_id"
	 		+ " LEFT JOIN cs_planreachapplication t3"
	 		+ " ON t2.PlanReachApplication_id=t3.id"
	 		+ " WHERE t3.id=:planReachId");

public static String shenBaoInfoOfPackPlanOfPlanReach = String.format("SELECT"
		 	+ " t1.id,t1.createdBy,t1.createdDate,t1.itemOrder,t1.modifiedBy,t1.modifiedDate,"
		 	+ " t1.approval_pzwh,t1.beginDate,t1.buidSafeInvestment,t1.capitalOther,t1.capitalOtherType,t1.capitalOtherDescription,"
		 	+ " t1.CapitalQCZ_gtzj,t1.capitalQCZ_ggys,t1.capitalSCZ_ggys,t1.CapitalSCZ_gtzj,t1.capitalSCZ_zxzj,t1.capitalSHTZ,t1.capitalZYYS,"
		 	+ " t1.companyName,t1.constructionCycle,t1.constructionLand,t1.divisionId,t1.endDate,t1.equipmentInvestment,t1.finalAmount,t1.financeProjectNumber,"
		 	+ " t1.landPrice,t1.pifuCBSJYGS_date,t1.pifuCBSJYGS_wenhao,t1.pifuJYS_date,t1.pifuJYS_wenhao,t1.pifuKXXYJBG_date,t1.pifuKXXYJBG_wenhao,t1.projectAddress,"
		 	+ " t1.projectCategory,t1.projectClassify,t1.projectGuiMo,t1.projectIndustry,t1.projectIntro,t1.projectInvestAccuSum,t1.projectInvestSum,t1.projectInvestmentType,"
		 	+ " t1.projectName,t1.projectNumber,t1.projectRepMobile,t1.projectRepName,t1.projectStage,t1.projectType,t1.remark,t1.repUnitRepMobile,t1.repUnitRepName,t1.unitName,"
		 	+ " t1.useBenefits,t1.apInvestSum,t1.applyYearInvest,t1.applyYearInvest_LastYear,t1.applyYearInvest_LastTwoYear,t1.auditState,t1.capitalAP_ggys_LastYear,t1.capitalAP_ggys_LastTwoYear,"
		 	+ " t1.capitalAP_ggys_TheYear,t1.capitalAP_gtzj_LastTwoYear,t1.capitalAP_gtzj_LastYear,t1.capitalAP_gtzj_TheYear,t1.capitalAP_qita,t1.capitalAP_qita_LastTwoYear,t1.capitalAP_qita_LastYear,"
		 	+ " t1.capitalOtherDescriptionShenBao,t1.capitalSCZ_ggys_LastTwoYear,t1.capitalSCZ_ggys_LastYear,t1.capitalSCZ_ggys_TheYear,t1.capitalSCZ_gtzj_LastTwoYear,t1.capitalSCZ_gtzj_LastYear,t1.capitalSCZ_gtzj_TheYear,"
		 	+ " t1.capitalSCZ_qita,t1.capitalSCZ_qita_LastTwoYear,t1.capitalSCZ_qita_LastYear,t1.constructionUnit,t1.econClassSubjects,t1.existingProblem,t1.functionSubjects,t1.isApplyQianQiFei,t1.isIncludLibrary,t1.lastYearImageSchedule,"
		 	+ " t1.moveSuggestion,t1.planYear,t1.processStage,t1.processState,t1.projectConstrBasis,t1.projectConstrChar,t1.projectId,t1.projectShenBaoStage,t1.qianQiFeiApply,t1.recomProgram,t1.socialAndEconomic,t1.yearConstructionContent,"
		 	+ " t1.yearConstructionContentLastTwoYear,t1.yearConstructionContentLastYear,t1.yearConstructionContentShenBao,t1.yearConstructionTask,t1.yearImageSchedule,t1.yearInvestApproval,t1.yearInvestApproval_lastTwoYear,t1.yearInvestApproval_lastYear,"
		 	+ " t1.bianZhiUnitInfo_id,t1.shenBaoUnitInfo_id,t1.packageType,t1.receiver,t1.capitalOtherDescriptionShenBao_LastYear,t1.capitalOtherDescriptionShenBao_LastTwoYear,t1.isApplyOutsideCapital,t1.applyOutsideCapital,t1.isIncludYearPlan,"
		 	+ " t1.sqPlanReach_ggys,t1.sqPlanReach_gtzj,t1.isPlanReach,t1.apPlanReach_ggys,t1.apPlanReach_gtzj,t1.isIncludPack,t1.shenbaoDate,t1.qianshouDate,t1.nationalIndustry,t1.yearPlanCapitalId,t1.pifuDate,t1.complate,t1.thisTaskId,"
		 	+ "t1.thisTaskName,t1.zong_processId,t1.pifuZJSQBG_date,t1.pifuZJSQBG_wenhao,t1.monitor_processId,t1.isSubShenBaoAtt,t1.isLeaderHasRead,t1.thisUser,t1.monitor_status"
//	 		+ " p.id,p.createdBy,p.createdDate,p.itemOrder,p.modifiedBy,p.modifiedDate,"
//	 		+ " p.applicationName,p.applicationTime,p.applicationUnit,p.resPerson,p.resPersonTel"
	 		+ " FROM cs_shenbaoinfo t1"
	 		+ " LEFT JOIN cs_packplan_cs_shenbaoinfo t2"
	 		+ " ON t1.id=t2.shenBaoInfos_id"
	 		+ " LEFT JOIN cs_packplan t3"
	 		+ " ON t2.PackPlan_id=t3.id"
	 		+ " WHERE t3.id=:packPlanId");

}

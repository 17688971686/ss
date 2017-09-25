package cs.common;

public class SQLConfig {
 public static String yearPlanProject=String.format("SELECT t1.*,t2.capitalSum YearInvestApproval, t2.id AS yearPlanCapitalIdR"
 			+ " FROM cs_shenbaoinfo t1 "
			+ " inner join cs_yearplancapital t2 "
			+ " on t1.id = t2.shenbaoInfoId "
			+ " inner join cs_yearplan_cs_yearplancapital t3 "
			+ " on t2.id=t3.yearPlanCapitals_id "
			+ " inner join cs_yearplan t4 "
			+ " on t3.yearplan_id=t4.id "
			+ " where t4.id=:yearPlanId");
}

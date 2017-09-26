package cs.common;

public class BasicDataConfig {
	//begin#basicData
	public static String approvalType ="approvalType";
	public static String projectProgress ="projectProgress";
	
	public static boolean isComplete =false;
	
	//projectInvestmentType
	public static String projectInvestmentType="projectInvestmentType";
	public static String projectInvestmentType_ZF="projectInvestmentType_1";//政府投资
	public static String projectInvestmentType_SH="projectInvestmentType_2";//社会投资
	
	//projectStage
	public static String projectStage="projectStage";
	public static String projectStage_qianqichubei="projectStage_1";//前期储备阶段
	public static String projectStage_qianqi="projectStage_2";//前期阶段
	public static String projectStage_shigong="projectStage_3";//施工阶段
	public static String projectStage_tinggong="projectStage_4";//停工阶段
	public static String projectStage_jungong="projectStage_5";//竣工阶段
	public static String projectStage_gudingzicandengji="projectStage_6";//固定资产登记阶段
	
	
	//process
	public static String processState="processState";
	public static String processState_tianBao="processState_1";//等待签收
	public static String processState_qianShou="processState_2";//签收
	public static String processState_banJie="processState_11";//办结
	public static String processState_tuiWen="processState_15";//退文
	public static String processState_tuiWenBanJie="processState_24";//退文办结
	public static String processState_MiShuFenBan="processState_3";//秘书科分办
	public static String processState_jieShuShenPi="processState_23";//秘书科发文
	
	public static String msFenBanRole="秘书科分办人员";
	public static String msHeGaoRole="人秘科发文人员";
	
	public static String projectShenBaoStage_nextYearPlan="projectShenBaoStage_7";//下一年度计划
	
	public static String taskType="taskType";
	public static String taskType_nextYearPlan="taskType_2";//下一年度计划
	public static String taskType_monthReport="taskType_1";//月报填报
	public static String taskType_sendMesg="taskType_3";//发送短信
	public static String taskType_shenBaoDK="taskType_4";//申报端口
	public static String taskType_XMJYS="taskType_5";//项目建议书
	public static String taskType_KXXYJBG="taskType_6";//可行性研究报告
	public static String taskType_CBSJYGS="taskType_7";//初步设计与概算
	public static String taskType_qianQi="taskType_8";//前期计划
	public static String taskType_new="taskType_9";//新开工
	public static String taskType_xuJian="taskType_10";//续建
	public static String taskType_junGong="taskType_11";//竣工

	
	public static String attachment_type_jys="JYS"; 
	public static String attachment_type_kxxyjbg="KXXYJBG"; 
	public static String attachment_type_cbsjygs="CBSJYGS";
	
	public static String auditState_noAudit="auditState_1";//未审核
	public static String auditState_auditPass="auditState_2";//审核通过
	
	public static String projectCategory_A="projectCategory_1";//A类
	public static String projectCategory_B="projectCategory_2";//B类
	public static String projectCategory_C="projectCategory_3";//C类
	public static String projectCategory_D="projectCategory_4";//D类
	
	public static String packageType_danLie="packageType_1";//打包类型--单列项目
	//end#basicData
	
	public static String role_admin="超级管理员";
	public static String role_unit="建设单位";
	public static String role_manage="管理员";
	public static String role_shenpiUnit="审批单位";
	
}

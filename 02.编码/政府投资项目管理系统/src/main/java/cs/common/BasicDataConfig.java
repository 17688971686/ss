package cs.common;

public class BasicDataConfig {
	
	public static String approvalType ="approvalType";
	public static String projectProgress ="projectProgress";
	public static boolean isComplete =false;
	
	//项目投资类型 projectInvestmentType
	public static String projectInvestmentType="projectInvestmentType";
	public static String projectInvestmentType_ZF="projectInvestmentType_1";//政府投资
	public static String projectInvestmentType_SH="projectInvestmentType_2";//社会投资
	
	//项目阶段 projectStage
	public static String projectStage="projectStage";
	public static String projectStage_qianqichubei="projectStage_1";//前期储备阶段
	public static String projectStage_qianqi="projectStage_2";//前期阶段
	public static String projectStage_shigong="projectStage_3";//施工阶段
	public static String projectStage_tinggong="projectStage_4";//停工阶段
	public static String projectStage_jungong="projectStage_5";//竣工阶段
	public static String projectStage_gudingzicandengji="projectStage_6";//固定资产登记阶段
	
	//项目类别 projectCategory
	public static String projectCategory_A="projectCategory_1";//A类
	public static String projectCategory_B="projectCategory_2";//B类
	public static String projectCategory_C="projectCategory_3";//C类
	public static String projectCategory_D="projectCategory_4";//D类
	
	//批复文件文件类型
	public static String attachment_type_jys="JYS"; 
	public static String attachment_type_kxxyjbg="KXXYJBG"; 
	public static String attachment_type_cbsjygs="CBSJYGS";
	
	//申报阶段 projectShenBaoStage
	public static String projectShenBaoStage_XMJYS="projectShenBaoStage_1";//项目建议书
	public static String projectShenBaoStage_KXXYJBG="projectShenBaoStage_2";//可行性研究报告
	public static String projectShenBaoStage_CBSJGS="projectShenBaoStage_3";//初步设计概算
	public static String projectShenBaoStage_ZJSQBG="projectShenBaoStage_4";//资金申请报告
	public static String projectShenBaoStage_planReach="projectShenBaoStage_5";//计划下达
	public static String projectShenBaoStage_nextYearPlan="projectShenBaoStage_7";//下一年度计划
	
	//打包类型 packageType
	public static String packageType_danLie="packageType_1";//打包类型--单列项目
	public static String packageType_jieSuanKuan="packageType_2";//结算款项目
	public static String packageType_xiaoEr="packageType_3";//小额项目
	public static String packageType_weiLiXian="packageType_4";//未立项预留项目

	//流程阶段 processStage
	public static String processStage_tianbao="processStage_1";//建设单位填写申报信息
	public static String processStage_qianshou="processStage_2";//投资科审核收件办理
	public static String processStage_kzshenhe="processStage_3";//科长审核办理
	public static String processStage_jbrbanli="processStage_4";//经办人办理
	public static String processStage_zbqitaren="processStage_5";//转他人办理
	public static String processStage_weituopishen="processStage_6";//委托评审科长审核
	public static String processState_niwendengji="processStage_7";//拟文登记科长审核
	public static String processState_mskfawen = "processStage_9";//秘书科发文
	//流程状态 processState
	public static int processState_weikaishi=0;
	public static int processState_jinxingzhong=1;
	public static int processState_pass=2;
	public static int processState_zhuanban=3;
	public static int processState_notpass=4;
	//审核状态 auditState
	public static String auditState_noAudit="auditState_1";//未审核
	public static String auditState_auditPass="auditState_2";//审核通过
	
	//任务类型
	public static String taskType="taskType";
	public static String taskType_XMJYS="taskType_5";//项目建议书
	public static String taskType_KXXYJBG="taskType_6";//可行性研究报告
	public static String taskType_CBSJYGS="taskType_7";//初步设计与概算
	public static String taskType_junGong="taskType_11";//竣工
	public static String taskType_ZJSQBG="taskType_12";//资金申请报告
	public static String taskType_JHXD="taskType_14";//计划下达
	//系统配置信息
	public static String taskType_monthReport="taskType_1";//月报填报
	public static String taskType_nextYearPlan="taskType_2";//下一年度计划
	public static String taskType_sendMesg="taskType_3";//发送短信配置
	public static String taskType_shenBaoDK="taskType_4";//申报端口配置
	public static String taskType_monthReportPort="taskType_13";//月报端口配置
	public static String taskType_shenpiFenBan="taskType_15";//审批分办人员配置
	
	//审批流程中涉及到的角色名称
	public static String msFenBanRole="秘书科分办人员";
	public static String msFaWenRole="秘书科发文人员";
	public static String KeZhang="科长";
	public static String JuZhang="局长";
	public static String KeYuan="科员";
	
	//角色名称
	public static String role_admin="超级管理员";
	public static String role_unit="建设单位";
	public static String role_manage="管理员";
	public static String role_shenpiUnit="审批单位";
	
	
	
}

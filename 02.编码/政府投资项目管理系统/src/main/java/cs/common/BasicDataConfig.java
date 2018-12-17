package cs.common;

/**
 *	基本数据转换
 * @author Administrator
 *
 */
public class BasicDataConfig {
	public static int processState_wqd=0;//未启动
	public static int processState_jxz=1;//进行中
	public static int processState_tg=2;//审批通过
	public static int processState_btg=3;//审批不通过
	
	public static String gm_name="光明区";//审批不通过
	
	public final static String  APPID="861b9769db254eb38e2cd6f1323cc78f";
	public final static String  APPSECRET ="e9c3f577af8345d7ae4b6dcaf5442392";
	public final static String AUTHORSECRET = "530ded1aeb7f47b3bda1e56e693ba9c2";//服务秘钥
	
	public final static String  ROLE_OPERATOR="办公室经办人";
	public final static String  ROLE_SECTION_CHIEF="科长";
	public final static String  ROLE_LEADERSHIP="局领导";
	public final static String  ROLE_DEPUTYCHIEF="副局";
	public final static String  ROLE_DEPUTY="局长";
	public final static String  ROLE_HEAD="评审中心评审人员";
	public final static String  ROLE_CLERKOFFICER="科员";
	
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
	public static String attachment_type_zjsqbg="ZJSQBG";
	public static String attachment_type_SCQQJFXD="SCQQJFXD";
	
	public static String zf_projectClassify="projectClassify_1";
	public static String zf_projectClassify_fj="projectClassify_1_1";
	public static String zf_projectClassify_sz="projectClassify_1_2";
	public static String zf_projectClassify_sw="projectClassify_1_3";
	public static String zf_projectClassify_qt="projectClassify_1_4";
	public static String sh_projectClassify="projectClassify_2";
	public static String sh_projectClassify_fj="projectClassify_2_1";
	public static String sh_projectClassify_sz="projectClassify_2_2";
	public static String sh_projectClassify_sw="projectClassify_2_3";
	public static String sh_projectClassify_qt="projectClassify_2_4";
	
	
	//申报阶段 projectShenBaoStage
	public static String projectShenBaoStage_XMJYS="projectShenBaoStage_1";//项目建议书
	public static String projectShenBaoStage_KXXYJBG="projectShenBaoStage_2";//可行性研究报告
	public static String projectShenBaoStage_CBSJGS="projectShenBaoStage_3";//初步设计概算
	public static String projectShenBaoStage_ZJSQBG="projectShenBaoStage_4";//资金申请报告
	public static String projectShenBaoStage_planReach="projectShenBaoStage_5";//计划下达
	public static String projectShenBaoStage_oncePlanReach="projectShenBaoStage_6";//首次前期计划下达
	public static String projectShenBaoStage_nextYearPlan="projectShenBaoStage_7";//下一年度计划
	
	public static String projectShenBaoStage_KXXYJBG_name="可行性研究报告";//可行性研究报告
	public static String projectShenBaoStage_CBSJGS_name="初步设计概算";//初步设计概算
	public static String projectShenBaoStage_ZJSQBG_name="资金申请报告";//资金申请报告
	public static String projectShenBaoStage_oncePlanReach_name="首次前期经费下达";//首次前期经费下达
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
	public static String processState_tuihui = "processStage_10";//秘书科发文
	//流程状态 processState
	public static int processState_weikaishi=0;
	public static int processState_jinxingzhong=1;
	public static int processState_pass=2;
	public static int processState_zhuanban=3;
	public static int processState_notpass=4;
	public static int processState_tuiwen=5;
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
	public static String taskType_SCQQJFXD="taskType_20";//首次前期经费下达
	//系统配置信息
	public static String taskType_monthReport="taskType_1";//月报填报
	public static String taskType_nextYearPlan="taskType_2";//下一年度计划
	public static String taskType_sendMesg="taskType_3";//发送短信配置
	public static String taskType_shenBaoDK="taskType_4";//申报端口配置
	public static String taskType_monthReportPort="taskType_13";//月报端口配置
	public static String taskType_shenpiFenBan="taskType_15";//审批分办人员配置
	public static String taskType_JiHuaDK="taskType_16";//审批分办人员配置
	public static String taskType_MOREN_PROJECT_HANDLE="taskType_17";//默认项目办理人员配置
	public static String taskType_Office_work="taskType_18";//默认办公室办文人员配置
	public static String taskType_Office_printing ="taskType_19";//默认办公室印文人员配置
	
	//审批流程中涉及到的角色名称
	public static String msFenBanRole="办公室核稿人员";
	public static String msFaWenRole="办公室发文人员";
	public static String KeZhang="科长";
	public static String JuZhang="局长";
	public static String KeYuan="科员";
	public static String FuJuZhang="副局长";
	public static String PingShenRenYuan="评审中心评审人员";
	
	
	//角色名称
	public static String role_admin="超级管理员";
	public static String role_unit="建设单位";
	public static String role_manage="管理员";
	public static String role_shenpiUnit="审批单位";
	
	public static String fileSet_pingjian="fileSet_1";
	public static String fileSet_jiaji="fileSet_2";
	public static String fileSet_teji="fileSet_4";
	public static String fileSet_teti="fileSet_5";
	
	
}

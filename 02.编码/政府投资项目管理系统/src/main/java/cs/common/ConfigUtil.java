//package cs.common;
//
//import java.util.Locale;
//import java.util.ResourceBundle;
//
//public class ConfigUtil {
//   
//    /**
//     * @Description:基础数据类型各种类型记录对应的编号
//     * @author: cx
//     * @Date: 2017-05-09
//     * @version: 0.1
//     * 这里把变量名设置为全部大写，主要是把其当做常亮来使用，只有系统第一次
//     * 初始化时才会对其进行赋值，之后不会对其进行改动
//     */
//    public static String PROJECT_STAGE;//申报阶段
//    public static String PROJECT_INDUSTRY;//项目行业
//    public static String PROJECT_CONSTRCHAR;//项目建设性质
//    public static String UNIT_PROPERTY;//单位性质
//    public static String COMPILATIONUNIT_QUALIFICATIONS;//编制单位资质
//    public static String PROJECT_INVESTMENT_TYPE;//项目投资类型
//    public static String PROJECT_TYPE;//项目类型
//    public static String PROJECT_CLASSIFY;//项目分类
//    public static String FOUNDAPPLI_REPOGENERATION_STATUS;//资金申请报告生成状态
//    public static String PROBLEM_TYPE;//问题类型
//    public static String PROJECT_PROGRESS;//项目进度
//    public static String DRAFT_SECRET_LEVEL;//拟稿秘密等级
//    public static String DRAFT_STATUS;//拟稿状态
//    public static String OPEN_TYPE;//公开类型
//    public static String FILE_SET;//文件缓急
//    public static String FILE_TYPE;//文件类型
//    public static String POSTING_TYPE;//发文种类
//    public static String APPROVAL_TYPE;//批复类型
//    public static String DEPT_TYPE;//部门类型
//    public static String ATTACHMENT_TYPE;//附件类型
//    
//    static  {      
//        Locale defaultLocale = Locale.getDefault();
//        ResourceBundle config = ResourceBundle.getBundle("config", defaultLocale);        
//        try{
//           
//        	PROJECT_STAGE = config.getString("projectStage");
//        	PROJECT_INDUSTRY = config.getString("projectIndustry");
//        	PROJECT_CONSTRCHAR = config.getString("projectConstrProperty");
//        	UNIT_PROPERTY = config.getString("unitProperty");
//        	COMPILATIONUNIT_QUALIFICATIONS = config.getString("CompilationUnitQualifications");
//        	PROJECT_INVESTMENT_TYPE = config.getString("projectInvestType");
//        	PROJECT_TYPE = config.getString("projectType");
//        	PROJECT_CLASSIFY = config.getString("projectClassify");
//        	FOUNDAPPLI_REPOGENERATION_STATUS = config.getString("foundAppliRepoGenerationStatus");
//        	PROBLEM_TYPE = config.getString("problemType");
//        	PROJECT_PROGRESS = config.getString("projectProgress");
//        	DRAFT_SECRET_LEVEL = config.getString("draftSecretLevel");
//        	DRAFT_STATUS = config.getString("draftStatus");
//        	OPEN_TYPE = config.getString("openType");
//        	FILE_SET = config.getString("fileSet");
//        	FILE_TYPE = config.getString("fileType");
//        	POSTING_TYPE = config.getString("postingType");
//        	APPROVAL_TYPE = config.getString("approvalType");
//        	DEPT_TYPE = config.getString("deptType");
//        	ATTACHMENT_TYPE = config.getString("attachmentType");
//           
//        }catch (Exception e){
//        	e.printStackTrace();
//        }
//    }
// 
//}

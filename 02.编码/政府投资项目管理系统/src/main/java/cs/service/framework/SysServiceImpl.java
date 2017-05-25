package cs.service.framework;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import cs.common.Response;
import cs.common.sysResource.ClassFinder;
import cs.common.sysResource.SysResourceDto;
import cs.domain.BasicData;
import cs.domain.framework.Resource;
import cs.domain.framework.Role;
import cs.domain.framework.SysConfig;
import cs.domain.framework.User;
import cs.repository.common.BasicDataRepo;
import cs.repository.framework.RoleRepoImpl;
import cs.repository.framework.SysConfigRepoImpl;
import cs.repository.framework.UserRepoImpl;

@Service
public class SysServiceImpl implements SysService {
	private static Logger logger = Logger.getLogger(SysServiceImpl.class);

	@Autowired
	private RoleRepoImpl roleRepo;
	@Autowired
	private UserRepoImpl userRepo;
	@Autowired
	private SysConfigRepoImpl sysConfigRepo;
	@Autowired
	private BasicDataRepo basicDataRepo;
	@Override
	public List<SysResourceDto> get() {

		List<SysResourceDto> resources = new ArrayList<SysResourceDto>();
		List<Class<?>> classes = ClassFinder.find("cs.controller");
		for (Class<?> obj : classes) {

			if (obj.isAnnotationPresent(RequestMapping.class)) {
				SysResourceDto resource = new SysResourceDto();

				Annotation classAnnotation = obj.getAnnotation(RequestMapping.class);
				RequestMapping classAnnotationInfo = (RequestMapping) classAnnotation;

				resource.setName(classAnnotationInfo.name());
				resource.setPath(classAnnotationInfo.path()[0]);

				List<SysResourceDto> operations = new ArrayList<SysResourceDto>();

				for (Method method : obj.getDeclaredMethods()) {

					if (method.isAnnotationPresent(RequestMapping.class)) {
						SysResourceDto operation = new SysResourceDto();

						Annotation methodAnnotation = method.getAnnotation(RequestMapping.class);
						RequestMapping methodAnnotationInfo = (RequestMapping) methodAnnotation;

						String httpMethod = methodAnnotationInfo.method().length == 0 ? "GET"
								: methodAnnotationInfo.method()[0].name();
						operation.setPath(String.format("%s#%s#%s", resource.getPath(), methodAnnotationInfo.path()[0].replace("{", "").replace("}", ""),
								httpMethod));
						operation.setName(String.format("%s(%s)", methodAnnotationInfo.name(), operation.getPath()));
						operation.setMethod(httpMethod);
						operations.add(operation);

					}
				}
				resource.setChildren(operations);
				resources.add(resource);
			}

		}
		return resources;
	}

	@Override
	@Transactional
	public Response SysInit() {
		Response response = new Response();
		SysConfig sysConfig = sysConfigRepo.findById("UserAndRoleInit");
		if (sysConfig!=null) {// 已经被初始化
			response.setMessage("已经存在初始化数据，此次操作无效");
			logger.warn("已经存在初始化数据，此次操作无效");

		} else {// 未被初始化

			// 初始化角色
			Role role = new Role();
			role.setRoleName("超级管理员");
			role.setId(UUID.randomUUID().toString());
			role.setComment("系统初始化创建,不可删除");

			List<SysResourceDto> resourceDtos = this.get();
			List<Resource> resources = new ArrayList<>();
			resourceDtos.forEach(x -> {
				x.getChildren().forEach(y -> {
					Resource resource = new Resource();
					resource.setMethod(y.getMethod());
					resource.setName(y.getName());
					resource.setPath(y.getPath());
					resources.add(resource);

				});

			});
			role.setResources(resources);

			roleRepo.save(role);

			// 初始化用户
			User user = new User();
			user.setLoginName("admin");
			user.setId(UUID.randomUUID().toString());
			user.setPassword("admin");
			user.setComment("系统初始化创建,不可删除");
			user.setDisplayName("超级管理员");
			user.getRoles().add(role);
			userRepo.save(user);

			// 更新sysConfig
			sysConfig = new SysConfig();
			sysConfig.setInit(true);
			sysConfig.setId("UserAndRoleInit");
			sysConfigRepo.save(sysConfig);

			response.setMessage("初始化成功");
			response.setSuccess(true);
			
			logger.info("系统初始化成功!");

		}
		return response;

	}
	@Override
	@Transactional
	public Response SysInitBasicData() {
		Response response = new Response();
		List<SysConfig> sysConfigs = sysConfigRepo.findAll();
		SysConfig sysConfig;
		// 更新sysConfig
		for(SysConfig obj:sysConfigs){
			if("基础数据初始化".equals(obj.getId())){
				response.setMessage("已经存在初始化基础数据，此次操作无效");
				logger.warn("已经存在初始化基础数据，此次操作无效");
				return response;
			}
		}
		
		//初始化基础数据
		this.createBasicData("approvalType_01","" , "approvalType", "深发改", "批复类型分类");
		this.createBasicData("approvalType_02","" , "approvalType", "深发改函", "批复类型分类");
		this.createBasicData("approvalType_03","" , "approvalType", "深光发改", "批复类型分类");
		this.createBasicData("approvalType_04","" , "approvalType", "深光发改函", "批复类型分类");
		
		this.createBasicData("attachmentType_01","" , "attachmentType", "申请报告(pdf版，加盖公章)", "附件类型分类");
		this.createBasicData("attachmentType_02","" , "attachmentType", "申请报告(Word版)", "附件类型分类");
		this.createBasicData("attachmentType_03","" , "attachmentType", "投资计划", "附件类型分类");
		this.createBasicData("attachmentType_04","" , "attachmentType", "概算批复", "附件类型分类");
		this.createBasicData("attachmentType_05","" , "attachmentType", "前期工作计划文件", "附件类型分类");
		this.createBasicData("attachmentType_06","" , "attachmentType", "项目实施依据文件", "附件类型分类");
		this.createBasicData("attachmentType_07","" , "attachmentType", "历年政府投资计划下达文件", "附件类型分类");
		this.createBasicData("attachmentType_08","" , "attachmentType", "可行性研究报告批复文件", "附件类型分类");
		this.createBasicData("attachmentType_09","" , "attachmentType", "项目建议书批复文件", "附件类型分类");
		this.createBasicData("attachmentType_10","" , "attachmentType", "项目总概算批复文件", "附件类型分类");
		this.createBasicData("attachmentType_11","" , "attachmentType", "项目建议书批文复印件", "附件类型分类");
		this.createBasicData("attachmentType_12","" , "attachmentType", "上一年度计划批文复印件", "附件类型分类");
		this.createBasicData("attachmentType_13","" , "attachmentType", "工程规划许可证扫描件", "附件类型分类");
		this.createBasicData("attachmentType_14","" , "attachmentType", "概算批复扫描件", "附件类型分类");
		this.createBasicData("attachmentType_15","" , "attachmentType", "全部已下达计划批复文件扫描件", "附件类型分类");
		this.createBasicData("attachmentType_16","" , "attachmentType", "建设工程规划许可证", "附件类型分类");
		this.createBasicData("attachmentType_17","" , "attachmentType", "土地落实情况、征地拆迁有关情况", "附件类型分类");
		this.createBasicData("attachmentType_18","" , "attachmentType", "项目工程形象进度及年度资金需求情况", "附件类型分类");
		this.createBasicData("attachmentType_19","" , "attachmentType", "项目进展情况相关资料", "附件类型分类");
		this.createBasicData("attachmentType_20","" , "attachmentType", "年度完成建设内容及各阶段工作内容完成时间表", "附件类型分类");
		this.createBasicData("attachmentType_21","" , "attachmentType", "会议纪要", "附件类型分类");
		this.createBasicData("attachmentType_22","" , "attachmentType", "送审造价", "附件类型分类");
		this.createBasicData("attachmentType_23","" , "attachmentType", "汇总表", "附件类型分类");
		this.createBasicData("attachmentType_24","" , "attachmentType", "其他资料", "附件类型分类");
															
		this.createBasicData("deptType_01","" , "deptType", "普通部门", "部门类型分类");
		this.createBasicData("deptType_02","" , "deptType", "涉及部门", "部门类型分类");
		
		this.createBasicData("draftSecretLevel_01","" , "draftSecretLevel", "公开", "拟稿秘密等级分类");
		this.createBasicData("draftSecretLevel_02","" , "draftSecretLevel", "国内", "拟稿秘密等级分类");
		this.createBasicData("draftSecretLevel_03","" , "draftSecretLevel", "内部", "拟稿秘密等级分类");
		this.createBasicData("draftSecretLevel_04","" , "draftSecretLevel", "秘密", "拟稿秘密等级分类");
		this.createBasicData("draftSecretLevel_05","" , "draftSecretLevel", "机密", "拟稿秘密等级分类");
		this.createBasicData("draftSecretLevel_06","" , "draftSecretLevel", "绝密", "拟稿秘密等级分类");
		
		this.createBasicData("draftStatus_01","" , "draftStatus", "经办人拟稿", "拟稿状态分类");
		this.createBasicData("draftStatus_02","" , "draftStatus", "生成发文正文", "拟稿状态分类");
		this.createBasicData("draftStatus_03","" , "draftStatus", "领导审批", "拟稿状态分类");
		this.createBasicData("draftStatus_04","" , "draftStatus", "项目发文", "拟稿状态分类");
		
		this.createBasicData("fileSet_01","" , "fileSet", "平件", "文件缓急分类");
		this.createBasicData("fileSet_02","" , "fileSet", "平急", "文件缓急分类");
		this.createBasicData("fileSet_03","" , "fileSet", "急件", "文件缓急分类");
		this.createBasicData("fileSet_04","" , "fileSet", "特急", "文件缓急分类");
		this.createBasicData("fileSet_05","" , "fileSet", "特提", "文件缓急分类");
		
		this.createBasicData("fileType_01","" , "fileType", "函", "文件种类分类");
		this.createBasicData("fileType_02","" , "fileType", "指示", "文件种类分类");
		this.createBasicData("fileType_03","" , "fileType", "通知", "文件种类分类");
		this.createBasicData("fileType_04","" , "fileType", "命令", "文件种类分类");
		this.createBasicData("fileType_05","" , "fileType", "决定", "文件种类分类");
		this.createBasicData("fileType_06","" , "fileType", "公告", "文件种类分类");
		this.createBasicData("fileType_07","" , "fileType", "通告", "文件种类分类");
		this.createBasicData("fileType_08","" , "fileType", "通报", "文件种类分类");
		this.createBasicData("fileType_09","" , "fileType", "议案", "文件种类分类");
		this.createBasicData("fileType_10","" , "fileType", "报告", "文件种类分类");
		this.createBasicData("fileType_11","" , "fileType", "请示", "文件种类分类");
		this.createBasicData("fileType_12","" , "fileType", "批复", "文件种类分类");
		this.createBasicData("fileType_13","" , "fileType", "意见", "文件种类分类");
		
		this.createBasicData("foundAppliRepoGenerationStatus_01","" , "foundAppliRepoGenerationStatus", "未生成", "资金申请报告生成状态分类");
		this.createBasicData("foundAppliRepoGenerationStatus_02","" , "foundAppliRepoGenerationStatus", "生成成功", "资金申请报告生成状态分类");
		this.createBasicData("foundAppliRepoGenerationStatus_03","" , "foundAppliRepoGenerationStatus", "生成失败", "资金申请报告生成状态分类");
		
		this.createBasicData("openType_01","" , "openType", "主动公开", "公开类型分类");
		this.createBasicData("openType_02","" , "openType", "依申请公开", "公开类型分类");
		this.createBasicData("openType_03","" , "openType", "不公开", "公开类型分类");
		
		this.createBasicData("postingType_01","" , "postingType", "上行文", "发文种类");
		this.createBasicData("postingType_02","" , "postingType", "平行文", "发文种类");
		this.createBasicData("postingType_03","" , "postingType", "下行文", "发文种类");
		
		this.createBasicData("problemType_01","" , "problemType", "规划设计审批及调整问题", "问题类型分类");
		this.createBasicData("problemType_02","" , "problemType", "征地拆迁问题", "问题类型分类");
		this.createBasicData("problemType_03","" , "problemType", "项目选址问题", "问题类型分类");
		this.createBasicData("problemType_04","" , "problemType", "资金保障问题", "问题类型分类");
		this.createBasicData("problemType_05","" , "problemType", "中央及省部级部门审批问题", "问题类型分类");
		this.createBasicData("problemType_06","" , "problemType", "其他", "问题类型分类");
		
		this.createBasicData("projectClassifiy_01","" , "projectClassifiy", "政府投资房建类", "项目分类");
		this.createBasicData("projectClassifiy_02","" , "projectClassifiy", "政府投资市政类", "项目分类");
		this.createBasicData("projectClassifiy_03","" , "projectClassifiy", "社会投资房建类", "项目分类");
		this.createBasicData("projectClassifiy_04","" , "projectClassifiy", "社会投资市政类", "项目分类");
		
		this.createBasicData("projectConstrChar_01","" , "projectConstrChar", "新建", "项目建设性质分类");
		this.createBasicData("projectConstrChar_02","" , "projectConstrChar", "扩建", "项目建设性质分类");
		this.createBasicData("projectConstrChar_03","" , "projectConstrChar", "迁建", "项目建设性质分类");
		this.createBasicData("projectConstrChar_04","" , "projectConstrChar", "改建", "项目建设性质分类");
		this.createBasicData("projectConstrChar_05","" , "projectConstrChar", "前期", "项目建设性质分类");
		this.createBasicData("projectConstrChar_06","" , "projectConstrChar", "新开工", "项目建设性质分类");
		this.createBasicData("projectConstrChar_07","" , "projectConstrChar", "续建", "项目建设性质分类");
		
		this.createBasicData("projectIndustry_01","" , "projectIndustry", "农业水利", "项目行业分类");
		this.createBasicData("projectIndustry_01_01","projectIndustry_01" , "projectIndustry", "农业", "项目行业分类-农业水利");
		this.createBasicData("projectIndustry_01_02","projectIndustry_01" , "projectIndustry", "水库", "项目行业分类-农业水利");
		this.createBasicData("projectIndustry_01_03","projectIndustry_01" , "projectIndustry", "其他水事工程", "项目行业分类-农业水利");
		
		this.createBasicData("projectIndustry_02","" , "projectIndustry", "能源", "项目行业分类");
		this.createBasicData("projectIndustry_02_01","projectIndustry_02" , "projectIndustry", "水电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_02","projectIndustry_02" , "projectIndustry", "抽水蓄能电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_03","projectIndustry_02" , "projectIndustry", "火电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_04","projectIndustry_02" , "projectIndustry", "热电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_05","projectIndustry_02" , "projectIndustry", "风电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_06","projectIndustry_02" , "projectIndustry", "核电站", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_07","projectIndustry_02" , "projectIndustry", "电网工程", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_08","projectIndustry_02" , "projectIndustry", "煤矿", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_09","projectIndustry_02" , "projectIndustry", "煤制燃料", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_10","projectIndustry_02" , "projectIndustry", "液化石油气接收、存储设施(不含油气田、炼油厂的配套项目)", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_11","projectIndustry_02" , "projectIndustry", "进口液化天然气接收、储运设施", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_12","projectIndustry_02" , "projectIndustry", "输油管网", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_13","projectIndustry_02" , "projectIndustry", "输气管网", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_14","projectIndustry_02" , "projectIndustry", "炼油", "项目行业分类-能源");
		this.createBasicData("projectIndustry_02_15","projectIndustry_02" , "projectIndustry", "变性燃料乙醇", "项目行业分类-能源");

		this.createBasicData("projectIndustry_03","" , "projectIndustry", "交通运输", "项目行业分类");
		this.createBasicData("projectIndustry_03_01","projectIndustry_03" , "projectIndustry", "新建(含增建)铁路", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_02","projectIndustry_03" , "projectIndustry", "公路", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_03","projectIndustry_03" , "projectIndustry", "独立公(铁)路桥梁、隧道", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_04","projectIndustry_03" , "projectIndustry", "煤炭、矿石、油气专用泊位", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_05","projectIndustry_03" , "projectIndustry", "集装箱专用码头", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_06","projectIndustry_03" , "projectIndustry", "内河航运", "项目行业分类-交通运输");
		this.createBasicData("projectIndustry_03_07","projectIndustry_03" , "projectIndustry", "民航", "项目行业分类-交通运输");

		this.createBasicData("projectIndustry_04","" , "projectIndustry", "信息产业", "项目行业分类");
		this.createBasicData("projectIndustry_04_01","projectIndustry_04" , "projectIndustry", "电信", "项目行业分类-信息产业");
		
		this.createBasicData("projectIndustry_05","" , "projectIndustry", "原材料", "项目行业分类");
		this.createBasicData("projectIndustry_05_01","projectIndustry_05" , "projectIndustry", "稀土、铁矿、有色矿山开发", "项目行业分类-原材料");
		this.createBasicData("projectIndustry_05_02","projectIndustry_05" , "projectIndustry", "石化", "项目行业分类-原材料");
		this.createBasicData("projectIndustry_05_03","projectIndustry_05" , "projectIndustry", "化工", "项目行业分类-原材料");
		this.createBasicData("projectIndustry_05_04","projectIndustry_05" , "projectIndustry", "稀土", "项目行业分类-原材料");
		this.createBasicData("projectIndustry_05_05","projectIndustry_05" , "projectIndustry", "黄金", "项目行业分类-原材料");
		
		this.createBasicData("projectIndustry_06","" , "projectIndustry", "机械制造", "项目行业分类");
		this.createBasicData("projectIndustry_06_01","projectIndustry_06" , "projectIndustry", "汽车", "项目行业分类-机械制造");
		
		this.createBasicData("projectIndustry_07","" , "projectIndustry", "轻工", "项目行业分类");
		this.createBasicData("projectIndustry_07_01","projectIndustry_07" , "projectIndustry", "烟草", "项目行业分类-轻工");
		
		this.createBasicData("projectIndustry_08","" , "projectIndustry", "高新技术", "项目行业分类");
		this.createBasicData("projectIndustry_08_01","projectIndustry_08" , "projectIndustry", "民用航空航天", "项目行业分类-高新技术");
		
		this.createBasicData("projectIndustry_09","" , "projectIndustry", "城建", "项目行业分类");
		this.createBasicData("projectIndustry_09_01","projectIndustry_09" , "projectIndustry", "城市快速轨道交通项目", "项目行业分类-城建");
		this.createBasicData("projectIndustry_09_02","projectIndustry_09" , "projectIndustry", "城市道路桥梁、隧道", "项目行业分类-城建");
		this.createBasicData("projectIndustry_09_03","projectIndustry_09" , "projectIndustry", "其他城建项目", "项目行业分类-城建");
		
		this.createBasicData("projectIndustry_10","" , "projectIndustry", "社会事业", "项目行业分类");
		this.createBasicData("projectIndustry_10_01","projectIndustry_10" , "projectIndustry", "主题公园", "项目行业分类-社会事业");
		this.createBasicData("projectIndustry_10_02","projectIndustry_10" , "projectIndustry", "旅游", "项目行业分类-社会事业");
		this.createBasicData("projectIndustry_10_03","projectIndustry_10" , "projectIndustry", "其他社会事业项目", "项目行业分类-社会事业");

		this.createBasicData("projectIndustry_11","" , "projectIndustry", "外商投资", "项目行业分类");
		this.createBasicData("projectIndustry_11_01","projectIndustry_11" , "projectIndustry", "外商投资民航业项目", "项目行业分类-外商投资");
		
		this.createBasicData("projectIndustry_12","" , "projectIndustry", "境外投资", "项目行业分类");
		
		this.createBasicData("projectInvestmentType_01","" , "projectInvestmentType", "政府投资", "项目投资类型分类");
		this.createBasicData("projectInvestmentType_01_01","projectInvestmentType_01" , "projectInvestmentType", "市投市建", "项目行业分类-政府投资");
		this.createBasicData("projectInvestmentType_01_02","projectInvestmentType_01" , "projectInvestmentType", "市投区建", "项目行业分类-政府投资");
		this.createBasicData("projectInvestmentType_01_03","projectInvestmentType_01" , "projectInvestmentType", "市、区共投", "项目行业分类-政府投资");

		this.createBasicData("projectInvestmentType_02","" , "projectInvestmentType", "社会投资", "项目投资类型分类");
		this.createBasicData("projectInvestmentType_02_01","projectInvestmentType_02" , "projectInvestmentType", "市、区政府及社会投资组合类", "项目行业分类-社会投资");

		this.createBasicData("projectProgress_01","" , "projectProgress", "进展顺利", "项目进度分类");
		this.createBasicData("projectProgress_02","" , "projectProgress", "进展略滞后于计划", "项目进度分类");
		this.createBasicData("projectProgress_03","" , "projectProgress", "进展大幅滞后于计划", "项目进度分类");
		
		this.createBasicData("projectStage_01","" , "projectStage", "前期计划(前期费)", "项目申报阶段分类");
		this.createBasicData("projectStage_02","" , "projectStage", "规划设计前期费", "项目申报阶段分类");
		this.createBasicData("projectStage_03","" , "projectStage", "新开工计划", "项目申报阶段分类");
		this.createBasicData("projectStage_04","" , "projectStage", "续建计划", "项目申报阶段分类");
		this.createBasicData("projectStage_05","" , "projectStage", "委托审计", "项目申报阶段分类");
		this.createBasicData("projectStage_06","" , "projectStage", "审计决算资金", "项目申报阶段分类");
		this.createBasicData("projectStage_07","" , "projectStage", "下一年度计划", "项目申报阶段分类");
		this.createBasicData("projectStage_08","" , "projectStage", "年度调整计划", "项目申报阶段分类");
		this.createBasicData("projectStage_09","" , "projectStage", "项目建议书", "项目申报阶段分类");
		this.createBasicData("projectStage_10","" , "projectStage", "可行性研究报告", "项目申报阶段分类");
		this.createBasicData("projectStage_11","" , "projectStage", "初步设计概算", "项目申报阶段分类");
		this.createBasicData("projectStage_12","" , "projectStage", "核准", "项目申报阶段分类");
		this.createBasicData("projectStage_13","" , "projectStage", "备案", "项目申报阶段分类");
		
		this.createBasicData("projectStatus_01","" , "projectStatus", "未提交", "项目状态分类");
		this.createBasicData("projectStatus_02","" , "projectStatus", "已提交", "项目状态分类");
		this.createBasicData("projectStatus_03","" , "projectStatus", "已收件", "项目状态分类");
		
		this.createBasicData("projectType_01","" , "projectType", "市重大项目", "项目类型分类");
		this.createBasicData("projectType_02","" , "projectType", "区重大项目", "项目类型分类");
		this.createBasicData("projectType_03","" , "projectType", "区重大民生项目", "项目类型分类");
		this.createBasicData("projectType_04","" , "projectType", "市十二项重大民生项目", "项目类型分类");
		this.createBasicData("projectType_05","" , "projectType", "重点区域项目", "项目类型分类");
		this.createBasicData("projectType_06","" , "projectType", "2014年度计划A类", "项目类型分类");
		this.createBasicData("projectType_07","" , "projectType", "2015年度计划A类", "项目类型分类");
		this.createBasicData("projectType_08","" , "projectType", "2016年度计划A类", "项目类型分类");
		this.createBasicData("projectType_09","" , "projectType", "2017年前期项目", "项目类型分类");
		this.createBasicData("projectType_10","" , "projectType", "其他", "项目类型分类");
		
		this.createBasicData("qualifiyLevel_01","" , "qualifiyLevel", "甲级", "编制单位资质分类");
		this.createBasicData("qualifiyLevel_02","" , "qualifiyLevel", "乙级", "编制单位资质分类");
		this.createBasicData("qualifiyLevel_03","" , "qualifiyLevel", "丙级", "编制单位资质分类");
		
		this.createBasicData("unitProperty_01","" , "unitProperty", "党政机关", "单位性质分类");
		this.createBasicData("unitProperty_02","" , "unitProperty", "私营企业", "单位性质分类");
		this.createBasicData("unitProperty_03","" , "unitProperty", "股份制企业", "单位性质分类");
		this.createBasicData("unitProperty_04","" , "unitProperty", "外商独资企业", "单位性质分类");
		this.createBasicData("unitProperty_05","" , "unitProperty", "社会团体", "单位性质分类");
		this.createBasicData("unitProperty_06","" , "unitProperty", "中外合资企业", "单位性质分类");
		this.createBasicData("unitProperty_07","" , "unitProperty", "中外合作企业", "单位性质分类");
		this.createBasicData("unitProperty_08","" , "unitProperty", "全额事业单位", "单位性质分类");
		this.createBasicData("unitProperty_09","" , "unitProperty", "差额事业单位", "单位性质分类");
		this.createBasicData("unitProperty_10","" , "unitProperty", "企业化管理事业单位", "单位性质分类");
		this.createBasicData("unitProperty_11","" , "unitProperty", "全民所有制企业", "单位性质分类");
		this.createBasicData("unitProperty_12","" , "unitProperty", "集体所有制企业", "单位性质分类");
		this.createBasicData("unitProperty_13","" , "unitProperty", "其他", "单位性质分类");
		
		this.createBasicData("440306002001","" , "division", "光明居民委员会", "行政区划");


				
		// 更新sysConfig
		sysConfig = new SysConfig();
		sysConfig.setInit(true);
		sysConfig.setId("基础数据初始化");
		sysConfigRepo.save(sysConfig);

		response.setMessage("基础数据初始化成功");
		response.setSuccess(true);
		
		logger.info("基础数据初始化成功!");
	
		return response;

	}
	public BasicData createBasicData(String id,String pid,String identity,String description,String comment){
		BasicData basicData = new BasicData();
		basicData.setId(id);
		basicData.setpId(pid);
		basicData.setIdentity(identity);
		basicData.setDescription(description);
		basicData.setComment(comment);
		basicDataRepo.save(basicData);
		return basicData;
	}
	
}

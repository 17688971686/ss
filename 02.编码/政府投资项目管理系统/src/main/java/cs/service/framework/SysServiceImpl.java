package cs.service.framework;

import java.lang.annotation.Annotation;
import java.lang.reflect.Method;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;
import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestMapping;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.sysResource.ClassFinder;
import cs.common.sysResource.SysResourceDto;
import cs.domain.BasicData;
import cs.domain.ReplyFile;
import cs.domain.UserUnitInfo;
import cs.domain.framework.Resource;
import cs.domain.framework.Role;
import cs.domain.framework.Role_;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.domain.framework.User;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.common.BasicDataRepo;
import cs.repository.framework.RoleRepoImpl;
import cs.repository.framework.SysConfigRepoImpl;
import cs.repository.framework.UserRepoImpl;
import cs.repository.impl.UserUnitInfoRepoImpl;
import cs.repository.interfaces.IRepository;

@Service
public class SysServiceImpl implements SysService{
	private static Logger logger = Logger.getLogger(SysServiceImpl.class);

	@Autowired
	private RoleRepoImpl roleRepo;
	@Autowired
	private UserRepoImpl userRepo;
	@Autowired
	private IRepository<UserUnitInfo, String> userUnitInfoRepo;
	@Autowired
	private SysConfigRepoImpl sysConfigRepo;
	@Autowired
	private BasicDataRepo basicDataRepo;
	@Autowired
	private IMapper<SysConfigDto,SysConfig> sysConfigMapper;
	@Autowired
	ICurrentUser currentUser;
	
	@Override
	public List<SysResourceDto> getSysResources() {

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
		
		Criterion criterion=Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_admin);
		Criterion criterion2=Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_unit);
		Criterion criterion3=Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_manage);
		Criterion criterionOr=Restrictions.or(criterion,criterion2,criterion3);
		
		List<Role> roles=roleRepo.findByCriteria(criterionOr);
		
		roles.forEach(x->{
			x.getUsers().forEach(y->{
				y.getRoles().clear();
				userRepo.delete(y);
			});			
			roleRepo.delete(x);
		});
		List<SysConfig> sysConfigs = sysConfigRepo.findAll();
		sysConfigs.forEach(x->{
			sysConfigRepo.delete(x);
		});
		
		List<UserUnitInfo> userUnitInfos = userUnitInfoRepo.findAll();
		userUnitInfos.forEach(x->{
			userUnitInfoRepo.delete(x);
		});
		
		
		//end
		//初始化配置
		SysConfig con = new SysConfig();
		con.setConfigName(BasicDataConfig.taskType_sendMesg);
		con.setConfigType(BasicDataConfig.taskType);
		con.setId(UUID.randomUUID().toString());
		con.setCreatedBy("admin");
		con.setCreatedDate(new Date());
		con.setEnable(false);
		
		SysConfig con2 = new SysConfig();
		con2.setConfigName(BasicDataConfig.taskType_shenBaoDK);
		con2.setConfigType(BasicDataConfig.taskType);
		con2.setId(UUID.randomUUID().toString());
		con2.setCreatedBy("admin");
		con2.setCreatedDate(new Date());
		con2.setEnable(false);
		
		sysConfigRepo.save(con);
		sysConfigRepo.save(con2);
		// 初始化角色
		Role role = new Role();
		role.setRoleName(BasicDataConfig.role_admin);
		role.setId(UUID.randomUUID().toString());
		role.setComment("系统初始化创建,不可删除");
		
		Role role2 = new Role();
		role2.setRoleName(BasicDataConfig.role_unit);
		role2.setId(UUID.randomUUID().toString());
		role2.setComment("系统初始化创建,不可删除");
		
		Role role3 = new Role();
		role3.setRoleName(BasicDataConfig.role_manage);
		role3.setId(UUID.randomUUID().toString());
		role3.setComment("系统初始化创建,不可删除");

		List<SysResourceDto> resourceDtos = this.getSysResources();
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
		roleRepo.save(role2);
		roleRepo.save(role3);

		// 初始化超级用户
		User user = new User();
		user.setLoginName("admin");
		user.setId(UUID.randomUUID().toString());
		user.setPassword("admin");
		user.setComment("系统初始化创建,不可删除");
		user.setDisplayName("超级管理员");
		user.getRoles().add(role);
		userRepo.save(user);

		//初始化建设单位用户信息和单位信息
		String[] userNames = {"党工委管委会","组织人事局","统战和社会建设局","城市管理局","光明供电局",
								"文体教育局","光明交通运输局","住房和建设局","发展和财政局","卫生计生局",
								"光明公安分局","环境保护和水务局","经济服务局","纪检监察局","市规划和国土资源委员会光明管理局",
								"综合办","公明办事处","光明办事处","马田办事处","凤凰办事处",
								"公共资源交易中心","城市发展促进中心","机关后勤服务中心","土地整备中心","建筑工务局",
								"光明消防大队","光明现役消防支队光明新区大队","规划土地监察大队","深水光明","经发公司"};
		
		for(String userName : userNames){
			User unitUser = new User();
			unitUser.setId(UUID.randomUUID().toString());
			unitUser.setDisplayName(userName);
			unitUser.setLoginName(userName);
			unitUser.setPassword("888888");
			unitUser.setComment("系统初始化创建");
			unitUser.getRoles().add(role2);
			userRepo.save(unitUser);
			
			UserUnitInfo userUnitInfo = new UserUnitInfo();
			userUnitInfo.setId(UUID.randomUUID().toString());
			userUnitInfo.setUnitName(userName);
			userUnitInfo.setUserName(unitUser.getId());
			userUnitInfo.setRemark("系统初始化创建");
			userUnitInfoRepo.save(userUnitInfo);
		}
		
		response.setMessage("初始化成功");
		response.setSuccess(true);
		
		logger.info("系统初始化成功!");
		return response;

	}
	@Override
	@Transactional
	public Response SysInitBasicData() {
		Response response = new Response();
		
		//删除历史基础数据		
		basicDataRepo.getSession().createQuery(String.format("delete from %s",BasicData.class.getSimpleName())).executeUpdate();
		

		//初始化基础数据
		
		this.createBasicData("documentType","" , "documentType", "文件种类", "");
		this.createBasicData("documentType_1","documentType" , "documentType", "函", "");
		this.createBasicData("documentType_2","documentType" , "documentType", "指示", "");
		this.createBasicData("documentType_3","documentType" , "documentType", "通知", "");
		this.createBasicData("documentType_4","documentType" , "documentType", "命令", "");
		this.createBasicData("documentType_5","documentType" , "documentType", "决定", "");
		this.createBasicData("documentType_6","documentType" , "documentType", "公告", "");
		this.createBasicData("documentType_7","documentType" , "documentType", "通告", "");
		this.createBasicData("documentType_8","documentType" , "documentType", "通报", "");
		this.createBasicData("documentType_9","documentType" , "documentType", "议案", "");
		this.createBasicData("documentType_10","documentType" , "documentType", "报告", "");
		this.createBasicData("documentType_11","documentType" , "documentType", "请示", "");
		this.createBasicData("documentType_12","documentType" , "documentType", "批复", "");
		this.createBasicData("documentType_13","documentType" , "documentType", "意见", "");
		
		this.createBasicData("postingCategory","" , "postingCategory", "发文种类", "");
		this.createBasicData("postingCategory_1","postingCategory" , "postingCategory", "上行文", "");
		this.createBasicData("postingCategory_2","postingCategory" , "postingCategory", "平行文", "");
		this.createBasicData("postingCategory_3","postingCategory" , "postingCategory", "下行文", "");
		
		this.createBasicData("approvalType","" , "approvalType", "批复类型分类", "");
		this.createBasicData("approvalType_1","approvalType" , "approvalType", "深发改", "");
		this.createBasicData("approvalType_2","approvalType" , "approvalType", "深发改函", "");
		this.createBasicData("approvalType_3","approvalType" , "approvalType", "深光发改", "");
		this.createBasicData("approvalType_4","approvalType" , "approvalType", "深光发改函", "");
		
		this.createBasicData("attachmentType","" , "attachmentType", "附件类型分类", "");
		this.createBasicData("attachmentType_1","attachmentType" , "attachmentType", "申请报告(pdf版，加盖公章)", "");
		this.createBasicData("attachmentType_2","attachmentType" , "attachmentType", "申请报告(Word版)", "");
		this.createBasicData("attachmentType_3","attachmentType" , "attachmentType", "投资计划", "");
		this.createBasicData("attachmentType_4","attachmentType" , "attachmentType", "概算批复", "");
		this.createBasicData("attachmentType_5","attachmentType" , "attachmentType", "前期工作计划文件", "");
		this.createBasicData("attachmentType_6","attachmentType" , "attachmentType", "项目实施依据文件", "");
		this.createBasicData("attachmentType_7","attachmentType" , "attachmentType", "历年政府投资计划下达文件", "");
		this.createBasicData("attachmentType_8","attachmentType" , "attachmentType", "可行性研究报告批复文件", "");
		this.createBasicData("attachmentType_9","attachmentType" , "attachmentType", "项目建议书批复文件", "");
		this.createBasicData("attachmentType_10","attachmentType" , "attachmentType", "项目总概算批复文件", "");
		this.createBasicData("attachmentType_11","attachmentType" , "attachmentType", "项目建议书批文复印件", "");
		this.createBasicData("attachmentType_12","attachmentType" , "attachmentType", "上一年度计划批文复印件", "");
		this.createBasicData("attachmentType_13","attachmentType" , "attachmentType", "工程规划许可证扫描件", "");
		this.createBasicData("attachmentType_14","attachmentType" , "attachmentType", "概算批复扫描件", "");
		this.createBasicData("attachmentType_15","attachmentType" , "attachmentType", "全部已下达计划批复文件扫描件", "");
		this.createBasicData("attachmentType_16","attachmentType" , "attachmentType", "建设工程规划许可证", "");
		this.createBasicData("attachmentType_17","attachmentType" , "attachmentType", "土地落实情况、征地拆迁有关情况", "");
		this.createBasicData("attachmentType_18","attachmentType" , "attachmentType", "项目工程形象进度及年度资金需求情况", "");
		this.createBasicData("attachmentType_19","attachmentType" , "attachmentType", "项目进展情况相关资料", "");
		this.createBasicData("attachmentType_20","attachmentType" , "attachmentType", "年度完成建设内容及各阶段工作内容完成时间表", "");
		this.createBasicData("attachmentType_21","attachmentType" , "attachmentType", "会议纪要", "");
		this.createBasicData("attachmentType_22","attachmentType" , "attachmentType", "送审造价", "");
		this.createBasicData("attachmentType_23","attachmentType" , "attachmentType", "汇总表", "");
		this.createBasicData("attachmentType_24","attachmentType" , "attachmentType", "其他资料", "");
															
		this.createBasicData("deptType","" , "deptType", "部门类型分类", "");
		this.createBasicData("deptType_1","deptType" , "deptType", "普通部门", "");
		this.createBasicData("deptType_2","deptType" , "deptType", "涉及部门", "");
		
		this.createBasicData("hecretHierarchy","hecretHierarchy" , "hecretHierarchy", "拟稿秘密等级分类", "");
		this.createBasicData("hecretHierarchy_1","hecretHierarchy" , "hecretHierarchy", "公开", "");
		this.createBasicData("hecretHierarchy_2","hecretHierarchy" , "hecretHierarchy", "国内", "");
		this.createBasicData("hecretHierarchy_3","hecretHierarchy" , "hecretHierarchy", "内部", "");
		this.createBasicData("hecretHierarchy_4","hecretHierarchy" , "hecretHierarchy", "秘密", "");
		this.createBasicData("hecretHierarchy_5","hecretHierarchy" , "hecretHierarchy", "机密", "");
		this.createBasicData("hecretHierarchy_6","hecretHierarchy" , "hecretHierarchy", "绝密", "");
		
		this.createBasicData("draftStatus","" , "draftStatus", "拟稿状态分类", "");
		this.createBasicData("draftStatus_1","draftStatus" , "draftStatus", "经办人拟稿", "");
		this.createBasicData("draftStatus_2","draftStatus" , "draftStatus", "生成发文正文", "");
		this.createBasicData("draftStatus_3","draftStatus" , "draftStatus", "领导审批", "");
		this.createBasicData("draftStatus_4","draftStatus" , "draftStatus", "项目发文", "");
		
		this.createBasicData("fileSet","" , "fileSet", "文件缓急分类", "");
		this.createBasicData("fileSet_1","fileSet" , "fileSet", "平件", "");
		this.createBasicData("fileSet_2","fileSet" , "fileSet", "平急", "");
		this.createBasicData("fileSet_3","fileSet" , "fileSet", "急件", "");
		this.createBasicData("fileSet_4","fileSet" , "fileSet", "特急", "");
		this.createBasicData("fileSet_5","fileSet" , "fileSet", "特提", "");
		
		this.createBasicData("foundAppliRepoGenerationStatus","","foundAppliRepoGenerationStatus", "资金申请报告生成状态分类", "");
		this.createBasicData("foundAppliRepoGenerationStatus_1","foundAppliRepoGenerationStatus" , "foundAppliRepoGenerationStatus", "未生成", "");
		this.createBasicData("foundAppliRepoGenerationStatus_2","foundAppliRepoGenerationStatus" , "foundAppliRepoGenerationStatus", "生成成功", "");
		this.createBasicData("foundAppliRepoGenerationStatus_3","foundAppliRepoGenerationStatus" , "foundAppliRepoGenerationStatus", "生成失败", "");
		
		this.createBasicData("openType","" , "openType", "公开类型分类", "");
		this.createBasicData("openType_1","openType" , "openType", "主动公开", "");
		this.createBasicData("openType_2","openType" , "openType", "依申请公开", "");
		this.createBasicData("openType_3","openType" , "openType", "不公开", "");
		
		this.createBasicData("problemType","" , "problemType", "问题类型分类", "");
		this.createBasicData("problemType_1","problemType" , "problemType", "规划设计审批及调整问题", "");
		this.createBasicData("problemType_2","problemType" , "problemType", "征地拆迁问题", "");
		this.createBasicData("problemType_3","problemType" , "problemType", "项目选址问题", "");
		this.createBasicData("problemType_4","problemType" , "problemType", "资金保障问题", "");
		this.createBasicData("problemType_5","problemType" , "problemType", "中央及省部级部门审批问题", "");
		this.createBasicData("problemType_6","problemType" , "problemType", "其他", "");
		
		this.createBasicData("projectClassify","" , "projectClassify", "项目分类", "");
		this.createBasicData("projectClassify_1","projectClassify" , "projectClassify", "政府投资项目分类", "");
			this.createBasicData("projectClassify_1_1","projectClassify_1" , "projectClassify", "政府投资房建类", "");
			this.createBasicData("projectClassify_1_2","projectClassify_1" , "projectClassify", "政府投资市政类", "");
			this.createBasicData("projectClassify_1_3","projectClassify_1" , "projectClassify", "政府投资水务类", "");
			this.createBasicData("projectClassify_1_4","projectClassify_1" , "projectClassify", "其它", "");
		this.createBasicData("projectClassify_2","projectClassify" , "projectClassify", "社会投资项目分类", "");		
			this.createBasicData("projectClassify_2_1","projectClassify_2" , "projectClassify", "社会投资房建类", "");
			this.createBasicData("projectClassify_2_2","projectClassify_2" , "projectClassify", "社会投资市政类", "");
			this.createBasicData("projectClassify_2_3","projectClassify_2" , "projectClassify", "社会投资水务类", "");
			this.createBasicData("projectClassify_2_4","projectClassify_2" , "projectClassify", "其它", "");
		
		this.createBasicData("projectConstrChar","" , "projectConstrChar", "项目建设性质分类", "");		
		this.createBasicData("projectConstrChar_1","projectConstrChar" , "projectConstrChar", "前期", "");
		this.createBasicData("projectConstrChar_2","projectConstrChar" , "projectConstrChar", "新开工", "");
		this.createBasicData("projectConstrChar_3","projectConstrChar" , "projectConstrChar", "续建", "");
		this.createBasicData("projectConstrChar_4","projectConstrChar" , "projectConstrChar", "储备类", "");
 		
		this.createBasicData("projectIndustry","" , "projectIndustry", "项目行业分类","项目行业分类",false);
			this.createBasicData("projectIndustry_1","projectIndustry" , "projectIndustry", "政府投资项目行业分类", "",0,false);
				this.createBasicData("projectIndustry_1_1","projectIndustry_1" , "projectIndustry", "文体", "WT",0,false,5);
				this.createBasicData("projectIndustry_1_2","projectIndustry_1" , "projectIndustry", "教育", "JY",0,false,3);
				this.createBasicData("projectIndustry_1_3","projectIndustry_1" , "projectIndustry", "卫生", "WS",0,false,4);
				this.createBasicData("projectIndustry_1_4","projectIndustry_1" , "projectIndustry", "环保水务", "HS",0,false,1);
				this.createBasicData("projectIndustry_1_5","projectIndustry_1" , "projectIndustry", "道路交通", "DJ",0,false,2);
				this.createBasicData("projectIndustry_1_6","projectIndustry_1" , "projectIndustry", "公园绿化", "GL",0,false,6);
				this.createBasicData("projectIndustry_1_7","projectIndustry_1" , "projectIndustry", "电力燃气", "DR",0,false,8);
				this.createBasicData("projectIndustry_1_8","projectIndustry_1" , "projectIndustry", "城市管理", "CG",0,false,11);
				this.createBasicData("projectIndustry_1_9","projectIndustry_1" , "projectIndustry", "公共安全", "GA",0,false,16);
				this.createBasicData("projectIndustry_1_10","projectIndustry_1" , "projectIndustry", "社会保障 ", "SB",0,false,9);
				this.createBasicData("projectIndustry_1_11","projectIndustry_1" , "projectIndustry", "党政机关", "DZ",0,false,13);
				this.createBasicData("projectIndustry_1_12","projectIndustry_1" , "projectIndustry", "征地拆迁", "ZC",0,false,14);
				this.createBasicData("projectIndustry_1_13","projectIndustry_1" , "projectIndustry", "其他", "QT",0,false,17);
				this.createBasicData("projectIndustry_1_14","projectIndustry_1" , "projectIndustry", "地质灾害治理", "DZ",0,false,10);
				this.createBasicData("projectIndustry_1_15","projectIndustry_1" , "projectIndustry", "社区建设", "QJ",0,false,7);
				this.createBasicData("projectIndustry_1_16","projectIndustry_1" , "projectIndustry", "社会建设", "HJ",0,false,12);
				this.createBasicData("projectIndustry_1_17","projectIndustry_1" , "projectIndustry", "规划课题", "GK",0,false,15);
			this.createBasicData("projectIndustry_2","projectIndustry" , "projectIndustry", "社会投资项目行业分类", "",false);
				this.createBasicData("projectIndustry_2_1","projectIndustry_2" , "projectIndustry", "农、林、牧、渔业", "",0,false);
					this.createBasicData("projectIndustry_2_1_1","projectIndustry_2_1" , "projectIndustry", "农业", "A01",0,false);
					this.createBasicData("projectIndustry_2_1_2","projectIndustry_2_1" , "projectIndustry", "林业", "A02",0,false);
					this.createBasicData("projectIndustry_2_1_3","projectIndustry_2_1" , "projectIndustry", "畜牧业", "A03",0,false);
					this.createBasicData("projectIndustry_2_1_4","projectIndustry_2_1" , "projectIndustry", "渔业", "A04",0,false);
					this.createBasicData("projectIndustry_2_1_5","projectIndustry_2_1" , "projectIndustry", "...", "A05",0,false);
//			this.createBasicData("projectIndustry_2","projectIndustry" , "projectIndustry", "社会投资项目国民经济行业分类", "");
//		
//		
//		this.createBasicData("projectIndustry_2","projectIndustry" , "projectIndustry", "能源", "");
//		this.createBasicData("projectIndustry_2_1","projectIndustry_2" , "projectIndustry", "水电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_2","projectIndustry_2" , "projectIndustry", "抽水蓄能电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_3","projectIndustry_2" , "projectIndustry", "火电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_4","projectIndustry_2" , "projectIndustry", "热电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_5","projectIndustry_2" , "projectIndustry", "风电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_6","projectIndustry_2" , "projectIndustry", "核电站", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_7","projectIndustry_2" , "projectIndustry", "电网工程", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_8","projectIndustry_2" , "projectIndustry", "煤矿", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_9","projectIndustry_2" , "projectIndustry", "煤制燃料", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_10","projectIndustry_2" , "projectIndustry", "液化石油气接收、存储设施(不含油气田、炼油厂的配套项目)", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_11","projectIndustry_2" , "projectIndustry", "进口液化天然气接收、储运设施", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_12","projectIndustry_2" , "projectIndustry", "输油管网", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_13","projectIndustry_2" , "projectIndustry", "输气管网", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_14","projectIndustry_2" , "projectIndustry", "炼油", "项目行业分类-能源");
//		this.createBasicData("projectIndustry_2_15","projectIndustry_2" , "projectIndustry", "变性燃料乙醇", "项目行业分类-能源");
//
//		this.createBasicData("projectIndustry_3","projectIndustry" , "projectIndustry", "交通运输", "");
//		this.createBasicData("projectIndustry_3_1","projectIndustry_3" , "projectIndustry", "新建(含增建)铁路", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_2","projectIndustry_3" , "projectIndustry", "公路", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_3","projectIndustry_3" , "projectIndustry", "独立公(铁)路桥梁、隧道", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_4","projectIndustry_3" , "projectIndustry", "煤炭、矿石、油气专用泊位", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_5","projectIndustry_3" , "projectIndustry", "集装箱专用码头", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_6","projectIndustry_3" , "projectIndustry", "内河航运", "项目行业分类-交通运输");
//		this.createBasicData("projectIndustry_3_7","projectIndustry_3" , "projectIndustry", "民航", "项目行业分类-交通运输");
//
//		this.createBasicData("projectIndustry_4","projectIndustry" , "projectIndustry", "信息产业", "");
//		this.createBasicData("projectIndustry_4_1","projectIndustry_4" , "projectIndustry", "电信", "项目行业分类-信息产业");
//		
//		this.createBasicData("projectIndustry_5","projectIndustry" , "projectIndustry", "原材料", "");
//		this.createBasicData("projectIndustry_5_1","projectIndustry_5" , "projectIndustry", "稀土、铁矿、有色矿山开发", "项目行业分类-原材料");
//		this.createBasicData("projectIndustry_5_2","projectIndustry_5" , "projectIndustry", "石化", "项目行业分类-原材料");
//		this.createBasicData("projectIndustry_5_3","projectIndustry_5" , "projectIndustry", "化工", "项目行业分类-原材料");
//		this.createBasicData("projectIndustry_5_4","projectIndustry_5" , "projectIndustry", "稀土", "项目行业分类-原材料");
//		this.createBasicData("projectIndustry_5_5","projectIndustry_5" , "projectIndustry", "黄金", "项目行业分类-原材料");
//		
//		this.createBasicData("projectIndustry_6","projectIndustry" , "projectIndustry", "机械制造", "");
//		this.createBasicData("projectIndustry_6_1","projectIndustry_6" , "projectIndustry", "汽车", "项目行业分类-机械制造");
//		
//		this.createBasicData("projectIndustry_7","projectIndustry" , "projectIndustry", "轻工", "");
//		this.createBasicData("projectIndustry_7_1","projectIndustry_7" , "projectIndustry", "烟草", "项目行业分类-轻工");
//		
//		this.createBasicData("projectIndustry_8","projectIndustry" , "projectIndustry", "高新技术", "");
//		this.createBasicData("projectIndustry_8_1","projectIndustry_8" , "projectIndustry", "民用航空航天", "项目行业分类-高新技术");
//		
//		this.createBasicData("projectIndustry_9","projectIndustry" , "projectIndustry", "城建", "");
//		this.createBasicData("projectIndustry_9_1","projectIndustry_9" , "projectIndustry", "城市快速轨道交通项目", "项目行业分类-城建");
//		this.createBasicData("projectIndustry_9_2","projectIndustry_9" , "projectIndustry", "城市道路桥梁、隧道", "项目行业分类-城建");
//		this.createBasicData("projectIndustry_9_3","projectIndustry_9" , "projectIndustry", "其他城建项目", "项目行业分类-城建");
//		
//		this.createBasicData("projectIndustry_10","projectIndustry" , "projectIndustry", "社会事业", "");
//		this.createBasicData("projectIndustry_10_1","projectIndustry_10" , "projectIndustry", "主题公园", "项目行业分类-社会事业");
//		this.createBasicData("projectIndustry_10_2","projectIndustry_10" , "projectIndustry", "旅游", "项目行业分类-社会事业");
//		this.createBasicData("projectIndustry_10_3","projectIndustry_10" , "projectIndustry", "其他社会事业项目", "项目行业分类-社会事业");
//
//		this.createBasicData("projectIndustry_11","projectIndustry" , "projectIndustry", "外商投资", "");
//		this.createBasicData("projectIndustry_11_1","projectIndustry_11" , "projectIndustry", "外商投资民航业项目", "项目行业分类-外商投资");
//		
//		this.createBasicData("projectIndustry_12","projectIndustry" , "projectIndustry", "境外投资", "");
		
		this.createBasicData("projectInvestmentType","" , "projectInvestmentType", "项目投资类型分类", "项目投资类型分类");
		this.createBasicData("projectInvestmentType_1","projectInvestmentType" , "projectInvestmentType", "政府投资项目", "项目投资类型分类");
		this.createBasicData("projectInvestmentType_2","projectInvestmentType" , "projectInvestmentType", "社会投资项目", "项目投资类型分类");

		this.createBasicData("projectProgress","" , "projectProgress", "项目进度分类", "项目进度分类");
		this.createBasicData("projectProgress_1","projectProgress" , "projectProgress", "进展顺利", "项目进度分类");
		this.createBasicData("projectProgress_2","projectProgress" , "projectProgress", "进展略滞后于计划", "项目进度分类");
		this.createBasicData("projectProgress_3","projectProgress" , "projectProgress", "进展大幅滞后于计划", "项目进度分类");
		
		this.createBasicData("projectShenBaoStage","" , "projectShenBaoStage", "项目申报阶段分类", "项目申报阶段分类");
//		this.createBasicData("projectShenBaoStage_1","projectShenBaoStage" , "projectShenBaoStage", "前期计划(前期费)", "项目申报阶段分类");

		this.createBasicData("projectShenBaoStage_1","projectShenBaoStage" , "projectShenBaoStage", "项目建议书", "项目申报阶段分类",1,false);
		this.createBasicData("projectShenBaoStage_2","projectShenBaoStage" , "projectShenBaoStage", "可行性研究报告", "项目申报阶段分类",2,false);
		this.createBasicData("projectShenBaoStage_3","projectShenBaoStage" , "projectShenBaoStage", "初步设计概算", "项目申报阶段分类",3,false);
		this.createBasicData("projectShenBaoStage_4","projectShenBaoStage" , "projectShenBaoStage", "规划设计前期费", "项目申报阶段分类",4,false);
		this.createBasicData("projectShenBaoStage_5","projectShenBaoStage" , "projectShenBaoStage", "新开工计划", "项目申报阶段分类",5,false);
		this.createBasicData("projectShenBaoStage_6","projectShenBaoStage" , "projectShenBaoStage", "续建计划", "项目申报阶段分类",6,false);
		this.createBasicData("projectShenBaoStage_7","projectShenBaoStage" , "projectShenBaoStage", "下一年度计划", "项目申报阶段分类",7,false);
		this.createBasicData("projectShenBaoStage_8","projectShenBaoStage" , "projectShenBaoStage", "竣工决算", "项目申报阶段分类",8,false);
		this.createBasicData("projectShenBaoStage_9","projectShenBaoStage" , "projectShenBaoStage", "资金申请报告", "项目申报阶段分类",9,false);
//		this.createBasicData("projectShenBaoStage_5","projectShenBaoStage" , "projectShenBaoStage", "委托审计", "项目申报阶段分类");
//		this.createBasicData("projectShenBaoStage_8","projectShenBaoStage" , "projectShenBaoStage", "年度调整计划", "项目申报阶段分类");
//		this.createBasicData("projectShenBaoStage_12","projectShenBaoStage" , "projectShenBaoStage", "核准", "项目申报阶段分类");
//		this.createBasicData("projectShenBaoStage_13","projectShenBaoStage" , "projectShenBaoStage", "备案", "项目申报阶段分类");
		
		this.createBasicData("projectStatus","" , "projectStatus", "项目状态分类", "项目状态分类");
		this.createBasicData("projectStatus_1","projectStatus" , "projectStatus", "未提交", "项目状态分类");
		this.createBasicData("projectStatus_2","projectStatus" , "projectStatus", "已提交", "项目状态分类");
		this.createBasicData("projectStatus_3","projectStatus" , "projectStatus", "已收件", "项目状态分类");
		
		this.createBasicData("projectType","" , "projectType", "项目类型分类", "项目类型分类");
		this.createBasicData("projectType_1","projectType" , "projectType", "市重大项目", "项目类型分类");
		this.createBasicData("projectType_2","projectType" , "projectType", "区重大项目", "项目类型分类");
		this.createBasicData("projectType_3","projectType" , "projectType", "凤凰城项目", "项目类型分类");
		this.createBasicData("projectType_4","projectType" , "projectType", "海绵项目", "项目类型分类");
		this.createBasicData("projectType_5","projectType" , "projectType", "治水项目", "项目类型分类");
		this.createBasicData("projectType_6","projectType" , "projectType", "其他", "项目类型分类");
		
		this.createBasicData("projectCategory","", "projectCategory", "项目类别分类", "项目类别分类");
		this.createBasicData("projectCategory_1", "projectCategory", "projectCategory", "A类", "项目类别分类");
		this.createBasicData("projectCategory_2", "projectCategory", "projectCategory", "B类", "项目类别分类");
		this.createBasicData("projectCategory_3", "projectCategory", "projectCategory", "C类", "项目类别分类");
		this.createBasicData("projectCategory_4", "projectCategory", "projectCategory", "D类", "项目类别分类");
		
		this.createBasicData("projectFunctionClassify","", "projectFunctionClassify", "项目功能分类科目", "项目功能分类科目");
		this.createBasicData("projectFunctionClassify_1", "projectFunctionClassify", "projectFunctionClassify", "功能1", "项目功能分类科目");
		this.createBasicData("projectFunctionClassify_2", "projectFunctionClassify", "projectFunctionClassify", "功能2", "项目功能分类科目");
		
		this.createBasicData("projectGoverEconClassify","", "projectGoverEconClassify", "项目政府经济分类科目", "项目政府经济分类科目");
		this.createBasicData("projectGoverEconClassify_1", "projectGoverEconClassify", "projectGoverEconClassify", "经济分类1", "项目政府经济分类科目");
		this.createBasicData("projectGoverEconClassify_2", "projectGoverEconClassify", "projectGoverEconClassify", "经济分类2", "项目政府经济分类科目");
		
		this.createBasicData("capitalOtherType", "", "capitalOtherType", "资金其他来源类型", "资金其他来源类型");
		this.createBasicData("capitalOtherType_1", "capitalOtherType", "capitalOtherType", "海绵资金", "资金其他来源类型");
		this.createBasicData("capitalOtherType_2", "capitalOtherType", "capitalOtherType", "海绵资金2", "资金其他来源类型");
		
		this.createBasicData("qualifiyLevel","" , "qualifiyLevel", "编制单位资质分类", "编制单位资质分类");
		this.createBasicData("qualifiyLevel_1","qualifiyLevel" , "qualifiyLevel", "甲级", "编制单位资质分类");
		this.createBasicData("qualifiyLevel_2","qualifiyLevel" , "qualifiyLevel", "乙级", "编制单位资质分类");
		this.createBasicData("qualifiyLevel_3","qualifiyLevel" , "qualifiyLevel", "丙级", "编制单位资质分类");
		
		this.createBasicData("unitProperty","" , "unitProperty", "单位性质分类", "单位性质分类");
		this.createBasicData("unitProperty_1","unitProperty" , "unitProperty", "党政机关", "单位性质分类");
		this.createBasicData("unitProperty_2","unitProperty" , "unitProperty", "私营企业", "单位性质分类");
		this.createBasicData("unitProperty_3","unitProperty" , "unitProperty", "股份制企业", "单位性质分类");
		this.createBasicData("unitProperty_4","unitProperty" , "unitProperty", "外商独资企业", "单位性质分类");
		this.createBasicData("unitProperty_5","unitProperty" , "unitProperty", "社会团体", "单位性质分类");
		this.createBasicData("unitProperty_6","unitProperty" , "unitProperty", "中外合资企业", "单位性质分类");
		this.createBasicData("unitProperty_7","unitProperty" , "unitProperty", "中外合作企业", "单位性质分类");
		this.createBasicData("unitProperty_8","unitProperty" , "unitProperty", "全额事业单位", "单位性质分类");
		this.createBasicData("unitProperty_9","unitProperty" , "unitProperty", "差额事业单位", "单位性质分类");
		this.createBasicData("unitProperty_10","unitProperty" , "unitProperty", "企业化管理事业单位", "单位性质分类");
		this.createBasicData("unitProperty_11","unitProperty" , "unitProperty", "全民所有制企业", "单位性质分类");
		this.createBasicData("unitProperty_12","unitProperty" , "unitProperty", "集体所有制企业", "单位性质分类");
		this.createBasicData("unitProperty_13","unitProperty" , "unitProperty", "其他", "单位性质分类");
		
		this.createBasicData("area","" , "area", "行政区域", "行政区域");
		this.createBasicData("area_1","area" , "area", "光明新区", "行政区域");
		this.createBasicData("area_1_1","area_1" , "area", "光明街道", "行政区域-街道");
		this.createBasicData("area_1_2","area_1" , "area", "公明街道", "行政区域-街道");
		this.createBasicData("area_1_3","area_1" , "area", "新湖街道", "行政区域-街道");
		this.createBasicData("area_1_4","area_1" , "area", "凤凰街道", "行政区域-街道");
		this.createBasicData("area_1_5","area_1" , "area", "玉塘街道", "行政区域-街道");
		this.createBasicData("area_1_6","area_1" , "area", "马田街道", "行政区域-街道");
		
		this.createBasicData("projectStage","" , "projectStage", "项目阶段", "项目阶段",false);		
		this.createBasicData("projectStage_1","projectStage" , "projectStage", "前期储备阶段", "",false);
		this.createBasicData("projectStage_2","projectStage" , "projectStage", "前期阶段", "",false);
		this.createBasicData("projectStage_3","projectStage" , "projectStage", "施工阶段", "",false);
		this.createBasicData("projectStage_4","projectStage" , "projectStage", "停工阶段", "",false);
		this.createBasicData("projectStage_5","projectStage" , "projectStage", "竣工阶段", "",false);
		this.createBasicData("projectStage_6","projectStage" , "projectStage", "固定资产登记阶段", "",false);
		
		//审批流程
		this.createBasicData("processState","" , "processState", "处理状态", "处理状态",false);		
		this.createBasicData("processState_1","processState" , "processState", "已填报/等待签收", "",false);
		this.createBasicData("processState_2","processState" , "processState", "已签收", "",false);
		this.createBasicData("processState_3","processState" , "processState", "秘书科分办", "",false);
		this.createBasicData("processState_4","processState" , "processState", "科长分办", "",false);
		this.createBasicData("processState_5","processState" , "processState", "经办人初审", "",false);
		this.createBasicData("processState_6","processState" , "processState", "科长复核", "",false);
		this.createBasicData("processState_7","processState" , "processState", "副局长审批", "",false);
		this.createBasicData("processState_8","processState" , "processState", "局长审批", "",false);
		this.createBasicData("processState_9","processState" , "processState", "经办人送审", "",false);
		this.createBasicData("processState_10","processState" , "processState", "评审中心评审", "",false);
		this.createBasicData("processState_11","processState" , "processState", "已办结", "",false);
		this.createBasicData("processState_12","processState" , "processState", "协办", "",false);
		this.createBasicData("processState_13","processState" , "processState", "结束协办", "",false);
		this.createBasicData("processState_14","processState" , "processState", "退回重办", "",false);
		this.createBasicData("processState_15","processState" , "processState", "已退文", "",false);
		this.createBasicData("processState_16","processState" , "processState", "下一流程处理中", "",false);
		this.createBasicData("processState_17","processState" , "processState", "经办人拟稿", "",false);
		this.createBasicData("processState_18","processState" , "processState", "科长核稿", "",false);
		this.createBasicData("processState_19","processState" , "processState", "秘书科核稿", "",false);
		this.createBasicData("processState_20","processState" , "processState", "副局长复核", "",false);
		this.createBasicData("processState_21","processState" , "processState", "局长复核", "",false);
		this.createBasicData("processState_22","processState" , "processState", "秘书科发文登记", "",false);
		this.createBasicData("processState_23","processState" , "processState", "结束审批", "",false);
		this.createBasicData("processState_24","processState" , "processState", "退文办结", "",false);
		
		this.createBasicData("taskType","" , "taskType", "任务类型", "任务类型",false);		
		this.createBasicData("taskType_1","taskType" , "taskType", "月报填报", "",false);
		this.createBasicData("taskType_2","taskType" , "taskType", "下一年度计划", "",false);
		this.createBasicData("taskType_3","taskType" , "taskType", "是否发送短信", "",false);
		this.createBasicData("taskType_4","taskType" , "taskType", "是否打开申报端口", "",false);
		this.createBasicData("taskType_5","taskType" , "taskType", "项目建议书", "",false);
		this.createBasicData("taskType_6","taskType" , "taskType", "可行性研究报告", "",false);
		this.createBasicData("taskType_7","taskType" , "taskType", "初步设计与概算", "",false);
		this.createBasicData("taskType_8","taskType" , "taskType", "前期计划", "",false);
		this.createBasicData("taskType_9","taskType" , "taskType", "新开工计划", "",false);
		this.createBasicData("taskType_10","taskType" , "taskType", "续建计划", "",false);
		this.createBasicData("taskType_11","taskType" , "taskType", "竣工决算", "",false);

		this.createBasicData("auditState","" , "auditState", "审核状态", "审核状态",false);
		this.createBasicData("auditState_1","auditState" , "auditState", "未审核", "",false);
		this.createBasicData("auditState_2","auditState" , "auditState", "审核通过", "",false);
		this.createBasicData("auditState_3","auditState" , "auditState", "审核不通过", "",false);
		this.createBasicData("credentialsType","" , "credentialsType", "证件类型", "");
		this.createBasicData("credentialsType_1","credentialsType" , "credentialsType", "身份证", "");
		this.createBasicData("credentialsType_2","credentialsType" , "credentialsType", "护照", "");
		this.createBasicData("credentialsType_3","credentialsType" , "credentialsType", "户口本", "");
		this.createBasicData("credentialsType_4","credentialsType" , "credentialsType", "军人证", "");
		this.createBasicData("credentialsType_5","credentialsType" , "credentialsType", "党员证", "");
		this.createBasicData("credentialsType_6","credentialsType" , "credentialsType", "其他", "");
		
		this.createBasicData("serviceRating", "", "serviceRating", "服务质量评分", "");
		this.createBasicData("serviceRating_1", "serviceRating", "serviceRating", "优秀(9-10)", "");
		this.createBasicData("serviceRating_2", "serviceRating", "serviceRating", "良好(8-9)", "");
		this.createBasicData("serviceRating_3", "serviceRating", "serviceRating", "合格(6-8)", "");
		this.createBasicData("serviceRating_4", "serviceRating", "serviceRating", "不合格(<6)", "");
				
		response.setMessage("基础数据初始化成功");
		response.setSuccess(true);		
		logger.info("基础数据初始化成功!");	
		return response;

	}
	/**
	 * 
	 * @Description：创建默认为可排序行业基础数据
	 * @author： cx
	 * @Date： 2017年7月4日
	 * @version: 0.1
	 */
	private BasicData createBasicData(String id,String pid,String identity,String description,String comment,Integer count,boolean canEdit,Integer itemOrder){
		BasicData basicData = new BasicData();
		basicData.setId(id);
		basicData.setpId(pid);
		basicData.setIdentity(identity);
		basicData.setDescription(description);
		basicData.setCanEdit(true);
		basicData.setComment(comment);
		basicData.setCount(count);
		basicData.setCanEdit(canEdit);
		basicData.setItemOrder(itemOrder);
		basicDataRepo.save(basicData);
		return basicData;
	}
	/**
	 * 
	 * @Description：创建默认为可编辑的行业基础数据
	 * @author： cx
	 * @Date： 2017年7月4日
	 * @version: 0.1
	 */
	private BasicData createBasicData(String id,String pid,String identity,String description,String comment,Integer itemOrder,boolean canEdit){
		BasicData basicData = new BasicData();
		basicData.setId(id);
		basicData.setpId(pid);
		basicData.setIdentity(identity);
		basicData.setDescription(description);
		basicData.setCanEdit(true);
		basicData.setComment(comment);
		basicData.setItemOrder(itemOrder);
		basicData.setCanEdit(canEdit);
		basicDataRepo.save(basicData);
		return basicData;
	}
	/**
	 * 
	 * @Description：创建默认为可编辑的基础数据
	 * @author： cx
	 * @Date： 2017年7月4日
	 * @version: 0.1
	 */
	private BasicData createBasicData(String id,String pid,String identity,String description,String comment){
		BasicData basicData = new BasicData();
		basicData.setId(id);
		basicData.setpId(pid);
		basicData.setIdentity(identity);
		basicData.setDescription(description);
		basicData.setCanEdit(true);
		basicDataRepo.save(basicData);
		return basicData;
	}
	/**
	 * 
	 * @Description：创建基础数据
	 * @author： cx
	 * @Date： 2017年7月4日
	 * @version: 0.1
	 */
	private BasicData createBasicData(String id,
			String pid,
			String identity,
			String description,
			String comment,
			boolean canEdit){
		BasicData basicData = new BasicData();
		basicData.setId(id);
		basicData.setpId(pid);
		basicData.setIdentity(identity);
		basicData.setDescription(description);
		basicData.setCanEdit(canEdit);
		//basicData.setComment(comment);				
		basicDataRepo.save(basicData);
		return basicData;
	}

	/**
	 * @Description 通过类型查询出配置的信息
	 */
	@Override
	@Transactional
	public List<SysConfigDto> getSysConfigs() {
		return sysConfigRepo.findAll().stream().map((x)->{
			return sysConfigMapper.toDto(x);
		}).collect(Collectors.toList());
	}

	/**
	 * @Description 创建task签收人
	 */
	@Override
	@Transactional
	public void createTaskUser(SysConfigDto sysConfigDto) {
	 	Optional<SysConfig> isExist= sysConfigRepo.findAll().stream().filter((x)->{
			return sysConfigDto.getConfigType().equals(x.getConfigType())
					&&sysConfigDto.getConfigName().equals(x.getConfigName());
		}).findFirst();
	 	
		if(isExist.isPresent()){//更新
			SysConfig entity=isExist.get();
			entity.setConfigValue(sysConfigDto.getConfigValue());
			entity.setEnable(sysConfigDto.getEnable());
			sysConfigRepo.save(entity);
		}else{//创建
			SysConfig sysconfig = new SysConfig();
			String uid = (String) UUID.randomUUID().toString();			
			sysconfig.setId(uid);
			sysconfig.setConfigName(sysConfigDto.getConfigName());
			sysconfig.setConfigValue(sysConfigDto.getConfigValue());
			sysconfig.setEnable(sysConfigDto.getEnable());
			sysconfig.setCreatedBy(currentUser.getUserId());
			sysconfig.setModifiedBy(currentUser.getUserId());
			sysconfig.setConfigType(sysConfigDto.getConfigType());
			
			sysConfigRepo.save(sysconfig);
		}
	}

	@Override
	@Transactional
	public SysConfigDto getSysConfig(String configName) {
		Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), configName);
		List<SysConfig> sysConfigs = sysConfigRepo.findByCriteria(criterion);
		SysConfig entity = new SysConfig();
		if(sysConfigs !=null && sysConfigs.size()>0){
			entity = sysConfigs.stream().findFirst().get();
			return sysConfigMapper.toDto(entity);
		}else{
			throw new IllegalArgumentException(String.format("没有查找到申报端口状态信息,请联系管理员！"));
		}
	}
}

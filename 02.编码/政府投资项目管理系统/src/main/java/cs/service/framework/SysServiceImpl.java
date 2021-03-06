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

import cs.domain.framework.*;
import cs.repository.framework.*;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.Assert;
import org.springframework.web.bind.annotation.RequestMapping;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Response;
import cs.common.sysResource.ClassFinder;
import cs.common.sysResource.SysResourceDto;
import cs.domain.BasicData;
import cs.domain.UserUnitInfo;
import cs.model.DomainDto.SysConfigDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.common.BasicDataRepo;
import cs.repository.interfaces.IRepository;

@Service
public class SysServiceImpl implements SysService {
    private static Logger logger = Logger.getLogger(SysServiceImpl.class);

    @Autowired
    private RoleRepoImpl roleRepo;
    @Autowired
    private UserRepoImpl userRepo;
    @Autowired
    private OrgRepoImpl orgRepo;
    @Autowired
    private IRepository<UserUnitInfo, String> userUnitInfoRepo;
    @Autowired
    private SysConfigRepoImpl sysConfigRepo;
    @Autowired
    private BasicDataRepo basicDataRepo;
    @Autowired
    private IMapper<SysConfigDto, SysConfig> sysConfigMapper;
    @Autowired
    ICurrentUser currentUser;
    @Autowired
    private AdminResourceRepo adminResourceRepo;

    @Override
    public List<SysResourceDto> getSysResources() {

        List<SysResourceDto> sysResourceDtos = new ArrayList<SysResourceDto>();
        //查询所有的权限记录
        List<AdminResource> adminResources = adminResourceRepo.findAll();
        Assert.notEmpty(adminResources,"权限记录为空");
        adminResources.forEach(x -> {
            if(x.getItemOrder() == 0) {
                SysResourceDto sysResourceDto = new SysResourceDto();
                sysResourceDto.setName(x.getName());
                sysResourceDto.setPath(x.getPath());
                sysResourceDto.setId(x.getId());
                sysResourceDto.setItemOrder(x.getItemOrder());

                sysResourceDto.setChildren(this.pushManySysResource(adminResources,x.getId()));
                sysResourceDtos.add(sysResourceDto);
            }
        });

        return sysResourceDtos;
    }

    //获取树形结构数据
    private List<SysResourceDto> pushManySysResource(List<AdminResource> list,String pid){
        List<SysResourceDto> sysResourceDtos = new ArrayList<SysResourceDto>();
        list.forEach(x -> {
            if(pid.equals(x.getParentId())) {
                SysResourceDto sysResourceDto = new SysResourceDto();
                sysResourceDto.setName(x.getName());
                sysResourceDto.setPath(x.getPath());
                sysResourceDto.setId(x.getId());
                sysResourceDto.setItemOrder(x.getItemOrder());

                sysResourceDto.setChildren(pushManySysResource(list, x.getId()));
                sysResourceDtos.add(sysResourceDto);
            }

        });
        return sysResourceDtos;
    }

    @Override
    @Transactional
    public Response initSysConfig() {

        Response response = new Response();
        List<SysConfig> sysConfigs = sysConfigRepo.findAll();
        sysConfigs.forEach(x -> {
            sysConfigRepo.delete(x);
        });

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
        con2.setEnable(true);

        SysConfig con3 = new SysConfig();
        con3.setId(UUID.randomUUID().toString());
        con3.setConfigName(BasicDataConfig.taskType_monthReportPort);
        con3.setConfigValue("25-5");
        con3.setConfigType(BasicDataConfig.taskType);
        con3.setCreatedBy("admin");
        con3.setCreatedDate(new Date());
        con3.setEnable(true);

        SysConfig con4 = new SysConfig();
        con4.setId(UUID.randomUUID().toString());
        con4.setConfigName(BasicDataConfig.taskType_shenpiFenBan);
        con4.setConfigValue("");
        con4.setConfigType(BasicDataConfig.taskType);
        con4.setCreatedBy("admin");
        con4.setCreatedDate(new Date());
        con4.setEnable(false);

        SysConfig con5 = new SysConfig();
        con5.setId(UUID.randomUUID().toString());
        con5.setConfigName(BasicDataConfig.taskType_MOREN_PROJECT_HANDLE);
        con5.setConfigValue("");
        con5.setConfigType(BasicDataConfig.taskType);
        con5.setCreatedBy("admin");
        con5.setCreatedDate(new Date());
        con5.setEnable(false);

        SysConfig con6 = new SysConfig();
        con6.setId(UUID.randomUUID().toString());
        con6.setConfigName(BasicDataConfig.taskType_Office_work);
        con6.setConfigValue("");
        con6.setConfigType(BasicDataConfig.taskType);
        con6.setCreatedBy("admin");
        con6.setCreatedDate(new Date());
        con6.setEnable(false);

        SysConfig con7 = new SysConfig();
        con7.setId(UUID.randomUUID().toString());
        con7.setConfigName(BasicDataConfig.taskType_Office_printing);
        con7.setConfigValue("");
        con7.setConfigType(BasicDataConfig.taskType);
        con7.setCreatedBy("admin");
        con7.setCreatedDate(new Date());
        con7.setEnable(false);
        
        SysConfig con8 = new SysConfig();
        con8.setId(UUID.randomUUID().toString());
        con8.setConfigName(BasicDataConfig.taskType_JiHuaDK);
        con8.setConfigValue("");
        con8.setConfigType(BasicDataConfig.taskType);
        con8.setCreatedBy("admin");
        con8.setCreatedDate(new Date());
        con8.setEnable(false);
        
        SysConfig con9 = new SysConfig();
        con9.setId(UUID.randomUUID().toString());
        con9.setConfigName(BasicDataConfig.taskType_nextYearPlan);
        con9.setConfigValue("");
        con9.setConfigType(BasicDataConfig.taskType);
        con9.setCreatedBy("admin");
        con9.setCreatedDate(new Date());
        con9.setEnable(false);

        sysConfigRepo.save(con);
        sysConfigRepo.save(con2);
        sysConfigRepo.save(con3);
        sysConfigRepo.save(con4);
        sysConfigRepo.save(con5);
        sysConfigRepo.save(con6);
        sysConfigRepo.save(con7);
        sysConfigRepo.save(con8);
        sysConfigRepo.save(con9);
        response.setMessage("系统配置初始化成功");
        response.setSuccess(true);

        logger.info("系统配置初始化成功!");
        return response;
    }

    @Override
    @Transactional
    public Response SysInit() {
        Response response = new Response();

        Criterion criterion = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_admin);
        Criterion criterion2 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_unit);
        Criterion criterion3 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.role_manage);
        Criterion criterion6 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.JuZhang);
        Criterion criterion9 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.FuJuZhang);
        Criterion criterion7 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.KeZhang);
        Criterion criterion8 = Restrictions.eq(Role_.roleName.getName(), BasicDataConfig.KeYuan);
        Criterion criterionOr = Restrictions.or(criterion, criterion2, criterion3, criterion6, criterion7, criterion8, criterion9);

        List<Role> roles = roleRepo.findByCriteria(criterionOr);

        roles.forEach(x -> {
            x.getUsers().forEach(y -> {
                y.getRoles().clear();
//				userRepo.delete(y);
            });
            roleRepo.delete(x);
        });

        //初始化部门
        Org org1 = new Org();
        org1.setComment("系统初始化创建,不可删除");
        org1.setCreatedBy("admin");
        org1.setCreatedDate(new Date());
        org1.setId(UUID.randomUUID().toString());
        org1.setName("办公室");
        org1.setOrgIdentity("办公室");

        Org org2 = new Org();
        org2.setComment("系统初始化创建,不可删除");
        org2.setCreatedBy("admin");
        org2.setCreatedDate(new Date());
        org2.setId(UUID.randomUUID().toString());
        org2.setName("局领导");
        org2.setOrgIdentity("局领导");

        Org org3 = new Org();
        org3.setComment("系统初始化创建,不可删除");
        org3.setCreatedBy("admin");
        org3.setCreatedDate(new Date());
        org3.setId(UUID.randomUUID().toString());
        org3.setName("评审中心");
        org3.setOrgIdentity("评审中心");

        Org org4 = new Org();
        org4.setComment("系统初始化创建,不可删除");
        org4.setCreatedBy("admin");
        org4.setCreatedDate(new Date());
        org4.setId(UUID.randomUUID().toString());
        org4.setName("投资科");
        org4.setOrgIdentity("投资科");

        orgRepo.save(org4);
        orgRepo.save(org3);
        orgRepo.save(org2);
        orgRepo.save(org1);

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

        Role role5 = new Role();
        role5.setRoleName(BasicDataConfig.role_shenpiUnit);
        role5.setId(UUID.randomUUID().toString());
        role5.setComment("系统初始化创建,不可删除");

        Role role9 = new Role();
        role9.setRoleName(BasicDataConfig.msFaWenRole);
        role9.setId(UUID.randomUUID().toString());
        role9.setComment("系统初始化创建,不可删除");

        Role role6 = new Role();
        role6.setRoleName(BasicDataConfig.JuZhang);
        role6.setId(UUID.randomUUID().toString());
        role6.setComment("系统初始化创建,不可删除");

        Role role10 = new Role();
        role10.setRoleName(BasicDataConfig.FuJuZhang);
        role10.setId(UUID.randomUUID().toString());
        role10.setComment("系统初始化创建,不可删除");

        Role role11 = new Role();
        role11.setRoleName(BasicDataConfig.PingShenRenYuan);
        role11.setId(UUID.randomUUID().toString());
        role11.setComment("系统初始化创建,不可删除");

        Role role7 = new Role();
        role7.setRoleName(BasicDataConfig.KeZhang);
        role7.setId(UUID.randomUUID().toString());
        role7.setComment("系统初始化创建,不可删除");

        Role role8 = new Role();
        role8.setRoleName(BasicDataConfig.KeYuan);
        role8.setId(UUID.randomUUID().toString());
        role8.setComment("系统初始化创建,不可删除");

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
        roleRepo.save(role5);
        roleRepo.save(role6);
        roleRepo.save(role7);
        roleRepo.save(role8);
        roleRepo.save(role9);
        roleRepo.save(role10);
        roleRepo.save(role11);

        // 初始化超级用户
        User user = new User();
        user.setLoginName("tzsp");
        user.setId(UUID.randomUUID().toString());
        user.setPassword("111111");
        user.setComment("系统初始化创建,不可删除");
        user.setDisplayName("超级管理员");
        user.getRoles().add(role);
        userRepo.save(user);

        //初始化建设单位用户信息和单位信息
        String[] userNames = {"党工委管委会", "组织人事局", "统战和社会建设局", "城市管理局", "光明供电局",
                "文体教育局", "光明交通运输局", "住房和建设局", "发展和财政局", "卫生计生局",
                "光明公安分局", "环境保护和水务局", "经济服务局", "纪检监察局", "市规划和国土资源委员会光明管理局",
                "综合办", "公明办事处", "光明办事处", "马田办事处", "凤凰办事处",
                "公共资源交易中心", "城市发展促进中心", "机关后勤服务中心", "土地整备中心", "建筑工务局",
                "光明消防大队", "光明现役消防支队光明区大队", "规划土地监察大队", "深水光明", "经发公司"};
        List<UserUnitInfo> userUnitInfos = userUnitInfoRepo.findAll();
        boolean hasUnit = false;
        for (String userName : userNames) {
//			Criterion criterionU=Restrictions.eq(User_.loginName.getName(), userName);
//			List<User> users = userRepo.findByCriteria(criterionU);
//			users.forEach(x->{
//				userRepo.delete(x);
//			});
//			
//			User unitUser = new User();
//			unitUser.setId(UUID.randomUUID().toString());
//			unitUser.setDisplayName(userName);
//			unitUser.setLoginName(userName);
//			unitUser.setPassword("111111");
//			unitUser.setComment("系统初始化创建");
//			unitUser.getRoles().add(role2);
//			userRepo.save(unitUser);

            for (int i = 0; i < userUnitInfos.size(); i++) {
                UserUnitInfo unitInfo = userUnitInfos.get(i);
                if (unitInfo.getUnitName().equals(userName)) {
                    hasUnit = true;
                }

            }
            if (!hasUnit) {
                UserUnitInfo userUnitInfo = new UserUnitInfo();
                userUnitInfo.setId(UUID.randomUUID().toString());
                userUnitInfo.setUnitName(userName);
//				userUnitInfo.setUserName(unitUser.getId());
                userUnitInfo.setRemark("系统初始化创建");
                userUnitInfoRepo.save(userUnitInfo);
            }


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
        basicDataRepo.getSession().createQuery(String.format("delete from %s", BasicData.class.getSimpleName())).executeUpdate();


        //初始化基础数据
        this.createBasicData("initType", "initType", "initType", "1", "");
        this.createBasicData("documentType", "", "documentType", "文件种类", "");
        this.createBasicData("documentType_1", "documentType", "documentType", "函", "");
        this.createBasicData("documentType_2", "documentType", "documentType", "指示", "");
        this.createBasicData("documentType_3", "documentType", "documentType", "通知", "");
        this.createBasicData("documentType_4", "documentType", "documentType", "命令", "");
        this.createBasicData("documentType_5", "documentType", "documentType", "决定", "");
        this.createBasicData("documentType_6", "documentType", "documentType", "公告", "");
        this.createBasicData("documentType_7", "documentType", "documentType", "通告", "");
        this.createBasicData("documentType_8", "documentType", "documentType", "通报", "");
        this.createBasicData("documentType_9", "documentType", "documentType", "议案", "");
        this.createBasicData("documentType_10", "documentType", "documentType", "报告", "");
        this.createBasicData("documentType_11", "documentType", "documentType", "请示", "");
        this.createBasicData("documentType_12", "documentType", "documentType", "批复", "");
        this.createBasicData("documentType_13", "documentType", "documentType", "意见", "");
        this.createBasicData("documentType_14", "documentType", "documentType", "纪要", "");
        this.createBasicData("documentType_15", "documentType", "documentType", "公报", "");
        this.createBasicData("documentType_16", "documentType", "documentType", "决议", "");
        this.createBasicData("documentType_17", "documentType", "documentType", "政务活动安排", "");

        this.createBasicData("postingCategory", "", "postingCategory", "发文种类", "");
        this.createBasicData("postingCategory_1", "postingCategory", "postingCategory", "上行文", "");
        this.createBasicData("postingCategory_2", "postingCategory", "postingCategory", "平行文", "");
        this.createBasicData("postingCategory_3", "postingCategory", "postingCategory", "下行文", "");

        this.createBasicData("approvalType", "", "approvalType", "批复类型分类", "");
        this.createBasicData("approvalType_1", "approvalType", "approvalType", "深发改", "");
        this.createBasicData("approvalType_2", "approvalType", "approvalType", "深发改函", "");
        this.createBasicData("approvalType_3", "approvalType", "approvalType", "深光发改", "");
        this.createBasicData("approvalType_4", "approvalType", "approvalType", "深光发改函", "");

        this.createBasicData("attachmentType", "", "attachmentType", "附件类型分类", "");
        this.createBasicData("attachmentType_1", "attachmentType", "attachmentType", "申请报告(pdf版，加盖公章)", "");
        this.createBasicData("attachmentType_2", "attachmentType", "attachmentType", "申请报告(Word版)", "");
        this.createBasicData("attachmentType_3", "attachmentType", "attachmentType", "投资计划", "");
        this.createBasicData("attachmentType_4", "attachmentType", "attachmentType", "概算批复", "");
        this.createBasicData("attachmentType_5", "attachmentType", "attachmentType", "前期工作计划文件", "");
        this.createBasicData("attachmentType_6", "attachmentType", "attachmentType", "项目实施依据文件", "");
        this.createBasicData("attachmentType_7", "attachmentType", "attachmentType", "历年政府投资计划下达文件", "");
        this.createBasicData("attachmentType_8", "attachmentType", "attachmentType", "可行性研究报告批复文件", "");
        this.createBasicData("attachmentType_9", "attachmentType", "attachmentType", "项目建议书批复文件", "");
        this.createBasicData("attachmentType_10", "attachmentType", "attachmentType", "项目总概算批复文件", "");
        this.createBasicData("attachmentType_11", "attachmentType", "attachmentType", "项目建议书批文复印件", "");
        this.createBasicData("attachmentType_12", "attachmentType", "attachmentType", "上一年度计划批文复印件", "");
        this.createBasicData("attachmentType_13", "attachmentType", "attachmentType", "工程规划许可证扫描件", "");
        this.createBasicData("attachmentType_14", "attachmentType", "attachmentType", "概算批复扫描件", "");
        this.createBasicData("attachmentType_15", "attachmentType", "attachmentType", "全部已下达计划批复文件扫描件", "");
        this.createBasicData("attachmentType_16", "attachmentType", "attachmentType", "建设工程规划许可证", "");
        this.createBasicData("attachmentType_17", "attachmentType", "attachmentType", "土地落实情况、征地拆迁有关情况", "");
        this.createBasicData("attachmentType_18", "attachmentType", "attachmentType", "项目工程形象进度及年度资金需求情况", "");
        this.createBasicData("attachmentType_19", "attachmentType", "attachmentType", "项目进展情况相关资料", "");
        this.createBasicData("attachmentType_20", "attachmentType", "attachmentType", "年度完成建设内容及各阶段工作内容完成时间表", "");
        this.createBasicData("attachmentType_21", "attachmentType", "attachmentType", "会议纪要", "");
        this.createBasicData("attachmentType_22", "attachmentType", "attachmentType", "送审造价", "");
        this.createBasicData("attachmentType_23", "attachmentType", "attachmentType", "汇总表", "");
        this.createBasicData("attachmentType_24", "attachmentType", "attachmentType", "其他资料", "");

        this.createBasicData("deptType", "", "deptType", "部门类型分类", "");
        this.createBasicData("deptType_1", "deptType", "deptType", "普通部门", "");
        this.createBasicData("deptType_2", "deptType", "deptType", "涉及部门", "");

        this.createBasicData("hecretHierarchy", "", "hecretHierarchy", "拟稿秘密等级分类", "");
        this.createBasicData("hecretHierarchy_1", "hecretHierarchy", "hecretHierarchy", "公开", "");
//        this.createBasicData("hecretHierarchy_2", "hecretHierarchy", "hecretHierarchy", "国内", "");
        this.createBasicData("hecretHierarchy_3", "hecretHierarchy", "hecretHierarchy", "内部", "");
//        this.createBasicData("hecretHierarchy_4", "hecretHierarchy", "hecretHierarchy", "秘密", "");
//        this.createBasicData("hecretHierarchy_5", "hecretHierarchy", "hecretHierarchy", "机密", "");
//        this.createBasicData("hecretHierarchy_6", "hecretHierarchy", "hecretHierarchy", "绝密", "");

        this.createBasicData("draftStatus", "", "draftStatus", "拟稿状态分类", "");
        this.createBasicData("draftStatus_1", "draftStatus", "draftStatus", "经办人拟稿", "");
        this.createBasicData("draftStatus_2", "draftStatus", "draftStatus", "生成发文正文", "");
        this.createBasicData("draftStatus_3", "draftStatus", "draftStatus", "领导审批", "");
        this.createBasicData("draftStatus_4", "draftStatus", "draftStatus", "项目发文", "");

        this.createBasicData("fileSet", "", "fileSet", "文件缓急分类", "");
        this.createBasicData("fileSet_1", "fileSet", "fileSet", "平件", "");
        this.createBasicData("fileSet_2", "fileSet", "fileSet", "加急", "");
//        this.createBasicData("fileSet_3", "fileSet", "fileSet", "急件", "");
        this.createBasicData("fileSet_4", "fileSet", "fileSet", "特急", "");
        this.createBasicData("fileSet_5", "fileSet", "fileSet", "特提", "");

        this.createBasicData("foundAppliRepoGenerationStatus", "", "foundAppliRepoGenerationStatus", "资金申请报告生成状态分类", "");
        this.createBasicData("foundAppliRepoGenerationStatus_1", "foundAppliRepoGenerationStatus", "foundAppliRepoGenerationStatus", "未生成", "");
        this.createBasicData("foundAppliRepoGenerationStatus_2", "foundAppliRepoGenerationStatus", "foundAppliRepoGenerationStatus", "生成成功", "");
        this.createBasicData("foundAppliRepoGenerationStatus_3", "foundAppliRepoGenerationStatus", "foundAppliRepoGenerationStatus", "生成失败", "");

        this.createBasicData("openType", "", "openType", "公开类型分类", "");
        this.createBasicData("openType_1", "openType", "openType", "主动公开", "");
        this.createBasicData("openType_2", "openType", "openType", "依申请公开", "");
        this.createBasicData("openType_3", "openType", "openType", "不公开", "");

        this.createBasicData("problemType", "", "problemType", "问题类型分类", "");
        this.createBasicData("problemType_1", "problemType", "problemType", "规划设计审批及调整问题", "");
        this.createBasicData("problemType_2", "problemType", "problemType", "征地拆迁问题", "");
        this.createBasicData("problemType_3", "problemType", "problemType", "项目选址问题", "");
        this.createBasicData("problemType_4", "problemType", "problemType", "资金保障问题", "");
        this.createBasicData("problemType_5", "problemType", "problemType", "中央及省部级部门审批问题", "");
        this.createBasicData("problemType_6", "problemType", "problemType", "其他", "");

        this.createBasicData("projectClassify", "", "projectClassify", "项目分类", "");
        this.createBasicData("projectClassify_1", "projectClassify", "projectClassify", "政府投资项目分类", "");
        this.createBasicData("projectClassify_1_1", "projectClassify_1", "projectClassify", "政府投资房建类", "");
        this.createBasicData("projectClassify_1_2", "projectClassify_1", "projectClassify", "政府投资市政类", "");
        this.createBasicData("projectClassify_1_3", "projectClassify_1", "projectClassify", "政府投资水务类", "");
        this.createBasicData("projectClassify_1_4", "projectClassify_1", "projectClassify", "其它", "");
        this.createBasicData("projectClassify_2", "projectClassify", "projectClassify", "社会投资项目分类", "");
        this.createBasicData("projectClassify_2_1", "projectClassify_2", "projectClassify", "社会投资房建类", "");
        this.createBasicData("projectClassify_2_2", "projectClassify_2", "projectClassify", "社会投资市政类", "");
        this.createBasicData("projectClassify_2_3", "projectClassify_2", "projectClassify", "社会投资水务类", "");
        this.createBasicData("projectClassify_2_4", "projectClassify_2", "projectClassify", "其它", "");

        this.createBasicData("projectConstrChar", "", "projectConstrChar", "项目建设性质分类", "");
        this.createBasicData("projectConstrChar_1", "projectConstrChar", "projectConstrChar", "前期", "");
        this.createBasicData("projectConstrChar_2", "projectConstrChar", "projectConstrChar", "新开工", "");
        this.createBasicData("projectConstrChar_3", "projectConstrChar", "projectConstrChar", "续建", "");
        this.createBasicData("projectConstrChar_4", "projectConstrChar", "projectConstrChar", "储备类", "");

        this.createBasicData("projectIndustry", "", "projectIndustry", "项目行业分类", "项目行业分类", false);
        this.createBasicData("projectIndustry_1", "projectIndustry", "projectIndustry", "政府投资项目行业分类", "", 0, false);
        this.createBasicData("projectIndustry_1_1", "projectIndustry_1", "projectIndustry", "文体", "WT", 1, false, 5);
        this.createBasicData("projectIndustry_1_2", "projectIndustry_1", "projectIndustry", "教育", "JY", 2, false, 3);
        this.createBasicData("projectIndustry_1_3", "projectIndustry_1", "projectIndustry", "卫生", "WS", 3, false, 4);
        this.createBasicData("projectIndustry_1_4", "projectIndustry_1", "projectIndustry", "环保水务", "HS", 4, false, 1);
        this.createBasicData("projectIndustry_1_5", "projectIndustry_1", "projectIndustry", "道路交通", "DJ", 0, false, 2);
        this.createBasicData("projectIndustry_1_6", "projectIndustry_1", "projectIndustry", "公园绿化", "GL", 0, false, 6);
        this.createBasicData("projectIndustry_1_7", "projectIndustry_1", "projectIndustry", "电力燃气", "DR", 0, false, 8);
        this.createBasicData("projectIndustry_1_8", "projectIndustry_1", "projectIndustry", "城市管理", "CG", 0, false, 11);
        this.createBasicData("projectIndustry_1_9", "projectIndustry_1", "projectIndustry", "公共安全", "GA", 0, false, 16);
        this.createBasicData("projectIndustry_1_10", "projectIndustry_1", "projectIndustry", "社会保障 ", "SB", 0, false, 9);
        this.createBasicData("projectIndustry_1_11", "projectIndustry_1", "projectIndustry", "党政机关", "DZ", 0, false, 13);
        this.createBasicData("projectIndustry_1_12", "projectIndustry_1", "projectIndustry", "征地拆迁", "ZC", 0, false, 14);
        this.createBasicData("projectIndustry_1_13", "projectIndustry_1", "projectIndustry", "其他", "QT", 0, false, 17);
        this.createBasicData("projectIndustry_1_14", "projectIndustry_1", "projectIndustry", "地质灾害治理", "DZ", 0, false, 10);
        this.createBasicData("projectIndustry_1_15", "projectIndustry_1", "projectIndustry", "社区建设", "QJ", 0, false, 7);
        this.createBasicData("projectIndustry_1_16", "projectIndustry_1", "projectIndustry", "社会建设", "HJ", 0, false, 12);
        this.createBasicData("projectIndustry_1_17", "projectIndustry_1", "projectIndustry", "规划课题", "GK", 0, false, 15);
        this.createBasicData("projectIndustry_2", "projectIndustry", "projectIndustry", "社会投资项目行业分类", "", false);

        this.createBasicData("projectIndustry_2_1", "projectIndustry_2", "projectIndustry", "农、林、牧、渔业", "", 0, false);
        this.createBasicData("projectIndustry_2_1_1", "projectIndustry_2_1", "projectIndustry", "农业", "A01", 0, false);
        this.createBasicData("projectIndustry_2_1_2", "projectIndustry_2_1", "projectIndustry", "林业", "A02", 0, false);
        this.createBasicData("projectIndustry_2_1_3", "projectIndustry_2_1", "projectIndustry", "畜牧业", "A03", 0, false);
        this.createBasicData("projectIndustry_2_1_4", "projectIndustry_2_1", "projectIndustry", "渔业", "A04", 0, false);
        this.createBasicData("projectIndustry_2_1_5", "projectIndustry_2_1", "projectIndustry", "...", "A05", 0, false);
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

        this.createBasicData("nationalIndustry", "", "nationalIndustry", "国民经济行业分类", "", false);
        this.createBasicData("nationalIndustry_1", "nationalIndustry", "nationalIndustry", "农、林、牧、渔业", "");
        this.createBasicData("nationalIndustry_1_1", "nationalIndustry_1", "nationalIndustry", "农业", "01", 0, false);
        this.createBasicData("nationalIndustry_1_2", "nationalIndustry_1", "nationalIndustry", "林业", "02", 0, false);
        this.createBasicData("nationalIndustry_1_3", "nationalIndustry_1", "nationalIndustry", "畜牧业", "03", 0, false);
        this.createBasicData("nationalIndustry_1_4", "nationalIndustry_1", "nationalIndustry", "渔业", "04", 0, false);
        this.createBasicData("nationalIndustry_1_5", "nationalIndustry_1", "nationalIndustry", "农、林、牧、渔服务业", "05", 0, false);

        this.createBasicData("nationalIndustry_2", "nationalIndustry", "nationalIndustry", "采矿业", "");
        this.createBasicData("nationalIndustry_2_1", "nationalIndustry_2", "nationalIndustry", "煤炭开采和洗选业", "06", 0, false);
        this.createBasicData("nationalIndustry_2_2", "nationalIndustry_2", "nationalIndustry", "石油和天然气开采业", "07", 0, false);
        this.createBasicData("nationalIndustry_2_3", "nationalIndustry_2", "nationalIndustry", "黑色金属矿采选业", "08", 0, false);
        this.createBasicData("nationalIndustry_2_4", "nationalIndustry_2", "nationalIndustry", "有色金属矿采选业", "09", 0, false);
        this.createBasicData("nationalIndustry_2_5", "nationalIndustry_2", "nationalIndustry", "非金属矿采选业", "10", 0, false);
        this.createBasicData("nationalIndustry_2_6", "nationalIndustry_2", "nationalIndustry", "开采辅助活动", "11", 0, false);
        this.createBasicData("nationalIndustry_2_7", "nationalIndustry_2", "nationalIndustry", "其他采矿业", "12", 0, false);

        this.createBasicData("nationalIndustry_3", "nationalIndustry", "nationalIndustry", "制造业", "");
        this.createBasicData("nationalIndustry_3_1", "nationalIndustry_3", "nationalIndustry", "农副食品加工业", "13", 0, false);
        this.createBasicData("nationalIndustry_3_2", "nationalIndustry_3", "nationalIndustry", "食品制造业", "14", 0, false);
        this.createBasicData("nationalIndustry_3_3", "nationalIndustry_3", "nationalIndustry", "酒、饮料和精制茶制造业", "15", 0, false);
        this.createBasicData("nationalIndustry_3_4", "nationalIndustry_3", "nationalIndustry", "烟草制品业", "16", 0, false);
        this.createBasicData("nationalIndustry_3_5", "nationalIndustry_3", "nationalIndustry", "纺织业", "17", 0, false);
        this.createBasicData("nationalIndustry_3_6", "nationalIndustry_3", "nationalIndustry", "纺织服装、服饰业", "18", 0, false);
        this.createBasicData("nationalIndustry_3_7", "nationalIndustry_3", "nationalIndustry", "皮革、毛皮、羽毛及其制品和制鞋业", "19", 0, false);
        this.createBasicData("nationalIndustry_3_8", "nationalIndustry_3", "nationalIndustry", "木材加工和木、竹、藤、棕、草制品", "20", 0, false);
        this.createBasicData("nationalIndustry_3_9", "nationalIndustry_3", "nationalIndustry", "家具制造业", "21", 0, false);
        this.createBasicData("nationalIndustry_3_10", "nationalIndustry_3", "nationalIndustry", "造纸和纸制品业", "22", 0, false);
        this.createBasicData("nationalIndustry_3_11", "nationalIndustry_3", "nationalIndustry", "印刷和记录媒介复制业", "23", 0, false);
        this.createBasicData("nationalIndustry_3_12", "nationalIndustry_3", "nationalIndustry", "文教、工美、体育和娱乐用品制造业", "24", 0, false);
        this.createBasicData("nationalIndustry_3_13", "nationalIndustry_3", "nationalIndustry", "石油加工、炼焦和核燃料加工业", "25", 0, false);
        this.createBasicData("nationalIndustry_3_14", "nationalIndustry_3", "nationalIndustry", "化学原料和化学制品制造业", "26", 0, false);
        this.createBasicData("nationalIndustry_3_15", "nationalIndustry_3", "nationalIndustry", "医药制造业", "27", 0, false);
        this.createBasicData("nationalIndustry_3_16", "nationalIndustry_3", "nationalIndustry", "化学纤维制造业", "28", 0, false);
        this.createBasicData("nationalIndustry_3_17", "nationalIndustry_3", "nationalIndustry", "橡胶和塑料制品业", "29", 0, false);
        this.createBasicData("nationalIndustry_3_18", "nationalIndustry_3", "nationalIndustry", "非金属矿物制品业", "30", 0, false);
        this.createBasicData("nationalIndustry_3_19", "nationalIndustry_3", "nationalIndustry", "黑色金属冶炼和压延加工业", "31", 0, false);
        this.createBasicData("nationalIndustry_3_20", "nationalIndustry_3", "nationalIndustry", "有色金属冶炼和压延加工业", "32", 0, false);
        this.createBasicData("nationalIndustry_3_21", "nationalIndustry_3", "nationalIndustry", "金属制品业", "33", 0, false);
        this.createBasicData("nationalIndustry_3_22", "nationalIndustry_3", "nationalIndustry", "通用设备制造业", "34", 0, false);
        this.createBasicData("nationalIndustry_3_23", "nationalIndustry_3", "nationalIndustry", "专用设备制造业", "35", 0, false);
        this.createBasicData("nationalIndustry_3_24", "nationalIndustry_3", "nationalIndustry", "汽车制造业", "36", 0, false);
        this.createBasicData("nationalIndustry_3_25", "nationalIndustry_3", "nationalIndustry", "铁路、船舶、航空航天和其他运输设备制造业", "37", 0, false);
        this.createBasicData("nationalIndustry_3_26", "nationalIndustry_3", "nationalIndustry", "电气机械和器材制造业", "38", 0, false);
        this.createBasicData("nationalIndustry_3_27", "nationalIndustry_3", "nationalIndustry", "计算机、通信和其他电子设备制造业", "39", 0, false);
        this.createBasicData("nationalIndustry_3_28", "nationalIndustry_3", "nationalIndustry", "仪器仪表制造业", "40", 0, false);
        this.createBasicData("nationalIndustry_3_29", "nationalIndustry_3", "nationalIndustry", "其他制造业", "41", 0, false);
        this.createBasicData("nationalIndustry_3_30", "nationalIndustry_3", "nationalIndustry", "废弃资源综合利用业", "42", 0, false);
        this.createBasicData("nationalIndustry_3_31", "nationalIndustry_3", "nationalIndustry", "金属制品、机械和设备修理业", "43", 0, false);

        this.createBasicData("nationalIndustry_4", "nationalIndustry", "nationalIndustry", "电力、热力、燃气及水生产和供应业", "");
        this.createBasicData("nationalIndustry_4_1", "nationalIndustry_4", "nationalIndustry", "电力、热力生产和供应业", "44", 0, false);
        this.createBasicData("nationalIndustry_4_2", "nationalIndustry_4", "nationalIndustry", "燃气生产和供应业", "45", 0, false);
        this.createBasicData("nationalIndustry_4_3", "nationalIndustry_4", "nationalIndustry", "水的生产和供应业", "46", 0, false);


        this.createBasicData("nationalIndustry_5", "nationalIndustry", "nationalIndustry", "建筑业", "");
        this.createBasicData("nationalIndustry_5_1", "nationalIndustry_5", "nationalIndustry", "房屋建筑业", "47", 0, false);
        this.createBasicData("nationalIndustry_5_2", "nationalIndustry_5", "nationalIndustry", "土木工程建筑业", "48", 0, false);
        this.createBasicData("nationalIndustry_5_3", "nationalIndustry_5", "nationalIndustry", "建筑安装业", "49", 0, false);
        this.createBasicData("nationalIndustry_5_4", "nationalIndustry_5", "nationalIndustry", "建筑装饰和其他建筑业", "50", 0, false);

        this.createBasicData("nationalIndustry_6", "nationalIndustry", "nationalIndustry", "批发和零售业", "");
        this.createBasicData("nationalIndustry_6_1", "nationalIndustry_6", "nationalIndustry", "批发业", "51", 0, false);
        this.createBasicData("nationalIndustry_6_2", "nationalIndustry_6", "nationalIndustry", "零售业", "52", 0, false);

        this.createBasicData("nationalIndustry_7", "nationalIndustry", "nationalIndustry", "交通运输、仓储和邮政业", "");
        this.createBasicData("nationalIndustry_7_1", "nationalIndustry_7", "nationalIndustry", "铁路运输业", "53", 0, false);
        this.createBasicData("nationalIndustry_7_2", "nationalIndustry_7", "nationalIndustry", "道路运输业", "54", 0, false);
        this.createBasicData("nationalIndustry_7_3", "nationalIndustry_7", "nationalIndustry", "水上运输业", "55", 0, false);
        this.createBasicData("nationalIndustry_7_4", "nationalIndustry_7", "nationalIndustry", "航空运输业", "56", 0, false);
        this.createBasicData("nationalIndustry_7_5", "nationalIndustry_7", "nationalIndustry", "管道运输业", "57", 0, false);
        this.createBasicData("nationalIndustry_7_6", "nationalIndustry_7", "nationalIndustry", "装卸搬运和运输代理业", "58", 0, false);
        this.createBasicData("nationalIndustry_7_7", "nationalIndustry_7", "nationalIndustry", "仓储业", "59", 0, false);
        this.createBasicData("nationalIndustry_7_8", "nationalIndustry_7", "nationalIndustry", "邮政业", "60", 0, false);

        this.createBasicData("nationalIndustry_8", "nationalIndustry", "nationalIndustry", "住宿和餐饮业", "");
        this.createBasicData("nationalIndustry_8_1", "nationalIndustry_8", "nationalIndustry", "住宿业", "61", 0, false);
        this.createBasicData("nationalIndustry_8_2", "nationalIndustry_8", "nationalIndustry", "餐饮业", "62", 0, false);

        this.createBasicData("nationalIndustry_9", "nationalIndustry", "nationalIndustry", "信息传输、软件和信息技术服务业", "");
        this.createBasicData("nationalIndustry_9_1", "nationalIndustry_9", "nationalIndustry", "电信、广播电视和卫星传输服务", "63", 0, false);
        this.createBasicData("nationalIndustry_9_2", "nationalIndustry_9", "nationalIndustry", "互联网和相关服务", "64", 0, false);
        this.createBasicData("nationalIndustry_9_3", "nationalIndustry_9", "nationalIndustry", "软件和信息技术服务业", "65", 0, false);

        this.createBasicData("nationalIndustry_10", "nationalIndustry", "nationalIndustry", "金融业", "");
        this.createBasicData("nationalIndustry_10_1", "nationalIndustry_10", "nationalIndustry", "货币金融服务", "66", 0, false);
        this.createBasicData("nationalIndustry_10_2", "nationalIndustry_10", "nationalIndustry", "资本市场服务", "67", 0, false);
        this.createBasicData("nationalIndustry_10_3", "nationalIndustry_10", "nationalIndustry", "保险业", "68", 0, false);
        this.createBasicData("nationalIndustry_10_4", "nationalIndustry_10", "nationalIndustry", "其他金融业", "69", 0, false);

        this.createBasicData("nationalIndustry_11", "nationalIndustry", "nationalIndustry", "房地产业", "");
        this.createBasicData("nationalIndustry_11_1", "nationalIndustry_11", "nationalIndustry", "房地产业", "70", 0, false);

        this.createBasicData("nationalIndustry_12", "nationalIndustry", "nationalIndustry", "租赁和商务服务业", "");
        this.createBasicData("nationalIndustry_12_1", "nationalIndustry_12", "nationalIndustry", "租赁业", "71", 0, false);
        this.createBasicData("nationalIndustry_12_2", "nationalIndustry_12", "nationalIndustry", "商务服务业", "72", 0, false);

        this.createBasicData("nationalIndustry_13", "nationalIndustry", "nationalIndustry", "科学研究和技术服务业", "");
        this.createBasicData("nationalIndustry_13_1", "nationalIndustry_13", "nationalIndustry", "研究和试验发展", "73", 0, false);
        this.createBasicData("nationalIndustry_13_2", "nationalIndustry_13", "nationalIndustry", "专业技术服务业", "74", 0, false);
        this.createBasicData("nationalIndustry_13_3", "nationalIndustry_13", "nationalIndustry", "科技推广和应用服务业", "75", 0, false);

        this.createBasicData("nationalIndustry_14", "nationalIndustry", "nationalIndustry", "水利、环境和公共设施管理业", "");
        this.createBasicData("nationalIndustry_14_1", "nationalIndustry_14", "nationalIndustry", "水利管理业", "76", 0, false);
        this.createBasicData("nationalIndustry_14_2", "nationalIndustry_14", "nationalIndustry", "生态保护和环境治理业", "77", 0, false);
        this.createBasicData("nationalIndustry_14_3", "nationalIndustry_14", "nationalIndustry", "公共设施管理业", "78", 0, false);

        this.createBasicData("nationalIndustry_15", "nationalIndustry", "nationalIndustry", "居民服务、修理和其他服务业", "");
        this.createBasicData("nationalIndustry_15_1", "nationalIndustry_15", "nationalIndustry", "居民服务业", "79", 0, false);
        this.createBasicData("nationalIndustry_15_2", "nationalIndustry_15", "nationalIndustry", "机动车、电子产品和日用产品修理业", "80", 0, false);
        this.createBasicData("nationalIndustry_15_3", "nationalIndustry_15", "nationalIndustry", "其他服务业", "81", 0, false);

        this.createBasicData("nationalIndustry_16", "nationalIndustry", "nationalIndustry", "教育", "");
        this.createBasicData("nationalIndustry_16_1", "nationalIndustry_16", "nationalIndustry", "教育", "82", 0, false);

        this.createBasicData("nationalIndustry_17", "nationalIndustry", "nationalIndustry", "卫生和社会工作", "");
        this.createBasicData("nationalIndustry_17_1", "nationalIndustry_17", "nationalIndustry", "卫生", "83", 0, false);
        this.createBasicData("nationalIndustry_17_2", "nationalIndustry_17", "nationalIndustry", "社会工作", "84", 0, false);

        this.createBasicData("nationalIndustry_18", "nationalIndustry", "nationalIndustry", "文化、体育和娱乐业", "");
        this.createBasicData("nationalIndustry_18_1", "nationalIndustry_18", "nationalIndustry", "新闻和出版业", "85", 0, false);
        this.createBasicData("nationalIndustry_18_2", "nationalIndustry_18", "nationalIndustry", "广播、电视、电影和影视录音制作业", "86", 0, false);
        this.createBasicData("nationalIndustry_18_3", "nationalIndustry_18", "nationalIndustry", "文化艺术业", "87", 0, false);
        this.createBasicData("nationalIndustry_18_4", "nationalIndustry_18", "nationalIndustry", "体育", "88", 0, false);
        this.createBasicData("nationalIndustry_18_5", "nationalIndustry_18", "nationalIndustry", "娱乐业", "89", 0, false);

        this.createBasicData("nationalIndustry_19", "nationalIndustry", "nationalIndustry", "公共管理、社会保障和社会组织", "");
        this.createBasicData("nationalIndustry_19_1", "nationalIndustry_19", "nationalIndustry", "中国共产党机关", "90", 0, false);
        this.createBasicData("nationalIndustry_19_2", "nationalIndustry_19", "nationalIndustry", "国家机构", "91", 0, false);
        this.createBasicData("nationalIndustry_19_3", "nationalIndustry_19", "nationalIndustry", "人民政协、民主党派", "92", 0, false);
        this.createBasicData("nationalIndustry_19_4", "nationalIndustry_19", "nationalIndustry", "社会保障", "93", 0, false);
        this.createBasicData("nationalIndustry_19_5", "nationalIndustry_19", "nationalIndustry", "群众团体、社会团体和其他成员组织", "94", 0, false);
        this.createBasicData("nationalIndustry_19_6", "nationalIndustry_19", "nationalIndustry", "基层群众自治组织", "95", 0, false);

        this.createBasicData("nationalIndustry_20", "nationalIndustry", "nationalIndustry", "国际组织", "");
        this.createBasicData("nationalIndustry_20_1", "nationalIndustry_20", "nationalIndustry", "国际组织", "96", 0, false);

        this.createBasicData("projectInvestmentType", "", "projectInvestmentType", "项目投资类型分类", "项目投资类型分类");
        this.createBasicData("projectInvestmentType_1", "projectInvestmentType", "projectInvestmentType", "政府投资项目", "项目投资类型分类");
        this.createBasicData("projectInvestmentType_2", "projectInvestmentType", "projectInvestmentType", "社会投资项目", "项目投资类型分类");

        this.createBasicData("projectProgress", "", "projectProgress", "项目进度分类", "项目进度分类");
        this.createBasicData("projectProgress_1", "projectProgress", "projectProgress", "进展顺利", "项目进度分类");
        this.createBasicData("projectProgress_2", "projectProgress", "projectProgress", "进展略滞后于计划", "项目进度分类");
        this.createBasicData("projectProgress_3", "projectProgress", "projectProgress", "进展大幅滞后于计划", "项目进度分类");

        this.createBasicData("projectShenBaoStage", "", "projectShenBaoStage", "项目申报阶段分类", "项目申报阶段分类");
        this.createBasicData("projectShenBaoStage_1", "projectShenBaoStage", "projectShenBaoStage", "项目建议书", "项目申报阶段分类", 1, false);
        this.createBasicData("projectShenBaoStage_2", "projectShenBaoStage", "projectShenBaoStage", "可行性研究报告", "项目申报阶段分类", 2, false);
        this.createBasicData("projectShenBaoStage_3", "projectShenBaoStage", "projectShenBaoStage", "初步设计概算", "项目申报阶段分类", 3, false);
        this.createBasicData("projectShenBaoStage_4", "projectShenBaoStage", "projectShenBaoStage", "资金申请报告", "项目申报阶段分类", 4, false);
        this.createBasicData("projectShenBaoStage_5", "projectShenBaoStage", "projectShenBaoStage", "计划下达", "项目申报阶段分类", 5, false);
        this.createBasicData("projectShenBaoStage_6", "projectShenBaoStage", "projectShenBaoStage", "首次前期经费下达", "项目申报阶段分类", 6, false);
        this.createBasicData("projectShenBaoStage_7", "projectShenBaoStage", "projectShenBaoStage", "下一年度计划", "项目申报阶段分类", 7, false);


        this.createBasicData("projectStatus", "", "projectStatus", "项目状态分类", "项目状态分类");
        this.createBasicData("projectStatus_1", "projectStatus", "projectStatus", "未提交", "项目状态分类");
        this.createBasicData("projectStatus_2", "projectStatus", "projectStatus", "已提交", "项目状态分类");
        this.createBasicData("projectStatus_3", "projectStatus", "projectStatus", "已收件", "项目状态分类");

        this.createBasicData("projectType", "", "projectType", "项目类型分类", "项目类型分类");
        this.createBasicData("projectType_1", "projectType", "projectType", "市重大项目", "项目类型分类");
        this.createBasicData("projectType_2", "projectType", "projectType", "区重大项目", "项目类型分类");
        this.createBasicData("projectType_3", "projectType", "projectType", "凤凰城项目", "项目类型分类");
        this.createBasicData("projectType_4", "projectType", "projectType", "海绵项目", "项目类型分类");
        this.createBasicData("projectType_5", "projectType", "projectType", "治水项目", "项目类型分类");
        this.createBasicData("projectType_6", "projectType", "projectType", "其他", "项目类型分类");

        this.createBasicData("projectCategory", "", "projectCategory", "项目类别分类", "项目类别分类");
        this.createBasicData("projectCategory_1", "projectCategory", "projectCategory", "A类", "项目类别分类");
        this.createBasicData("projectCategory_2", "projectCategory", "projectCategory", "B类", "项目类别分类");
        this.createBasicData("projectCategory_3", "projectCategory", "projectCategory", "C类", "项目类别分类");
        this.createBasicData("projectCategory_4", "projectCategory", "projectCategory", "D类", "项目类别分类");

        this.createBasicData("projectFunctionClassify", "", "projectFunctionClassify", "项目功能分类科目", "项目功能分类科目");
        this.createBasicData("projectFunctionClassify_1", "projectFunctionClassify", "projectFunctionClassify", "功能1", "项目功能分类科目");
        this.createBasicData("projectFunctionClassify_2", "projectFunctionClassify", "projectFunctionClassify", "功能2", "项目功能分类科目");

        this.createBasicData("projectGoverEconClassify", "", "projectGoverEconClassify", "项目政府经济分类科目", "项目政府经济分类科目");
        this.createBasicData("projectGoverEconClassify_1", "projectGoverEconClassify", "projectGoverEconClassify", "经济分类1", "项目政府经济分类科目");
        this.createBasicData("projectGoverEconClassify_2", "projectGoverEconClassify", "projectGoverEconClassify", "经济分类2", "项目政府经济分类科目");

        this.createBasicData("capitalOtherType", "", "capitalOtherType", "资金其他来源类型", "资金其他来源类型");
        this.createBasicData("capitalOtherType_1", "capitalOtherType", "capitalOtherType", "海绵资金", "资金其他来源类型");
        this.createBasicData("capitalOtherType_2", "capitalOtherType", "capitalOtherType", "海绵资金2", "资金其他来源类型");

        this.createBasicData("qualifiyLevel", "", "qualifiyLevel", "编制单位资质分类", "编制单位资质分类");
        this.createBasicData("qualifiyLevel_1", "qualifiyLevel", "qualifiyLevel", "甲级", "编制单位资质分类");
        this.createBasicData("qualifiyLevel_2", "qualifiyLevel", "qualifiyLevel", "乙级", "编制单位资质分类");
        this.createBasicData("qualifiyLevel_3", "qualifiyLevel", "qualifiyLevel", "丙级", "编制单位资质分类");

        this.createBasicData("unitProperty", "", "unitProperty", "单位性质分类", "单位性质分类");
        this.createBasicData("unitProperty_1", "unitProperty", "unitProperty", "党政机关", "单位性质分类");
        this.createBasicData("unitProperty_2", "unitProperty", "unitProperty", "私营企业", "单位性质分类");
        this.createBasicData("unitProperty_3", "unitProperty", "unitProperty", "股份制企业", "单位性质分类");
        this.createBasicData("unitProperty_4", "unitProperty", "unitProperty", "外商独资企业", "单位性质分类");
        this.createBasicData("unitProperty_5", "unitProperty", "unitProperty", "社会团体", "单位性质分类");
        this.createBasicData("unitProperty_6", "unitProperty", "unitProperty", "中外合资企业", "单位性质分类");
        this.createBasicData("unitProperty_7", "unitProperty", "unitProperty", "中外合作企业", "单位性质分类");
        this.createBasicData("unitProperty_8", "unitProperty", "unitProperty", "全额事业单位", "单位性质分类");
        this.createBasicData("unitProperty_9", "unitProperty", "unitProperty", "差额事业单位", "单位性质分类");
        this.createBasicData("unitProperty_10", "unitProperty", "unitProperty", "企业化管理事业单位", "单位性质分类");
        this.createBasicData("unitProperty_11", "unitProperty", "unitProperty", "全民所有制企业", "单位性质分类");
        this.createBasicData("unitProperty_12", "unitProperty", "unitProperty", "集体所有制企业", "单位性质分类");
        this.createBasicData("unitProperty_13", "unitProperty", "unitProperty", "其他", "单位性质分类");

        this.createBasicData("area", "", "area", "行政区域", "行政区域");
        this.createBasicData("area_1", "area", "area", "光明区", "行政区域");
        this.createBasicData("area_1_1", "area_1", "area", "光明街道", "行政区域-街道");
        this.createBasicData("area_1_2", "area_1", "area", "公明街道", "行政区域-街道");
        this.createBasicData("area_1_3", "area_1", "area", "新湖街道", "行政区域-街道");
        this.createBasicData("area_1_4", "area_1", "area", "凤凰街道", "行政区域-街道");
        this.createBasicData("area_1_5", "area_1", "area", "玉塘街道", "行政区域-街道");
        this.createBasicData("area_1_6", "area_1", "area", "马田街道", "行政区域-街道");

        this.createBasicData("projectStage", "", "projectStage", "项目阶段", "项目阶段", false);
        this.createBasicData("projectStage_1", "projectStage", "projectStage", "前期储备阶段", "", false);
        this.createBasicData("projectStage_2", "projectStage", "projectStage", "前期阶段", "", false);
        this.createBasicData("projectStage_3", "projectStage", "projectStage", "施工阶段", "", false);
        this.createBasicData("projectStage_4", "projectStage", "projectStage", "停工阶段", "", false);
        this.createBasicData("projectStage_5", "projectStage", "projectStage", "竣工阶段", "", false);
        this.createBasicData("projectStage_6", "projectStage", "projectStage", "固定资产登记阶段", "", false);

        //审批流程
        this.createBasicData("processStage", "", "processStage", "审批流程阶段", "审批流程阶段", false);
        this.createBasicData("processStage_1", "processStage", "processStage", "建设单位填写申报信息", "审批流程阶段", false);
        this.createBasicData("processStage_2", "processStage", "processStage", "投资科审核收件办理", "审批流程阶段", false);
        this.createBasicData("processStage_3", "processStage", "processStage", "科长审核办理", "审批流程阶段", false);
        this.createBasicData("processStage_4", "processStage", "processStage", "经办人办理", "审批流程阶段", false);
        this.createBasicData("processStage_5", "processStage", "processStage", "转他人办理", "审批流程阶段", false);
        this.createBasicData("processStage_6", "processStage", "processStage", "委托评审科长审核", "审批流程阶段", false);
        this.createBasicData("processStage_7", "processStage", "processStage", "拟文登记科长审核", "审批流程阶段", false);
        this.createBasicData("processStage_8", "processStage", "processStage", "评审中心审批", "审批流程阶段", false);
        this.createBasicData("processStage_9", "processStage", "processStage", "秘书科发文", "审批流程阶段", false);
        this.createBasicData("processStage_10", "processStage", "processStage", "审批退文", "审批流程阶段", false);

        this.createBasicData("taskType", "", "taskType", "任务类型", "任务类型", false);
        this.createBasicData("taskType_1", "taskType", "taskType", "月报填报", "", false);
        this.createBasicData("taskType_2", "taskType", "taskType", "下一年度计划", "", false);
        this.createBasicData("taskType_3", "taskType", "taskType", "是否发送短信", "", false);
        this.createBasicData("taskType_4", "taskType", "taskType", "是否打开申报端口", "", false);
        this.createBasicData("taskType_5", "taskType", "taskType", "项目建议书", "", false);
        this.createBasicData("taskType_6", "taskType", "taskType", "可行性研究报告", "", false);
        this.createBasicData("taskType_7", "taskType", "taskType", "初步设计与概算", "", false);
        this.createBasicData("taskType_8", "taskType", "taskType", "规划设计前期费", "", false);
        this.createBasicData("taskType_9", "taskType", "taskType", "新开工计划", "", false);
        this.createBasicData("taskType_10", "taskType", "taskType", "续建计划", "", false);
        this.createBasicData("taskType_11", "taskType", "taskType", "竣工决算", "", false);
        this.createBasicData("taskType_12", "taskType", "taskType", "资金申请报告", "", false);
        this.createBasicData("taskType_13", "taskType", "taskType", "月报端口配置", "", false);
        this.createBasicData("taskType_14", "taskType", "taskType", "计划下达", "", false);
        this.createBasicData("taskType_15", "taskType", "taskType", "审批分办人员配置", "", false);
        this.createBasicData("taskType_16", "taskType", "taskType", "计划下达端口配置", "", false);
        this.createBasicData("taskType_17", "taskType", "taskType", "项目办理人员配置", "", false);
        this.createBasicData("taskType_18", "taskType", "taskType", "办公室办文人员配置", "", false);
        this.createBasicData("taskType_19", "taskType", "taskType", "办公室印文人员配置", "", false);
        this.createBasicData("taskType_20", "taskType", "taskType", "首次前期经费下达", "", false);

        this.createBasicData("auditState", "", "auditState", "审核状态", "审核状态", false);
        this.createBasicData("auditState_1", "auditState", "auditState", "未审核", "", false);
        this.createBasicData("auditState_2", "auditState", "auditState", "审核通过", "", false);
        this.createBasicData("auditState_3", "auditState", "auditState", "审核不通过", "", false);

        this.createBasicData("credentialsType", "", "credentialsType", "证件类型", "");
        this.createBasicData("credentialsType_1", "credentialsType", "credentialsType", "身份证", "");
        this.createBasicData("credentialsType_2", "credentialsType", "credentialsType", "护照", "");
        this.createBasicData("credentialsType_3", "credentialsType", "credentialsType", "户口本", "");
        this.createBasicData("credentialsType_4", "credentialsType", "credentialsType", "军人证", "");
        this.createBasicData("credentialsType_5", "credentialsType", "credentialsType", "党员证", "");
        this.createBasicData("credentialsType_6", "credentialsType", "credentialsType", "其他", "");

        this.createBasicData("serviceRating", "", "serviceRating", "服务质量评分", "");
        this.createBasicData("serviceRating_1", "serviceRating", "serviceRating", "优秀(9-10)", "");
        this.createBasicData("serviceRating_2", "serviceRating", "serviceRating", "良好(8-9)", "");
        this.createBasicData("serviceRating_3", "serviceRating", "serviceRating", "合格(6-8)", "");
        this.createBasicData("serviceRating_4", "serviceRating", "serviceRating", "不合格(<6)", "");

        this.createBasicData("packageType", "", "packageType", "打包类型", "打包类型");
        this.createBasicData("packageType_1", "packageType", "packageType", "单列项目", "打包类型");
        this.createBasicData("packageType_2", "packageType", "packageType", "结算款项目", "打包类型");
        this.createBasicData("packageType_3", "packageType", "packageType", "小额项目", "打包类型");
        this.createBasicData("packageType_4", "packageType", "packageType", "未立项预留项目", "打包类型");


        this.createBasicData("shenpiStateType_1", "", "shenpiStateType", "审批中", "项目监控审批状态", 0);
        this.createBasicData("shenpiStateType_2", "", "shenpiStateType", "审批通过", "审批通过", 1);
        this.createBasicData("shenpiStateType_3", "", "shenpiStateType", "审批不通过", "审批不通过", 2);

        this.createBasicData("shenpiUnit_1", "shenpiUnitType", "shenpiUnitType", "项目计划书", "审批类型", 30);
        this.createBasicData("shenpiUnit_2", "shenpiUnitType", "shenpiUnitType", "计划立项", "审批类型", 15);
        this.createBasicData("shenpiUnit_3", "shenpiUnitType", "shenpiUnitType", "办理用地手续", "审批类型", 105);
        this.createBasicData("shenpiUnit_4", "shenpiUnitType", "shenpiUnitType", "设计招标", "审批类型", 45);
        this.createBasicData("shenpiUnit_5", "shenpiUnitType", "shenpiUnitType", "方案设计与审核", "审批类型", 65);
        this.createBasicData("shenpiUnit_6", "shenpiUnitType", "shenpiUnitType", "项目可行性研究", "审批类型", 50);
        this.createBasicData("shenpiUnit_7", "shenpiUnitType", "shenpiUnitType", "初步设计", "审批类型", 20);


        response.setMessage("基础数据初始化成功");
        response.setSuccess(true);
        logger.info("基础数据初始化成功!");
        return response;

    }

    /**
     * @Description：创建默认为可排序行业基础数据
     * @author： cx
     * @Date： 2017年7月4日
     * @version: 0.1
     */
    private BasicData createBasicData(String id, String pid, String identity, String description, String comment, Integer count, boolean canEdit, Integer itemOrder) {
        BasicData basicData = new BasicData();
        basicData.setId(id);
        basicData.setpId(pid);
        basicData.setIdentity(identity);
        basicData.setDescription(description);
        basicData.setCanEdit(true);
        basicData.setComment(comment);
        basicData.setCount(count);
        basicData.setCanEdit(canEdit);
        if (itemOrder != null) {
            basicData.setItemOrder(itemOrder);
        }
        basicDataRepo.save(basicData);
        return basicData;
    }

    /**
     * @Description：创建默认为可编辑的行业基础数据
     * @author： cx
     * @Date： 2017年7月4日
     * @version: 0.1
     */
    private BasicData createBasicData(String id, String pid, String identity, String description, String comment, Integer itemOrder, boolean canEdit) {
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
     * @Description：创建默认为可编辑的基础数据
     * @author： cx
     * @Date： 2017年7月4日
     * @version: 0.1
     */
    private BasicData createBasicData(String id, String pid, String identity, String description, String comment, Integer day) {
        BasicData basicData = new BasicData();
        basicData.setId(id);
        basicData.setpId(pid);
        basicData.setIdentity(identity);
        basicData.setDescription(description);
        basicData.setCanEdit(true);
        basicData.setDay(day);
        basicDataRepo.save(basicData);
        return basicData;
    }

    /**
     * @Description：创建默认为可编辑的基础数据
     * @author： cx
     * @Date： 2017年7月4日
     * @version: 0.1
     */
    private BasicData createBasicData(String id, String pid, String identity, String description, String comment) {
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
                                      boolean canEdit) {
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
        return sysConfigRepo.findAll().stream().map((x) -> {
            return sysConfigMapper.toDto(x);
        }).collect(Collectors.toList());
    }

    /**
     * @Description 创建task签收人
     */
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void createTaskUser(SysConfigDto sysConfigDto) {
        Optional<SysConfig> isExist = sysConfigRepo.findAll().stream().filter((x) -> {
            return sysConfigDto.getConfigType().equals(x.getConfigType())
                    && sysConfigDto.getConfigName().equals(x.getConfigName());
        }).findFirst();

        if (isExist.isPresent()) {//更新
            SysConfig entity = isExist.get();
            entity.setConfigValue(sysConfigDto.getConfigValue());
            entity.setEnable(sysConfigDto.getEnable());
            sysConfigRepo.save(entity);
        } else {//创建
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
    public SysConfigDto getSysConfig(String configName) {
        Criterion criterion = Restrictions.eq(SysConfig_.configName.getName(), configName);
        List<SysConfig> sysConfigs = sysConfigRepo.findByCriteria(criterion);
        Assert.notEmpty(sysConfigs, "没有查找到端口状态信息,请联系管理员！");
        SysConfig entity = sysConfigs.stream().findFirst().get();
        return sysConfigMapper.toDto(entity);
    }

}

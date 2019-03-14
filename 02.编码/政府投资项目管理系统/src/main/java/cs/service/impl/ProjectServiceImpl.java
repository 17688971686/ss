package cs.service.impl;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import com.sun.org.apache.xpath.internal.operations.Bool;
import cs.common.*;
import cs.excelHelper.PoiExcel2k3Helper;
import cs.excelHelper.PoiExcel2k7Helper;
import cs.excelHelper.PoiExcelHelper;
import cs.model.DomainDto.ShenBaoInfoDto;
import org.apache.commons.lang3.StringUtils;
import org.apache.log4j.Logger;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.util.SystemOutLogger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.query.NativeQuery;
import org.hibernate.transform.Transformers;
import org.hibernate.type.BooleanType;
import org.hibernate.type.DoubleType;
import org.hibernate.type.IntegerType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.domain.MonthReport;
import cs.domain.Project;
import cs.domain.Project_;
import cs.domain.ReplyFile;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfo_;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DtoMapper.IMapper;
import cs.model.Statistics.sttisticsData;
import cs.model.Statistics.ProjectStageData;
import cs.model.Statistics.ProjectStatisticsBean;
import cs.repository.impl.ProjectRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
import org.springframework.util.CollectionUtils;

import com.sn.framework.common.IdWorker;

/**
 * @Description: 项目信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class ProjectServiceImpl extends AbstractServiceImpl<ProjectDto, Project, String> implements ProjectService {
    private static Logger logger = Logger.getLogger(ProjectServiceImpl.class);

    @Autowired
    private IRepository<Attachment, String> attachmentRepo;
    @Autowired
    private IRepository<ReplyFile, String> replyFileRepo;
    @Autowired
    private IRepository<BasicData, String> basicDataRepo;
    @Autowired
    private IRepository<MonthReport, String> monthReportRepo;
    @Autowired
    private IRepository<UserUnitInfo, String> userUnitInfoRepo;
    @Autowired
    private IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
    @Autowired
    private ProjectRepoImpl projectRepoImpl;
    @Autowired
    private IMapper<AttachmentDto, Attachment> attachmentMapper;
    @Autowired
    private IMapper<MonthReportDto, MonthReport> monthReportMapper;

    @Override
    @Transactional
    public PageModelDto<ProjectDto> get(ODataObj odataObj) {
        logger.info("查询项目数据");
        return super.get(odataObj);
    }

    /**
     * 修改项目库和申报信息的 isIncludLibrary 字段
     * @param odata
     * @param id
     * @param isIncludLibary
     */
    @Override
    public void updateProjectForLibary(ODataObj odata, String id, Boolean isIncludLibary) {
        List<ShenBaoInfo> shenBaoInfos = shenBaoInfoRepo.findByOdata(odata);
        Project project = super.repository.findById(id);
        //如果shenbaoInfos数组不为空，修改申报表
        if(!CollectionUtils.isEmpty(shenBaoInfos)){
            ShenBaoInfo shenBaoInfo = shenBaoInfos.get(0);
            if(shenBaoInfo != null){
                //对比页面选择和申报表的isIncludLibrary,不同则修改后save
                if(shenBaoInfo.getIsIncludLibrary() != isIncludLibary){
                    shenBaoInfo.setIsIncludLibrary(isIncludLibary);
                    shenBaoInfo.setModifiedBy(currentUser.getUserId());
                    shenBaoInfo.setModifiedDate(new Date());
                    shenBaoInfoRepo.save(shenBaoInfo);
                }
            } else {
                throw  new IllegalArgumentException(String.format("没有查到对应的申报信息"));
            }
        }
        if(project != null){
            //对比页面选择和项目表的isIncludLibrary,不同则修改后save
            if(project.getIsIncludLibrary() != isIncludLibary){
                project.setIsIncludLibrary(isIncludLibary);
                project.setModifiedBy(currentUser.getUserId());
                project.setModifiedDate(new Date());
                super.repository.save(project);
                logger.info(String.format("======>修改项目纳出纳入,项目名称 %s", project.getProjectName()));
            }
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
        }
    }

    /**
     * 列表获取具有所属单位名的项目
     */
    @Override
    @Transactional
    public PageModelDto<ProjectDto> Get(ODataObj odataObj) {
        List<ProjectDto> dtos = super.repository.findByOdata(odataObj).stream().map((x) -> {
            return mapper.toDto(x);
        }).collect(Collectors.toList());

        dtos.stream().forEach(x -> {
            UserUnitInfo userUnitInfo = userUnitInfoRepo.findById(x.getUnitName());
            if (userUnitInfo != null) {
                x.setUnitName(userUnitInfo.getUnitName());
            } else {
                x.setUnitName("");
            }
        });

        PageModelDto<ProjectDto> pageModelDto = new PageModelDto<>();
        pageModelDto.setCount(odataObj.getCount());
        pageModelDto.setValue(dtos);
        logger.info("查询项目数据--带有所属单位名称");
        return pageModelDto;
    }

    /**
     * 列表获取本单位和所有已纳入项目库的项目
     */
    @Override
    @Transactional
    public PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj, Boolean isFilters, Boolean hasUnitFilter, Boolean isUnitFilter) {
        List<ProjectDto> dtos = projectRepoImpl.findByOdata2(odataObj, isFilters, hasUnitFilter, isUnitFilter).stream().map((x) -> {
            return mapper.toDto(x);
        }).collect(Collectors.toList());

//		dtos.stream().forEach(x->{
//			UserUnitInfo userUnitInfo = userUnitInfoRepo.findById(x.getUnitName());
//			if(userUnitInfo !=null){
//				x.setUnitName(userUnitInfo.getUnitName());
//			}else{
//				x.setUnitName("");
//			}
//		});

        //查询项目未提交申报的数据
        for (ProjectDto dto : dtos){
            //项目id
            String projectId = dto.getId();
            //条件-项目id
            Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), projectId);
            //条件-流程id为空
            Criterion criterion1 = Restrictions.isNull(ShenBaoInfo_.zong_processId.getName());


            Criterion criterion3 = Restrictions.and(criterion,criterion1);
            //查询
            List<ShenBaoInfo> shenBaoInfos = shenBaoInfoRepo.findByCriteria(criterion3);
            if(!shenBaoInfos.isEmpty()){
                ShenBaoInfo shenBaoInfo = shenBaoInfos.get(0);
                dto.setShenbaoId(shenBaoInfo.getId());
                dto.setProjectShenBaoStage(shenBaoInfo.getProjectStage());
                dto.setZong_processId(shenBaoInfo.getZong_processId());
            }
        }

        PageModelDto<ProjectDto> pageModelDto = new PageModelDto<>();
        pageModelDto.setCount(odataObj.getCount());
        pageModelDto.setValue(dtos);
        logger.info("查询项目数据--带有所属单位名称且包含所有已纳入项目库的");
        return pageModelDto;
    }

    @Override
    @Transactional
    public Project update(ProjectDto projectDto, String id) {
        Project project = super.update(projectDto, id);//进行数据的转换
        //处理关联信息
        //附件
        project.getAttachments().forEach(x -> {//删除历史附件
            attachmentRepo.delete(x);
        });
        project.getAttachments().clear();
        projectDto.getAttachmentDtos().forEach(x -> {//添加新附件
            Attachment attachment = new Attachment();
            attachmentMapper.buildEntity(x, attachment);
            attachment.setId(IdWorker.get32UUID());
            attachment.setCreatedBy(project.getCreatedBy());
            attachment.setModifiedBy(project.getModifiedBy());
            project.getAttachments().add(attachment);
        });
        //月报
        project.getMonthReports().forEach(x -> {//删除历史月报
            monthReportRepo.delete(x);
        });
        project.getMonthReports().clear();
        projectDto.getMonthReportDtos().forEach(x -> {//添加新月报
            MonthReport monthReport = new MonthReport();
            monthReportMapper.buildEntity(x, monthReport);
            monthReport.setCreatedBy(project.getCreatedBy());
            monthReport.setModifiedBy(project.getModifiedBy());
            project.getMonthReports().add(monthReport);
        });

        //保存数据
        super.repository.save(project);
        //更新文件库
        handlePiFuFile(project);
        logger.info(String.format("更新项目信息,项目名称 %s", projectDto.getProjectName()));
        return project;
    }

    @Override
    @Transactional
    public void updateProjectByIsMonthReport(String id, Boolean isMonthReport) {
        Project project = super.findById(id);
        if (project != null) {
            project.setIsMonthReport(isMonthReport);
            super.repository.save(project);
            logger.info(String.format("修改项目是否月报,项目名称 %s", project.getProjectName()));
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
        }
    }
	/*public void updateProjectByIsMonthReport(ProjectDto projectDto) {		
		Project project = super.repository.findById(projectDto.getId());
		if(project !=null){
			project.setIsMonthReport(projectDto.getIsMonthReport());
			//设置修改人
			project.setModifiedBy(currentUser.getUserId());
			project.setModifiedDate(new Date());
			//保存数据
			super.repository.save(project);
			logger.info(String.format("修改项目是否月报,项目名称 %s",project.getProjectName()));
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
		}
	}*/

    @Override
    @Transactional
    public Project create(ProjectDto projectDto) {
        if (projectDto != null) {
            //首先验证项目名称是否重复
            Criterion criterion = Restrictions.eq(Project_.projectName.getName(), projectDto.getProjectName());
            List<Project> findProjects = super.repository.findByCriteria(criterion);
            if (findProjects.isEmpty()) {//如果为空集合
                //判断是否存在项目代码--生成项目代码
                if (Util.isNull(projectDto.getProjectNumber())) {
                    //根据行业类型id查询出基础数据
                    BasicData basicData = basicDataRepo.findById(projectDto.getProjectIndustry());
                    if (basicData != null) {
//						String number = Util.getProjectNumber(projectDto.getProjectInvestmentType(), basicData);
//						projectDto.setProjectNumber(number);
                        //行业项目统计累加更新
                        basicData.setCount(basicData.getCount() + 1);
                        basicData.setModifiedBy(currentUser.getUserId());
                        basicData.setModifiedDate(new Date());
                        basicDataRepo.save(basicData);
                    } else {
                        throw new IllegalArgumentException(String.format("项目代码生成故障，请确认项目行业选择是否正确！"));
                    }
                }
                Project project = super.create(projectDto);    //进行数据的转换
                //处理关联信息
                projectDto.getAttachmentDtos().forEach(x -> {//添加新附件
                    Attachment attachment = new Attachment();
                    attachmentMapper.buildEntity(x, attachment);
                    attachment.setCreatedBy(project.getCreatedBy());
                    attachment.setModifiedBy(project.getModifiedBy());
                    project.getAttachments().add(attachment);
                });
                //月报
                projectDto.getMonthReportDtos().forEach(x -> {//添加新月报
                    MonthReport monthReport = new MonthReport();
                    monthReportMapper.buildEntity(x, monthReport);
                    monthReport.setCreatedBy(project.getCreatedBy());
                    monthReport.setModifiedBy(project.getModifiedBy());
                    project.getMonthReports().add(monthReport);
                });
                //保存数据
                super.repository.save(project);
                //将批复文件保存replyFile
                handlePiFuFile(project);
                logger.info(String.format("创建项目,项目名称： %s", projectDto.getProjectName()));
                return project;
            } else {//如果有项目
                throw new IllegalArgumentException(String.format("项目：%s 已存在,请重新确认！", projectDto.getProjectName()));
            }
        }
        return null;
    }

    @Override
    @Transactional
    public List<ProjectDto> getProjectByNumber(String number) {
        //根据项目代码来获取项目信息
        Criterion criterion = Restrictions.eq(Project_.projectNumber.getName(), number);
        List<Project> findProjects = super.repository.findByCriteria(criterion);

        List<ProjectDto> projectDtos = new ArrayList<>();
        if (findProjects.isEmpty()) {
            findProjects.stream().forEach(x -> {
                ProjectDto dto = super.mapper.toDto(x);
                projectDtos.add(dto);
            });
        }
        logger.info(String.format("根据项目代码查询项目,项目代码 %s", number));
        return projectDtos;
    }

    @Override
    @Transactional
    public void updateVersion(String id, Boolean isLatestVersion) {
        Project project = super.repository.findById(id);
        if (project != null) {
            project.setIsLatestVersion(isLatestVersion);
            project.setModifiedDate(new Date());//设置修改时间
            //设置修改人
            project.setModifiedBy(currentUser.getUserId());
            super.repository.save(project);
            logger.info(String.format("修改项目版本,项目名称 %s", project.getProjectName()));
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
        }
    }


    @Override
    @Transactional
    public void delete(String id) {
        //根据项目id查询到项目判断是否已纳入项目库
        Project entity = super.findById(id);
        if (entity != null) {
            if (entity.getIsIncludLibrary()) {
                throw new IllegalArgumentException(String.format("项目：%s --已纳入项目库，不可删除！", entity.getProjectName()));
            }
            //根据项目id查询到是否有申报记录
            Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), id);
            List<ShenBaoInfo> findShenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
            if (!findShenBaoInfo.isEmpty()) {//有的话返回false，没有的话返回true
                throw new IllegalArgumentException(String.format("项目：%s --已含有申报信息，不可删除！", entity.getProjectName()));
            }
            logger.info(String.format("删除项目,项目名称： %s", entity.getProjectName()));
            super.repository.delete(entity);
        } else {
            throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
        }
    }

    @Override
    public List<ProjectDto> findByDto(ODataObj odataObj) {
        return null;
    }

    /***************以下方法用于项目统计***************/
    @SuppressWarnings({"unchecked", "deprecation"})
    @Override
    @Transactional
    public List<ProjectStageData> getStageProjects() {
        List<ProjectStageData> datas = (List<ProjectStageData>) super.repository.getSession().createSQLQuery(
                "SELECT COUNT(p.id)as count,p.projectStage FROM cs_project p WHERE p.projectInvestmentType = 'projectInvestmentType_1' GROUP BY p.projectStage")
                .addScalar("count", new IntegerType())  //数量
                .addScalar("projectStage", new StringType())  //阶段id
                .setResultTransformer(Transformers.aliasToBean(ProjectStageData.class))
                .list();
        return datas;
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    @Override
    @Transactional
    public List<ProjectStageData> getMonthReportProjects() {
        return super.repository.getSession().createSQLQuery(
                "SELECT COUNT(p.id) as count, p.isMonthReport from cs_project p where p.projectInvestmentType = 'projectInvestmentType_1' GROUP BY p.isMonthReport")
                .addScalar("count", new IntegerType())
                .addScalar("isMonthReport", new BooleanType())
                .setResultTransformer(Transformers.aliasToBean(ProjectStageData.class))
                .list();
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    @Override
    @Transactional
    public List<ProjectStageData> getIndustryProjects() {
        return super.repository.getSession().createSQLQuery(
                "SELECT COUNT(p.id) as count, p.projectIndustry from cs_project p where p.projectInvestmentType = 'projectInvestmentType_1' GROUP BY p.projectIndustry")
                .addScalar("count", new IntegerType())
                .addScalar("projectIndustry", new StringType())
                .setResultTransformer(Transformers.aliasToBean(ProjectStageData.class))
                .list();
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    @Override
    @Transactional
    public List<sttisticsData> getprojectByHYData() {
        List<sttisticsData> list = new ArrayList<>();
        list = super.repository.getSession().createSQLQuery(SQLConfig.projectByHY)
                .addScalar("projectIndustry", new StringType())
                .addScalar("projectInvestSum", new DoubleType())
                .addScalar("projectInvestAccuSum", new DoubleType())
                .setResultTransformer(Transformers.aliasToBean(sttisticsData.class))
                .list();
        return list;
    }

    @SuppressWarnings({"unchecked", "deprecation"})
    @Override
    @Transactional
    public List<sttisticsData> getprojectInvestSourceData() {
        List<sttisticsData> list = new ArrayList<>();
        list = super.repository.getSession().createSQLQuery(SQLConfig.projectInvestSourceData)
                .addScalar("capitalSCZ_ggys", new DoubleType())
                .addScalar("capitalSCZ_gtzj", new DoubleType())
                .addScalar("capitalSCZ_zxzj", new DoubleType())
                .addScalar("capitalQCZ_ggys", new DoubleType())
                .addScalar("capitalQCZ_gtzj", new DoubleType())
                .addScalar("capitalZYYS", new DoubleType())
                .addScalar("capitalSHTZ", new DoubleType())
                .addScalar("capitalOther", new DoubleType())
                .setResultTransformer(Transformers.aliasToBean(sttisticsData.class))
                .list();
        return list;
    }

    /**
     * @param type            分类类型
     * @param isIncludLibrary 筛选条件：是否已纳入项目库
     * @return 查询到的数据集合
     * @throws
     * @Title: getProjectStatistics
     * @Description: 统计分析项目分类统计获取数据
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getProjectStatistics(String type, String isIncludLibrary) {
        List<ProjectStatisticsBean> list = new ArrayList<>();
        String Sql = "";
        switch (type) {
            case "unit"://按单位分类
                Sql += SQLConfig.projectStatisticsByUnit;
                break;
            case "category"://按项目类型分类
                Sql += SQLConfig.projectStatisticsByCategory;
                break;
            case "industry"://按项目行业分类
                Sql += SQLConfig.projectStatisticsByIndustry;
                break;
            case "stage"://按项目阶段分类
                Sql += SQLConfig.projectStatisticsByStage;
                break;
            default:
                break;
        }

        Boolean isIncluded = null;
        if (isIncludLibrary.equals("true")) {
            isIncluded = true;
        } else if (isIncludLibrary.equals("false")) {
            isIncluded = false;
        }
        NativeQuery query = super.repository.getSession().createNativeQuery(Sql);
        query.setParameter("isIncluded", isIncluded);
        query.addScalar("classDesc", new StringType());
        query.addScalar("projectNumbers", new IntegerType());
        query.addScalar("projectInvestSum", new DoubleType());
        if (type.equals("unit")) {
            query.addScalar("prereserveNumbers", new IntegerType());
            query.addScalar("preNumbers", new IntegerType());
            query.addScalar("constructionNumbers", new IntegerType());
            query.addScalar("shutdownNumbers", new IntegerType());
            query.addScalar("completedNumbers", new IntegerType());
            query.addScalar("fixedAssetsNumbers", new IntegerType());
        }
        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        switch (type) {
            //按单位分类
            case "unit":
                logger.info("项目总库信息单位分类统计报表导出");
                break;
            //按项目类型分类
            case "category":
                logger.info("项目总库信息类型分类统计报表导出");
                break;
            //按项目行业分类
            case "industry":
                logger.info("项目总库信息行业分类统计报表导出");
                break;
            //按项目阶段分类
            case "stage":
                logger.info("项目总库信息阶段分类统计报表导出");
                break;
            default:
                break;
        }
        return list;
    }

    /**
     * @param isIncludLibrary 筛选条件：是否已纳入项目库
     * @return 查询到的数据集合
     * @throws
     * @Title: getMoneyStatistics
     * @Description: 统计分析项目分类统计获取数据
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getMoneyStatistics(String isIncludLibrary,String[] stageSelected,String[] projectStageSelected,String projectName,
                 String[] unitSelected,String[] industrySelected,String[] categorySelected) {
        List<ProjectStatisticsBean> list = new ArrayList<>();

        String Sql = String.format("SELECT "
                + " a.projectName,u.unitName,b.description as projectStageDesc,IFNULL(a.projectInvestSum,0) AS projectInvestSum,IFNULL(a.pfProjectInvestSum,0) AS pfProjectInvestSum"
                + " from cs_shenbaoinfo a"
                + " left join cs_basicdata b on a.projectShenBaoStage = b.id"
                + " left join cs_userunitinfo u on a.unitName = u.id"
                + " where a.isIncludLibrary = :isIncluded ");

        Boolean isIncluded = null;
        if (isIncludLibrary.equals("true")) {
            isIncluded = true;
        } else if (isIncludLibrary.equals("false")) {
            isIncluded = false;
        }

        if (Util.isNotNull(projectName)) {
            Sql += " and a.projectName like \'%" + projectName + "%\' ";
        }

        if (stageSelected != null && stageSelected.length > 0) {
            Sql += " and a.projectShenBaoStage IN (";
            for (int i = 0; i < stageSelected.length; i++) {
                if (i == stageSelected.length - 1) {
                    Sql += "'" + stageSelected[i].trim() + "'";
                } else {
                    Sql += "'" + stageSelected[i].trim() + "',";
                }
            }
            Sql += " ) ";
        }

        if (projectStageSelected != null && projectStageSelected.length > 0) {
            Sql += " and a.projectStage IN (";
            for (int i = 0; i < projectStageSelected.length; i++) {
                if (i == projectStageSelected.length - 1) {
                    Sql += "'" + projectStageSelected[i].trim() + "'";
                } else {
                    Sql += "'" + projectStageSelected[i].trim() + "',";
                }
            }
            Sql += " ) ";
        }

        if (unitSelected != null && unitSelected.length > 0) {
            Sql += " and u.id IN (";
            for (int i = 0; i < unitSelected.length; i++) {
                if (i == unitSelected.length - 1) {
                    Sql += "'" + unitSelected[i].trim() + "'";
                } else {
                    Sql += "'" + unitSelected[i].trim() + "',";
                }
            }
            Sql += " ) ";
        }

        if (industrySelected != null && industrySelected.length > 0) {
            Sql += " and a.projectIndustry IN (";
            for (int i = 0; i < industrySelected.length; i++) {
                if (i == industrySelected.length - 1) {
                    Sql += "'" + industrySelected[i].trim() + "'";
                } else {
                    Sql += "'" + industrySelected[i].trim() + "',";
                }
            }
            Sql += " ) ";
        }

        if (categorySelected != null && categorySelected.length > 0) {
            Sql += " and a.projectCategory IN (";
            for (int i = 0; i < categorySelected.length; i++) {
                if (i == categorySelected.length - 1) {
                    Sql += "'" + categorySelected[i].trim() + "'";
                } else {
                    Sql += "'" + categorySelected[i].trim() + "',";
                }
            }
            Sql += " ) ";
        }

        Sql += "order by a.projectName desc,a.projectShenBaoStage asc ";

        NativeQuery query = super.repository.getSession().createNativeQuery(Sql);

        //参数设置
        query.setParameter("isIncluded", isIncluded);

        //映射pojo
        query.addScalar("projectName",new StringType());
        query.addScalar("unitName",new StringType());
        query.addScalar("projectStageDesc",new StringType());
        query.addScalar("pfProjectInvestSum",new DoubleType());
        query.addScalar("projectInvestSum", new DoubleType());

        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        logger.info("项目资金统计报表导出");
        return list;
    }

    /**
     * @param industrySelected 选中的行业
     * @param stageSelected    选中的阶段
     * @param categorySelected 选中的类别
     * @param unitSelected     选中的单位
     * @param investSumBegin   总投资范围开始段
     * @param investSumEnd     总投资范围结束段
     * @param projectName      项目名称
     * @return 查询到的数据集合
     * @throws
     * @Title: getProjectStatisticsByCustom
     * @Description: 统计分析项目自定义条件统计获取数据
     */
    @SuppressWarnings({"deprecation", "rawtypes", "unchecked"})
    @Override
    @Transactional
    public List<ProjectStatisticsBean> getProjectStatisticsByCustom(String[] industrySelected,
                                                                    String[] stageSelected, String[] categorySelected, String[] unitSelected, Double investSumBegin,
                                                                    Double investSumEnd, String projectName) {

        List<ProjectStatisticsBean> list;
        String Sql = "SELECT p.projectName,u.unitName,b1.description AS projectStageDesc,b2.description AS projectIndustryDesc,p.projectInvestSum,p.projectGuiMo,p.projectInvestAccuSum";
        Sql += " FROM cs_project AS p,cs_basicdata AS b1,cs_basicdata AS b2,cs_userunitinfo AS u";
        Sql += " WHERE";
        if (industrySelected != null && industrySelected.length > 0) {
            Sql += " p.projectIndustry IN (";
            for (int i = 0; i < industrySelected.length; i++) {
                if (i == industrySelected.length - 1) {
                    Sql += "'" + industrySelected[i] + "'";
                } else {
                    Sql += "'" + industrySelected[i] + "',";
                }
            }
            Sql += " ) AND";
        }
        if (stageSelected != null && stageSelected.length > 0) {
            Sql += " p.projectStage IN (";
            for (int i = 0; i < stageSelected.length; i++) {
                if (i == stageSelected.length - 1) {
                    Sql += "'" + stageSelected[i] + "'";
                } else {
                    Sql += "'" + stageSelected[i] + "',";
                }
            }
            Sql += " ) AND";
        }
        if (categorySelected != null && categorySelected.length > 0) {
            Sql += " p.projectCategory IN (";
            for (int i = 0; i < categorySelected.length; i++) {
                if (i == categorySelected.length - 1) {
                    Sql += "'" + categorySelected[i] + "'";
                } else {
                    Sql += "'" + categorySelected[i] + "',";
                }
            }
            Sql += " ) AND";
        }
        if (unitSelected != null && unitSelected.length > 0) {
            Sql += " p.unitName IN (";
            for (int i = 0; i < unitSelected.length; i++) {
                if (i == unitSelected.length - 1) {
                    Sql += "'" + unitSelected[i] + "'";
                } else {
                    Sql += "'" + unitSelected[i] + "',";
                }
            }
            Sql += " ) AND";
        }
        if (investSumBegin != null && investSumEnd != null) {
            Sql += " p.projectInvestSum BETWEEN " + investSumBegin + " AND " + investSumEnd + " AND";
        } else if (investSumBegin != null && investSumEnd == null) {
            Sql += " p.projectInvestSum >= " + investSumBegin + " AND";
        } else if (investSumBegin == null && investSumEnd != null) {
            Sql += " p.projectInvestSum <= " + investSumBegin + " AND";
        }

        if (Util.isNotNull(projectName)) {
            Sql += " p.projectName like \'%" + projectName + "%\' AND";
        }
        Sql += " p.projectStage = b1.id AND p.projectIndustry = b2.id AND p.unitName = u.id ORDER BY b2.itemOrder";

        NativeQuery query = super.repository.getSession().createNativeQuery(Sql);
        query.addScalar("projectName", new StringType());
        query.addScalar("unitName", new StringType());
        query.addScalar("projectStageDesc", new StringType());
        query.addScalar("projectIndustryDesc", new StringType());
        query.addScalar("projectInvestSum", new DoubleType());
        query.addScalar("projectGuiMo", new StringType());
        query.addScalar("projectInvestAccuSum", new DoubleType());
        list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
        logger.info("项目总库信息自定义分类统计报表导出");
        return list;
    }

    /**
     * 根据上传的Excel更新已拨付数
     *
     * @param filePath
     */
    @Override
    @Transactional
    public Map<String, Object> updateAlreadyDisbursedByExcel(String filePath) {
        try {
            PoiExcelHelper helper;
            if (filePath.toLowerCase().endsWith(PoiExcel2k3Helper.FILE_NAME_SUFFIX)) {
                // xls helper
                helper = new PoiExcel2k3Helper(filePath);
            } else {
                // xlsx helper
                helper = new PoiExcel2k7Helper(filePath);
            }

            /** 开始查找当前年份所在的列 **/
            int headerRowNum = 3;
            Integer currentYearColumnNum = null;
            Row headerRow = helper.getRow(headerRowNum);
            for (int i = 0; i < headerRow.getLastCellNum(); i++) {
                Cell cell = headerRow.getCell(i);
                if (cell.getStringCellValue().startsWith(LocalDate.now().getYear() + "")) {
                    currentYearColumnNum = i;
                }
            }

            if (currentYearColumnNum == null) {
                logger.error("解析文档时未找到当前年份对应的列");
                throw new IllegalArgumentException("解析文档时未找到当前年份对应的列");
            }
            /** 结束查找当前年份所在的列 **/

            int startRowNum = 4; // 开始读取数据的行数
            int successCount = 0;// 成功总数
            List<Object[]> errorList = new ArrayList<>();    // 错误列表，定义为: [Row实例, 消息]
            List<Row> rows = helper.getRows(startRowNum, helper.getLastRowNum());    // 从Excel中拿到指定行的内容

            for (Row row : rows) {
                Cell projectNumCell = row.getCell(5);    // 一行中projectNum所在的cell
                Cell alreadyDisbursedCell = row.getCell(currentYearColumnNum);    // 一行中已拨付数所在的cell

                // 判断项目名是否填入，若未填入则跳过该行数据并将该行加入错误列表
                if (StringUtils.isBlank(projectNumCell.getStringCellValue())) {
                    errorList.add(new Object[]{row, "未输入唯一编号, 已跳过该行数据"});
                    continue;
                }

                if (StringUtils.isBlank(helper.getCellValue(alreadyDisbursedCell))) {
                    errorList.add(new Object[]{row, "未填入拨付金额, 已跳过该行数据"});
                    continue;
                }

                try {
                    alreadyDisbursedCell.getNumericCellValue();
                } catch (IllegalStateException e) {
                    errorList.add(new Object[]{row, "拨付金额错误, 已跳过该行数据"});
                    continue;
                }

                // 根据projectNum从库中查询出project对象
                Project project = getProjectByProjectNum(projectNumCell.getStringCellValue());

                // 若未在库中找到对应的项目，则跳过该行数据并将该行加入错误列表
                if (project == null) {
                    errorList.add(new Object[]{row, "未能根据【唯一编号】在系统中找到对应的项目"});
                    continue;
                }

                // 设置已拨付数到项目实例中
                project.setAlreadyDisbursed(alreadyDisbursedCell.getNumericCellValue());

                // 保存
                project.setModifiedDate(new Date());//设置修改时间
                project.setModifiedBy(currentUser.getUserId());//设置修改人
                super.repository.save(project);

                // 成功总数加一
                successCount++;
            }

            // 将结果以Map对象的形式返回给调用者
            Map<String, Object> result = new HashMap<>();
            result.put("errorList", errorList);
            result.put("successCount", successCount);
            result.put("totalCount", rows.size());
            logger.info(String.format("完成更新已拨付数，总行数：%s，成功行数：%s, 失败行数：%s", rows.size(), successCount, errorList.size()));
            return result;
        } catch (IOException e) {
            logger.error("更新已拨付数时发生异常: " + e.getMessage());
            throw new IllegalArgumentException("更新已拨付数时发生异常");
        }
    }

    @Override
    @Transactional
    public boolean projectNumberExists(String projectNumber, String ignoreProject) {
        Criteria crit = super.repository.getSession().createCriteria(Project.class);
        crit.add(Restrictions.eq(Project_.projectNumber.getName(), projectNumber));
        if (StringUtils.isNotBlank(ignoreProject)) {
            crit.add(Restrictions.ne(Project_.id.getName(), ignoreProject));
        }
        return ((Number) crit.setProjection(Projections.rowCount()).uniqueResult()).intValue() > 0;
    }

    @Override
    @Transactional
    public void updateProjectNumber(String projectId, String projectNumber) {
        Project project = findById(projectId);
        project.setProjectNumber(projectNumber);
        super.repository.save(project);
    }

    @Override
    @Transactional
    public int getProjectSequenceNumberInYear(String projectId) {
        String sql = "select rownum from (select @rownum\\:=@rownum+1 as rownum, id from (select @rownum\\:=0) r, cs_project where date_format(createdDate, '%Y') = (select date_format(p.createdDate, '%Y') from cs_project p where id = '" + projectId + "') order by createdDate, id) t where id = '" + projectId + "'";

        List results = super.repository.getSession().createSQLQuery(sql)
                .addScalar("rownum", new IntegerType())
                .list();

        if (!CollectionUtils.isEmpty(results)) {
            return (Integer) results.get(0);
        }
        throw new IllegalArgumentException("获得项目序列号时出错");
    }

    @Transactional(rollbackOn = Exception.class)
    public Project getProjectByProjectNum(String projectNumber) {
        Criterion criterion = Restrictions.eq(Project_.projectNumber.getName(), projectNumber);
        List<Project> projects = super.repository.findByCriteria(criterion);
        if (!CollectionUtils.isEmpty(projects)) {
            return projects.get(0);
        }
        return null;
    }

//	public List<ProjectStatisticsBean> getProjectStatisticsByCustom(List<String> industrySelected,
//			List<String> stageSelected, List<String> categorySelected, List<String> unitSelected, Double investSumBegin,
//			Double investSumEnd) {
//		
//		List<ProjectStatisticsBean> list = new ArrayList<>();
//		String Sql = "SELECT p.projectName,u.unitName,b1.description AS projectStageDesc,b2.description AS projectIndustryDesc,p.projectInvestSum,p.projectGuiMo,p.projectInvestAccuSum";
//		Sql +=" FROM cs_project AS p,cs_basicdata AS b1,cs_basicdata AS b2,cs_userunitinfo AS u";
//		Sql +=" WHERE";
//		if(industrySelected.size()>0){
//			Sql +=" p.projectIndustry IN (";
//			for(int i=0;i<industrySelected.size();i++){
//				if(i == industrySelected.size()-1){
//					Sql += "'"+industrySelected.get(i)+"'";
//				}else{
//					Sql += "'"+industrySelected.get(i)+"',";
//				}
//			}
//			Sql +=" ) AND";
//		}
//		if(stageSelected.size()>0){
//			Sql += " p.projectStage IN (";
//			for(int i=0;i<stageSelected.size();i++){
//				if(i == stageSelected.size()-1){
//					Sql += "'"+stageSelected.get(i)+"'";
//				}else{
//					Sql += "'"+stageSelected.get(i)+"',";
//				}
//			}
//			Sql +=" ) AND";
//		}
//		if(categorySelected.size()>0){
//			Sql += " p.projectCategory IN (";
//			for(int i=0;i<categorySelected.size();i++){
//				if(i == categorySelected.size()-1){
//					Sql += "'"+categorySelected.get(i)+"'";
//				}else{
//					Sql += "'"+categorySelected.get(i)+"',";
//				}
//			}
//			Sql +=" ) AND";
//		}
//		if(unitSelected.size()>0){
//			Sql += " p.unitName IN (";
//			for(int i=0;i<unitSelected.size();i++){
//				if(i == unitSelected.size()-1){
//					Sql += "'"+unitSelected.get(i)+"'";
//				}else{
//					Sql += "'"+unitSelected.get(i)+"',";
//				}
//			}
//			Sql +=" ) AND";
//		}
//		if(investSumBegin!=null && investSumEnd!=null){
//			Sql +=" p.projectInvestSum BETWEEN "+investSumBegin+" AND "+investSumEnd+" AND";
//		}else if(investSumBegin!=null && investSumEnd==null){
//			Sql +=" p.projectInvestSum >= "+investSumBegin+" AND";
//		}else if(investSumBegin==null && investSumEnd!=null){
//			Sql +=" p.projectInvestSum <= "+investSumBegin+" AND";
//		}
//		
//		Sql +=" p.projectStage = b1.id AND p.projectIndustry = b2.id AND p.unitName = u.id ORDER BY b2.itemOrder";
//		
//		NativeQuery query = super.repository.getSession().createSQLQuery(Sql);
//		query.addScalar("projectName", new StringType());
//		query.addScalar("unitName", new StringType());
//		query.addScalar("projectStageDesc", new StringType());
//		query.addScalar("projectIndustryDesc", new StringType());
//		query.addScalar("projectInvestSum", new DoubleType());
//		query.addScalar("projectGuiMo", new StringType());
//		query.addScalar("projectInvestAccuSum", new DoubleType());
//		list = query.setResultTransformer(Transformers.aliasToBean(ProjectStatisticsBean.class)).list();
//		logger.info("项目总库信息自定义分类统计报表导出");
//		return list;
//	}

	/**
	 * 批复文件库处理
	 */
	@Override
	public void handlePiFuFile(Project project){
		//获取文件库中所有的批复文件(map)
		List<ReplyFile> replyFiles = replyFileRepo.findAll();
		Map<String,Object> replyFileMap = new HashMap<String,Object>();
		replyFiles.stream().forEach(x->{
			String key = x.getNumber();//文号
			String value = x.getName();//文件名
			replyFileMap.put(key, value);
		});
		//获取项目中批复文件以及文号(map)
		Map<String,Attachment> pifuMap = new HashMap<>();
		project.getAttachments().stream().forEach(x->{
			if(Util.isNotNull(x.getType())){//非空判断
				if(x.getType().equals(BasicDataConfig.attachment_type_jys)){//如果是建议书批复文件
					pifuMap.put(project.getPifuJYS_wenhao(), x);
				}
				if(x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)){//如果是可行性研究报告批复文件
					pifuMap.put(project.getPifuKXXYJBG_wenhao(), x);
				}
				if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){//如果是初步概算与设计批复文件
                    pifuMap.put(project.getPifuCBSJYGS_wenhao(), x);
                }
				if(x.getType().equals(BasicDataConfig.attachment_type_zjsqbg)){//如果是资金申请报告批复文件
                    pifuMap.put(project.getPifuZJSQBG_wenhao(), x);
                }
				if(x.getType().equals(BasicDataConfig.attachment_type_SCQQJFXD)){//如果是资金申请报告批复文件
                    pifuMap.put(project.getPifuSCQQJFXD_wenhao(), x);
                }
            }
        });
        //判断项目中批复文件在文件库中是否存在,最后获取需要进行存储的批复文件
        List<Map<String, Object>> needList = Util.getCheck(pifuMap, replyFileMap);
        //更新文件库
        needList.stream().forEach(x -> {
            for (String key : x.keySet()) {
                Attachment obj = (Attachment) x.get(key);
                ReplyFile replyfile = new ReplyFile();
                replyfile.setId(UUID.randomUUID().toString());
                replyfile.setNumber(key);
                replyfile.setName(obj.getName());
                replyfile.setFullName(obj.getUrl());
                replyfile.setType(obj.getType());
                replyfile.setItemOrder(obj.getItemOrder());
                replyfile.setCreatedBy(obj.getCreatedBy());
                replyfile.setModifiedBy(obj.getModifiedBy());

                replyFileRepo.save(replyfile);//更新文件库
            }
        });
    }

}

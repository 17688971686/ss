package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Util;
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
import cs.repository.impl.ProjectRepoImpl;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectService;
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
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<ProjectDto> get(ODataObj odataObj) {
		logger.info("查询项目数据");
		return super.get(odataObj);		
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
		
		dtos.stream().forEach(x->{
			UserUnitInfo userUnitInfo = userUnitInfoRepo.findById(x.getUnitName());
			if(userUnitInfo !=null){
				x.setUnitName(userUnitInfo.getUnitName());
			}else{
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
	public PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter) {
		List<ProjectDto> dtos = projectRepoImpl.findByOdata2(odataObj,isFilters,hasUnitFilter,isUnitFilter).stream().map((x) -> {
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
		
		PageModelDto<ProjectDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);
		logger.info("查询项目数据--带有所属单位名称且包含所有已纳入项目库的");
		return pageModelDto;
	}

	@Override
	@Transactional
	public Project update(ProjectDto projectDto,String id) {		
		Project project = super.update(projectDto,id);//进行数据的转换		
		//处理关联信息
		//附件
		project.getAttachments().forEach(x -> {//删除历史附件
			attachmentRepo.delete(x);
		});
		project.getAttachments().clear();
		projectDto.getAttachmentDtos().forEach(x -> {//添加新附件
			Attachment attachment = new Attachment();
			attachmentMapper.buildEntity(x, attachment);
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
		logger.info(String.format("更新项目信息,项目名称 %s",projectDto.getProjectName()));
		return project;		
	}
	
	@Override
	@Transactional
	public void updateProjectByIsMonthReport(ProjectDto projectDto) {		
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
	}
	
	@Override
	@Transactional
	public Project create(ProjectDto projectDto) {
			//判断是否存在项目代码--生成项目代码
			if(Util.isNull(projectDto.getProjectNumber())){
				//根据行业类型id查询出基础数据
				BasicData basicData = basicDataRepo.findById(projectDto.getProjectIndustry());
				if(basicData !=null){
					if(Util.isNotNull(projectDto.getProjectInvestmentType())){
						String number = Util.getProjectNumber(projectDto.getProjectInvestmentType(), basicData);
						projectDto.setProjectNumber(number);
						//行业项目统计累加
						basicData.setCount(basicData.getCount()+1);
						basicData.setModifiedBy(currentUser.getUserId());
						basicData.setModifiedDate(new Date());
						basicDataRepo.save(basicData);
					}
				}else{
					throw new IllegalArgumentException(String.format("项目代码生成故障，请确认项目行业选择是否正确！"));
				}
			}
			Project project = super.create(projectDto);	//进行数据转换
			project.setModifiedDate(new Date());//设置修改时间（是为了更新项目阶段时用）
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
			//将文件保存replyFile
			handlePiFuFile(project);
			logger.info(String.format("创建项目,项目名称 %s",projectDto.getProjectName()));
			return project;	
	}
	
	@Override
	@Transactional
	public List<ProjectDto> getProjectByNumber(String number) {
		//根据项目代码来获取项目信息
		Criterion criterion=Restrictions.eq(Project_.projectNumber.getName(), number);
		List<Project> findProjects = super.repository.findByCriteria(criterion);
		
		List<ProjectDto> projectDtos = new ArrayList<>();
		if(findProjects.isEmpty()){
			findProjects.stream().forEach(x->{
				ProjectDto dto = super.mapper.toDto(x);			
				projectDtos.add(dto);
			});
		}
		logger.info(String.format("根据项目代码查询项目,项目代码 %s",number));
		return projectDtos;
	}

	@Override
	@Transactional
	public void updateVersion(String id, Boolean isLatestVersion) {
		Project project = super.repository.findById(id);
		if(project !=null){
			project.setIsLatestVersion(isLatestVersion);
			project.setModifiedDate(new Date());//设置修改时间
			//设置修改人
			project.setModifiedBy(currentUser.getUserId());
			super.repository.save(project);
			logger.info(String.format("修改项目版本,项目名称 %s",project.getProjectName()));
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
		}
	}
	
	
	
	@Override
	@Transactional
	public void delete(String id) {
		//根据项目id查询到项目判断是否已纳入项目库
		Project entity = super.findById(id);
		if(entity !=null){
			if(entity.getIsIncludLibrary()){
				throw new IllegalArgumentException(String.format("项目：%s --已纳入项目库，不可删除！",entity.getProjectName()));
			}
			//根据项目id查询到是否有申报记录
			Criterion criterion = Restrictions.eq(ShenBaoInfo_.projectId.getName(), id);
			List<ShenBaoInfo> findShenBaoInfo = shenBaoInfoRepo.findByCriteria(criterion);
			if(!findShenBaoInfo.isEmpty()){//有的话返回false，没有的话返回true
				throw new IllegalArgumentException(String.format("项目：%s --已含有申报信息，不可删除！",entity.getProjectName()));
			}
			logger.info(String.format("删除项目,项目名称： %s",entity.getProjectName()));
			super.repository.delete(entity);
		}else{
			throw new IllegalArgumentException(String.format("没有查找到对应的项目"));
		}
	}

	/**
	 * 批复文件库处理
	 */
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
				if(x.getType().equals(BasicDataConfig.attachment_type_jys)){
					pifuMap.put(project.getPifuJYS_wenhao(), x);
				}
				else if(x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)){
					pifuMap.put(project.getPifuKXXYJBG_wenhao(), x);
				}
				else if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs)){
					pifuMap.put(project.getPifuCBSJYGS_wenhao(), x);
				}
			}
		});
		//判断项目中批复文件在文件库中是否存在
		List<Map<String,Object>> needList = Util.getCheck(pifuMap,replyFileMap);
		//更新文件库
		needList.stream().forEach(x->{
			for(String key:x.keySet()){
				Attachment obj = (Attachment)x.get(key);
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

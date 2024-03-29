package cs.service.impl;

import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.Util;
import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.domain.MonthReport;
import cs.domain.Project;
import cs.domain.ReplyFile;
import cs.model.PageModelDto;
import cs.model.DomainDto.AttachmentDto;
import cs.model.DomainDto.MonthReportDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ProjectSupervisedService;

@Service
public class ProjectSupervisedServiceImpl extends AbstractServiceImpl<ProjectDto, Project, String> implements ProjectSupervisedService{

	private static Logger logger = Logger.getLogger(ProjectSupervisedServiceImpl.class);
			
	@Autowired
	private IRepository<Attachment, String> attachmentRepo;
	@Autowired
	private IRepository<ReplyFile, String> replyFileRepo;
	@Autowired
	private IRepository<BasicData, String> basicDataRepo;
	@Autowired
	private IRepository<MonthReport, String> monthReportRepo;
	@Autowired
	private IMapper<AttachmentDto, Attachment> attachmentMapper;
	@Autowired
	private IMapper<MonthReportDto, MonthReport> monthReportMapper;
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<ProjectDto> get(ODataObj odataObj) {
		logger.info("======>查询项目数据");
		return super.get(odataObj);		
	}
	
	@Override
	public void updateProjectByIsMonthReport(ProjectDto projectDto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public List<ProjectDto> getProjectByNumber(String number) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public void updateVersion(String id, Boolean isLatestVersion) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public PageModelDto<ProjectDto> Get(ODataObj odataObj) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public PageModelDto<ProjectDto> getUnitAndAll(ODataObj odataObj, Boolean isFilters, Boolean hasUnitFilter,
			Boolean isUnitFilter) {
		// TODO Auto-generated method stub
		return null;
	}
	
	@Override
	@Transactional
	public Project create(ProjectDto projectDto) {
			//判断是否存在项目代码--生成项目代码
			if(projectDto.getProjectNumber() == null || projectDto.getProjectNumber().isEmpty()){
				//根据行业类型id查询出基础数据
				BasicData basicData = basicDataRepo.findById(projectDto.getProjectIndustry());
				if(basicData !=null){
//					String number = Util.getProjectNumber(projectDto.getProjectInvestmentType(), basicData);
//					projectDto.setProjectNumber(number);
					//行业项目统计累加
					basicData.setCount(basicData.getCount()+1);
					basicData.setModifiedBy(currentUser.getLoginName());
					basicData.setModifiedDate(new Date());
					basicDataRepo.save(basicData);
				}else{
					throw new IllegalArgumentException(String.format("项目代码生成故障，请确认项目行业选择是否正确！"));
				}
			}
			Project project = super.create(projectDto);	
			project.setModifiedDate(new Date());//设置修改时间
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
	public Project update(ProjectDto projectDto,String id) {		
		Project project = super.update(projectDto,id);		
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
		logger.info(String.format("编辑项目,项目名称 %s",projectDto.getProjectName()));
		return project;		
	}

	@Override
	public List<ProjectDto> findByDto(ODataObj odataObj) {
		return null;
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
			if(x.getType() !=null && !x.getType().isEmpty()){//非空判断
				if(x.getType().equals(BasicDataConfig.attachment_type_cbsjygs) ||
						x.getType().equals(BasicDataConfig.attachment_type_jys) ||
						x.getType().equals(BasicDataConfig.attachment_type_kxxyjbg)
						){
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
				replyfile.setCreatedBy(obj.getCreatedBy());
				replyfile.setName(obj.getName());
				replyfile.setFullName(obj.getUrl());
				replyfile.setItemOrder(obj.getItemOrder());
				replyfile.setModifiedBy(obj.getModifiedBy());
				replyfile.setType(obj.getType());
				replyFileRepo.save(replyfile);//更新文件库
			}
		});
	} 

}

package cs.service.impl;

import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import cs.common.DateUtil;
import cs.common.SQLConfig;
import cs.model.Statistics.sttisticsData;
import org.apache.log4j.Logger;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.hibernate.transform.Transformers;
import org.hibernate.type.DoubleType;
import org.hibernate.type.StringType;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.Project;
import cs.domain.ShenPiItems;
import cs.domain.ShenPiUnit;
import cs.model.PageModelDto;
import cs.model.DomainDto.ProjectDto;
import cs.model.DomainDto.ShenPiItemsDto;
import cs.model.DomainDto.ShenPiUnitDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenPiItemsService;

@Service
public class ShenPiItemsServiceImpl  extends AbstractServiceImpl<ShenPiItemsDto,ShenPiItems,String>  implements  ShenPiItemsService{
	private static Logger logger = Logger.getLogger(ShenPiItemsServiceImpl.class);
	// 依赖注入持久层
	@Autowired
	private IRepository<ShenPiItems, String> shenPiItemsRepo;
	@Autowired
	private IRepository<Project, String> projectRepo;
	@Autowired
	private IRepository<ShenPiUnit, String> shenpiUnitRepo;
	@Autowired
	private IMapper<ShenPiItemsDto, ShenPiItems>  shenPiItemsMapper;
	@Autowired
	private IMapper<ShenPiUnitDto, ShenPiUnit>  shenpiUnitMapper;
	@Autowired
	private IMapper<ProjectDto, Project>  projectMapper;
	@Autowired
	private ICurrentUser currentUser;
	@Override
	@Transactional
	public PageModelDto<ShenPiItemsDto> get(ODataObj odataObj) {
		List<ShenPiItemsDto> shenPiItemsDtoList = setShenpiItemsList(odataObj,"eq","shenpiType_item","shenpiType","审批事项列表");
		PageModelDto<ShenPiItemsDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenPiItemsDtoList);
		return pageModelDto;
	}
	public ShenPiItemsDto  setShenPiItemsDto(ShenPiItems shenPiItems){
		ShenPiItemsDto dto=shenPiItemsMapper.toDto(shenPiItems);
		if(shenPiItems.getProjectId()!=null){
			Project project=projectRepo.findById(shenPiItems.getProjectId());
			ProjectDto projectDto=projectMapper.toDto(project);
			dto.setProjectDto(projectDto);
		}
		if(shenPiItems.getShenpiUnitId()!=null){
			ShenPiUnit shenPiUnit=	shenpiUnitRepo.findById(shenPiItems.getShenpiUnitId());
			ShenPiUnitDto shenPiUnitDto=shenpiUnitMapper.toDto(shenPiUnit);
			dto.setShenPiUnitDto(shenPiUnitDto);
		}
		return  dto;
	}
	/**
	 * 包装审批事项
	 * @param odataObj
	 * @param operatorType
	 * @param value
	 * @param field
	 * @param type
	 * @return List
	 */
	public List<ShenPiItemsDto> setShenpiItemsList(ODataObj odataObj,String operatorType,String value,String field ,String type){
		ODataFilterItem<String> filterItem= new ODataFilterItem<>();
		filterItem.setField(field);//"shenpiUnitId"
		filterItem.setOperator(operatorType);//"eq"
		filterItem.setValue(value);//shenPiUnits.get(0).getId()
		odataObj.getFilter().add(filterItem);
		List<ShenPiItemsDto> shenPiItemsDtos=new ArrayList<ShenPiItemsDto>();
		Date  date = new Date();
		shenPiItemsRepo.findByOdata(odataObj).forEach(x->{
			int temp = 0;
			temp = DateUtil.overdueTime(date,x.getShenpiBeginDate(),"",x.getDayNum());
			ShenPiItemsDto dto = null;
			if ("逾期".equals(type)&&temp < 0){
				if(!"1".equals(x.getShenpiState())){
					x.setVirtualDayNum(temp);
					dto = setShenPiItemsDto(x);
					shenPiItemsDtos.add(dto);
				}
			}
			if (!"逾期".equals(type)){
				x.setVirtualDayNum(temp);
				dto = setShenPiItemsDto(x);
				shenPiItemsDtos.add(dto);
			}
		});
		return  shenPiItemsDtos;
	}

	@Override
	@Transactional
	public PageModelDto<ShenPiItemsDto> getShenpiItemsOverdue(ODataObj odataObj)  {
		List<ShenPiItemsDto>shenPiItemsDtoList = setShenpiItemsList(odataObj,"eq","shenpiType_item","shenpiType","逾期");
		PageModelDto<ShenPiItemsDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount()-1);
		pageModelDto.setValue(shenPiItemsDtoList);
		return pageModelDto;
	}
	@Override
	@Transactional
	public ShenPiItems update(ShenPiItemsDto dto, String id) {
		setShenPiItemsNameOrDay(dto);
		dto.setProjectId(dto.getProjectDto().getId());
		dto.setProjectName(dto.getProjectDto().getProjectName());
		dto.setShenpiUnitId(dto.getShenPiUnitDto().getId());
		dto.setShenpiUnitName(dto.getShenPiUnitDto().getShenpiUnitName());
		logger.info(String.format("编辑审批事项信息,审批事项名称 %s",dto.getShenpiName()));
		ShenPiItems shenpiItems=super.update(dto, id);
		return super.repository.save(shenpiItems);
	}
	@Override
	@Transactional
	public ShenPiItems create(ShenPiItemsDto dto) {
		setShenPiItemsNameOrDay(dto);
		dto.setProjectId(dto.getProjectDto().getId());
		dto.setProjectName(dto.getProjectDto().getProjectName());
		dto.setShenpiUnitId(dto.getShenPiUnitDto().getId());
		dto.setShenpiUnitName(dto.getShenPiUnitDto().getShenpiUnitName());
		logger.info(String.format("新增审批事项,审批事项名称  %s",dto.getShenpiName()));
		ShenPiItems shenPiItems=super.create(dto);
		return super.repository.save(shenPiItems);
	}
	public  ShenPiItemsDto  setShenPiItemsNameOrDay(ShenPiItemsDto dto){
		String shenpiName = dto.getShenpiName();
		int dayNum = 0;
		if(shenpiName!=null){
			if(shenpiName.contains(",")){
				String[] array = shenpiName.split(",");
				shenpiName =array[1];
				dayNum= Integer.valueOf(array[0]);
				dto.setShenpiName(shenpiName);
				dto.setDayNum(dayNum);
			}
		}
		return dto;
	}
	@Override
	@Transactional
	public void delete(String id) {
	   logger.info(String.format("删除审批事项,审批事项id %s",id));
	   super.delete(id);
	}
	@Override
	@Transactional
	public void deletes(String[] ids) {
		super.deletes(ids);
	}

	@Override
	@Transactional
	public List<ShenPiItemsDto> findByDto(ODataObj odataObj) {
		ShenPiItemsDto shenPiItemsDto = new ShenPiItemsDto();
		List<ShenPiItemsDto> shenPiItemsDtos=new ArrayList<ShenPiItemsDto>();
		shenPiItemsRepo.findByOdata(odataObj).forEach(x->{
			ShenPiItemsDto dto=shenPiItemsMapper.toDto(x);
			shenPiItemsDtos.add(dto);
		});

		return shenPiItemsDtos;

	}


}

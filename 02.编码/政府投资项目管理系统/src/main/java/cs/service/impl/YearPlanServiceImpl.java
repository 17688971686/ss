package cs.service.impl;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import javax.management.Query;
import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.SQLConfig;
import cs.domain.BasicData;
import cs.domain.ShenBaoInfo;
import cs.domain.YearPlan;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.model.DtoMapper.ShenBaoInfoMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.interfaces.YearPlanRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanService;

@Service
public class YearPlanServiceImpl implements YearPlanService {
	private static Logger logger = Logger.getLogger(YearPlanServiceImpl.class);
	@Autowired
	private YearPlanRepo yearPlanRepo;
	@Autowired
	private ShenBaoInfoRepo shenbaoInfoRepo;
	
	@Autowired
	private IMapper<YearPlanDto, YearPlan> yearPlanMapper;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoInfoMapper;

	@Override
	@Transactional
	public PageModelDto<YearPlanDto> get(ODataObj odataObj) {
		List<YearPlanDto> yearPlanDtos=new ArrayList<>();
		yearPlanRepo.findByOdata(odataObj).forEach(x->{
			
			YearPlanDto yearPlanDto=yearPlanMapper.toDto(x);			
			yearPlanDtos.add(yearPlanDto);	
			
		});
		PageModelDto<YearPlanDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(yearPlanDtos);
		logger.info("查询年度计划数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void create(YearPlanDto dto) {
		YearPlan entity=new YearPlan();
		yearPlanMapper.buildEntity(dto, entity);
		yearPlanRepo.save(entity);
		logger.info(String.format("创建年度计划,名称：%s",dto.getName()));
	}

	@Override
	@Transactional
	public void update(YearPlanDto dto) {
		YearPlan entity=yearPlanRepo.findById(dto.getId());
		if(entity!=null){
			yearPlanMapper.buildEntity(dto, entity);
			yearPlanRepo.save(entity);
			logger.info(String.format("更新年度计划,名称：%s",dto.getName()));
		}
		
	}

	@Override
	@Transactional
	public List<ShenBaoInfoDto> getYearPlanShenBaoInfo(String planId) {	
		YearPlan yearPlan=yearPlanRepo.findById(planId);
		if(yearPlan!=null){
			List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
			
			List<ShenBaoInfo> shenBaoInfos=shenbaoInfoRepo.getSession()
					.createSQLQuery(SQLConfig.yearPlanProject)
					.setParameter("yearPlanId", planId)
					.addEntity(ShenBaoInfo.class)
					.getResultList();
			shenBaoInfos.forEach(x->{
				shenBaoInfoDtos.add(shenbaoInfoMapper.toDto(x));
			});
			
			return shenBaoInfoDtos;
		}	
		
		return null;
	}

}

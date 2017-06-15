package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.ShenBaoInfo;
import cs.domain.YearPlan;
import cs.domain.YearPlanCapital;
import cs.model.PageModelDto;
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.model.DomainDto.YearPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.interfaces.YearPlanCapitalRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.YearPlanCapitalService;

@Service
public class YearPlanCapitalServiceImpl implements YearPlanCapitalService {
	private static Logger logger = Logger.getLogger(YearPlanCapitalServiceImpl.class);
	
	@Autowired
	private YearPlanCapitalRepo yearPlanCapitalRepo;
	
	@Autowired
	private IMapper<YearPlanCapitalDto, YearPlanCapital> yearPlanCapitalMapper;
	
	@Autowired
	private ICurrentUser currentUser;
	
	@Autowired
	private ShenBaoInfoRepo shenBaoInfoRepo;

	@Override
	@Transactional
	public void createYearPlanCapitals(String[] ids) {
		

	}
	
	

	@Override
	@Transactional
	public PageModelDto<YearPlanCapitalDto> get(ODataObj odataObj) {
		List<YearPlanCapitalDto> yearPlanCapitalDtos=new ArrayList<>();
		yearPlanCapitalRepo.findByOdata(odataObj).forEach(x->{			
			YearPlanCapitalDto yearPlanCapitalDto=yearPlanCapitalMapper.toDto(x);			
			yearPlanCapitalDtos.add(yearPlanCapitalDto);				
		});
		PageModelDto<YearPlanCapitalDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(yearPlanCapitalDtos);
		logger.info("查询年度计划编制数据");
		return pageModelDto;

	}


	@Override
	@Transactional
	public void createYearPlanCapital(String shenBaoId) {
		YearPlanCapital entity = new YearPlanCapital();
		//设置关联的申报信息id
		entity.setShenbaoInfoId(shenBaoId);
		//设置创建人和修改人
		String loginName = currentUser.getLoginName();
		entity.setCreatedBy(loginName);
		entity.setModifiedBy(loginName);
		yearPlanCapitalRepo.save(entity);
	}



	@Override
	@Transactional
	public void update(YearPlanCapitalDto dto) {
		YearPlanCapital entity=yearPlanCapitalRepo.findById(dto.getId());
		if(entity!=null){
			yearPlanCapitalMapper.buildEntity(dto, entity);
			//设置修改人和修改时间
			entity.setModifiedBy(currentUser.getLoginName());
			entity.setModifiedDate(new Date());
			yearPlanCapitalRepo.save(entity);
			//更新安排资金
			ShenBaoInfo shenbaoInfo=shenBaoInfoRepo.findById(entity.getShenbaoInfoId());
			if(shenbaoInfo!=null){
				//计算年度计划编制安排资金
				Double yearInvestApproval = 0.00;
				if(dto.getCapitalSCZ_ggys()!=null){
					yearInvestApproval +=dto.getCapitalSCZ_gtzj();
				}if(dto.getCapitalSCZ_zxzj() != null){
					yearInvestApproval +=dto.getCapitalSCZ_zxzj();
				}if(dto.getCapitalSCZ_gtzj() != null){
					yearInvestApproval += dto.getCapitalSCZ_gtzj();
				}if(dto.getCapitalQCZ_ggys() !=null){
					yearInvestApproval += dto.getCapitalQCZ_ggys();
				}if(dto.getCapitalQCZ_gtzj() !=null){
					yearInvestApproval +=dto.getCapitalQCZ_gtzj();
				}if(dto.getCapitalSHTZ() !=null){
					yearInvestApproval += dto.getCapitalSHTZ();
				}if(dto.getCapitalOther() !=null){
					yearInvestApproval += dto.getCapitalOther();
				}
				shenbaoInfo.setYearInvestApproval(yearInvestApproval);
			}
			logger.info("更新年度计划编制信息");
		}	
	}
	
	

}

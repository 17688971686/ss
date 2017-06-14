package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.ShenBaoInfoService;

@Service
public class ShenBaoInfoServiceImpl implements ShenBaoInfoService {
	private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoMapper;
	@Autowired
	private ShenBaoInfoRepo shenBaoInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ICurrentUser currentUser;
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
		shenBaoInfoRepo.findByOdata(odataObj).forEach(x->{			
			ShenBaoInfoDto shenBaoInfoDto=shenbaoMapper.toDto(x);
			//获取项目相关类型的名称
			shenBaoInfoDto.setProjectClassifyDesc(basicDataService.getDescriptionById(x.getProjectClassify()));
			shenBaoInfoDto.setProjectIndustryDesc(basicDataService.getDescriptionById(x.getProjectIndustry()));
			shenBaoInfoDto.setProjectTypeDesc(basicDataService.getDescriptionById(x.getProjectType()));
			shenBaoInfoDto.setProjectStageDesc(basicDataService.getDescriptionById(x.getProjectStage()));
			shenBaoInfoDto.setProjectConstrCharDesc(basicDataService.getDescriptionById(x.getProjectConstrChar()));
			shenBaoInfoDto.setProjectShenBaoStageDesc(basicDataService.getDescriptionById(x.getProjectShenBaoStage()));
			//获取单位相关类型的名称
			shenBaoInfoDto.getShenBaoUnitInfoDto().setUnitPropertyDesc(basicDataService.getDescriptionById(x.getShenBaoUnitInfo().getUnitProperty()));
			shenBaoInfoDto.getShenBaoUnitInfoDto().setDivisionDesc(basicDataService.getDescriptionById(x.getShenBaoUnitInfo().getDivisionId()));
			shenBaoInfoDto.getBianZhiUnitInfoDto().setUnitPropertyDesc(basicDataService.getDescriptionById(x.getBianZhiUnitInfo().getUnitProperty()));
			shenBaoInfoDto.getBianZhiUnitInfoDto().setDivisionDesc(basicDataService.getDescriptionById(x.getBianZhiUnitInfo().getDivisionId()));
			
			shenBaoInfoDtos.add(shenBaoInfoDto);			
		});
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenBaoInfoDtos);
		logger.info("查询申报数据");
		return pageModelDto;	
	}

	@Override
	@Transactional
	public void createShenBaoInfo(ShenBaoInfoDto shenBaoInfoDto) {
		//进行数据转换
		ShenBaoInfo shenBaoInfo = new ShenBaoInfo();
		shenbaoMapper.buildEntity(shenBaoInfoDto, shenBaoInfo);
		String loginName = currentUser.getLoginName();
		
		shenBaoInfo.setCreatedBy(loginName);
		shenBaoInfo.setModifiedBy(loginName);
		shenBaoInfoRepo.save(shenBaoInfo);
		logger.info(String.format("创建申报信息,项目名称 %s",shenBaoInfoDto.getProjectName()));		
	}
	
	

}

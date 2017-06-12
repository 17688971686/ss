package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.ShenBaoInfoRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;

@Service
public class ShenBaoInfoServiceImpl implements ShenBaoInfoService {
	private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenbaoMapper;
	@Autowired
	private ShenBaoInfoRepo shenBaoInfoRepo;
	
	@Override
	@Transactional
	public PageModelDto<ShenBaoInfoDto> get(ODataObj odataObj) {
		List<ShenBaoInfoDto> shenBaoInfoDtos=new ArrayList<>();
		shenBaoInfoRepo.findByOdata(odataObj).forEach(x->{
			
			ShenBaoInfoDto shenBaoInfoDto=shenbaoMapper.toDto(x);			
			shenBaoInfoDtos.add(shenBaoInfoDto);	
			
		});
		PageModelDto<ShenBaoInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(shenBaoInfoDtos);
		logger.info("查询申报数据");
		return pageModelDto;	
	}

}

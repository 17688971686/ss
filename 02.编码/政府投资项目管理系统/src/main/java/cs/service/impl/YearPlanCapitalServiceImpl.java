package cs.service.impl;

import java.util.Date;

import javax.transaction.Transactional;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import cs.common.ICurrentUser;
import cs.domain.ShenBaoInfo;
import cs.domain.YearPlanCapital;
import cs.model.PageModelDto;
import cs.model.DomainDto.YearPlanCapitalDto;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;
import cs.service.interfaces.YearPlanCapitalService;
/**
 * @Description: 年度计划编制服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class YearPlanCapitalServiceImpl extends AbstractServiceImpl<YearPlanCapitalDto,YearPlanCapital,String> implements YearPlanCapitalService {
	private static Logger logger = Logger.getLogger(YearPlanCapitalServiceImpl.class);
	
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private  IRepository<ShenBaoInfo, String> shenBaoInfoRepo;
		
	@Override
	@Transactional
	public PageModelDto<YearPlanCapitalDto> get(ODataObj odataObj) {
		logger.info("查询年度计划编制数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public YearPlanCapital update(YearPlanCapitalDto dto,String id) {		
		YearPlanCapital yearPlanCapital = super.update(dto, id);
		super.repository.save(yearPlanCapital);
		//同步更新申报记录中的安排资金--（计划年度区国土基金&区公共预算&安排资金总计）
		ShenBaoInfo entity = shenBaoInfoService.findById(yearPlanCapital.getShenbaoInfoId());
		entity.setCapitalAP_ggys_TheYear(yearPlanCapital.getCapitalQCZ_ggys());
		entity.setCapitalAP_gtzj_TheYear(yearPlanCapital.getCapitalQCZ_gtzj());
		entity.setYearInvestApproval(dto.getCapitalSum());
		entity.setModifiedBy(currentUser.getUserId());
		entity.setModifiedDate(new Date());
		shenBaoInfoRepo.save(entity);
		logger.info("更新年度计划编制信息");	
		return yearPlanCapital;
	}
	
	@Override
	@Transactional
	public void createYearPlanCapital(String shenBaoId){		
		YearPlanCapital entity = new YearPlanCapital();
		//设置关联的申报信息id
		entity.setShenbaoInfoId(shenBaoId);
		//设置创建人和修改人
		String loginName = currentUser.getUserId();
		entity.setCreatedBy(loginName);
		entity.setModifiedBy(loginName);
		logger.info("创建年度计划编制信息");
		super.repository.save(entity);
	}
}

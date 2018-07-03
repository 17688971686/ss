package cs.service.impl;

import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.domain.AllocationCapital;
import cs.domain.PackPlan;
import cs.domain.PackPlan_;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.AllocationCapitalDto;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PackPlanService;

/**
 * @Description: 打包计划服务层
 * @author: wxy
 * @date: 2018年04月26日
 */
@Service
public class PackPlanServiceImpl extends AbstractServiceImpl<PackPlanDto, PackPlan, String>implements PackPlanService {
	private static Logger logger = Logger.getLogger(PackPlanServiceImpl.class);
	
	@Autowired
	private IRepository<PackPlan, String> packPlanRepo;
	@Autowired
	private IMapper<AllocationCapitalDto, AllocationCapital> allocationCapitalMapper;
	@Autowired
	private IRepository<AllocationCapital,String> allocationCapitalRepo;
	
	@Override
	@Transactional
	public PageModelDto<PackPlanDto> get(ODataObj odataObj){
		logger.info("查询年度计划数据");
		return super.get(odataObj);
	}
	
	@Override
	@Transactional
	public PackPlan create (PackPlanDto dto){
		Criterion criterion = Restrictions.eq(PackPlan_.name.getName(), dto.getName());
		Optional<PackPlan> packPlan = packPlanRepo.findByCriteria(criterion).stream().findFirst();
		if (packPlan.isPresent()) {
			throw new IllegalArgumentException(String.format("项目代码：%s 已经存在,请重新输入！", dto.getName()));
		} else {
			PackPlan entity = super.create(dto);
			//关联打包类建设单位资金设置
			dto.getAllocationCapitalDtos().stream().forEach(x->{
				AllocationCapital allocationCapital = new AllocationCapital();
				allocationCapitalMapper.buildEntity(x, allocationCapital);
				entity.getAllocationCapitals().add(allocationCapital);
			});
			logger.info(String.format("创建年度计划,名称：%s",dto.getName()));
			super.repository.save(entity);
			return entity;
		}
	}
	
	@Override
	@Transactional
	public PackPlan update(PackPlanDto dto,String id) {		
		PackPlan entity =  super.update(dto, id);
		//关联打包类建设单位
		entity.getAllocationCapitals().forEach(x->{//删除历史建设单位资金编制记录
			allocationCapitalRepo.delete(x);
		});
		entity.getAllocationCapitals().clear();
		dto.getAllocationCapitalDtos().forEach(x->{//添加新的建设单位资金编制记录
			entity.getAllocationCapitals().add(allocationCapitalMapper.buildEntity(x, new AllocationCapital()));
		});
		
		logger.info(String.format("更新年度计划,名称：%s",dto.getName()));
		super.repository.save(entity);
		return entity;		
	}
	
	@Override
	@Transactional
	public void delete(String id) {
		PackPlan packPlan = super.findById(id);
		

		if (packPlan.getShenBaoInfos() != null) {
			for (int j = 0; j < packPlan.getShenBaoInfos().size(); j++) {
				ShenBaoInfo shenbaoInfo = packPlan.getShenBaoInfos().get(j);
				if(shenbaoInfo.getProcessState().equals(BasicDataConfig.processState_jinxingzhong)){
					throw new IllegalArgumentException(String.format("打包计划中存在审批中的项目,无法删除,请重新选着！", packPlan.getName()));
				}
			}
		}
//		if (!packPlan.getIsInPlan()) {
		packPlan.getAllocationCapitals().clear();
		packPlan.getShenBaoInfos().clear();
		super.delete(id);
//		}else{
//			throw new IllegalArgumentException(String.format("打包计划已存在其他计划下达中,无法删除,请重新输入！", dto.getName()));
//		}
		
	}

	@Override
	public List<PackPlanDto> findByDto(ODataObj odataObj) {
		return null;
	}
}

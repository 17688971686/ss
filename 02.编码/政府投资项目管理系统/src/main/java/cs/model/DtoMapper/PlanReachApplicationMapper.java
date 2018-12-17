package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.PackPlan;
import cs.domain.PlanReachApplication;
import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.PackPlanDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.ShenBaoInfoDto;
/**
 * @Description: 计划下达申请实体转换
 * @author: cx
 * @Date：2018年3月6日
 * @version：0.1
 *
 */
@Component
public class PlanReachApplicationMapper implements IMapper<PlanReachApplicationDto, PlanReachApplication>{
	@Autowired
	IMapper<ShenBaoInfoDto,ShenBaoInfo> shenBaoInfoMapper;
	@Autowired
	IMapper<PackPlanDto,PackPlan> packPlanMapper;

	@Override
	public PlanReachApplicationDto toDto(PlanReachApplication entity) {
		PlanReachApplicationDto dto = new PlanReachApplicationDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setApplicationName(entity.getApplicationName());
			dto.setApplicationUnit(entity.getApplicationUnit());
			dto.setApplicationTime(entity.getApplicationTime());
			dto.setIsStartProcess(entity.getIsStartProcess());
			dto.setResPerson(entity.getResPerson());
			dto.setResPersonTel(entity.getResPersonTel());
			entity.getShenBaoInfos().stream().forEach(x->{
				dto.getShenBaoInfoDtos().add(shenBaoInfoMapper.toDto(x));
			});
			entity.getPackPlans().stream().forEach(x->{
				dto.getPlanPackDtos().add(packPlanMapper.toDto(x));
			});
			
			dto.setCreatedBy(entity.getCreatedBy());
			dto.setModifiedBy(entity.getModifiedBy());
			dto.setCreatedDate(entity.getCreatedDate());
			dto.setModifiedDate(entity.getModifiedDate());
			dto.setItemOrder(entity.getItemOrder());
			
		}
		return dto;
	}

	@Override
	public PlanReachApplication buildEntity(PlanReachApplicationDto dto, PlanReachApplication entity) {
		if(dto!=null && entity!=null){
			if(entity.getId()==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setApplicationName(dto.getApplicationName());
			entity.setApplicationUnit(dto.getApplicationUnit());
			entity.setApplicationTime(dto.getApplicationTime());
			entity.setResPerson(dto.getResPerson());
			entity.setResPersonTel(dto.getResPersonTel());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
			entity.setIsStartProcess(dto.getIsStartProcess());
			//关联关系在外面编写
			
		}
		return entity;
	}
	
}

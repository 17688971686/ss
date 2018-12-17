package cs.model.DtoMapper;

import java.util.UUID;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import cs.domain.PlanReachApproval;
import cs.domain.ShenBaoInfo;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.DomainDto.ShenBaoInfoDto;
/**
 * @Description: 申报信息实体转换
 * @author: cx
 * @Date：2018年3月6日
 * @version：0.1
 *
 */
@Component
public class PlanReachApprovalMappper implements IMapper<PlanReachApprovalDto, PlanReachApproval> {
	@Autowired
	IMapper<ShenBaoInfoDto,ShenBaoInfo> shenBaoInfoMapper;

	@Override
	public PlanReachApprovalDto toDto(PlanReachApproval entity) {
		PlanReachApprovalDto dto = new PlanReachApprovalDto();
		if(entity!=null){
			dto.setId(entity.getId());
			dto.setTitle(entity.getTitle());
//			dto.setResPerson(entity.getResPerson());
			dto.setResPersonTel(entity.getResPersonTel());
			dto.setApprovalTime(entity.getApprovalTime());
			entity.getShenBaoInfos().stream().forEach(x->{
				dto.getShenBaoInfoDtos().add(shenBaoInfoMapper.toDto(x));
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
	public PlanReachApproval buildEntity(PlanReachApprovalDto dto, PlanReachApproval entity) {
		if(dto!=null && entity!=null){
			if(entity.getId()==null || entity.getId().isEmpty()){
				entity.setId(UUID.randomUUID().toString());
			}
			entity.setTitle(dto.getTitle());
			entity.setApprovalTime(dto.getApprovalTime());
//			entity.setResPerson(dto.getResPerson());
			entity.setResPersonTel(dto.getResPersonTel());
			entity.setCreatedBy(dto.getCreatedBy());
			entity.setModifiedBy(dto.getModifiedBy());
			entity.setCreatedDate(dto.getCreatedDate());
			entity.setModifiedDate(dto.getModifiedDate());
			entity.setItemOrder(dto.getItemOrder());
			//关联关系在外面编写
			
		}
		return entity;
	}
	
}

package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.ICurrentUser;
import cs.domain.Commission;
import cs.domain.Datum;
import cs.model.DomainDto.CommissionDto;
import cs.model.DomainDto.DatumDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.service.interfaces.CommissionService;

/**
 * @Description: 评审批报信息服务层
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@Service
public class CommissionServiceImpl extends AbstractServiceImpl<CommissionDto, Commission, String> implements CommissionService{

	private static Logger logger = Logger.getLogger(CommissionServiceImpl.class);
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private IRepository<Datum, String> DatumRepo;
	@Autowired
	private IRepository<Commission, String> CommissionRepo;
	@Autowired
	private IMapper<CommissionDto, Commission> commissionMapper;
	@Autowired
	private IMapper<DatumDto, Datum> datumMapper;
	
	@Override
	@Transactional
	public CommissionDto getProxyByTaskId(String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<Commission> dtos = CommissionRepo.findByCriteria(criterion);
		Commission entity = new Commission();
		
		if(dtos !=null && dtos.size()>0){
			CommissionDto commissionDto = new CommissionDto();
			
			entity = dtos.stream().findFirst().get();
			commissionDto.setBeginDate(entity.getBeginDate());
			commissionDto.setCapitalBaoSong(entity.getCapitalBaoSong());
			commissionDto.setConstructionUnit(entity.getConstructionUnit());
			commissionDto.setCreatedBy(entity.getCreatedBy());
			commissionDto.setCreatedDate(entity.getCreatedDate());
			commissionDto.setId(entity.getId());
			commissionDto.setItemOrder(entity.getItemOrder());
			commissionDto.setModifiedBy(entity.getModifiedBy());
			commissionDto.setModifiedDate(entity.getModifiedDate());
			commissionDto.setProcessRole(entity.getProcessRole());
			commissionDto.setProcessSuggestion_JBR(entity.getProcessSuggestion_JBR());
			commissionDto.setProjectName(entity.getProjectName());
			commissionDto.setUnitName(entity.getUnitName());
			commissionDto.setRelId(entity.getRelId());
			commissionDto.setApprovalType(entity.getApprovalType());
			commissionDto.setContacts(entity.getContacts());
			
			
			List<DatumDto> datumDtos = new ArrayList<>();
			
			entity.getDatum().forEach(x->{
				DatumDto datumDto = new DatumDto();
				datumDto.setCreatedBy(x.getCreatedBy());
				datumDto.setCreatedDate(x.getCreatedDate());
				datumDto.setId(x.getId());
				datumDto.setItemOrder(x.getItemOrder());
				datumDto.setModifiedBy(x.getModifiedBy());
				datumDto.setModifiedDate(x.getModifiedDate());
				datumDto.setDataName(x.getDataName());
				datumDto.setDataNumber(x.getDataNumber());
				datumDtos.add(datumDto);
			});
			commissionDto.setDatumDtos(datumDtos);
			 
			logger.info("查询用户数据");
			return commissionDto;
		}else{
			logger.info("查询用户数据");
			return null;
		}
		
	}
	
	@Override
	@Transactional
	public void createProxy(CommissionDto commissionDto, String id) {
		Criterion criterion = Restrictions.eq("relId", id);
		List<Commission> dtos = CommissionRepo.findByCriteria(criterion);
		if(dtos !=null && dtos.size()>0){
			Commission entity = dtos.stream().findFirst().get();
			//处理关联信息
			//附件
			if(!entity.getDatum().isEmpty()){
				entity.getDatum().forEach(x -> {//删除历史附件
					DatumRepo.delete(x);
				});
				entity.getDatum().clear();
				
			}
			commissionDto.getDatumDtos().forEach(x -> {//添加新附件
				Datum datum = new Datum();
				datumMapper.buildEntity(x, datum);
				datum.setCreatedBy(entity.getCreatedBy());
				datum.setModifiedBy(entity.getModifiedBy());
				entity.getDatum().add(datum);
			});
			
			entity.setCreatedBy(currentUser.getUserId());
			entity.setCreatedDate(new Date());
			super.repository.save(entity);
			
		}else{
			Commission entity = new Commission();
			entity.setRelId(id);
			entity.setId(UUID.randomUUID().toString());
			
			//处理关联信息
			commissionDto.getDatumDtos().forEach(x -> {//添加新附件
				Datum datum = new Datum();
				datumMapper.buildEntity(x, datum);
				datum.setCreatedBy(commissionDto.getCreatedBy());
				datum.setModifiedBy(commissionDto.getModifiedBy());
				entity.getDatum().add(datum);
			});
			
			commissionMapper.buildEntity(commissionDto, entity);
			
			entity.setModifiedBy(currentUser.getUserId());
			entity.setModifiedDate(new Date());
			super.repository.save(entity);
		}
		logger.info(String.format("创建评审委托书,登录名:%s", currentUser.getLoginName()));
	}
	
}

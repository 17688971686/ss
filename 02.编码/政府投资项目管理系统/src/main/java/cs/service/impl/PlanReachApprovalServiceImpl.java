package cs.service.impl;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.Util;
import cs.domain.PlanReachApplication;
import cs.domain.PlanReachApproval;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;

@Service
public class PlanReachApprovalServiceImpl extends AbstractServiceImpl<PlanReachApprovalDto,PlanReachApproval,String> implements PlanReachApprovalService {
	private static Logger logger = Logger.getLogger(PlanReachApprovalServiceImpl.class);
	
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	@Autowired
	private ProjectService projectService;
	@Autowired
	private IRepository<UserUnitInfo, String> userUnitInfoRepo;
	@Autowired
	private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenBaoInfoMapper;
	
	
	
	@Override
	@Transactional
	public PageModelDto<PlanReachApprovalDto> get(ODataObj odataObj) {
		logger.info("获取计划下达批复数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public PlanReachApproval create(PlanReachApprovalDto dto) {
		PlanReachApproval entity = new PlanReachApproval();
		entity=super.create(dto);
		//处理关联信息
		if(dto.getShenBaoInfoDtos().size()>0){
			for(int i=0;i<dto.getShenBaoInfoDtos().size();i++){
				ShenBaoInfo shenBaoInfo=shenBaoInfoService.findById(dto.getShenBaoInfoDtos().get(i).getId());
				entity.getShenBaoInfos().add(shenBaoInfo);
			}
		}
		super.repository.save(entity);
		logger.info(String.format("创建计划下达批复表,名称 :%s",dto.getTitle()));
		return entity;
	}

	@Override
	@Transactional
	public PlanReachApproval update(PlanReachApprovalDto dto, String id) {
		PlanReachApproval entity = new PlanReachApproval();
		entity=super.update(dto, id);
		//处理关联信息
		entity.getShenBaoInfos().clear();
		if(dto.getShenBaoInfoDtos().size()>0){
			for(int i=0;i<dto.getShenBaoInfoDtos().size();i++){
				ShenBaoInfo shenBaoInfo=shenBaoInfoService.findById(dto.getShenBaoInfoDtos().get(i).getId());
				entity.getShenBaoInfos().add(shenBaoInfo);
			}
		}
		super.repository.save(entity);
		logger.info(String.format("更新计划下达批复表,名称 :%s",dto.getTitle()));
		return entity;
	}

	@Override
	@Transactional
	public void delete(String id) {
		PlanReachApproval entity = super.findById(id);
		entity.getShenBaoInfos().clear();
		super.repository.delete(entity);
		logger.info(String.format("删除下达批复表,名称 :%s",entity.getTitle()));
	}

	@Override
	public List<PlanReachApprovalDto> findByDto(ODataObj odataObj) {
		return null;
	}


}

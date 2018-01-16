package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.controller.management.MediationManagementController;
import cs.domain.MediationUnit;
import cs.domain.ShenPiUnit;
import cs.model.PageModelDto;
import cs.model.DomainDto.MediationUnitDto;
import cs.model.DomainDto.ShenPiUnitDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenPiUnitService;

@Service
public class ShenPiUnitServiceImpl  extends AbstractServiceImpl<ShenPiUnitDto,ShenPiUnit,String> implements ShenPiUnitService{
	   private static Logger logger = Logger.getLogger(ShenPiUnitServiceImpl.class);
	// 依赖注入持久层
		@Autowired
		private IRepository<ShenPiUnit, String> shenPiUnitRepo;
		
		@Autowired
		private IMapper<ShenPiUnitDto, ShenPiUnit>  shenPiUnitMapper;
		@Override
		@Transactional
		public PageModelDto<ShenPiUnitDto> get(ODataObj odataObj) {
			List<ShenPiUnitDto> ShenPiUnitDtos=new ArrayList<ShenPiUnitDto>();
			shenPiUnitRepo.findByOdata(odataObj).forEach(x->{
				ShenPiUnitDto dto=shenPiUnitMapper.toDto(x);
				ShenPiUnitDtos.add(dto);
			});
			PageModelDto<ShenPiUnitDto> pageModelDto = new PageModelDto<>();
			pageModelDto.setCount(odataObj.getCount());
			pageModelDto.setValue(ShenPiUnitDtos);
			return pageModelDto;	
		}
		@Override
		@Transactional
		public ShenPiUnit update(ShenPiUnitDto dto, String id) {
			logger.info(String.format("编辑审批单位信息,审批介单位名称 %s",dto.getShenpiUnitName()));
			ShenPiUnit shenpiUnit=super.update(dto, id);
			return super.repository.save(shenpiUnit);
		}
		@Override
		@Transactional
		public ShenPiUnit create(ShenPiUnitDto dto) {
			logger.info(String.format("新增审批单位信息,审批单位名称  %s",dto.getShenpiUnitName()));
			ShenPiUnit shenPiUnit=super.create(dto);
			return super.repository.save(shenPiUnit);
		}
		@Override
		@Transactional
		public void delete(String id) {
		   logger.info(String.format("删除审批单位信息,审批单位id %s",id));
		   super.delete(id);
		}
		@Override
		@Transactional
		public void deletes(String[] ids) {
			super.deletes(ids);
		}
}

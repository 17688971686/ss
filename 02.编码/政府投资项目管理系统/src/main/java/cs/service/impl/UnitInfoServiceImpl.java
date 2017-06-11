//package cs.service.impl;
//
//import java.util.ArrayList;
//import java.util.List;
//
//import org.apache.log4j.Logger;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//import cs.common.ICurrentUser;
//import cs.domain.ShenBaoUnitInfo;
//import cs.model.PageModelDto;
//import cs.model.DomainDto.UnitInfoDto;
//import cs.model.DtoMapper.UnitInfoMapper;
//import cs.repository.interfaces.UnitInfoRepo;
//import cs.repository.odata.ODataObj;
//import cs.service.common.BasicDataService;
//import cs.service.framework.UserServiceImpl;
//import cs.service.interfaces.UnitInfoService;
//
//@Service
//public class UnitInfoServiceImpl implements UnitInfoService {
//	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
//	
//	@Autowired 
//	private UnitInfoRepo unitInfoRepo;
//
//	@Autowired
//	private BasicDataService basicDataService;
//	@Autowired
//	private ICurrentUser currentUser;
//
//	@Override
//	@Transactional
//	public PageModelDto<UnitInfoDto> get(ODataObj odataObj) {
//		List<ShenBaoUnitInfo> unitInfos = unitInfoRepo.findByOdata(odataObj);
//		List<UnitInfoDto> unitInfoDtos = new ArrayList<>();
//		 //进行数据的转换
//		if(unitInfos !=null && unitInfos.size()>0){
//			for(ShenBaoUnitInfo unitInfo:unitInfos){
//				UnitInfoDto unitInfoDto = UnitInfoMapper.toDto(unitInfo);
//				
//				//一些名称需要在这里进行获取
//				unitInfoDto.setUnitPropertyValue(basicDataService.getDescriptionById(unitInfo.getUnitProperty()));//单位性质名称
//				
//				unitInfoDtos.add(unitInfoDto);
//			} 
//		}
//		PageModelDto<UnitInfoDto> pageModelDto = new PageModelDto<>();
//		pageModelDto.setCount(odataObj.getCount());
//		pageModelDto.setValue(unitInfoDtos);
//		return pageModelDto;
//	}
//
//	/**
//	 * @descripted 删除单位信息
//	 * @param id 单位编号
//	 * @author cx
//	 * @date 2017-05-17
//	 */
//	@Override
//	@Transactional
//	public void deleteUnitInfo(String id) {
//		ShenBaoUnitInfo unitInfo = unitInfoRepo.findById(id);
//		if(unitInfo != null){
//			//判断此单位信息是否被关联使用了			
////			List<ProjectInfo> projectInfos = projectInfoRepo.findByCriteria("BianZhiUnit_id",id);
//			unitInfoRepo.delete(unitInfo);
//			logger.info(String.format("删除单位信息,单位名称:%s", unitInfo.getUnitName()));
//		}	
//	}
//	
//	/**
//	 * @descripted 批量删除单位信息
//	 * @param ids 单位编号集合
//	 * @author cx
//	 * @date 2017-05-17
//	 */
//	@Override
//	@Transactional
//	public void deleteUnitInfos(String[] ids) {
//		for (String id : ids) {
//			this.deleteUnitInfo(id);
//		}
//		logger.info("批量删除单位信息");		
//	}
//	
//	/**
//	 * @descripted 更新单位信息
//	 * @param unitInfoDto 单位数据对象
//	 * @author cx
//	 * @date 2017-05-17
//	 */
//	@Override
//	@Transactional
//	public void updateUnitInfo(UnitInfoDto unitInfoDto) {
//		ShenBaoUnitInfo unitInfo = unitInfoRepo.findById(unitInfoDto.getId());		
//		//进行数据的转换
//		//unitInfo = DtoFactory.unitInfoDtoTounitInfo(unitInfoDto);
//		//获取当前登录用户设置修改人
//		
//		//unitInfo.setModifiedBy(currentUser.getLoginName());
//		
//		unitInfoRepo.save(unitInfo);
//		logger.info("更新项目信息");
//	}
//
//	/**
//	 * @descripted 创建单位信息
//	 * @param unitInfoDto 单位数据对象
//	 * @author cx
//	 * @date 2017-05-17
//	 */
//	@Override
//	@Transactional
//	public void createUnitInfo(UnitInfoDto unitInfoDto) {
//		ShenBaoUnitInfo findUnitInfo = unitInfoRepo.findById(unitInfoDto.getId());
//		if(findUnitInfo == null){//如果单位信息不存在
//			System.out.println("创建");
//			ShenBaoUnitInfo unitInfo = new ShenBaoUnitInfo();
//			//进行数据转换
//			UnitInfoMapper.buildEntity(unitInfoDto,unitInfo);
//			//保存数据
//			unitInfoRepo.save(unitInfo);
//			logger.info("创建单位信息");
//		}else{
//			throw new IllegalArgumentException(String.format("单位：%s 已经存在,请重新输入！", findUnitInfo.getUnitName()));
//		}
//		
//	}
//	
//	
//	
//	
//
//	
//}

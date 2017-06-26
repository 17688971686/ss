package cs.service.impl;


import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.UserUnitInfo;
import cs.domain.UserUnitInfo_;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.UserUnitInfoMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.UserUnitInfoService;
@Service
public class UserUnitInfoServiceImpl implements UserUnitInfoService {
	private static Logger logger = Logger.getLogger(UserUnitInfoServiceImpl.class);
	@Autowired
	private IRepository<UserUnitInfo, String> userUnitInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ICurrentUser currentUser;

	
	@Override
	@Transactional
	public PageModelDto<UserUnitInfoDto> get(ODataObj odataObj) {
		List<UserUnitInfoDto> userUnitInfoDtos=new ArrayList<>();
		userUnitInfoRepo.findByOdata(odataObj).forEach(x->{
			UserUnitInfoDto userUnitInfoDto = UserUnitInfoMapper.toDto(x);
			userUnitInfoDto.setDivisionDesc(basicDataService.getDescriptionById(x.getDivisionId()));
			userUnitInfoDto.setUnitPropertyDesc(basicDataService.getDescriptionById(x.getUnitProperty()));
			
			userUnitInfoDtos.add(userUnitInfoDto);
		});
		PageModelDto<UserUnitInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(userUnitInfoDtos);
		logger.info(String.format("查询单位信息:%s", currentUser.getLoginName()));
		return pageModelDto;	
	}
	
	
	@Override
	@Transactional
	public UserUnitInfoDto getByUserName(String userName) {
		Criterion criterion=Restrictions.eq(UserUnitInfo_.userName.getName(), userName);
		Optional<UserUnitInfo> userUnitInfo= userUnitInfoRepo.findByCriteria(criterion).stream().findFirst();
		if(userUnitInfo.isPresent()){
			 UserUnitInfoDto userUnitInfoDto  = UserUnitInfoMapper.toDto(userUnitInfo.get());
			userUnitInfoDto.setDivisionDesc(basicDataService.getDescriptionById(userUnitInfo.get().getDivisionId()));
			userUnitInfoDto.setUnitPropertyDesc(basicDataService.getDescriptionById(userUnitInfo.get().getUnitProperty()));
			return userUnitInfoDto;
		}
		return null;
	}

	@Override
	@Transactional
	public void save(String userName,UserUnitInfoDto unitInfoDto) {
		UserUnitInfo userUnitInfo;
		Criterion criterion=Restrictions.eq(UserUnitInfo_.userName.getName(), userName);
		Optional<UserUnitInfo>	query_userUnitInfo =userUnitInfoRepo.findByCriteria(criterion).stream().findFirst();
		if(query_userUnitInfo.isPresent()){
			userUnitInfo=query_userUnitInfo.get();
		}else{
			userUnitInfo=new UserUnitInfo();
		}
		
		unitInfoDto.setUserName(userName);
		UserUnitInfoMapper.buildEntity(unitInfoDto, userUnitInfo);
		String loginName = currentUser.getLoginName();
		
		userUnitInfo.setCreatedBy(loginName);
		userUnitInfo.setModifiedBy(loginName);
		userUnitInfoRepo.save(userUnitInfo);
		logger.info(String.format("创建单位信息:%s", userName));
	}

}

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
import cs.domain.ShenBaoInfo;
import cs.domain.UserUnitInfo;
import cs.domain.UserUnitInfo_;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.model.DtoMapper.UserUnitInfoMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.UserUnitInfoService;
@Service
public class UserUnitInfoServiceImpl extends AbstractServiceImpl<UserUnitInfoDto, UserUnitInfo, String> implements UserUnitInfoService {
	private static Logger logger = Logger.getLogger(UserUnitInfoServiceImpl.class);
	@Autowired
	private IRepository<UserUnitInfo, String> userUnitInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private IMapper<UserUnitInfoDto, UserUnitInfo> userUnitInfoMapper;
	@Autowired
	private ICurrentUser currentUser;

	
	@Override
	@Transactional
	public PageModelDto<UserUnitInfoDto> get(ODataObj odataObj) {		
		logger.info("查询单位信息");
		return super.get(odataObj);	
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
		userUnitInfoMapper.buildEntity(unitInfoDto, userUnitInfo);
		String loginName = currentUser.getLoginName();
		
		userUnitInfo.setCreatedBy(loginName);
		userUnitInfo.setModifiedBy(loginName);
		userUnitInfoRepo.save(userUnitInfo);
		logger.info(String.format("创建单位信息:%s", userName));
	}

}

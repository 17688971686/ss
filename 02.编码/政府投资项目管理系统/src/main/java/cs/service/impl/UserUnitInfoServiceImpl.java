package cs.service.impl;

import java.util.Optional;

import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.UserUnitInfo;
import cs.domain.UserUnitInfo_;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.UserUnitInfoMapper;
import cs.repository.interfaces.UserUnitInfoRepo;
import cs.service.interfaces.UserUnitInfoService;
@Service
public class UserUnitInfoServiceImpl implements UserUnitInfoService {

	@Autowired
	private UserUnitInfoRepo userUnitInfoRepo;
	
	@Override
	@Transactional
	public UserUnitInfoDto getByUserName(String userName) {
		Criterion criterion=Restrictions.eq(UserUnitInfo_.userName.getName(), userName);
		Optional<UserUnitInfo> userUnitInfo= userUnitInfoRepo.findByCriteria(criterion).stream().findFirst();
		if(userUnitInfo.isPresent()){
			return UserUnitInfoMapper.toDto(userUnitInfo.get());
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
		userUnitInfoRepo.save(userUnitInfo);
	}

}

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
import cs.domain.ProjectInfo;
import cs.domain.ProjectInfo_;
import cs.domain.UnitInfo;
import cs.domain.UserUnitInfo;
import cs.domain.UserUnitInfo_;
import cs.model.PageModelDto;
import cs.model.DomainDto.UnitInfoDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.DtoMapper.ProjectInfoMapper;
import cs.model.DtoMapper.UnitInfoMapper;
import cs.model.DtoMapper.UserUnitInfoMapper;
import cs.repository.interfaces.UserUnitInfoRepo;
import cs.repository.odata.ODataObj;
import cs.service.common.BasicDataService;
import cs.service.interfaces.UserUnitInfoService;
@Service
public class UserUnitInfoServiceImpl implements UserUnitInfoService {
	private static Logger logger = Logger.getLogger(UserUnitInfoServiceImpl.class);

	@Autowired
	private UserUnitInfoRepo userUnitInfoRepo;
	@Autowired
	private BasicDataService basicDataService;
	@Autowired
	private ICurrentUser currentUser;
	
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

	@Override
	@Transactional
	public PageModelDto<UserUnitInfoDto> get(ODataObj odataObj) {
		List<UserUnitInfo> userUnitInfos = userUnitInfoRepo.findByOdata(odataObj);
		List<UserUnitInfoDto> userUnitInfoDtos = new ArrayList<>();
		 //进行数据的转换
		if(userUnitInfos !=null && userUnitInfos.size()>0){
			userUnitInfos.forEach(x->{
				UserUnitInfoDto userUnitInfoDto = UserUnitInfoMapper.toDto(x);
				//一些名称需要在这里进行获取
				userUnitInfoDto.setUnitPropertyDisplay(basicDataService.getDescriptionById(x.getUnitProperty()));//单位性质名称
				userUnitInfoDtos.add(userUnitInfoDto);
			});		
		}
		PageModelDto<UserUnitInfoDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(userUnitInfoDtos);
		return pageModelDto;	
	}

	@Override
	@Transactional
	public void deleteUserUnitInfo(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void deleteUserUnitInfos(String[] ids) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void updateUserUnitInfo(UserUnitInfoDto unitInfoDto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	@Transactional
	public void createUserUnitInfo(UserUnitInfoDto userUnitInfoDto) {
		//首先判断是否拥有此用户单位
		Criterion criterion = Restrictions.eq(UserUnitInfo_.unitName.getName(), userUnitInfoDto.getUnitName());
		Optional<UserUnitInfo> findUserUnitInfo = userUnitInfoRepo.findByCriteria(criterion).stream().findFirst();
		if(findUserUnitInfo.isPresent()){
			throw new IllegalArgumentException(String.format("用户单位：%s 已经存在,请重新输入！", userUnitInfoDto.getUnitName()));
		}else{
			UserUnitInfo userUnitInfo = new UserUnitInfo();
			//进行数据转换，用来保存数据到数据库
			UserUnitInfoMapper.buildEntity(userUnitInfoDto,userUnitInfo);
			
			//设置创建人和修改人
			String longinName = currentUser.getLoginName();
			userUnitInfo.setCreatedBy(longinName);
			userUnitInfo.setModifiedBy(longinName);
			//保存数据
			userUnitInfoRepo.save(userUnitInfo);
			logger.info("创建用户单位信息");
		}
		
	}
	
	

}

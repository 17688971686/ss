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
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.repository.framework.UserRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;
/**
 * @Description: 用户单位信息服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class UserUnitInfoServiceImpl extends AbstractServiceImpl<UserUnitInfoDto, UserUnitInfo, String> implements UserUnitInfoService {
	private static Logger logger = Logger.getLogger(UserUnitInfoServiceImpl.class);
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private UserRepo userRepo;
	@Override
	@Transactional
	public PageModelDto<UserUnitInfoDto> get(ODataObj odataObj) {		
		logger.info("查询单位信息");
		return super.get(odataObj);	
	}
	
	@Override
	@Transactional
	public List<UserUnitInfoDto> Get() {
		List<UserUnitInfoDto> dtos = new ArrayList<>();
		List<UserUnitInfo> entitys = super.repository.findAll();
		entitys.forEach(x -> {
			UserUnitInfoDto dto = super.mapper.toDto(x);
			dtos.add(dto);
		});
		logger.info("获取单位信息集合");
		return dtos;
	}

	@Override
	@Transactional
	public void save(String unitName,UserUnitInfoDto unitInfoDto) {
		UserUnitInfo userUnitInfo;
		//根据用户名来判断是有有该用户单位这条记录
		Criterion criterion=Restrictions.eq(UserUnitInfo_.unitName.getName(), unitName);
		Optional<UserUnitInfo> query_userUnitInfo =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_userUnitInfo.isPresent()){//如果存在更新这一条数据
			userUnitInfo = super.update(unitInfoDto, unitInfoDto.getId());
			
			if(query_userUnitInfo.get().getUsers().isEmpty()){//单位没人
				User user = userRepo.findById(currentUser.getUserId());
				List<User> userList = new ArrayList<>();
				userList.add(user);
				userUnitInfo.setUsers(userList);
			}else{
				query_userUnitInfo.get().getUsers().forEach(x->{
					if(x != null){//如果单位有人员
						if(x.getId() == currentUser.getUserId()){//有人但重复
							return;
						}
					}else{
						User user = userRepo.findById(currentUser.getUserId());
						List<User> userList = new ArrayList<>();
						userList.add(user);
						userUnitInfo.setUsers(userList);
						return;
					}
				});
			}
			
			 
		}else{//如果不存在创建一条新数据
			unitInfoDto.setUserName(currentUser.getUserId());
			unitInfoDto.setUnitName(unitName);
			User user = userRepo.findById(currentUser.getUserId());
			List<User> userList = new ArrayList<>();
			userList.add(user);
			unitInfoDto.setUsers(userList);
			userUnitInfo = super.create(unitInfoDto);
		}
		super.repository.save(userUnitInfo);
		logger.info(String.format("创建单位信息:%s", unitName));
	}

	@Override
	@Transactional
	public UserUnitInfo getByUserName(String userName) {
		UserUnitInfo userUnitInfo;
		//根据用户名来判断是有有该用户单位这条记录
		Criterion criterion=Restrictions.eq(UserUnitInfo_.userName.getName(), userName);
		Optional<UserUnitInfo>	query_userUnitInfo =super.repository.findByCriteria(criterion).stream().findFirst();
		if(query_userUnitInfo.isPresent()){
			userUnitInfo = query_userUnitInfo.get();
		}else{
			userUnitInfo = new UserUnitInfo();
		}
		logger.info(String.format("根据登陆用户id查询单位信息:%s", userName));
		return userUnitInfo;
	}
	
	
}

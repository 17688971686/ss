
package cs.service.impl;

import cs.domain.UserUnitInfo;
import cs.domain.UserUnitInfo_;
import cs.domain.framework.User;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.PageModelDto;
import cs.repository.framework.UserRepo;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;
import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.DetachedCriteria;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
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
		Criteria criteria = repository.getSession().createCriteria(UserUnitInfo.class);
		criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
//		List<UserUnitInfo> entitys = super.repository.findAll();
		List<UserUnitInfo> entitys =criteria.list();
		entitys.forEach(x -> {
			UserUnitInfoDto dto = super.mapper.toDto(x);
			dtos.add(dto);
		});
		logger.info("获取单位信息集合");
		return dtos;
	}

	@Override
	@Transactional(rollbackFor = Exception.class)
	public void save(String unitName,UserUnitInfoDto unitInfoDto) {
		UserUnitInfo userUnitInfo = null;
		List<String> useridList = new ArrayList<>();
		User user = userRepo.findById(currentUser.getUserId());
		//根据用户名来判断是有有该用户单位这条记录
		Criterion criterion=Restrictions.eq(UserUnitInfo_.unitName.getName(), unitName);
		Criteria criteria = super.repository.getSession().createCriteria(UserUnitInfo.class);
		criteria.add(Restrictions.eq("unitName",unitName));
		criteria.setResultTransformer(Criteria.DISTINCT_ROOT_ENTITY);
		List<UserUnitInfo> query_userUnitInfo =criteria.list();
		if(!CollectionUtils.isEmpty(query_userUnitInfo) && query_userUnitInfo.size()>1 ){
			throw new IllegalArgumentException("单位名称已存在，请确认后提交");
		}
		if(!CollectionUtils.isEmpty(query_userUnitInfo) && query_userUnitInfo.size() == 1
				&& !query_userUnitInfo.get(0).getId().equals(unitInfoDto.getId())){
			throw new IllegalArgumentException("单位名称已存在，请确认后提交");
		}

		UserUnitInfo userUnit =super.repository.findById(unitInfoDto.getId());
		//如果存在更新这一条数据
		if(!ObjectUtils.isEmpty(userUnit)){
			//单位没人
			if(userUnit.getUsers().isEmpty()){
				userUnit.getUsers().add(user);
			}else{
				userUnit.getUsers().forEach(x->{
				
					useridList.add(x.getId());
				});

				if(useridList.indexOf(user.getId()) == -1){
					userUnit.getUsers().add(user);
				}
			}
			unitInfoDto.setUsers(userUnit.getUsers());
			userUnitInfo = super.update(unitInfoDto, userUnit.getId());
			 
		}
		super.repository.save(userUnitInfo);
		logger.info(String.format("更新单位信息:%s", unitName));
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

	@Override
	public List<UserUnitInfoDto> findByDto(ODataObj odataObj) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	public UserUnitInfoDto getByUserId(String userId) {
		Criteria criteria = DetachedCriteria.forClass(UserUnitInfo.class)
				.getExecutableCriteria(repository.getSession())
				.createCriteria(UserUnitInfo_.users.getName(), "users")
				.add(Property.forName("users.id").eq(userId));
		UserUnitInfo userUnitInfo = (UserUnitInfo) criteria.uniqueResult();
		return mapper.toDto(userUnitInfo);
	}
}

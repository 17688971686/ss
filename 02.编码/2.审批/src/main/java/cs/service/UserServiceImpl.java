package cs.service;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Set;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.sun.xml.internal.bind.v2.runtime.unmarshaller.XsiNilLoader.Single;

import cs.common.ICurrentUser;
import cs.common.Response;
import cs.domain.Role;
import cs.domain.User;
import cs.model.PageModelDto;
import cs.model.RoleDto;
import cs.model.UserDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.RoleRepo;
import cs.repository.repositoryImpl.UserRepo;

@Service
public class UserServiceImpl implements UserService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private RoleRepo roleRepo;
	@Autowired
	private ICurrentUser currentUser;

	/*
	 * (non-Javadoc)
	 * 
	 * @see cs.service.UserService#get(cs.repository.odata.ODataObj)
	 */
	@Override
	@Transactional
	public PageModelDto<UserDto> get(ODataObj odataObj) {
		
		List<User> listUser = userRepo.findByOdata(odataObj);
		List<UserDto> userDtoList = new ArrayList<>();
		for (User item : listUser) {
			UserDto userDto = new UserDto();
			userDto.setId(item.getId());
			userDto.setLoginName(item.getLoginName());
			userDto.setDisplayName(item.getDisplayName());
			userDto.setPassword(item.getPassword());
			userDto.setComment(item.getComment());
			userDto.setCreatedDate(item.getCreatedDate());

			// ��ѯ��ؽ�ɫ
			List<RoleDto> roleDtoList = new ArrayList<>();
			for (Role role : item.getRoles()) {
				RoleDto roleDto = new RoleDto();
				roleDto.setComment(role.getComment());
				roleDto.setRoleName(role.getRoleName());
				roleDto.setCreatedDate(role.getCreatedDate());
				roleDto.setId(role.getId());

				roleDtoList.add(roleDto);
			}
			userDto.setRoles(roleDtoList);

			userDtoList.add(userDto);
		}
		PageModelDto<UserDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(userDtoList);

		logger.info("��ѯ�û�����");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void createUser(UserDto userDto) {
		User findUser=userRepo.findUserByName(userDto.getLoginName());
		if (findUser==null) {// �û�������
			User user = new User();
			user.setComment(userDto.getComment());
			user.setLoginName(userDto.getLoginName());
			user.setDisplayName(userDto.getDisplayName());
			user.setId(UUID.randomUUID().toString());
			user.setCreatedBy(currentUser.getLoginName());
			user.setPassword(userDto.getPassword());

			// �����ɫ
			for (RoleDto roleDto : userDto.getRoles()) {
				Role role = roleRepo.findById(roleDto.getId());
				if (role != null) {
					user.getRoles().add(role);
				}

			}

			userRepo.save(user);
			logger.info(String.format("�����û�,��¼��:%s", userDto.getLoginName()));
		} else {
			throw new IllegalArgumentException(String.format("�û���%s �Ѿ�����,���������룡", userDto.getLoginName()));
		}

	}

	@Override
	@Transactional
	public void deleteUser(String id) {
		User user = userRepo.findById(id);
		if (user != null) {
			if(!user.getLoginName().equals("admin")){
				userRepo.delete(user);
				logger.info(String.format("ɾ���û�,�û���:%s", user.getLoginName()));
			}
			
		}
	}

	@Override
	@Transactional
	public void deleteUsers(String[] ids) {
		for (String id : ids) {
			this.deleteUser(id);
		}
		logger.info("����ɾ���û�");
	}

	@Override
	@Transactional
	public void updateUser(UserDto userDto) {
		User user = userRepo.findById(userDto.getId());
		user.setComment(userDto.getComment());
		user.setDisplayName(userDto.getDisplayName());
		user.setModifiedBy(currentUser.getLoginName());

		// �������role
		user.getRoles().clear();

		// �����ɫ
		for (RoleDto roleDto : userDto.getRoles()) {
			Role role = roleRepo.findById(roleDto.getId());
			if (role != null) {
				user.getRoles().add(role);
			}
		}

		userRepo.save(user);
		logger.info(String.format("�����û�,�û���:%s", userDto.getLoginName()));
	}
	@Override
	@Transactional
	public Response Login(String userName, String password){
		User user=userRepo.findUserByName(userName);
		Response response =new Response();
		if(user!=null){
			if(user.getLoginFailCount()>5&&user.getLastLoginDate().getDay()==(new Date()).getDay()){	
				response.setMessage("��¼ʧ�ܴ�������,����������!");
				logger.warn(String.format("��¼ʧ�ܴ�������,�û���:%s", userName));
			}
			else if(password!=null&&password.equals(user.getPassword())){
				currentUser.setLoginName(user.getLoginName());
				currentUser.setDisplayName(user.getDisplayName());
				user.setLoginFailCount(0);
				user.setLastLoginDate(new Date());
				//shiro
				UsernamePasswordToken token = new UsernamePasswordToken(user.getLoginName(), user.getPassword());
				Subject currentUser = SecurityUtils.getSubject();
				currentUser.login(token);
				
				response.setSuccess(true);
				logger.info(String.format("��¼�ɹ�,�û���:%s", userName));
			}else{
				user.setLoginFailCount(user.getLoginFailCount()+1);	
				user.setLastLoginDate(new Date());
				response.setMessage("�û������������!");
			}
			userRepo.save(user);
		}else{
			response.setMessage("�û������������!");
		}
		
		return response;
	}
	@Override
	@Transactional
	public Set<String> getCurrentUserPermissions(){
		//logger.info(String.format("��ѯ��ǰ�û�Ȩ��,�û���:%s", currentUser.getLoginName()));
		return  userRepo.getUserPermission(currentUser.getLoginName());
		
	}
	@Transactional
	public void logout(){
		Subject currentUser = SecurityUtils.getSubject();
		if(currentUser!=null){
			currentUser.logout();
			logger.info(String.format("�˳���¼,�û���:%s", currentUser.getPrincipal()));
		}
		
	}
	@Transactional
	public void changePwd(String password){
		String userName=currentUser.getLoginName();
		User user=userRepo.findUserByName(userName);
		
		if(user!=null){
			user.setPassword(password);
			userRepo.save(user);
			logger.info(String.format("�޸�����,�û���:%s", userName));
		}
	}
	@Transactional
	public User findUserByName(String userName){
		return userRepo.findUserByName(userName);
	}
}

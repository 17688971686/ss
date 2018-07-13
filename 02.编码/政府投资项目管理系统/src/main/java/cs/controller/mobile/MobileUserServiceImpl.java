package cs.controller.mobile;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cs.common.ICurrentUser;
import cs.common.MobileResponse;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.framework.RoleDto;
import cs.model.framework.UserDto;
import cs.repository.framework.UserRepo;


@Service
public class MobileUserServiceImpl implements MobileUserService {
	private static Logger logger = Logger.getLogger(MobileUserServiceImpl.class);
	@Autowired
	private UserRepo userRepo;

	@Autowired
	private ICurrentUser currentUser;

	@Override
	@Transactional
	public MobileResponse Login(String userName, String password,String roleName){
		User user=userRepo.findUserByName(userName);
		MobileResponse response =new MobileResponse();
		
		if(user!=null){
			if(user.getLoginFailCount()>5&&user.getLastLoginDate().getDay()==(new Date()).getDay()){	
				response.setMessage("登录失败次数过多,请明天再试!");
				logger.warn(String.format("登录失败次数过多,用户名:%s", userName));
			}
			else if(password!=null&&password.equals(user.getPassword())){
				//判断用户角色
				Boolean hasRole = false;
				List<Role> roles = user.getRoles();
				for(Role x:roles){
					if(x.getRoleName().equals(roleName) || x.getRoleName().equals("超级管理员") || x.getRoleName().equals("管理员")){//如果有对应的角色则允许登录
						hasRole = true;
						break;
					}else{
						hasRole = false;
					}
				}
				if(hasRole){
					currentUser.setLoginName(user.getLoginName());
					currentUser.setDisplayName(user.getDisplayName());
					currentUser.setUserId(user.getId());
					Date lastLoginDate=user.getLastLoginDate();
					if(lastLoginDate!=null){
						currentUser.setLastLoginDate(user.getLastLoginDate());
					}				
					user.setLoginFailCount(0);
					user.setLastLoginDate(new Date());
					//shiro
					UsernamePasswordToken token = new UsernamePasswordToken(user.getLoginName(), user.getPassword());
					Subject currentUser = SecurityUtils.getSubject();
					currentUser.login(token);
					
					response.setSuccess(true);
					
					UserDto userDto = new UserDto();
					userDto.setId(user.getId());
					userDto.setLoginName(user.getLoginName());
					userDto.setDisplayName(user.getDisplayName());
					
					List<Role> roleList = user.getRoles();
					List<RoleDto> roleDtoList = new ArrayList<RoleDto>();
					for(Role role : roleList) {
						RoleDto roleDto = new RoleDto();
						roleDto.setId(role.getId());
						roleDto.setRoleName(role.getRoleName());
						roleDtoList.add(roleDto);
					}
					
					userDto.setRoles(roleDtoList);
					response.setObject(userDto);
					logger.info(String.format("登录成功,用户名:%s", userName));
					
				}else{
					response.setMessage("权限不足，请联系管理员!");
				}
				
			}else{
				user.setLoginFailCount(user.getLoginFailCount()+1);	
				user.setLastLoginDate(new Date());
				response.setMessage("用户名或密码错误!");
			}
			userRepo.save(user);
		}else{
			response.setMessage("用户名或密码错误!");
		}
		
		return response;
	}
	
}

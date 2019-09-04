package cs.service.framework;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.activiti.engine.identity.Group;
import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.framework.Resource;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.framework.ResourceDto;
import cs.model.framework.RoleDto;
import cs.model.framework.UserDto;
import cs.repository.framework.RoleRepo;
import cs.repository.odata.ODataObj;
import org.springframework.util.CollectionUtils;

@Service
public class RoleServiceImpl implements RoleService {
	private static Logger logger = Logger.getLogger(RoleServiceImpl.class);
	@Autowired	
	private RoleRepo roleRepository;
	@Autowired
	private ICurrentUser currentUser;
	@Autowired
	private ActivitiService activitiService;

	/*
	 * (non-Javadoc)
	 * 
	 * @see cs.service.RoleService#get(cs.common.ODataObj)
	 */
	@Override
	@Transactional
	public PageModelDto<RoleDto> get(ODataObj odataObj) {

		List<Role> listRole = roleRepository.findByOdata(odataObj);
		List<RoleDto> roleDtoList = new ArrayList<RoleDto>();
		for (Role item : listRole) {
			RoleDto roleDto = new RoleDto();
			roleDto.setId(item.getId());
			roleDto.setRoleName(item.getRoleName());
			roleDto.setCreatedDate(item.getCreatedDate());
			roleDto.setComment(item.getComment());

			List<ResourceDto> resourceDtoList = new ArrayList<>();
			for (Resource resource : item.getResources()) {
				ResourceDto resourceDto = new ResourceDto();
				resourceDto.setMethod(resource.getMethod());
				resourceDto.setName(resource.getName());
				resourceDto.setPath(resource.getPath());
				resourceDtoList.add(resourceDto);
			}
			roleDto.setResources(resourceDtoList);
			roleDtoList.add(roleDto);
		}
		PageModelDto<RoleDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(roleDtoList);

		logger.info("查询角色数据");
		return pageModelDto;
	}
	
	@Override
	@Transactional
	public List<RoleDto> Get() {

		List<Role> listRole = roleRepository.findAll();
		List<RoleDto> roleDtoList = new ArrayList<RoleDto>();
		for (Role item : listRole) {
			RoleDto roleDto = new RoleDto();
			roleDto.setId(item.getId());
			roleDto.setRoleName(item.getRoleName());
			roleDto.setCreatedDate(item.getCreatedDate());
			roleDto.setComment(item.getComment());

			List<ResourceDto> resourceDtoList = new ArrayList<>();
			for (Resource resource : item.getResources()) {
				ResourceDto resourceDto = new ResourceDto();
				resourceDto.setMethod(resource.getMethod());
				resourceDto.setName(resource.getName());
				resourceDto.setPath(resource.getPath());
				resourceDtoList.add(resourceDto);
			}
			
			List<UserDto> userDtoList = new ArrayList<>();
			for(User user:item.getUsers()){
				UserDto userDto = new UserDto();
				userDto.setId(user.getId());
				userDto.setDisplayName(user.getDisplayName());
				userDto.setLoginName(user.getLoginName());
				userDtoList.add(userDto);
			}
			roleDto.setResources(resourceDtoList);
			roleDto.setUserDtos(userDtoList);
			roleDtoList.add(roleDto);
		}

		logger.info("查询角色数据");
		return roleDtoList;
	}

	@Override
	@Transactional
	public void createRole(RoleDto roleDto) {		
		boolean isRoleExist=roleRepository.isRoleExist(roleDto.getRoleName());
		if(!isRoleExist){//角色不存在		
			Role role = new Role();
			role.setComment(roleDto.getComment());
			role.setRoleName(roleDto.getRoleName());
			role.setId(UUID.randomUUID().toString());
			role.setCreatedBy(currentUser.getUserId());
			// resource
			for (ResourceDto resourceDto : roleDto.getResources()) {
				Resource resource = new Resource();
				resource.setMethod(resourceDto.getMethod());
				resource.setPath(resourceDto.getPath());
				resource.setName(resourceDto.getName());
			role.getResources().add(resource);
		}

		Role roleResult = roleRepository.save(role);
		//创建候选组
		Group group = activitiService.createNewGroup(roleResult.getId());
		group.setName(roleDto.getRoleName());
		activitiService.createGroup(group);
		logger.info(String.format("创建角色,角色名:%s", roleDto.getRoleName()));
		}else{
			throw new IllegalArgumentException(String.format("角色名：%s 已经存在,请重新输入！",	roleDto.getRoleName()));
		}
	}

	@Override
	@Transactional
	public void updateRole(RoleDto roleDto) {
		Role role = roleRepository.findById(roleDto.getId());
		role.setComment(roleDto.getComment());
		role.setModifiedBy(currentUser.getUserId());

		//清除已有resource
		role.getResources().clear();
		
		// resource
		for (ResourceDto resourceDto : roleDto.getResources()) {			
			Resource resource = new Resource();
			resource.setMethod(resourceDto.getMethod());
			resource.setPath(resourceDto.getPath());
			resource.setName(resourceDto.getName());
			role.getResources().add(resource);
		}
		
		Role roleResult = roleRepository.save(role);
		Group group = activitiService.getGroup(roleResult.getId());
		if(group == null){
			group = activitiService.createNewGroup(roleResult.getId());
		}
		logger.info(String.format("更新角色,角色名:%s", roleDto.getRoleName()));
	}

	@Override
	@Transactional
	public void deleteRole(String id) {
		Role role = roleRepository.findById(id);
		if (role != null) {
			List<User> users=role.getUsers();
			for (User user : users) {//把角色里的用户移出才能删除
				user.getRoles().remove(role);
				activitiService.deleteMembership(user.getId(), role.getId());
			}
			if(!role.getRoleName().equals(BasicDataConfig.role_admin)){
				//先删除候选组
				activitiService.deleteGroup(role.getId());
				roleRepository.delete(role);
				logger.info(String.format("删除角色,角色名:%s", role.getRoleName()));
			}
			
		}


	}

	@Override
	@Transactional
	public void deleteRoles(String[] ids) {
		for (String id : ids) {
			this.deleteRole(id);
		}
		logger.info("批量删除角色");
	}
}

package cs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Resource;
import cs.domain.Role;
import cs.domain.User;
import cs.model.PageModelDto;
import cs.model.ResourceDto;
import cs.model.RoleDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.RoleRepo;

@Service
public class RoleServiceImpl implements RoleService {
	private static Logger logger = Logger.getLogger(RoleServiceImpl.class);
	@Autowired	
	private RoleRepo roleRepository;
	@Autowired
	private ICurrentUser currentUser;

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

		logger.info("��ѯ��ɫ����");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void createRole(RoleDto roleDto) {		
		boolean isRoleExist=roleRepository.isRoleExist(roleDto.getRoleName());
		if(!isRoleExist){//��ɫ������		
			Role role = new Role();
			role.setComment(roleDto.getComment());
			role.setRoleName(roleDto.getRoleName());
			role.setId(UUID.randomUUID().toString());
			role.setCreatedBy(currentUser.getLoginName());
			// resource
			for (ResourceDto resourceDto : roleDto.getResources()) {
				Resource resource = new Resource();
				resource.setMethod(resourceDto.getMethod());
				resource.setPath(resourceDto.getPath());
				resource.setName(resourceDto.getName());
			role.getResources().add(resource);
		}

		roleRepository.save(role);		
		logger.info(String.format("������ɫ,��ɫ��:%s", roleDto.getRoleName()));
		}else{
			throw new IllegalArgumentException(String.format("��ɫ����%s �Ѿ�����,���������룡",	roleDto.getRoleName()));
		}
	}

	@Override
	@Transactional
	public void updateRole(RoleDto roleDto) {
		Role role = roleRepository.findById(roleDto.getId());
		role.setComment(roleDto.getComment());
		role.setModifiedBy(currentUser.getLoginName());

		//�������resource
		role.getResources().clear();
		
		// resource
		for (ResourceDto resourceDto : roleDto.getResources()) {			
			Resource resource = new Resource();
			resource.setMethod(resourceDto.getMethod());
			resource.setPath(resourceDto.getPath());
			resource.setName(resourceDto.getName());
			role.getResources().add(resource);
		}
		
		roleRepository.save(role);
		logger.info(String.format("���½�ɫ,��ɫ��:%s", roleDto.getRoleName()));
	}

	@Override
	@Transactional
	public void deleteRole(String id) {
		Role role = roleRepository.findById(id);
		if (role != null) {
			List<User> users=role.getUsers();
			for (User user : users) {//�ѽ�ɫ����û��Ƴ�����ɾ��
				user.getRoles().remove(role);
			}
			if(!role.getRoleName().equals("��������Ա")){
				roleRepository.delete(role);
				logger.info(String.format("ɾ����ɫ,��ɫ��:%s", role.getRoleName()));
			}
			
		}


	}

	@Override
	@Transactional
	public void deleteRoles(String[] ids) {
		for (String id : ids) {
			this.deleteRole(id);
		}
		logger.info("����ɾ����ɫ");
	}
}

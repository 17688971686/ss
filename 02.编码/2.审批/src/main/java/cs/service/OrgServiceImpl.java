package cs.service;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.hibernate.Criteria;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Org;
import cs.domain.User;
import cs.model.OrgDto;
import cs.model.PageModelDto;
import cs.model.UserDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.OrgRepo;
import cs.repository.repositoryImpl.UserRepo;

@Service
public class OrgServiceImpl implements OrgService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	@Autowired
	private UserRepo userRepo;
	@Autowired
	private OrgRepo orgRepo;
	@Autowired
	private ICurrentUser currentUser;

	/*
	 * (non-Javadoc)
	 * 
	 * @see cs.service.OrgService#get(cs.repository.odata.ODataObj)
	 */
	@Override
	@Transactional
	public PageModelDto<OrgDto> get(ODataObj odataObj) {
		List<Org> orgList = orgRepo.findByOdata(odataObj);
		List<OrgDto> orgDtoList = new ArrayList<>();
		for (Org item : orgList) {
			OrgDto orgDto = new OrgDto();
			orgDto.setId(item.getId());
			orgDto.setName(item.getName());
			orgDto.setCreatedDate(item.getCreatedDate());
			orgDto.setComment(item.getComment());
			orgDto.setOrgIdentity(item.getOrgIdentity());

			orgDtoList.add(orgDto);
		}
		PageModelDto<OrgDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(orgDtoList);

		logger.info("��ѯ��������");		
		return pageModelDto;
	}

	@Override
	@Transactional
	public void createOrg(OrgDto orgDto) {
		// �жϲ����Ƿ��Ѿ�����
		Criteria criteria = orgRepo.getSession().createCriteria(Org.class);
		criteria.add(Restrictions.eq("orgIdentity", orgDto.getOrgIdentity()));
		List<Org> orgs = criteria.list();
		if (orgs.isEmpty()) {// ���Ų�����
			Org org = new Org();
			org.setComment(orgDto.getComment());
			org.setName(orgDto.getName());
			org.setId(UUID.randomUUID().toString());
			org.setCreatedBy(currentUser.getLoginName());
			org.setOrgIdentity(orgDto.getOrgIdentity());

			orgRepo.save(org);

			logger.info(String.format("��������,������:%s", orgDto.getOrgIdentity()));
		} else

		{
			throw new IllegalArgumentException(String.format("���ű�ʶ��%s �Ѿ�����,���������룡", orgDto.getOrgIdentity()));
		}
	}

	@Override
	@Transactional
	public void updateOrg(OrgDto orgDto) {
		Org org = orgRepo.findById(orgDto.getId());
		org.setComment(orgDto.getComment());
		org.setName(orgDto.getName());
		org.setModifiedBy(currentUser.getLoginName());

		orgRepo.save(org);
		logger.info(String.format("���²���,������:%s", orgDto.getName()));
	}

	@Override
	@Transactional
	public void deleteOrg(String id) {
		Org org = orgRepo.findById(id);
		if (org != null) {
			
			List<User> users=org.getUsers();
			for (User user : users) {//�Ѳ�������û��Ƴ�����ɾ��
				user.getOrgs().remove(org);
			}
			orgRepo.delete(org);
			logger.info(String.format("ɾ������,����identity:%s", org.getOrgIdentity()));
		}

	}

	@Override
	@Transactional
	public void deleteOrgs(String[] ids) {
		for (String id : ids) {
			this.deleteOrg(id);
		}
		logger.info("����ɾ������");
	}

	@Override
	@Transactional
	public PageModelDto<UserDto> getOrgUsers(String id) {
		PageModelDto<UserDto> pageModelDto = new PageModelDto<>();
		List<UserDto> userDtos = new ArrayList<>();
		Org org = orgRepo.findById(id);
		if (org != null) {
			org.getUsers().forEach(x -> {
				UserDto userDto = new UserDto();
				userDto.setId(x.getId());
				userDto.setComment(x.getComment());
				userDto.setLoginName(x.getLoginName());
				userDto.setDisplayName(x.getDisplayName());
				userDtos.add(userDto);

			});
			pageModelDto.setValue(userDtos);
			pageModelDto.setCount(userDtos.size());
			logger.info(String.format("���Ҳ����û�������%s", org.getOrgIdentity()));
		}

		return pageModelDto;
	}

	@Override
	@Transactional
	public PageModelDto<UserDto> getUsersNotInOrg(String id, ODataObj oDataObj) {
		PageModelDto<UserDto> pageModelDto = new PageModelDto<>();
		List<UserDto> userDtos = new ArrayList<>();
		Org org = orgRepo.findById(id);
		List<String> userIds = new ArrayList<>();
		if (org != null) {

			org.getUsers().forEach(x -> {
				userIds.add(x.getId());
			});

			List<User> users = userRepo.getUsersNotIn(userIds, oDataObj);
			users.forEach(x -> {
				UserDto userDto = new UserDto();
				userDto.setId(x.getId());
				userDto.setComment(x.getComment());
				userDto.setLoginName(x.getLoginName());
				userDto.setDisplayName(x.getDisplayName());
				userDtos.add(userDto);

			});
			pageModelDto.setValue(userDtos);
			pageModelDto.setCount(userDtos.size());

			logger.info(String.format("���ҷǲ����û�,����%s", org.getOrgIdentity()));
		}

		return pageModelDto;
	}

	@Override
	@Transactional
	public void addUserToOrg(String userId, String orgId) {
		Org org = orgRepo.findById(orgId);
		if (org != null) {
			User user = userRepo.findById(userId);
			if (user != null) {
				user.getOrgs().add(org);
			}
			userRepo.save(user);
			logger.info(String.format("����û�������,����%s,�û�:%s", org.getOrgIdentity(), user.getLoginName()
					));
			
		}

	}

	@Override
	@Transactional
	public void removeOrgUser(String userId, String orgId) {
		Org org = orgRepo.findById(orgId);
		if (org != null) {
			User user = userRepo.findById(userId);
			if (user != null) {
				user.getOrgs().remove(org);
			}
			userRepo.save(user);
			logger.info(String.format("�Ӳ����Ƴ��û�,����%s,�û�:%s", org.getOrgIdentity(), user.getLoginName()));
		}

	}

	@Override
	@Transactional
	public void removeOrgUsers(String[] userIds, String orgId) {
		Org org = orgRepo.findById(orgId);
		if (org != null) {
			for (String id : userIds) {
				this.removeOrgUser(id,orgId);
			}
			logger.info(String.format("����ɾ�������û�,����%s", org.getOrgIdentity()));
		}
	}

}

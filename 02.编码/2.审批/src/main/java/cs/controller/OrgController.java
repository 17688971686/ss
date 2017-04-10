package cs.controller;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.OrgDto;
import cs.model.PageModelDto;
import cs.model.UserDto;
import cs.repository.odata.ODataObj;
import cs.service.OrgService;

@Controller
@RequestMapping(name = "����", path = "org")
public class OrgController {
	private String ctrlName = "org";
	@Autowired
	private OrgService orgService;

	@RequiresPermissions("org##get")	
	@RequestMapping(name = "��ȡ��������", path = "", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<OrgDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<OrgDto> orgDtos = orgService.get(odataObj);

		return orgDtos;
	}

	@RequiresPermissions("org##post")	
	@RequestMapping(name = "��������", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody OrgDto orgDto) {
		orgService.createOrg(orgDto);
	}

	@RequiresPermissions("org##put")	
	@RequestMapping(name = "���²���", path = "", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody OrgDto orgDto) {
		orgService.updateOrg(orgDto);
	}

	@RequiresPermissions("org##delete")	
	@RequestMapping(name = "ɾ������", path = "", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			orgService.deleteOrgs(ids);
		} else {
			orgService.deleteOrg(id);
		}
	}

	@RequiresPermissions("org#orgId/users#get")	
	@RequestMapping(name = "�����û�", path = "{orgId}/users", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserDto> orgUsers(@PathVariable String orgId) {

		return orgService.getOrgUsers(orgId);
	}
	
	@RequiresPermissions("org#orgId/userNotIn#get")	
	@RequestMapping(name = "�ǲ����û�", path = "{orgId}/userNotIn", method = RequestMethod.GET)
	public @ResponseBody PageModelDto<UserDto> userNotIn(@PathVariable String orgId,HttpServletRequest request) throws ParseException {

		ODataObj odataObj = new ODataObj(request);
		return orgService.getUsersNotInOrg(orgId, odataObj);
	}
	
	@RequiresPermissions("org#orgId/users#post")	
	@RequestMapping(name = "����û�������", path = "{orgId}/users", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void postUserToOrg(@PathVariable String orgId,@RequestBody String userId) {
		orgService.addUserToOrg(userId, orgId);
	}
	
	@RequiresPermissions("org#orgId/users#delete")
	@RequestMapping(name = "�Ӳ����Ƴ��û�", path = "{orgId}/users", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void deleteUserFromOrg(@PathVariable String orgId,@RequestBody String userId) {
		String[] ids = userId.split(",");
		if (ids.length > 1) {
			orgService.removeOrgUsers(ids,orgId);
		} else {
			orgService.removeOrgUser(userId, orgId);
		}
	}
	
	
	
	// begin#html
	
	@RequiresPermissions("org#html/list#get")
	@RequestMapping(name = "�����б�ҳ��", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

	@RequiresPermissions("org#html/edit#get")
	@RequestMapping(name = "�༭����ҳ��", path = "html/edit", method = RequestMethod.GET)
	public String edit() {
		return ctrlName + "/edit";
	}

	@RequiresPermissions("org#html/orgUser#get")
	@RequestMapping(name = "�����û��б�ҳ��", path = "html/orgUser", method = RequestMethod.GET)
	public String listUser() {
		return ctrlName + "/list_user";
	}
	// end#html
}

package cs.controller.management;

import java.text.ParseException;
import java.util.List;

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
import cs.common.ICurrentUser;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.model.DomainDto.TaskHeadDto;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserService;
import cs.service.interfaces.TaskHeadService;

@Controller
@RequestMapping(name = "后台管理--监管项目管理", path = "management/supervision/project")
public class ProjectSupervisedController {
	private String ctrl = "management/supervision/project";
	
	// begin#html
	@RequiresPermissions("management/supervision/project#html/list#get")
	@RequestMapping(name = "监管项目列表", path = "html/list", method = RequestMethod.GET)
	public String todo() {
		return ctrl + "/list";
	}

}

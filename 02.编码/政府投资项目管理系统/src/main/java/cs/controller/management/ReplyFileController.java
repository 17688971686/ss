package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.ReplyFileDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ReplyFileService;


/**
 * @author Administrator
 * @Description 获取批复文件信息
 */
@Controller
@RequestMapping(name="后台管理--批复文件管理",path="management/replyFile")
public class ReplyFileController {
	@Autowired
	private ReplyFileService replyFileService;
	
//	@RequiresPermissions("management/replyFile##get")
	@RequestMapping(name = "获取批复文件信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ReplyFileDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ReplyFileDto> replyFileDtos = replyFileService.get(odataObj);		
		return replyFileDtos;
	}
}

package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;

import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ShenBaoInfoService;

@Controller
@RequestMapping(name="申报信息管理", path="management/shenbao")
public class ShenBaoController {
	private String ctrl ="management/shenbao";
	@Autowired
	private ShenBaoInfoService shenBaoInfoService;
	
	@RequestMapping(name = "获取申报数据", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<ShenBaoInfoDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<ShenBaoInfoDto>  shenbaoInfoDtos= shenBaoInfoService.get(odataObj);		
		return shenbaoInfoDtos;
	}
}

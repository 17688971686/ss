package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.CreditIllegalNameDto;
import cs.model.DomainDto.InvestmentProjectDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.InvestmentProjectService;





@Controller
@RequestMapping(name="后台管理--目录管理", path="management/catalog")
public class CatalogController {
	private String ctrl ="management/catalog";
	
	@Autowired
	private InvestmentProjectService investmentService;
	
	@RequestMapping(name="添加投资项目",path="",method=RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody InvestmentProjectDto dto){
		investmentService.create(dto);
	}
	
	
	@RequestMapping(name="获取投资项目",path="",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<InvestmentProjectDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<InvestmentProjectDto>  investmentProjectDtos= investmentService.get(odataObj);		
		return investmentProjectDtos;
	}
	
	@RequestMapping(name="更新项目异常名录",path="",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void put(@RequestBody InvestmentProjectDto dto){
		investmentService.update(dto,dto.getId());
	}
	
	@RequestMapping(name="删除项目异常名录",path="delete",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestParam String id){
		investmentService.delete(id);
	}
	
	@RequestMapping(name = "批量删除项目异常名录(次级目录)", path = "",method=RequestMethod.DELETE)	
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  deleteSecondCatalogs(@RequestBody String id)  {		
		String[] ids=id.split(",");
		if(ids.length>1){
			investmentService.deleteCatalogs(ids);	
		}else{
			investmentService.delete(id);	
		}		
	}
	
	@RequestMapping(name="投资项目列表页",path="html/investmentList",method=RequestMethod.GET)
	public String investmentList(){
		return ctrl+"/investmentList";
	}
	
	@RequestMapping(name="投资项目编辑页",path="html/investmentEdit",method=RequestMethod.GET)
	public String investmentEdit(){
		return ctrl+"/investmentEdit";
	}

}

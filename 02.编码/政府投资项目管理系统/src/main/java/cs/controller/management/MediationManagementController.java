package cs.controller.management;

import java.text.ParseException;

import javax.servlet.http.HttpServletRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.model.PageModelDto;
import cs.model.DomainDto.AssistReviewDto;
import cs.model.DomainDto.MediationUnitDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.AssistReviewService;
import cs.service.interfaces.MediationUnitService;


@Controller
@RequestMapping(name="中介单位管理",path="management/mediationManagement")
public class MediationManagementController {
	private String ctrlName = "management/mediationManagement";

	@Autowired
	private MediationUnitService mediationUnitService;
	@Autowired
	private AssistReviewService assistReviewService;
	
	@RequestMapping(name = "获取中介单位信息", path = "",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<MediationUnitDto> get(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<MediationUnitDto> ropertyDtos = mediationUnitService.get(odataObj);		
		return ropertyDtos;
	}
	@RequestMapping(name = "更新中介单位信息", path = "", method = RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void update(@RequestBody MediationUnitDto dto) {
		mediationUnitService.update(dto,dto.getId());
	}
	@RequestMapping(name = "创建中介单位信息", path = "", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void post(@RequestBody MediationUnitDto dto) {
		mediationUnitService.create(dto);
	}
	@RequestMapping(name = "删除中介单位信息", path = "", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delete(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			mediationUnitService.deletes(ids);
		} else {
			mediationUnitService.delete(id);
		}
	} 
	@RequestMapping(name = "中介单位详情", path = "html/mediationUnitDetails", method = RequestMethod.GET)	
	public String mediationUnitDetails() {
       
		return this.ctrlName + "/mediationUnitDetails";
	}
	@RequestMapping(name = "获取协审活动信息", path = "assistReviewList",method=RequestMethod.GET)
	public @ResponseBody PageModelDto<AssistReviewDto> getAssistReview(HttpServletRequest request) throws ParseException {
		ODataObj odataObj = new ODataObj(request);
		PageModelDto<AssistReviewDto> assistReviewDtos = assistReviewService.get(odataObj);		
		return assistReviewDtos;
	} 
	@RequestMapping(name = "更新协审活动评价", path = "updateAssistReview",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateAssistReview(@RequestBody AssistReviewDto Dto){		
		assistReviewService.update(Dto, Dto.getId());
	}
	@RequestMapping(name = "更新协审活动", path = "updateOnlyAssistReview",method=RequestMethod.PUT)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void  updateOnlyAssistReview(@RequestBody AssistReviewDto Dto){		
		assistReviewService.updateAssistReview(Dto, Dto.getId());
	}
	@RequestMapping(name = "创建协审活动", path = "createAssistReview", method = RequestMethod.POST)
	@ResponseStatus(value = HttpStatus.CREATED)
	public void createAssistReview(@RequestBody AssistReviewDto dto) {
		assistReviewService.create(dto);
	}
	@RequestMapping(name = "删除协审活动信息", path = "delAssistReview", method = RequestMethod.DELETE)
	@ResponseStatus(value = HttpStatus.NO_CONTENT)
	public void delAssistReview(@RequestBody String id) {
		String[] ids = id.split(",");
		if (ids.length > 1) {
			assistReviewService.deletes(ids);
		} else {
			assistReviewService.delete(id);
		}
	}  
	@RequestMapping(name = "服务质量评价", path = "html/serviceEvaluation", method = RequestMethod.GET)	
	public String serviceEvaluation() {
       
		return this.ctrlName + "/serviceEvaluationEdit";
	}
	@RequestMapping(name = "送审文件质量评价", path = "html/submitReviewEvaluation", method = RequestMethod.GET)	
	public String submitReviewEvaluation() {
       
		return this.ctrlName + "/submitReviewEvaluationEdit";
	}
	@RequestMapping(name = "协审活动详情", path = "html/assistReviewDetails", method = RequestMethod.GET)	
	public String assistReviewDetails() {
       
		return this.ctrlName + "/assistReviewDetails";
	}
	@RequestMapping(name = "中介单位列表页面", path = "html/mediationUnitList", method = RequestMethod.GET)	
	public String mediationUnitList() {
		return this.ctrlName + "/mediationUnitList";
	}
	@RequestMapping(name = "中介单位编辑页面", path = "html/mediationUnitChangeDetails", method = RequestMethod.GET)	
	public String mediationUnitChangeDetails() {
       
		return this.ctrlName + "/mediationUnitEdit";
	}
	@RequestMapping(name = "协审活动列表页面", path = "html/assistReviewList", method = RequestMethod.GET)	
	public String assistReviewList() {
		return this.ctrlName + "/assistReviewList";
	}
	@RequestMapping(name = "协审活动编辑页面", path = "html/assistReviewChangeDetails", method = RequestMethod.GET)	
	public String assistReviewChangeDetails() {
       
		return this.ctrlName + "/assistReviewEdit";
	}
}

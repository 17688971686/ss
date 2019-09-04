package cs.controller.management;

import java.text.ParseException;

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
import cs.model.DomainDto.ReviewResultDto;
import cs.service.interfaces.ReviewResultService;


/**
 * @author Administrator
 * @Description 评审报批信息控制层
 */
@Controller
@RequestMapping(name = "后台管理--审批流程--评审结果", path = "management/review")
public class ReviewResultController {

	@Autowired
	ReviewResultService reviewResultService;
	@Autowired
	ICurrentUser currentUser;

//	@RequiresPermissions("management/review#id#get")
	@RequestMapping(name = "获取评审报批信息", path = "{id}",method=RequestMethod.GET)
	public @ResponseBody ReviewResultDto getReviewResult(@PathVariable String id) throws ParseException {
		
		ReviewResultDto reviewResultDto = reviewResultService.getReviewResultByTaskId(id);
		return reviewResultDto;
	}	
	
//	@RequiresPermissions("management/review#id#post")
	@RequestMapping(name = "创建评审报批信息", path = "{id}",method=RequestMethod.POST)	
	@ResponseStatus(value = HttpStatus.CREATED)
	public void  post(@RequestBody ReviewResultDto reviewResultDto,@PathVariable String id)  {		
		reviewResultService.createReviewResult(reviewResultDto,id);		
	}
}

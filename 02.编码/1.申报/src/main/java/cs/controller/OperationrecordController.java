package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 操作记录控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Operationrecord", path = "operationrecord")
public class OperationrecordController {
	private String ctrlName = "operationrecord";
	
	/**
	 * 进入操作记录页面
	 * @author 常祥
	 * @serialData 2017/4/10
	 * @return 
	 */
	@RequiresPermissions("operationrecord#html/list#get")
	@RequestMapping(name = "OperationrecordList", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

}

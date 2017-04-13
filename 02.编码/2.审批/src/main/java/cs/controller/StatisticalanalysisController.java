package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;

/**
 * 统计分析控制层
 * @author 常祥
 * @serialData 2017/4/10
 *
 */
@Controller
@RequestMapping(name = "Statisticalanalysis", path = "statisticalanalysis")
public class StatisticalanalysisController {
	private String ctrlName = "statisticalanalysis";
		
		/**
		 * 进入统计分析页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("statisticalanalysis#html/list#get")
		@RequestMapping(name = "StatisticalanalysisList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}

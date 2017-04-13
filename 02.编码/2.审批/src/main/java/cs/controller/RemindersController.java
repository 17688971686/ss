package cs.controller;

import org.apache.shiro.authz.annotation.RequiresPermissions;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
/**
 * 催办控制层
 * @author 常祥
 * @serialData 2017/4/10
 */
@Controller
@RequestMapping(name = "Reminders", path = "reminders")
public class RemindersController {
	private String ctrlName = "reminders";
		
		/**
		 * 进入催办页面
		 * @author 常祥
		 * @serialData 2017/4/10
		 * @return 
		 */
		@RequiresPermissions("reminders#html/list#get")
		@RequestMapping(name = "RemindersList", path = "html/list", method = RequestMethod.GET)
		public String list() {
			return ctrlName + "/list";
		}

}

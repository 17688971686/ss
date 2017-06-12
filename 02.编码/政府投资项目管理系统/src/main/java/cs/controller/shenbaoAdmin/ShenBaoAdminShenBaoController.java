package cs.controller.shenbaoAdmin;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping(name="项目申报",path="shenbaoAdmin/shenbao")
public class ShenBaoAdminShenBaoController {
	private String ctrlName = "shenbaoAdmin/shenbao";
	
	//begin#html
	@RequestMapping(name = "列表页", path = "html/list")
	public String list() {
		return this.ctrlName + "/list";
	}
	@RequestMapping(name = "申报页", path = "html/edit")
	public String create() {
		return this.ctrlName + "/edit";
	}
}

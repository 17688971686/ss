package cs.controller.framework;

import java.io.File;

import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.multipart.MultipartFile;

import cs.common.Util;

@Controller
@RequestMapping(name = "Demo", path = "demo")
public class DemoController {
	private String ctrlName = "framework/demo";
	
	@Autowired  
    private HttpServletRequest request;  
	//@RequiresPermissions("demo#save#post")
	@RequestMapping(name = "上传文件", path = "save", method = RequestMethod.POST)
	public @ResponseBody String Save(@RequestParam("file") MultipartFile file){
		String randomName="";
		if (!file.isEmpty()) {  
            try {  
            	//文件名：
            	String fileName=file.getOriginalFilename();
            	//随机名
            	randomName=Util.generateFileName(fileName);
                // 文件保存路径  
                String filePath = request.getSession().getServletContext().getRealPath("/") + "contents/upload/"  
                        + randomName;  
                // 转存文件  
                file.transferTo(new File(filePath));  
            } catch (Exception e) {  
                e.printStackTrace();  
            }  
        }  
		//return "true";
		return randomName;
	}
	@RequestMapping(name = "删除上传文件", path = "remove", method = RequestMethod.POST)
	public @ResponseBody String remove(HttpServletRequest request){
		return "true";
	}
	// begin#html
	//@RequiresPermissions("demo#html/list#get")
	@RequestMapping(name = "DemoList页面", path = "html/list", method = RequestMethod.GET)
	public String list() {
		return ctrlName + "/list";
	}

	// end#html
}

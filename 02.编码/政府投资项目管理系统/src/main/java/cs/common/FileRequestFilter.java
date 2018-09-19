package cs.common;

import java.io.IOException;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;



/**
 * 该过滤器用来拦截[contents/upload]下的文件请求，实现文件的在线浏览功能
 * @author Administrator
 *
 */
public class FileRequestFilter implements Filter{
	
//	private UploadPathBean uploadPathBean;//用来获取上传路径的类

	@Override
	public void init(FilterConfig filterConfig) throws ServletException {
//		ServletContext sc = filterConfig.getServletContext(); 
//	    XmlWebApplicationContext cxt = (XmlWebApplicationContext)WebApplicationContextUtils.getWebApplicationContext(sc);
//	    
//	    if(cxt != null && cxt.getBean("uploadPathBean") != null && uploadPathBean == null){
//	    	uploadPathBean = (UploadPathBean) cxt.getBean("uploadPathBean");
//	    }
	}

	@Override
	public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
			throws IOException, ServletException {
		HttpServletRequest req = (HttpServletRequest)request;
		String url = req.getRequestURL().toString();
		if(url.contains("/contents/upload")){
			
				
				redirect(url, response);
			
		}else{
			chain.doFilter(request, response);
		}
	}

	@Override
	public void destroy() {
		
	}
	
	//把请求转发到tomcat配置的虚拟路径中
	private void redirect(String url, ServletResponse resp){
		try {
			HttpServletResponse response = (HttpServletResponse)resp;
			url = url.replace("contents/upload", "attachments");
			response.sendRedirect(url);//把请求转发到tomcat配置的虚拟路径中
		} catch (IOException e) {
			e.printStackTrace();
		}
	}

}

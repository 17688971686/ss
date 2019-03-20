package cs.common;

import java.io.IOException;
import java.net.URL;

import javax.servlet.Filter;
import javax.servlet.FilterChain;
import javax.servlet.FilterConfig;
import javax.servlet.ServletException;
import javax.servlet.ServletRequest;
import javax.servlet.ServletResponse;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import org.springframework.http.HttpMethod;

/**
 * Created by lqs on 2017/8/17.
 * xss攻击检查过滤器
 */
public class XssFilter implements Filter{

    FilterConfig filterConfig = null;

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        this.filterConfig = filterConfig;
    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain) throws IOException, ServletException {

        HttpServletRequest req = (HttpServletRequest)request;

        //判断请求方法
        String method = req.getMethod().toUpperCase();
        if(!validateMethod(method)){
            ((HttpServletResponse)response).setStatus(403);
        }
        String servletPath = req.getServletPath();
        if(!servletPath.startsWith("/contents")
                &&!servletPath.startsWith("/login")&&!servletPath.startsWith("/mobile")&&!servletPath.startsWith("/sys/backPassword")){
            //防御CRSF
            String referer = req.getHeader("Referer");
            if(referer != null&&!referer.isEmpty()){
                URL url = new URL(referer);
                String refererDomain = url.getHost();
                //需要过滤的地址
                String domain = "192.168.189.235,192.168.180.63,192.168.189.142,localhost,192.168.0.252,121.201.66.221,192.168.2.4";
                if(domain != null&&!domain.isEmpty()){
                    //Referer要和domain一直才通过
                    boolean isExists = false;
                    String[] domains = domain.split(",");
                    for(String subDomain : domains){
                        if(refererDomain.equals(subDomain)){
                            isExists = true;
                            break;
                        }
                    }
                    if(!isExists){
                        //Referer不在允许域名内，禁止访问
                        String contextPath = req.getContextPath();
                        ((HttpServletResponse)response).setStatus(403);
                        //((HttpServletResponse)response).sendRedirect(contextPath);
                        return ;
                    }

                }

            }/*else{
                //判断host
                String contextPath = req.getContextPath();
                ((HttpServletResponse)response).sendRedirect(contextPath);
                return ;
            }*/
        }
		try {
			 chain.doFilter(new XssHttpServletRequestWrapper(req),response);
		} catch (Exception e) {
			e.printStackTrace();
		}
		       
    }

    /**
     * 校验http方法
     *
     * */
    private boolean validateMethod(String method) {
        boolean isExists = false;
        HttpMethod[] httpMethods = HttpMethod.values();
        for(HttpMethod httpMethod : httpMethods){
            if(httpMethod.name().equals(method)){
                isExists = true;
                break;
            }
        }
        return isExists;
    }

    @Override
    public void destroy() {

    }
}

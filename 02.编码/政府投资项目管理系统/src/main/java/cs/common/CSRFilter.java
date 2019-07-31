package cs.common;/**
 * Created by Administrator on 2018-12-23.
 */

import com.sn.framework.common.StringUtil;
import cs.controller.shenbao.ShenBaoHomeController;
import org.apache.log4j.Logger;

import javax.servlet.*;
import javax.servlet.annotation.WebFilter;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;

import static com.sn.framework.common.StringUtil.SEPARATE_COMMA;

/**
 * @program: lgaj-gcw-all
 * @description: 防止跨站点伪造
 * @author: lanyijie
 * @create: 2018-12-23 23:49
 **/
public class CSRFilter implements Filter {
    private static Logger logger = Logger.getLogger(CSRFilter.class);


    private String[] verifyReferer = null;

    @Override
    public void destroy() {

    }

    @Override
    public void doFilter(ServletRequest request, ServletResponse response, FilterChain chain)
            throws IOException, ServletException {
        String referer = ((HttpServletRequest) request).getHeader("Referer");
        boolean b = false;
        loop:for (String vReferer : verifyReferer) {
            if (referer == null || referer.trim().startsWith(vReferer)) {
                b = true;
                //实际设置
                ((HttpServletResponse) response).setHeader("x-frame-options", "SAMEORIGIN");
                chain.doFilter(request, response);
                break loop;
            }
        }
        if (!b) {
            logger.warn("疑似CSRF攻击，referer: "+ referer);
        }
    }

    @Override
    public void init(FilterConfig filterConfig) throws ServletException {
        String url = "http://192.168.189.235,http://192.168.180.63,http://192.168.189.142,http://localhost,http://192.168.0.252,http://121.201.66.221,http://192.168.2.4,http://192.168.0.14";
//        Assert.hasText(url, "获取不到允许请求的配置地址");
        url = StringUtil.defaultIfBlank(url, "http://localhost");
        this.verifyReferer = StringUtil.split(url, SEPARATE_COMMA);
    }
}

package cs.controller.mobile;

import java.io.IOException;

import javax.servlet.FilterChain;
import javax.servlet.ServletException;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.web.filter.OncePerRequestFilter;

public class MobileFilter extends OncePerRequestFilter{

	@Override
	protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
			throws ServletException, IOException {
		HttpServletRequest httpServletRequest = (HttpServletRequest)request;
        HttpServletResponse httpServletResponse = (HttpServletResponse)response;
        httpServletResponse.setHeader("Access-Control-Allow-Headers","Origin, X-Requested-With, Content-Type, Accept");
        httpServletResponse.setHeader("Access-Control-Allow-Methods","GET, POST, PUT");
        httpServletResponse.setHeader("Access-Control-Allow-Origin","*");
        String callKey = request.getParameter("callKey");
        if(callKey == null || callKey.isEmpty() || !callKey.equals("5DF50E30-B215-45BC-B361-776AE1D09994")){
            //验证未通过
            httpServletResponse.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            httpServletResponse.flushBuffer();
            return ;
        }

        filterChain.doFilter(request,response);

		
	}

}

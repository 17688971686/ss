package cs.common;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.ResponseStatus;

import cs.service.framework.RoleServiceImpl;

import org.apache.shiro.authz.AuthorizationException;
import org.apache.shiro.authz.UnauthenticatedException;

@ControllerAdvice
public class GlobalDefaultExceptionHandler {
    private static Logger logger = Logger.getLogger(GlobalDefaultExceptionHandler.class);

    public static final String DEFAULT_ERROR_VIEW = "error";

    @Autowired
    private HttpServletRequest request;

    @ExceptionHandler(value = IllegalArgumentException.class)
//    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    @ResponseBody
    public Response illegalErrorHandler(IllegalArgumentException e) {
        logger.error("错误处理, URL[" + request.getRequestURI() + "]", e.getCause());
        Response response = new Response();
        response.setMessage(e.getMessage());
        response.setStatus(555);
        return response;
    }

    @ExceptionHandler(value = {UnauthenticatedException.class, AuthorizationException.class})
    @ResponseStatus(value = HttpStatus.UNAUTHORIZED)
    public String unAuthErrorHandler(Exception e) {
        logger.error("无权限访问, URL[" + request.getRequestURI() + "]", e.getCause());
        //获取当前的请求url
        String url = request.getServletPath();
        String[] urls = url.split("\\/");
        if (urls[1].equals("management")) {
            return "forward:/adminLogin";
        } else {
            return "forward:/";
        }
    }

    @ExceptionHandler(value = Exception.class)
//    @ResponseStatus(value = HttpStatus.INTERNAL_SERVER_ERROR)
    public void errorHandler(Exception e) throws Exception {
        logger.error("通用错误处理, URL[" + request.getRequestURI() + "]", e.getCause());
        e.printStackTrace();
        throw e;

        // If the exception is annotated with @ResponseStatus rethrow it and let
        // the framework handle it - like the OrderNotFoundException example
        // at the start of this post.
        // AnnotationUtils is a Spring Framework utility class.
        // if (AnnotationUtils.findAnnotation(e.getClass(),
        // ResponseStatus.class) != null)
        // throw e;

        // // Otherwise setup and send the user to a default error-view.
        // ModelAndView mav = new ModelAndView();
        // mav.addObject("exception", e);
        // mav.addObject("url", req.getRequestURL());
        // mav.setViewName(DEFAULT_ERROR_VIEW);
        // return mav;
    }
}

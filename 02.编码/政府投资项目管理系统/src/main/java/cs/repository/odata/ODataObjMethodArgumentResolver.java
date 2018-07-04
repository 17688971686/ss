package cs.repository.odata;

import javax.servlet.http.HttpServletRequest;

import org.springframework.core.MethodParameter;
import org.springframework.web.bind.support.WebDataBinderFactory;
import org.springframework.web.context.request.NativeWebRequest;
import org.springframework.web.method.support.HandlerMethodArgumentResolver;
import org.springframework.web.method.support.ModelAndViewContainer;

/**
 * Description: 自定义参数绑定（针对OdataCriteria）
 * @Author: tzg
 * @Date: 2017/7/26 10:26
 */
public class ODataObjMethodArgumentResolver implements HandlerMethodArgumentResolver {

    @Override
    public boolean supportsParameter(MethodParameter parameter) {
        Class cls = parameter.getParameterType();
        return (ODataObj.class).equals(cls) || (ODataObjNew.class).equals(cls);
    }

    @Override
    public Object resolveArgument(MethodParameter parameter, ModelAndViewContainer mavContainer, NativeWebRequest webRequest, WebDataBinderFactory binderFactory) throws Exception {
        HttpServletRequest request = webRequest.getNativeRequest(HttpServletRequest.class);
        if ((ODataObjNew.class).equals(parameter.getParameterType())) {
            return new ODataObjNew(request);
        }
        return new ODataObj(request);
    }

}
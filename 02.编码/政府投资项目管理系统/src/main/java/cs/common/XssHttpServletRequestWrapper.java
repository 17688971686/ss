package cs.common;


import cs.service.impl.CodingPlatformServiceImpl;
import org.apache.log4j.Logger;
import org.springframework.util.StringUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletRequestWrapper;
import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;

/**
 * Created by lqs on 2017/8/17.
 */
public class XssHttpServletRequestWrapper extends HttpServletRequestWrapper{
    private static Logger logger = Logger.getLogger(XssHttpServletRequestWrapper.class);
    /**
     * Constructs a request object wrapping the given request.
     *
     * @param request
     * @throws IllegalArgumentException if the request is null
     */

    private static String key = "exec|insert|select|delete|update|*|%|chr|mid|master|truncate|char|declare|or|-|+";
    private static Set<String> notAllowedKeyWords = new HashSet<String>(0);
    private static String replacedString="INVALID";
    static {
        String keyStr[] = key.split("\\|");
        for (String str : keyStr) {
            notAllowedKeyWords.add(str);
        }
    }

    private String currentUrl;

    public XssHttpServletRequestWrapper(HttpServletRequest servletRequest) {
        super(servletRequest);
        currentUrl = servletRequest.getRequestURI();
    }


    /**覆盖getParameter方法，将参数名和参数值都做xss过滤。
     * 如果需要获得原始的值，则通过super.getParameterValues(name)来获取
     * getParameterNames,getParameterValues和getParameterMap也可能需要覆盖
     */
    @Override
    public String getParameter(String parameter) {
        String value = super.getParameter(parameter);
        if (value == null) {
            return null;
        }
        return cleanXSS(value);
    }
    @Override
    public String[] getParameterValues(String parameter) {
        String[] values = super.getParameterValues(parameter);
        if (values == null) {
            return null;
        }
        int count = values.length;
        String[] encodedValues = new String[count];
        for (int i = 0; i < count; i++) {
            encodedValues[i] = cleanXSS(values[i]);
        }
        return encodedValues;
    }
    @Override
    public Map<String, String[]> getParameterMap(){
        Map<String, String[]> values=super.getParameterMap();
        if (values == null) {
            return null;
        }
        Map<String, String[]> result=new HashMap<>();
        for(String key:values.keySet()){
            String encodedKey=cleanXSS(key);
            int count=values.get(key).length;
            String[] encodedValues = new String[count];
            for (int i = 0; i < count; i++){
                encodedValues[i]=cleanXSS(values.get(key)[i]);
            }
            result.put(encodedKey,encodedValues);
        }
        return result;
    }
    /**
     * 覆盖getHeader方法，将参数名和参数值都做xss过滤。
     * 如果需要获得原始的值，则通过super.getHeaders(name)来获取
     * getHeaderNames 也可能需要覆盖
     */
    @Override
    public String getHeader(String name) {
        String value = super.getHeader(name);
        if (value == null) {
            return null;
        }
        return cleanXSS(value);
    }

    private  String cleanXSS(String valueP) {
        // You'll need to remove the spaces from the html entities below
        String value = valueP.replaceAll("<", "&lt;").replaceAll(">", "&gt;");
        value = value.replaceAll("<", "& lt;").replaceAll(">", "& gt;");
//        value = value.replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;");
//        value = value.replaceAll("'", "& #39;");

        value = value.replaceAll("eval\\((.*)\\)", "");
        value = value.replaceAll("[\\\"\\\'][\\s]*javascript:(.*)[\\\"\\\']", "\"\"");
        value = value.replaceAll("script", "")
                .replaceAll("javascript", "")
                .replaceAll("alert", "")
                .replaceAll("select", "")
                .replaceAll("update", "")
                .replaceAll("delete", "")
                .replaceAll("insert", "")
                .replaceAll("drop", "")
//                .replaceAll("create", "")
                .replaceAll("vbscript", "")
                .replaceAll("href", "")
                .replaceAll("input", "")
                .replaceAll("return", "")
                .replaceAll("debugger", "")

                .replaceAll("trancate", "")
                .replaceAll("into", "")
                .replaceAll("ascii", "")
                .replaceAll("declare", "")
                .replaceAll("exec", "")
                .replaceAll("master", "")

                .replaceAll("execute", "")
                .replaceAll("frame", "")
                .replaceAll("img", "")
                .replaceAll("iframe", "");
        value = cleanSqlKeyWords(value);
        return value;
    }

    private String cleanSqlKeyWords(String value) {
        String paramValue = value;
        for (String keyword : notAllowedKeyWords) {
            if (paramValue.length() > keyword.length() + 4
                    && (paramValue.contains(" "+keyword)||paramValue.contains(keyword+" ")||paramValue.contains(" "+keyword+" "))) {
                paramValue = StringUtils.replace(paramValue, keyword, replacedString);
                logger.error(this.currentUrl + "已被过滤，因为参数中包含不允许sql的关键词(" + keyword
                        + ")"+";参数："+value+";过滤后的参数："+paramValue);
            }
        }
        return paramValue;
    }
//    public XssHttpServletRequestWrapper(HttpServletRequest request) {
//        super(request);
//    }
//
//    public String[] getParameterValues(String parameter) {
//        String[] values = super.getParameterValues(parameter);
//        if (values==null)  {
//            return null;
//        }
//        int count = values.length;
//        String[] encodedValues = new String[count];
//        for (int i = 0; i < count; i++) {
//            encodedValues[i] = cleanXSS(values[i]);
//        }
//        return encodedValues;
//    }
//    public String getParameter(String parameter) {
//        String value = super.getParameter(parameter);
//        if (value == null) {
//            return null;
//        }
//        return cleanXSS(value);
//    }
//    public String getHeader(String name) {
//        String value = super.getHeader(name);
//        if (value == null)
//            return null;
//        return cleanXSS(value);
//    }
//    private static  String cleanXSS(String value) {
//        //You'll need to remove the spaces from the html entities below
//        value = value.replaceAll("<", "& lt;")
//                .replaceAll(">", "& gt;");
//
//        //value = value.replaceAll("\\(", "& #40;").replaceAll("\\)", "& #41;");
//        //value = value.replaceAll("'", "& #39;");
//        value = value.replaceAll("eval\\((.*)\\)", "");
//        value = value.replaceAll("[\\\"\\\'][\\s]*JavaScript:(.*)[\\\"\\\']", "\"\"");
//        value = value.replaceAll("script", "")
//                .replaceAll("javascript", "")
//                .replaceAll("alert", "")
//                .replaceAll("select", "")
//                .replaceAll("update", "")
//                .replaceAll("delete", "")
//                .replaceAll("insert", "")
//                .replaceAll("drop", "")
////                .replaceAll("create", "")
//                .replaceAll("vbscript", "")
//                .replaceAll("href", "")
//                .replaceAll("input", "")
//                .replaceAll("return", "")
//                .replaceAll("debugger", "")
//
//                .replaceAll("trancate", "")
//                .replaceAll("into", "")
//                .replaceAll("ascii", "")
//                .replaceAll("declare", "")
//                .replaceAll("exec", "")
//                .replaceAll("master", "")
//
//                .replaceAll("execute", "")
//                .replaceAll("frame", "")
//                .replaceAll("img", "")
//                .replaceAll("iframe", "")
//
//        ;
//        return value;
//    }
//
//    public static  void main(String[] a){
//        String b = cleanXSS("asdasdas<asd><<<>>&^%$&(*^%$$%deleteasdasd deleteasd");
//        System.out.println(b);
//    }

}

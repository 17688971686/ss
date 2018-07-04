package cs.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sn.framework.common.StringUtil;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.io.PrintWriter;

import static com.sn.framework.common.StringUtil.UTF_8;

/**
 * Description: 基础工具类
 *
 * @author: tzg
 * @date: 2018/7/4 19:19
 */
public class SNKit {
    private static Logger logger = Logger.getLogger(SNKit.class);

    /**
     * 判断是否json的响应
     *
     * @param request
     * @return
     */
    public static boolean isJsonContent(HttpServletRequest request) {
        String accept = request.getHeader("Accept");
        if (StringUtil.isNotBlank(accept)) {
            return accept.contains(MediaType.APPLICATION_JSON_VALUE);
        }
        String x = request.getContentType();
        return StringUtil.isNotBlank(x) && x.contains(MediaType.APPLICATION_JSON_VALUE);
    }

    /**
     * 返回JSON数据格式的信息
     *
     * @param response
     * @param httpStatus
     * @param result
     * @throws IOException
     */
    public static void printJsonMsg(HttpServletResponse response, HttpStatus httpStatus, Object result) {
        if (logger.isDebugEnabled()) {
            logger.debug("返回json格式的消息");
        }
        response.setContentType(MediaType.APPLICATION_JSON_UTF8_VALUE);
        response.setCharacterEncoding(UTF_8.name());
        response.setHeader("Charset", UTF_8.name());
        response.setHeader("Cache-Control", "no-cache");
        response.setStatus(httpStatus.value());
        PrintWriter writer = null;
        try {
            writer = response.getWriter();
            if (result instanceof CharSequence) {
                writer.print(result);
            } else {
                writer.print(JacksonUtils.objectToString(result));
            }
            writer.flush();
        } catch (JsonProcessingException e) {
            logger.error("响应消息转换失败", e);
        } catch (IOException e) {
            logger.error("响应处理失败", e);
        } finally {
            if (null != writer) {
                writer.close();
                try {
                    response.flushBuffer();
                } catch (IOException e) {
                    logger.error("响应异常", e);
                }
            }
        }
    }

}

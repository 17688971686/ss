package cs.common;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.sn.framework.common.SnRuntimeException;
import com.sn.framework.common.StringUtil;
import org.apache.log4j.Logger;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.util.Assert;
import org.springframework.util.FileCopyUtils;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import java.io.*;

import static com.sn.framework.common.StringUtil.GBK;
import static com.sn.framework.common.StringUtil.ISO_8859_1;
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
     * 密码加密
     *
     * @param username
     * @param password
     * @param passwordSalt
     * @return
     */
    public static String decodePwd(String username, String password, String passwordSalt) {
        if (logger.isDebugEnabled()) {
            logger.debug("对用户密码进行加密");
        }
        //组装MD5密码,形式（ MD5（MD5(PASSWORD+SALT2))））
        String salt2 = AZDGUtils.md5(passwordSalt, username);
        password = AZDGUtils.md5(password, password + salt2, 2);
        return password;
    }

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

    /**
     * 获取系统基础路径
     *
     * @param request
     * @return
     */
    public static String getBasePath(HttpServletRequest request) {
        String scheme = request.getScheme();
        String serverName = request.getServerName();
        int port = request.getServerPort();
        String path = request.getContextPath();
        if (port != 80) {
            path = ":" + port + path;
        }
        return scheme + "://" + serverName + path;
    }

    /**
     * 文件下载
     *
     * @param response
     * @param inputStream
     */
    public static void fileDownload(HttpServletResponse response, InputStream inputStream) {
        try {
            FileCopyUtils.copy(inputStream, response.getOutputStream());

        } catch (IOException e) {
//            e.printStackTrace();
            throw new SnRuntimeException("文件下载失败", e.getCause());
        }
    }

    /**
     * 文件下载
     *
     * @param response
     * @param outFile
     */
    public static void fileDownload(HttpServletResponse response, File outFile) {
        Assert.notNull(outFile, "缺少参数");
        if (!outFile.exists()) {
            logger.warn("硬盘上不存在文件 {}"+outFile.getName());
            throw new SnRuntimeException(String.format("找不到【%s】文件", outFile.getName()));
        }
        response.addHeader("Content-Length", "" + outFile.length());  //返回头 文件大小
        InputStream inputStream = null;
        try {
            inputStream = new FileInputStream(outFile);
        } catch (FileNotFoundException e) {
            logger.error("文件不存在 {}", e);
        }
        fileDownload(response, inputStream);
    }

    /**
     * 文件下载
     *
     * @param response     请求响应对象
     * @param outFile      下载的文件对象
     * @param originalName 文件原始名称
     * @throws IOException
     */
    public static void fileDownload(HttpServletRequest request, HttpServletResponse response, File outFile, String originalName) {
        response.setCharacterEncoding(UTF_8.name());
        response.setContentType(MediaType.APPLICATION_OCTET_STREAM_VALUE);
        String filename = null, userAgent = request.getHeader("user-agent");
        if (userAgent.indexOf("MSIE") != -1 || userAgent.indexOf("Trident") != -1 || userAgent.indexOf("Edge") != -1) {     // ie
            filename = new String(originalName.getBytes(GBK), ISO_8859_1);
        } else {
            filename = new String(originalName.getBytes(UTF_8), ISO_8859_1);
        }
        response.setHeader("Content-disposition", "attachment;filename=" + filename);
        fileDownload(response, outFile);
    }


}

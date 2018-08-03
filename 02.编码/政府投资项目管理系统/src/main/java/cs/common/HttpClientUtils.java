package cs.common;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;

import javax.servlet.http.HttpServletRequest;

public class HttpClientUtils {
	public static String getHttpReturn(HttpServletRequest request,String url1) {
		String str = "";
        try {
            URL url = new URL(url1);    // 把字符串转换为URL请求地址
            HttpURLConnection connection = (HttpURLConnection) url.openConnection();// 打开连接
            connection.connect();// 连接会话
            // 获取输入流,并指定字符集,如若不指定会有乱码问题
            BufferedReader br = new BufferedReader(new InputStreamReader(connection.getInputStream() , "utf-8"));
            String line;
            StringBuilder sb = new StringBuilder();
            while ((line = br.readLine()) != null) {// 循环读取流
                sb.append(line);
            }
            br.close();// 关闭流
            connection.disconnect();// 断开连接
            str = sb.toString();
        } catch (Exception e) {
            e.printStackTrace();
            System.out.println("失败!");
        }
        return str;
    }
}

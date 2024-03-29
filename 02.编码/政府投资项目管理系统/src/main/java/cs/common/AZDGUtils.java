package cs.common;

import org.apache.shiro.crypto.hash.Md5Hash;

import java.io.IOException;
import java.security.MessageDigest;
import java.util.Random;

/**
 *  该类用于给sms的username和password用于AZDG加密
 *
 */
public class AZDGUtils {

    public static String encrypt(String txt, String key) {
        String encrypt_key = "0f9cfb7a9acced8a4167ea8006ccd098";
        int ctr = 0;
        String tmp = "";
        int i;
        for (i = 0; i < txt.length(); i++) {
            ctr = (ctr == encrypt_key.length()) ? 0 : ctr;
            tmp = tmp + encrypt_key.charAt(ctr)
                    + (char) (txt.charAt(i) ^ encrypt_key.charAt(ctr));
            ctr++;
        }

        return base64_encode(key(tmp, key));
    }

    /**
     * 解密算法
     */
    public static String decrypt(String cipherText, String key) {
        // base64解码
        try{
            cipherText = base64_decode(cipherText);
            cipherText = key(cipherText, key);
            String tmp = "";
            for (int i = 0; i < cipherText.length(); i++) {
                int c = cipherText.charAt(i) ^ cipherText.charAt(i + 1);
                String x = "" + (char) c;

                tmp += x;
                i++;
            }
            return tmp;
        }catch(Exception e){
            e.printStackTrace();
            return "fffggg";
        }
    }

    public static String key(String txt, String encrypt_key) {
        encrypt_key = strMD5(encrypt_key);
        int ctr = 0;
        String tmp = "";
        for (int i = 0; i < txt.length(); i++) {
            ctr = (ctr == encrypt_key.length()) ? 0 : ctr;
            int c = txt.charAt(i) ^ encrypt_key.charAt(ctr);
            String x = "" + (char) c;
            tmp = tmp + x;
            ctr++;
        }
        return tmp;
    }

    public  static String base64_encode(String str) {
        return new sun.misc.BASE64Encoder().encode(str.getBytes());
    }

    public static String base64_decode(String str) {
        sun.misc.BASE64Decoder decoder = new sun.misc.BASE64Decoder();
        if (str == null)
            return null;
        try {
            return new String(decoder.decodeBuffer(str));
        } catch (IOException e) {
            e.printStackTrace();
            return null;
        }
    }

    public static final String strMD5(String s) {
        char hexDigits[] = {'0', '1', '2', '3', '4', '5', '6', '7', '8', '9',
                'a', 'b', 'c', 'd', 'e', 'f'};
        try {
            byte[] strTemp = s.getBytes();
            MessageDigest mdTemp = MessageDigest.getInstance("MD5");
            mdTemp.update(strTemp);
            byte[] md = mdTemp.digest();
            int j = md.length;
            char str[] = new char[j * 2];
            int k = 0;
            for (int i = 0; i < j; i++) {
                byte byte0 = md[i];
                str[k++] = hexDigits[byte0 >>> 4 & 0xf];
                str[k++] = hexDigits[byte0 & 0xf];
            }
            return new String(str);
        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * md5加密
     * @param str
     * @param salt
     * @return
     */
    public static String md5(String str,String salt){
        return new Md5Hash(str, salt).toString();
    }

    /**
     * md5加密(散列次数)
     * @param str
     * @param salt
     * @return
     */
    public static String md5(String str,String salt, int hashIterations){
        return new Md5Hash(str, salt, hashIterations).toString();
    }

}

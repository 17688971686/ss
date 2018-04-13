package cs.common;

import org.apache.commons.lang3.StringUtils;
import org.springframework.util.Assert;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * 字符串工具类
 *
 * @author ldm
 */
public class StringUtil extends StringUtils {

    /**
     * 获取特定格式的日期字符串
     *
     * @param date
     * @return
     */
    public static String formatDate(Date date) {
        return formatDate(date, "yyyy/MM/dd HH:mm:ss");
    }

    /**
     * 按格式字符串格式化日期
     *
     * @param date
     * @param format
     * @return
     */
    public static String formatDate(Date date, String format) {
        Assert.hasText(format, "缺少日期格式参数");
        return new SimpleDateFormat(format).format(date);
    }

    private final static Pattern FORMAT_COLON_PATTERN = Pattern.compile("\\:\\w+");

    /**
     * 格式字符串（冒号加对象的字段名）
     * @param str               带占位符的字符串
     * @param object            获取数据的实体对象
     * @param ignoreProperties  忽略的属性
     * @return
     */
    public static String formatColon(String str, Object object, String... ignoreProperties) {
        if (isNotBlank(str) && str.contains(":")) {
            Matcher matcher = FORMAT_COLON_PATTERN.matcher(str);
            String fieldname, ip;
            ff: while (matcher.find()) {
                fieldname = matcher.group();
                ipf: for (int i = 0, len = ignoreProperties.length; i < len; i++) {
                    ip = ignoreProperties[i];
                    if (StringUtil.isNotBlank(ip) && fieldname.substring(1).equals(ip)) {
                        str = str.replaceAll(fieldname, "");
                        continue ff;
                    }
                }
                try {
                    str = str.replaceAll(fieldname, ObjectUtils.getFieldValue(object, fieldname.substring(1)));
                } catch (Exception e) {
                    str = str.replaceAll(fieldname, "");
                }
            }
        }
        return str;
    }

    /**
     * 首字母大写
     *
     * @param str
     * @return
     */
    public static String upperCaseFirst(String str) {
        if (isBlank(str)) {
            return str;
        }
        char f = str.charAt(0);
        if (Character.isUpperCase(f)) {
            return str;
        } else {
            return (new StringBuilder()).append(Character.toUpperCase(f)).append(str.substring(1)).toString();
        }
    }

    public static String lowerCaseFirst(String str) {
        if (isBlank(str)) {
            return str;
        }
        char f = str.charAt(0);
        if (Character.isUpperCase(f)) {
            return str;
        } else {
            return (new StringBuilder()).append(Character.toLowerCase(f)).append(str.substring(1)).toString();
        }
    }

    private final static Pattern wordPattern = Pattern.compile("\\w"),
            fieldWordPattern = Pattern.compile("[\\w|\\/|\\.|\\+]"),
            numberPattern = Pattern.compile("[\\d|\\.]");

    public static boolean isWord(String word) {
        return wordPattern.matcher(word).find();
    }

    public static boolean isFieldWord(String fieldName) {
        return fieldWordPattern.matcher(fieldName).find();
    }

    public static boolean isNumber(String value) {
        return numberPattern.matcher(value).find();
    }

    public final static long BASIC = 0xcbf29ce484222325L;
    public final static long PRIME = 0x100000001b3L;

    public static long fnv1a_64_lower(String key) {
        long hashCode = BASIC;
        for (int i = 0; i < key.length(); ++i) {
            char ch = key.charAt(i);

            if (ch >= 'A' && ch <= 'Z') {
                ch = (char) (ch + 32);
            }

            hashCode ^= ch;
            hashCode *= PRIME;
        }

        return hashCode;
    }

}

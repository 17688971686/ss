package cs.common;

import java.text.SimpleDateFormat;
import java.util.Date;

public class Util {
	public static String formatDate(Date date) {
		return new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(date);
	}
	public static String generateFileName(String fileName) {
		return (new SimpleDateFormat("yyyyMMdd_HHmmssS").format(new Date()))+"_"+fileName;
	}
}

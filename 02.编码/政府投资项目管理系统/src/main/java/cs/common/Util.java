package cs.common;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.springframework.integration.annotation.Publisher;

public class Util {
	public static String formatDate(Date date) {
		String dateStr="";
		if(date!=null){
			dateStr=new SimpleDateFormat("yyyy/MM/dd HH:mm:ss").format(date);
		}
		return dateStr;
	}
	public static String formatDate(Date date,String format) {
		String dateStr="";
		if(date!=null){
			dateStr=new SimpleDateFormat(format).format(date);
		}
		return dateStr;
	}
	public static String getDay(Date date){
		int day=date.getDay();
		String dayStr="";
		switch (day) {
		case 1:
			dayStr= "星期一";
			break;
		case 2:
			dayStr=  "星期二";
			break;
		case 3:
			dayStr=  "星期三";
			break;
		case 4:
			dayStr=  "星期四";
			break;
		case 5:
			dayStr=  "星期五";
			break;
		case 6:
			dayStr=  "星期六";
			break;
		case 0:
			dayStr=  "星期日";
			break;
		}
		return dayStr;
	}
	public static String generateFileName(String fileName) {
		return (new SimpleDateFormat("yyyyMMdd_HHmmssS").format(new Date()))+"_"+fileName;
	}
	
}

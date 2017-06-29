package cs.common;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

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
	
  public static String getFourRandom(){
        Random random = new Random();
        String fourRandom = random.nextInt(10000) + "";
        int randLength = fourRandom.length();
        if(randLength<4){
          for(int i=1; i<=4-randLength; i++)
              fourRandom = "0" + fourRandom  ;
      }
        return fourRandom;
    }
  
  public static String getFiveRandom(){
      Random random = new Random();
      String fiveRandom = random.nextInt(100000) + "";
      int randLength = fiveRandom.length();
      if(randLength<5){
        for(int i=1; i<=5-randLength; i++)
        	fiveRandom = "0" + fiveRandom  ;
    }
      return fiveRandom;
  } 
	
	public static String getProjectNumber(String type,String stage){
		String number = "";
		//投资类型
		if(type.equals(BasicDataConfig.projectInvestmentType_ZF)){//政府投资
			number += "Z";
			//项目阶段			
			if(stage.equals(BasicDataConfig.projectStage_qianqichubei)){
				number += "1";
			}else if(stage.equals(BasicDataConfig.projectStage_qianqi)){
				number += "2";
			}else if(stage.equals(BasicDataConfig.projectStage_shigong)){
				number += "3";
			}else if(stage.equals(BasicDataConfig.projectStage_tinggong)){
				number += "4";
			}else if(stage.equals(BasicDataConfig.projectStage_jungong)){
				number += "5";
			}else if(stage.equals(BasicDataConfig.projectStage_gudingzicandengji)){
				number += "6";
			}
			//年份
			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
			number += format.format(new Date());
			//行业
			number += "HY";//TODO 怎样实现行业的分类
			//该行业申报数量的系列号
			number += getFourRandom();//TODO 怎样实现数字不同?
			//间隔符
			number += "-";
			//可研辅助码
			number += "XX";//TODO
			//间隔符
			number += "-";
			//概算辅助码
			number += "XX";
		}else if(type.equals(BasicDataConfig.projectInvestmentType_SH)){//社会投资
			number += "S";
			//年份
			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
			number += format.format(new Date());
			//行业
			number += "HYH";//TODO 怎样实现行业的分类
			//该行业申报数量的系列号
			number += getFiveRandom();//TODO 怎样实现数字不同?
		}				
		return number;
	}
	
}

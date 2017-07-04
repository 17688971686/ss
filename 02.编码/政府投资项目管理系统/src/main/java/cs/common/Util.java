package cs.common;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Random;

import cs.domain.BasicData;
import cs.model.DomainDto.BasicDataDto;

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
	
  public static String getFourNumber(Integer count){
	  String rend = String.valueOf(count);
	  int randLength = rend.length();
        if(randLength<4){
          for(int i=1; i<=4-randLength; i++)
        	  rend = "0" + rend  ;
      }     
        return rend;
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
	
  	/**
  	 * 
  	 * @Description：创建项目代码
  	 * @author： cx
  	 * @Date： 2017年7月4日
  	 * @version: 0.1
  	 */
	public static String getProjectNumber(String type,BasicData basicData){
		String number = "";
		//投资类型
		if(type.equals(BasicDataConfig.projectInvestmentType_ZF)){//政府投资
			number += "Z";
			//项目申报阶段(默认为项目建议书)						
			number += "1";			
			//年份
			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
			number += format.format(new Date());
			//根据行业id查询行业代码以及项目数量					
			number += basicData.getComment();
			//该行业申报数量的系列号
			number += getFourNumber(basicData.getCount()+1);			
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

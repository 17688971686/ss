package cs.common;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.IOUtils;
import com.alibaba.fastjson.JSONObject;

import cs.domain.Attachment;
import cs.domain.BasicData;
import cs.model.ActionResult;
import cs.model.SendMsg;


public class Util {
	public static String judgeString(String str){
		String rStr = "";
		if(str !=null){
			return str;
		}else{
			return rStr;
		}
	}

	public static boolean isNotNull(String str){
		Boolean obj = true;
		if(str == null || str.isEmpty()){
			obj = false;
		}
		return obj;
	}
	
	public static boolean isNull(String str){
		Boolean obj = false;
		if(str == null || str.isEmpty()){
			obj = true;
		}
		return obj;
	}

	public static String no(int i){
		switch (i) {
		case 1:
			return "一";
		case 2:
			return "二";
		case 3:
			return "三";
		case 4:
			return "四";
		case 5:
			return "五";
		case 6:
			return "六";
		case 7:
			return "七";
		case 8:
			return "八";
		case 9:
			return "九";
		case 10:
			return "十";
		case 11:
			return "十一";
		case 12:
			return "十二";
		case 13:
			return "十三";
		case 14:
			return "十四";
		case 15:
			return "十五";
		case 16:
			return "十六";
		case 17:
			return "十七";
		case 18:
			return "十八";
		case 19:
			return "十九";
		case 20:
			return "二十";
		case 21:
			return "二十一";
		case 22:
			return "二十二";
		case 23:
			return "二十三";
		case 24:
			return "二十四";
		case 25:
			return "二十五";
		case 26:
			return "二十六";
		case 27:
			return "二十七";
		case 28:
			return "二十八";
		case 29:
			return "二十九";
		case 30:
			return "三十";
		case 31:
			return "三十一";
		case 32:
			return "三十二";
		case 33:
			return "三十三";
		case 34:
			return "三十四";
		default:
			return null;
		}
			
		
	}
		
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
		@SuppressWarnings("deprecation")
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
//      if(randLength<6){
//	      for(int i=1; i<6-randLength; i++)
//	    	  rend = "0" + rend  ;
//      }     
        return rend;
    }
  
  public static String getFiveRandom(Integer count){
	  String rend = String.valueOf(count);
	  int randLength = rend.length();
	  if(randLength<5){
	     for(int i=1; i<=5-randLength; i++)
	    	 rend = "0" + rend  ;
	  }     
//      if(randLength<6){
//         for(int i=1; i<=6-randLength; i++)
//        	 rend = "0" + rend  ;
//      }     
        return rend;
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
			
//			//年份
//			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
//			number += format.format(new Date());
//			//440300为广东省 深圳市 行政区划代码
//			number += "-440300-"; 
//			number += basicData.getComment();
//			number += "Z";
//			number += getFourNumber(basicData.getCount()+1);
			
		}else if(type.equals(BasicDataConfig.projectInvestmentType_SH)){//社会投资
			number += "S";
			//年份
			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
			number += format.format(new Date());
			//行业
			number += basicData.getComment();
			//该行业申报数量的系列号
			number += getFiveRandom(basicData.getCount()+1);
			
			//年份
//			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
//			number += format.format(new Date());
//			//440300为广东省 深圳市 行政区划代码
//			number += "440300"; 
//			number += basicData.getComment();
//			number += "S";
//			number += getFourNumber(basicData.getCount()+1);
		}				
		return number;
	}
	
	/**
	 * 网络POST请求发送短信
	 * 
	 */
	public static ActionResult sendShortMessage(SendMsg sendMsg){
		ActionResult result = new ActionResult();
		try{
			//请求地址
			URL url=new URL(ConfigUtil.msgUrl);
			HttpURLConnection connection=(HttpURLConnection) url.openConnection();
			connection.setDoInput(true);
			connection.setDoOutput(true);
			connection.setRequestMethod("POST");
			//设置请求参数/返回信息的格式
			connection.setRequestProperty("Accept", "application/json");
	        connection.setRequestProperty("Content-Type", "application/json");
			
			OutputStream os=connection.getOutputStream();
			//请求体
			String soap = "{Pin:'"+ConfigUtil.msgPid+"',mobile:'"+sendMsg.getMobile()+"',content:'"+sendMsg.getContent()+"',formUser:'"+sendMsg.getFromUser()+"'}";
			os.write(soap.getBytes("UTF-8"));
			os.flush();
			InputStream is=connection.getInputStream();
			//将返回的数据转换为java对象
			JSONObject jsStr = JSONObject.parseObject(IOUtils.toString(is));
			result = (ActionResult) JSONObject.toJavaObject(jsStr,ActionResult.class);
			is.close();
			os.close();
		}catch (Exception e) {
			// TODO: handle exception
		}
		return result;	
	}
	
	/**
	 * Map数据比较
	 * @param map1 需要进行判断的map
	 * @param map2 进行比较的参照map
	 * @return 最终不同的结果map
	 */
	public static List<Map<String,Object>> getCheck(Map<String,Attachment> map1,Map<String,Object> map2){
		List<Map<String,Object>> listMap = new ArrayList<Map<String,Object>>();
		Boolean isSame = false;
		for (String key1 : map1.keySet()) {//遍历Map
			for(String key2 : map2.keySet()){
				if(Util.isNotNull(key1)){//如果key1不是空
					if(Util.isNotNull(key2)){//如果key2不是空
						if(key2.equals(key1)){//判断key是否相同--如果相同，则比较value
							if(map2.get(key2).equals(map1.get(key1).getName())){//判断value是否相同--如果相同
								isSame = true;
							}else{//判断value是否相同--如果不同
								isSame = false;
							}
						}else{//判断key是否相同--如果不同
							isSame = false;
						}
						if(isSame){//如果已有相同，则结束循环
							break;
						}
					}
				}else{//如果key为空，则直接比较value
					if(map2.get(key2).equals(map1.get(key1).getName())){//判断value是否相同--如果相同
						isSame = true;
					}else{//判断value是否相同--如果不同
						isSame = false;
					}
					if(isSame){//如果已有相同，则结束循环
						break;
					}
				}
				
			}
			if(!isSame){
				Map<String,Object> mapObj = new HashMap<>();
				mapObj.put(key1, map1.get(key1));
				listMap.add(mapObj);
			}
		}
		return listMap;
	}
}

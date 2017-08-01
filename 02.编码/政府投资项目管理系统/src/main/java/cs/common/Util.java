package cs.common;

import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import org.apache.commons.io.IOUtils;
import com.alibaba.fastjson.JSONObject;
import cs.domain.BasicData;
import cs.model.ActionResult;
import cs.model.SendMsg;

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
  
  public static String getFiveRandom(Integer count){
	  String rend = String.valueOf(count);
	  int randLength = rend.length();
        if(randLength<5){
          for(int i=1; i<=5-randLength; i++)
        	  rend = "0" + rend  ;
      }     
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
		}else if(type.equals(BasicDataConfig.projectInvestmentType_SH)){//社会投资
			number += "S";
			//年份
			SimpleDateFormat format = new SimpleDateFormat("yyyy"); // 时间字符串产生方式
			number += format.format(new Date());
			//行业
			number += basicData.getComment();
			//该行业申报数量的系列号
			number += getFiveRandom(basicData.getCount()+1);
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
	 * 导入Excel中的项目信息数据
	 */
	public static void importExcelProject(){
		
	}
	
	/**
	 * 读取Excel文件数据形成List集合
	 */
//	public static String readExcelFile(MultipartFile file){
//		 String result ="";  
//	        //创建处理EXCEL的类  
//	        ReadExcel readExcel=new ReadExcel();  
//	        //解析excel，获取上传的事件单  
//	        List<User> useList = readExcel.getExcelInfo(file);  
//	        //至此已经将excel中的数据转换到list里面了,接下来就可以操作list,可以进行保存到数据库,或者其他操作,  
//	        //和你具体业务有关,这里不做具体的示范  
//	        if(useList != null && !useList.isEmpty()){  
//	            result = "上传成功";  
//	        }else{  
//	            result = "上传失败";  
//	        }  
//	        return result;  
//	}
	
	/**
	 * 生成随机id
	 */
	public static String getUUID(){
		return UUID.randomUUID().toString();
	}
}

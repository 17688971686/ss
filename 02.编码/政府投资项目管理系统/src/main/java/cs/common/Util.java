package cs.common;

import java.awt.*;
import java.awt.image.BufferedImage;
import java.io.*;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLDecoder;
import java.text.DecimalFormat;
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

import javax.imageio.ImageIO;


/**
 * @author Administrator
 *基础工具类
 */
public class Util {
	
	public static boolean isIndexOf(List<String> ids ,String id){
		boolean rStr = false;
		return rStr;
	}
	
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
	public static String getProjectNumber(String type,BasicData basicData, int projectSequenceNumber){
		String number = "";
		number += new SimpleDateFormat("yyyy").format(new Date());
		number += "-";
		number += "440300";
		number += "-";
		if (type.equalsIgnoreCase(BasicDataConfig.projectInvestmentType_ZF))
			number += basicData.getComment();
		else
			number += basicData.getComment().substring(1, 2);
		number += "-";
		number += new DecimalFormat("000000").format(projectSequenceNumber);
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

	/**
	 * 根据获取JPG和PNG的宽高，判断是不是图片
	 * @param imageFile
	 * @return
	 */
	public static boolean isImage(File imageFile) {
		if (!imageFile.exists()) {
			return false;
		}
		Image img = null;
		try {
			img = ImageIO.read(imageFile);
			if (img == null || img.getWidth(null) <= 0 || img.getHeight(null) <= 0) {
				return false;
			}
			return true;
		} catch (Exception e) {
			return false;
		} finally {
			img = null;
		}
	}

	/**
	 * 添加图片水印
	 *
	 * @param srcImg 目标图片路径，如：C:\\kutuku.jpg
	 * @param waterImg 水印图片路径，如：C:\\kutuku.png
	 * @param x 水印图片距离目标图片左侧的偏移量，如果x<0, 则在正中间
	 * @param y 水印图片距离目标图片上侧的偏移量，如果y<0, 则在正中间
	 * @param alpha 透明度(0.0 -- 1.0, 0.0为完全透明，1.0为完全不透明)
	 * @throws IOException
	 */
	public final static void addWaterMark(String srcImg, String waterImg, int x, int y, float alpha) throws IOException {
		// 加载目标图片
		File file = new File(srcImg);
		String ext = srcImg.substring(srcImg.lastIndexOf(".") + 1);
		Image image = ImageIO.read(file);
		int width = image.getWidth(null);
		int height = image.getHeight(null);

		// 将目标图片加载到内存。
		BufferedImage bufferedImage = new BufferedImage(width, height, BufferedImage.TYPE_INT_RGB);
		Graphics2D g = bufferedImage.createGraphics();
		g.drawImage(image, 0, 0, width, height, null);

		// 加载水印图片。
		Image waterImage = ImageIO.read(new File(waterImg));
		int width_1 = waterImage.getWidth(null);
		int height_1 = waterImage.getHeight(null);
		// 设置水印图片的透明度。
		g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, alpha));

		// 设置水印图片的位置。
		int widthDiff = width - width_1;
		int heightDiff = height - height_1;
		if (x < 0) {
			x = widthDiff / 2;
		} else if (x > widthDiff) {
			x = widthDiff;
		}
		if (y < 0) {
			y = heightDiff / 2;
		} else if (y > heightDiff) {
			y = heightDiff;
		}

		// 将水印图片“画”在原有的图片的制定位置。
		g.drawImage(waterImage, x, y, width_1, height_1, null);
		// 关闭画笔。
		g.dispose();

		// 保存目标图片。
		ImageIO.write(bufferedImage, ext, file);
	}


	/**
	 * 给图片添加水印文字、可设置水印文字的旋转角度
	 * @param logoText 要写入的文字
	 * @param srcImgPath 源图片路径
	 * @param newImagePath 新图片路径
	 * @param degree 旋转角度
	 * @param color  字体颜色
	 * @param formaName 图片后缀
	 */
	public static void markImageByText(String logoText, String srcImgPath,String newImagePath,Integer degree,Color color,String formaName) {
		InputStream is = null;
		OutputStream os = null;
		try {
			// 1、源图片
			java.awt.Image srcImg = ImageIO.read(new File(srcImgPath));
			BufferedImage buffImg = new BufferedImage(srcImg.getWidth(null),srcImg.getHeight(null), BufferedImage.TYPE_INT_RGB);
			// 2、得到画笔对象
			Graphics2D g = buffImg.createGraphics();
			// 3、设置对线段的锯齿状边缘处理
			g.setRenderingHint(RenderingHints.KEY_INTERPOLATION,RenderingHints.VALUE_INTERPOLATION_BILINEAR);
			g.drawImage(srcImg.getScaledInstance(srcImg.getWidth(null), srcImg.getHeight(null), java.awt.Image.SCALE_SMOOTH), 0, 0, null);
			// 4、设置水印旋转
			if (null != degree) {
				g.rotate(Math.toRadians(degree),  buffImg.getWidth()/2,buffImg.getHeight() /2);
			}
			// 5、设置水印文字颜色
			g.setColor(color);
			// 6、设置水印文字Font
			g.setFont(new java.awt.Font("宋体", java.awt.Font.BOLD, buffImg.getHeight() /2));
			// 7、设置水印文字透明度
			g.setComposite(AlphaComposite.getInstance(AlphaComposite.SRC_ATOP, 0f));
			// 8、第一参数->设置的内容，后面两个参数->文字在图片上的坐标位置(x,y)
			g.drawString(logoText,  buffImg.getWidth()/2 , buffImg.getHeight()/2);
			// 9、释放资源
			g.dispose();
			// 10、生成图片
			os = new FileOutputStream(newImagePath);
			ImageIO.write(buffImg, formaName, os);
		} catch (Exception e) {
			e.printStackTrace();
		} finally {
			try {
				if (null != is)
					is.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
			try {
				if (null != os)
					os.close();
			} catch (Exception e) {
				e.printStackTrace();
			}
		}
	}

//	public static void sendMsg (String telPhone,String content) throws SQLException{
//		String driverName="com.microsoft.sqlserver.jdbc.SQL.ServerDriver";//加载jdbc驱动
//		String dbURL ="jdbc:microsoft:sqlserver://221.179.18.102:1393;databaseName=DB_CustomSMS";//链接服务器和数据库
//		String username = "sa";
//		String password = "Infox4Sms3Sps2Was1!";
//		
//		String sql = "INSERT INTO tab1_SMSendTask(CreatorID,SmSendedNum,OperationType,SendType,OrgAddr,DestAddr,SM_content,SendTime,NeedStateReport"+
//		",ServiceID,FeeType,FeeCode,SMType,MassageID,DestAddrType,SubType,TaskStatus,SendLevel,SendState,TryTimes)"+
//				" VALUE('0009',0,'was',1','106575557786',"+telPhone+ ","+content+","+"getdate(),0,'EIES','01','000000',0,'',0,getdate(),0,0,0,3)";
//		
//		Connection dbcon = null;
//		Statement state;
//		ResultSet res = null;
//		
//		while(res.next()){
//			System.out.println(res.first());
//		}
//		
//		try {
//			Class.forName(driverName);
//			dbcon = DriverManager.getConnection(dbURL,username,password);
//			state= dbcon.createStatement();
//			res = state.executeQuery(sql);
//			
//		} catch (ClassNotFoundException e) {
//			// TODO Auto-generated catch block
//			e.printStackTrace();
//		} catch (SQLException e) {
//			// TODO Auto-generated catch block
//			System.out.println("数据库链接错误");
//			e.printStackTrace();
//		}finally{
//			if(dbcon != null){
//				dbcon.close();
//			}
//		}
//	}
//	
}

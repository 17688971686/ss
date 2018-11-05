package cs.repository.odata;

import java.sql.Connection;
import java.sql.DriverManager;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.sql.Statement;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

public class connectDB {
	
	public static void main(String[] args) {
        //声明Connection对象
        Connection con;
        //驱动程序名
        String driver = "com.mysql.cj.jdbc.Driver";
        //URL指向要访问的数据库名mydata
        String url = "jdbc:mysql://localhost:3306/gm_test?serverTimezone=GMT%2b8&useSSL=false&useUnicode=true&characterEncoding=utf8";
        //MySQL配置时的用户名
        String user = "root";
        //MySQL配置时的密码
        String password = "Passw0rd";
        //遍历查询结果集
        try {
            //加载驱动程序
            Class.forName(driver);
            //1.getConnection()方法，连接MySQL数据库！！
            con = DriverManager.getConnection(url,user,password);
            if(!con.isClosed())
                System.out.println("Succeeded connecting to the Database!");
            //2.创建statement类对象，用来执行SQL语句！！
            Statement statement = con.createStatement();
			Statement statement1  = con.createStatement();
			Statement statement2  = con.createStatement();

            //要执行的SQL语句
            String sql = "select * from cs_shenbaoinfo where yearPlanYearContent_id is null ";
            //3.ResultSet类，用来存放获取的结果集！！
            ResultSet rs = statement.executeQuery(sql);
             
            Object  id                                          = null;
            Object  projectConstrChar                           = null;
            Object  planYear                                    = null;
            Object  isApplyOutsideCapital                       = null;
            Object  applyOutsideCapital                         = null;
            Object  applyYearInvest                             = null;
            Object  capitalSCZ_ggys_TheYear                     = null;
            Object  capitalSCZ_gtzj_TheYear                     = null;
            Object  capitalSCZ_qita                             = null;
            Object  capitalOtherDescriptionShenBao              = null;
            Object  applyYearInvest_LastYear                    = null;
            Object  capitalSCZ_ggys_LastYear                    = null;
            Object  capitalSCZ_gtzj_LastYear                    = null;
            Object  capitalSCZ_qita_LastYear                    = null;
            Object  capitalOtherDescriptionShenBao_LastYear     = null;
            Object  applyYearInvest_LastTwoYear                 = null;
            Object  capitalSCZ_ggys_LastTwoYear                 = null;
            Object  capitalSCZ_gtzj_LastTwoYear                 = null;
            Object  capitalSCZ_qita_LastTwoYear                 = null; 
            Object  capitalOtherDescriptionShenBao_LastTwoYear  = null;  
            Object  yearConstructionContent                     = null;  
            Object  yearConstructionContentLastYear             = null;  
            Object  yearConstructionContentLastTwoYear          = null;  
            Object  apInvestSum                                 = null;  
            Object  yearConstructionContentShenBao              = null;

            Map<Object,String> map = new HashMap<Object,String>();

            while(rs.next()){
            	String year_id = null;
            	
            	id                                          =   rs.getObject("id");
            	projectConstrChar                           =   rs.getObject("projectConstrChar");
            	planYear                                    =   rs.getObject("planYear");
            	isApplyOutsideCapital                       =   rs.getObject("isApplyOutsideCapital");
            	applyOutsideCapital                         =   rs.getObject("applyOutsideCapital");
            	applyYearInvest                             =   rs.getObject("applyYearInvest");
            	capitalSCZ_ggys_TheYear                     =   rs.getObject("capitalSCZ_ggys_TheYear");
            	capitalSCZ_gtzj_TheYear                     =   rs.getObject("capitalSCZ_gtzj_TheYear");
            	capitalSCZ_qita                             =   rs.getObject("capitalSCZ_qita");
            	capitalOtherDescriptionShenBao              =   rs.getObject("capitalOtherDescriptionShenBao");
            	applyYearInvest_LastYear                    =   rs.getObject("applyYearInvest_LastYear");
            	capitalSCZ_ggys_LastYear                    =   rs.getObject("capitalSCZ_ggys_LastYear");
            	capitalSCZ_gtzj_LastYear                    =   rs.getObject("capitalSCZ_gtzj_LastYear");
            	capitalSCZ_qita_LastYear                    =   rs.getObject("capitalSCZ_qita_LastYear");
            	capitalOtherDescriptionShenBao_LastYear     =   rs.getObject("capitalOtherDescriptionShenBao_LastYear");
            	applyYearInvest_LastTwoYear                 =   rs.getObject("applyYearInvest_LastTwoYear");
            	capitalSCZ_ggys_LastTwoYear                 =   rs.getObject("capitalSCZ_ggys_LastTwoYear");
            	capitalSCZ_gtzj_LastTwoYear                 =   rs.getObject("capitalSCZ_gtzj_LastTwoYear");
            	capitalSCZ_qita_LastTwoYear                 =   rs.getObject("capitalSCZ_qita_LastTwoYear"); 
            	capitalOtherDescriptionShenBao_LastTwoYear  =   rs.getObject("capitalOtherDescriptionShenBao_LastTwoYear");  
            	yearConstructionContent                     =   rs.getObject("yearConstructionContent");  
            	yearConstructionContentLastYear             =   rs.getObject("yearConstructionContentLastYear");  
            	yearConstructionContentLastTwoYear          =   rs.getObject("yearConstructionContentLastTwoYear");  
            	apInvestSum                                 =   rs.getObject("apInvestSum");  
            	yearConstructionContentShenBao              =   rs.getObject("yearConstructionContentShenBao");
            	
            	String insertSql = " insert into cs_yearPlan_yearContent (" +
            			"id"+
            			",projectConstrChar" +
            			",capitalOtherDescriptionShenBao" +
            			",capitalOtherDescriptionShenBao_LastYear" +
            			",capitalOtherDescriptionShenBao_LastTwoYear" +
            			",yearConstructionContent" +
            			",yearConstructionContentLastYear" +
            			",yearConstructionContentLastTwoYear" +
            			",yearConstructionContentShenBao" +
            			
            			",planYear" +
            			",isApplyOutsideCapital" +
                        ",applyOutsideCapital" +
                        ",applyYearInvest" +
                        ",capitalSCZ_ggys_TheYear" +
                        ",capitalSCZ_gtzj_TheYear" +
                        ",capitalSCZ_qita" + 
                        ",applyYearInvest_LastYear" +
                        ",capitalSCZ_ggys_LastYear" +
                        ",capitalSCZ_gtzj_LastYear" +
                        ",capitalSCZ_qita_LastYear" +
                        ",applyYearInvest_LastTwoYear" +
                        ",capitalSCZ_ggys_LastTwoYear" +
                        ",capitalSCZ_gtzj_LastTwoYear" +
                        ",capitalSCZ_qita_LastTwoYear" +
                        ",apInvestSum)" +
            			" values ( ";
            	
            	year_id = UUID.randomUUID().toString();
            	
            	insertSql += "'"+ year_id +"'"; 
            	
            	if(projectConstrChar ==null || projectConstrChar.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'"+ projectConstrChar +"'";
            	}
            	if(capitalOtherDescriptionShenBao == null || capitalOtherDescriptionShenBao.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'"+ capitalOtherDescriptionShenBao  +"'";
            	}
            	
            	if(capitalOtherDescriptionShenBao_LastYear == null || capitalOtherDescriptionShenBao_LastYear.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + capitalOtherDescriptionShenBao_LastYear +"'";
            	}
            	
            	if(capitalOtherDescriptionShenBao_LastTwoYear == null || capitalOtherDescriptionShenBao_LastTwoYear.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + capitalOtherDescriptionShenBao_LastTwoYear +"'";
            	}
            	
            	if(yearConstructionContent == null || yearConstructionContent.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + yearConstructionContent +"'";
            	}
            	
            	if(yearConstructionContentLastYear == null || yearConstructionContentLastYear.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + yearConstructionContentLastYear +"'";
            	}
            	
            	if(yearConstructionContentLastTwoYear == null || yearConstructionContentLastTwoYear.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + yearConstructionContentLastTwoYear +"'";
            	}
            	
            	if(yearConstructionContentShenBao == null || yearConstructionContentShenBao.equals("")){
            		insertSql += ","+ null;
            	}else{
            		insertSql += ","+ "'" + yearConstructionContentShenBao +"'";
            	}
            	
            	insertSql += "," + planYear +","+
            			isApplyOutsideCapital  +","+
                        applyOutsideCapital  +","+
                        applyYearInvest  +","+
                        capitalSCZ_ggys_TheYear  +","+
                        capitalSCZ_gtzj_TheYear  +","+
                        capitalSCZ_qita + ","+ 
                        applyYearInvest_LastYear  +","+
                        capitalSCZ_ggys_LastYear  +","+
                        capitalSCZ_gtzj_LastYear  +","+
                        capitalSCZ_qita_LastYear  +","+
                        applyYearInvest_LastTwoYear +"," +
                        capitalSCZ_ggys_LastTwoYear  +","+
                        capitalSCZ_gtzj_LastTwoYear  +","+
                        capitalSCZ_qita_LastTwoYear +","+
                        apInvestSum+")";

            	boolean flag = statement1.execute(insertSql);
            	System.out.println(insertSql);
            	System.out.println(flag);
            	map.put(id,year_id);
            }
            rs.close();
			statement.close();
            statement1.close();

            boolean flag1;
            for (Object o : map.keySet()){
				String updateSql = "update cs_shenbaoinfo set yearPlanYearContent_id = '"+map.get(o)+"' where id = '"+o+"'";
				flag1 = statement2.execute(updateSql);
				System.out.println(updateSql);
				System.out.println(flag1);
			}
			statement2.close();

            con.close();
        } catch(ClassNotFoundException e) {   
            //数据库驱动类异常处理
            System.out.println("Sorry,can`t find the Driver!");   
            e.printStackTrace();   
            } catch(SQLException e) {
            //数据库连接失败异常处理
            e.printStackTrace();  
            }catch (Exception e) {
            e.printStackTrace();
        }finally{
            System.out.println("数据库数据成功获取！！");
        }
    }


}

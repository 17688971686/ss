package cs.common;

import java.text.ParseException;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

import javax.servlet.http.HttpServletRequest;

import org.apache.log4j.Logger;





public class ValidationSQLUtil {
	private static Logger logger = Logger.getLogger(ValidationSQLUtil.class);
	/** 
     * 判断参数是否含有攻击串 
     * @param value 
     * @return 
     */  
    public static boolean judgeSQLInject(String value){  
    	String testValue = value.toLowerCase();// 统一转为小写
        if(value == null || "".equals(value)){  
            return true;  
        }  
        String xssStr = "|declare|exec|and|or|select|update|delete|drop|truncate|count|drop|=|==|+|,|//|/| |\\|!=|";
//        String badStr = "'|and|exec|execute|insert|select|delete|update|count|drop|*|%|" + "|declare|sitename|net user|xp_cmdshell|;|or|-|+|,|like'|and|exec|execute|insert|drop|from|union|where|select|delete|update|order|by|count|*|mid|master|truncate|declare|or||=|;|-|--|+|,|like|//|/|%|#";
        String[] xssArr = xssStr.split("\\|");  
//        String[] badArr = badStr.split("\\|"); 
        boolean temp = false;
        int count =0;
        int length = xssArr.length;
        while (count>=0 && count<length-1) {
        	 String checkString = xssArr[count];
        	 count++;
        	 if(testValue.contains(checkString) && !checkString.isEmpty()){
        		  temp= true;  
        		  count=-1;
        		  logger.info("contains测试问题:  "+testValue);
        	 }
        	 if(count ==length ){
        		 break;
        	 }
		}
        return temp;  
    }
    public static void main(String[] args) {
    
    	String str = "id eq '1ad62007-7b35-444e-a498-647d9b7ee903''+or+'f'='f";
//    	str = "id%20eq%20%271986fc7a-2cc7-42ef-9d8c-680f02480c33%27" ;
    	try {
			boolean temp = ValidationSQLUtil.BuildObj(str);
			System.out.println("temp " +temp);
			
		} catch (ParseException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
	}
    public static boolean BuildObj(String filter)
			throws ParseException {
		if (filter != null && !filter.isEmpty()) {
			String[] filters = filter.split("and");
			for (String filterItem : filters) {
				filterItem = filterItem.trim();
				// handle like
				if (filterItem.contains("substringof")) {
					Pattern patternField = Pattern.compile(",(.*?)\\)");
					Pattern patternValue = Pattern.compile("'(.*?)'");
					Matcher matcherField = patternField.matcher(filterItem);
					Matcher matcherValue = patternValue.matcher(filterItem);
					if (matcherField.find() && matcherValue.find()) {
						if (ValidationSQLUtil.judgeSQLInject(matcherField.group(1))|| ValidationSQLUtil.judgeSQLInject(matcherValue.group(1))) {
							return true;
						}
					}

				}
				else {
					String[] filterItems = filterItem.split(" ");
					for(String str : filterItems){
						boolean bo = judgeSQLInject(str);
						if (bo) {
							
						}
					}
					if (filterItems.length == 3) {
						if (filterItems[2].toLowerCase().contains("datetime")) {// datetime
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						} 
						else if(filterItems[2].toLowerCase().contains("guid")){//guid
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
						else if (filterItems[2].contains("'")) {// string
							if (ValidationSQLUtil.judgeSQLInject(filterItems[2])) {
								return true;
							}
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1]) || ValidationSQLUtil.judgeSQLInject(filterItems[2])) {
								return true;
							}
							
						} else if(filterItems[2].equalsIgnoreCase("false")||filterItems[2].equalsIgnoreCase("true")){//boolean
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
						else {// int
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
					}else{
						return true;
					}
				}
			} // for
			
			
		} // if
		return false;
	}
    
    public static boolean BuildObj(HttpServletRequest request)
			throws ParseException {
		String filter = request.getParameter("$filter");
		if (filter != null && !filter.isEmpty()) {
			String[] filters = filter.split("and");
			for (String filterItem : filters) {
				filterItem = filterItem.trim();
				// handle like
				if (filterItem.contains("substringof")) {
					Pattern patternField = Pattern.compile(",(.*?)\\)");
					Pattern patternValue = Pattern.compile("'(.*?)'");
					Matcher matcherField = patternField.matcher(filterItem);
					Matcher matcherValue = patternValue.matcher(filterItem);
					if (matcherField.find() && matcherValue.find()) {
						if (ValidationSQLUtil.judgeSQLInject(matcherField.group(1))|| ValidationSQLUtil.judgeSQLInject(matcherValue.group(1))) {
							return true;
						}
					}
				}
				else {
					String[] filterItems = filterItem.split(" ");
					for(String str : filterItems){
						boolean bo = judgeSQLInject(str);
						if (bo) {
							return true;
						}
					}
					if (filterItems.length == 3) {
						if (filterItems[2].toLowerCase().contains("datetime")) {// datetime
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						} 
						else if(filterItems[2].toLowerCase().contains("guid")){//guid
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
						else if (filterItems[2].contains("'")) {// string
							if (ValidationSQLUtil.judgeSQLInject(filterItems[2])) {
								return true;
							}
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1]) || ValidationSQLUtil.judgeSQLInject(filterItems[2])) {
								return true;
							}
						} else if(filterItems[2].equalsIgnoreCase("false")||filterItems[2].equalsIgnoreCase("true")){//boolean
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
						else {// int
							if (ValidationSQLUtil.judgeSQLInject(filterItems[0])|| ValidationSQLUtil.judgeSQLInject(filterItems[1])) {
								return true;
							}
						}
					}else{
						return true;
					}
				}
			} // for
			
			
		} // if
		return false;
	}

}

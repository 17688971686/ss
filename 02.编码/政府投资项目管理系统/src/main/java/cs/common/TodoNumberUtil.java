package cs.common;

import org.apache.log4j.Logger;

import com.huasisoft.portal.util.HuasisoftUtil;


public class TodoNumberUtil {
	
	private static Logger logger = Logger.getLogger(TodoNumberUtil.class);

	 public static void handleTodoMasg(String eventIds) {
		 eventIds.substring(0, eventIds.length());
		 String[] eventIdList = eventIds.split(",");
		 for (int i = 0; i < eventIdList.length; i++) {
			String eventId = eventIdList[i].trim();
			try {
				Integer result1 = HuasisoftUtil.getBacklogManager().findByEventId(eventId);
				if(result1 == 105){
					Integer result = HuasisoftUtil.getBacklogManager().finishByEventId(eventId);
					if(result == 102){
						Integer result2 = HuasisoftUtil.getBacklogManager().deleteByEventId(eventId);
						if(result2 == 107){
							logger.info("待办删除成功!");
						}
						
					}else if(result1 == 104){
						logger.info("您在重复完成待办");
					}
				}else if(result1 == 102){
					logger.info("待办已完成");
				}else{
					logger.info("不存在待办");
				}
				
			} catch (Exception e1) {
				logger.info("统一待办处理失败！");
				e1.printStackTrace();
			}
		}
		 
	 }
	 
	 
}

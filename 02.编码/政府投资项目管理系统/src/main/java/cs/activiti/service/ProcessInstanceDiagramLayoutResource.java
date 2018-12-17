package cs.activiti.service;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.sn.framework.common.StringUtil;
import org.activiti.engine.ProcessEngine;
import org.activiti.engine.history.HistoricTaskInstance;
import org.activiti.engine.task.Comment;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;
import org.springframework.web.bind.annotation.RestController;

import com.fasterxml.jackson.databind.node.ObjectNode;

import cs.domain.framework.User;
import cs.service.framework.UserService;

@RestController
public class ProcessInstanceDiagramLayoutResource extends BaseProcessDefinitionDiagramLayoutResource {
	
  @Autowired
  private ProcessEngine processEngine;
	
  @Autowired
  private UserService userService;
	

	/**
	 * 页面获取已办流程图
	 * @param processDefinitionId 流程ID
	 * @return 流程图实例
	 */
  @RequestMapping(value="/process-instance/{processInstanceId}/diagram-layout", method = RequestMethod.GET, produces = "application/json")
  public ObjectNode getDiagram(@PathVariable String processInstanceId) {
    return getDiagramNode(processInstanceId, null);
  }
  
  /**
   * 流转记录
   * @param taskId
   * @param userId
   * @return
   */
  @SuppressWarnings("deprecation")
  @RequestMapping(value="/getHiComment", method = RequestMethod.GET, produces = "application/json")
  public @ResponseBody List<Object> getHiComment(@RequestParam String taskId,String userId) {
	  Calendar calendar = Calendar.getInstance();
	  List<Comment> comments = processEngine.getTaskService().getTaskComments(taskId);
	  List<Object> hisList = new ArrayList<>();
	  
	  HistoricTaskInstance task = processEngine.getHistoryService().createHistoricTaskInstanceQuery().taskId(taskId).singleResult();
	  
	  for(Comment com : comments){
			Map<String, String> map = new HashMap<>();
			
			map.put("name", task.getName());
			
			map.put("endTime", com.getTime().toLocaleString());
			map.put("msg", com.getFullMessage());
			
			String userId2 = com.getUserId();
			if(StringUtil.isNotBlank(userId2)) {
				User user = userService.findById(userId2);
				
				map.put("id",user.getDisplayName());
			}else {
				map.put("id","");
			}

			calendar.set(com.getTime().getYear(),com.getTime().getMonth(),com.getTime().getDay(),com.getTime().getHours(),com.getTime().getMinutes(),com.getTime().getSeconds());
		    long millis = calendar.getTimeInMillis();
			map.put("itemOrder",String.valueOf(millis));
			hisList.add(map);
	  }
	  
	  
	  return hisList;
  }
}
package cs.activiti.listener;

import javax.annotation.Resource;

import org.activiti.engine.RepositoryService;
import org.activiti.engine.RuntimeService;
import org.activiti.engine.TaskService;
import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;
import org.apache.log4j.Logger;
import org.springframework.stereotype.Service;

/**
 * 任务监听类
 * @author qinshangzhi
 *
 */
public class ConfigNextAssigneeListener implements TaskListener{

	private static final long serialVersionUID = -1078919159900423539L;
	private static Logger logger = Logger.getLogger(ConfigNextAssigneeListener.class);
	
	@Resource
	private RuntimeService runtimeService;
	
	@Override
	public void notify(DelegateTask delegateTask) {
		// 获取存储在流程实例中的nextAssignee签收人变量的值  
		String nextAssignee = (String) runtimeService.getVariable(delegateTask.getExecutionId(), "nextAssignee");
		// 给当前任务设置下个签收人
		delegateTask.setAssignee(nextAssignee);
	}

}

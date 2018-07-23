package cs.activiti.listener;

import java.text.SimpleDateFormat;
import java.util.Date;

import org.activiti.engine.delegate.DelegateTask;
import org.activiti.engine.delegate.TaskListener;

/**
 * 监控流程的监听器
 * @author lanyijie
 *
 */
public class MonitorListener implements TaskListener {

	/**
	 * 
	 */
	private static final long serialVersionUID = 1L;

	@Override
	public void notify(DelegateTask delegateTask) {
		// TODO Auto-generated method stub
		SimpleDateFormat formatter = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss");
		delegateTask.setVariableLocal("beginTime", formatter.format(new Date()));
	}
}

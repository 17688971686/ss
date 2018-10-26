package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.Attachment;
import cs.domain.ShenBaoInfoRun;
import org.activiti.engine.history.HistoricActivityInstance;

import cs.common.Response;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObjNew;
import org.hibernate.criterion.Criterion;

import com.huasisoft.portal.model.Backlog;

public interface ProcessService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {

	PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str);

	List<Object> getHistoryInfo(String shenbaoInfoId);

	@SuppressWarnings("rawtypes")
	void taskComplete(Map data);

	Response getAssigneeByUserId(String processId);

	Response getAssigneeByUserId(String processId, String userId);

	@SuppressWarnings("rawtypes")
	void taskPinglun(Map data,boolean b);

	PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj,String str);

	List<HistoricActivityInstance> getUnfinished(String shenbaoInfoId);

	@SuppressWarnings("rawtypes")
	void yearPlanComplete(Map data);

	Response getAssigneeByUserId_plan(String processId);

	@SuppressWarnings("rawtypes")
	void taskComplete_plan(Map data);

	PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str, String leixin);	
	
	PageModelDto<ShenBaoInfoDto> getTodoTask_feedback(ODataObjNew odataObj);

	void handleFeedback(Map<String, Object> data);

	PageModelDto<ShenBaoInfoDto> getComplete_feedback(ODataObjNew odataObj);

	PageModelDto<ShenBaoInfoDto> getToDo_yuepi(ODataObjNew odataObj);

	void subShenBaoAtts(Map<String, Object> data);

	List<Attachment> getAllAtts(String shenBaoInfoId, String taskId, String taskKey, List<Attachment> list);

	List<Object> getAllComments(String shenBaoInfoId, String taskId, String taskKey, List<Object> list);

	/*Map<String, Object> getCurrentKeyIntoMap(String processInstanceId, Map<String, Object> map);*/
	
//	void taskYuepi(String id);

    /**
     * 查询待办数据
     * @param odata
     * @return
     */
    List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata);

    List<ShenBaoInfoDto> findRunByOdata(ODataObjNew odata, boolean isPerson, Criterion criterion);

	List<ShenBaoInfoDto> findAuditRunByOdata(ODataObjNew odata, boolean isPerson);

	List<ShenBaoInfoDto> findYearPlanRunByOdata(ODataObjNew odata, boolean isPerson);

	List<ShenBaoInfoDto> findPlanRunByOdata(ODataObjNew odata, boolean isPerson);

	List<ShenBaoInfoDto> findYuepiByOdata(ODataObjNew odataObj, boolean b);
	
	String getAuthorityForCurTask(String processInstanceId, String taskId, String taskKey);
	
	List<ShenBaoInfoDto> findAuditKeshi(ODataObjNew odata);

	/**
	 * 定时任务，更新投资科审批剩余时间和评审中心剩余时间
	 */
	void updateAuditTime();

	int findAllTodoTaskNumber(String id);

	void todoShenbaoInfo(ShenBaoInfo entity, String configValue);

	void todoShenbaoInfo(ShenBaoInfo shenBaoInfo, String nextUsers, Backlog bl);

}

package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.Attachment;
import cs.domain.ShenBaoInfoRun;
import cs.model.DomainDto.AllocationCapitalDto;
import org.activiti.engine.history.HistoricActivityInstance;

import cs.common.Response;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObjNew;
import org.hibernate.criterion.Criterion;

import com.huasisoft.portal.model.Backlog;

/**
 * @author Administrator
 *流程相关服务层
 */
public interface ProcessService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {

	/**
	 *  根据类型标识，查询人员的待办信息
	 * @param odataObj
	 * @param str 项目类型标识
	 * @return pagemodel
	 */
	PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str);

	/**
	 * 查询任务流转的意见信息
	 * @param shenbaoInfoId 申报信息ID
	 * @return
	 */
	List<Object> getHistoryInfo(String shenbaoInfoId);

	/**
	 * 办理任务
	 * @param data
	 */
	@SuppressWarnings("rawtypes")
	void taskComplete(Map data);

	Response getAssigneeByUserId(String processId);

	Response getAssigneeByUserId(String processId, String userId);

	/**
	 * 添加评论信息
	 * @param data
	 * @param b 评论或意见标识
	 */
	@SuppressWarnings("rawtypes")
	void taskPinglun(Map data,boolean b);

	/**
	 * 办理审批类任务
	 * @param odataObj
	 * @param str
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj,String str);

	/**
	 * 查询未完成的活动
	 * @param shenbaoInfoId 申报信息ID
	 * @return
	 */
	List<HistoricActivityInstance> getUnfinished(String shenbaoInfoId);

	/**
	 * 办理下一年度计划
	 * @param data
	 */
	@SuppressWarnings("rawtypes")
	void yearPlanComplete(Map data);

	Response getAssigneeByUserId_plan(String processId);

	/**
	 * 办理计划下达
	 * @param data
	 */
	@SuppressWarnings("rawtypes")
	void taskComplete_plan(Map data);

	/**
	 * 查询个人或科室待办
	 * @param odataObj
	 * @param str 项目类型
	 * @param leixin 个人或科室类型
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str, String leixin);	
	
	/**
	 * 查询在线监管待办数据
	 * @param odataObj
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getTodoTask_feedback(ODataObjNew odataObj);

	/**
	 * 办理在线监管
	 * @param data
	 */
	void handleFeedback(Map<String, Object> data);

	/**
	 * 查询在线监管一般数据
	 * @param odataObj
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getComplete_feedback(ODataObjNew odataObj);

	/**
	 * 查询需要阅批的待办任务
	 * @param odataObj
	 * @return
	 */
	PageModelDto<ShenBaoInfoDto> getToDo_yuepi(ODataObjNew odataObj);

	/**
	 * 关联附件信息到流程变量
	 * @param data
	 */
	void subShenBaoAtts(Map<String, Object> data);

	/**
	 * 根据流程变量中的附件信息，查询附件
	 * @param shenBaoInfoId 深白信息ID
	 * @param taskId 任务ID
	 * @param taskKey 任务标识
	 * @param list 附件list
	 * @return
	 */
	List<Attachment> getAllAtts(String shenBaoInfoId, String taskId, String taskKey, List<Attachment> list);

	/**
	 * 查询审批记录
	 * @param shenBaoInfoId
	 * @param taskId
	 * @param taskKey
	 * @param list
	 * @return
	 */
	List<Object> getAllComments(String shenBaoInfoId, String taskId, String taskKey, List<Object> list);

	/*Map<String, Object> getCurrentKeyIntoMap(String processInstanceId, Map<String, Object> map);*/
	
//	void taskYuepi(String id);

    /**
     * 查询待办数据
     * @param odata
     * @return
     */
    List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata);

    /**
     * 查询待办数据
     * @param odata
     * @param isPerson 待办类型标识
     * @param criterion 查询条件
     * @return
     */
    List<ShenBaoInfoDto> findRunByOdata(ODataObjNew odata, boolean isPerson, Criterion criterion);
    /**
     * 查询审批类待办数据
     * @param odata
     * @param isPerson 待办类型标识
     * @return
     */
	List<ShenBaoInfoDto> findAuditRunByOdata(ODataObjNew odata, boolean isPerson);
	/**
     * 查询下一年度计划待办数据
     * @param odata
     * @param isPerson 待办类型标识
     * @param criterion 查询条件
     * @return
     */
	List<ShenBaoInfoDto> findYearPlanRunByOdata(ODataObjNew odata, boolean isPerson);

	/**
     * 查询计划类待办数据
     * @param odata
     * @param isPerson 待办类型标识
     * @param criterion 查询条件
     * @return
     */
	List<ShenBaoInfoDto> findPlanRunByOdata(ODataObjNew odata, boolean isPerson);

	/**
     * 查询阅批类待办数据
     * @param odata
     * @param isPerson 待办类型标识
     * @param criterion 查询条件
     * @return
     */
	List<ShenBaoInfoDto> findYuepiByOdata(ODataObjNew odataObj, boolean b);
	
	String getAuthorityForCurTask(String processInstanceId, String taskId, String taskKey);
	
	/**
     * 查询科室待办数据
     * @param odata
     * @return
     */
	List<ShenBaoInfoDto> findAuditKeshi(ODataObjNew odata);

	/**
	 * 定时任务，更新投资科审批剩余时间和评审中心剩余时间
	 */
	void updateAuditTime();

	/**
	 * 查询待办总数
	 * @param id
	 * @return
	 */
	int findAllTodoTaskNumber(String id);

	void todoShenbaoInfo(ShenBaoInfo entity, String configValue);

	/**
	 * OA首页工作圈交互
	 * @param shenBaoInfo
	 * @param nextUsers
	 * @param bl
	 */
	void todoShenbaoInfo(ShenBaoInfo shenBaoInfo, String nextUsers, Backlog bl);

	List<AllocationCapitalDto> findPlanBySql(String id,String planId);
}

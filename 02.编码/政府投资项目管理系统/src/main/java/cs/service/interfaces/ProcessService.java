package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import cs.domain.ShenBaoInfoRun;
import org.activiti.engine.history.HistoricActivityInstance;

import cs.common.Response;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObjNew;

public interface ProcessService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {

    PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str);

    List<Object> getHistoryInfo(String shenbaoInfoId);

    @SuppressWarnings("rawtypes")
    void taskComplete(Map data);

    Response getAssigneeByUserId(String processId);

    Response getAssigneeByUserId(String processId, String userId);

    @SuppressWarnings("rawtypes")
    void taskPinglun(Map data);

    PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj, String str);

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

    /**
     * 查询待办数据
     * @param odata
     * @param leixin
     * @return
     */
    List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata, String leixin);

    List<ShenBaoInfoRun> findAuditRunByOdata(ODataObjNew odata, String leixin);

    List<ShenBaoInfoRun> findYearPlanRunByOdata(ODataObjNew odata, String leixin);

    List<ShenBaoInfoRun> findPlanRunByOdata(ODataObjNew odata, String leixin);
}

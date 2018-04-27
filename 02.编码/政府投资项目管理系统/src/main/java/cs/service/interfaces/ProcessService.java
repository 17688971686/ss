package cs.service.interfaces;

import java.util.List;
import java.util.Map;

import org.activiti.engine.history.HistoricActivityInstance;

import cs.common.Response;
import cs.domain.ShenBaoInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;

public interface ProcessService extends IService<ShenBaoInfoDto, ShenBaoInfo, String> {

	PageModelDto<ShenBaoInfoDto> getTask_user(ODataObjNew odataObj, String str);

	List<Object> getHistoryInfo(String shenbaoInfoId);

	void taskComplete(Map data);

	Response getAssigneeByUserId(String processId);

	void taskPinglun(Map data);

	PageModelDto<ShenBaoInfoDto> getAudit_complete(ODataObjNew odataObj,String str);

	List<HistoricActivityInstance> getUnfinished(String shenbaoInfoId);

	void yearPlanComplete(Map data);	
	
}

package cs.service.framework;

import cs.model.PageModelDto;
import cs.model.framework.LogDto;
import cs.repository.odata.ODataObj;

public interface LogService {

	PageModelDto<LogDto> get(ODataObj odataObj);

}
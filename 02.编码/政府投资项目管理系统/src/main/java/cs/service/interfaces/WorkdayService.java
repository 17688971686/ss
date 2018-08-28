package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.model.DomainDto.OpinionDto;
import cs.model.DomainDto.WorkdayDto;
import cs.repository.odata.ODataObj;

public interface WorkdayService {

	void saveWorkday(WorkdayDto WorkdayDto);


	void deleteWorkdays(String[] ids);


	void deleteWorkday(String id);


	void editWorkday(WorkdayDto opinDto);


	PageModelDto<WorkdayDto> getWorkday(ODataObj odataObj);

}

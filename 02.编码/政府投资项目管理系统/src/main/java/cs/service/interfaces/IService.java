package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;

public interface IService<Dto,Entity,ID> {
	PageModelDto<Dto> get(ODataObj odataObj);

	Entity create(Dto dto);
	
	Entity update(Dto dto,ID id);
	
	void delete(ID id);

	void deletes(ID[] ids);
	
	
}

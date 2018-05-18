package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;

import java.util.List;

public interface IService<Dto,Entity,ID> {
	PageModelDto<Dto> get(ODataObj odataObj);

	Entity create(Dto dto);
	
	Entity update(Dto dto,ID id);
	
	void delete(ID id);

	void deletes(ID[] ids);
	
	Entity findById(ID id);

	List<Dto> findByDto(ODataObj odataObj);
}

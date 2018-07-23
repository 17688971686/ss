package cs.service.interfaces;

import cs.model.PageModelDto;
import cs.repository.odata.ODataObj;
import cs.repository.odata.ODataObjNew;

import java.util.List;

public interface IService<Dto, Entity, ID> {
    PageModelDto<Dto> get(ODataObj odataObj);

    /**
     * 基于 odata 的查询
     * @param odataObj
     * @return
     */
    List<Dto> findByOdata2(ODataObjNew odataObj);

    /**
     * 基于 odata 的查询（分页）
     * @param odataObj
     * @return
     */
    PageModelDto<Dto> findPageByOdata2(ODataObjNew odataObj);

    Entity create(Dto dto);

    Entity update(Dto dto, ID id);

    void delete(ID id);

    void deletes(ID[] ids);

    Entity findById(ID id);

    List<Dto> findByDto(ODataObj odataObj);
}

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

    /**
     * 创建
     * @param dto 实体信息
     * @return
     */
    Entity create(Dto dto);

    /**
     * 更新
     * @param dto 实体信息
     * @param id 实体ID
     * @return
     */
    Entity update(Dto dto, ID id);

    /**
     * 删除 
     * @param id ID
     */
    void delete(ID id);

    void deletes(ID[] ids);

    /**
     * 根据ID查询
     * @param id
     * @return
     */
    Entity findById(ID id);

    /**
     * odataObj查询
     * @param odataObj
     * @return
     */
    List<Dto> findByDto(ODataObj odataObj);
}

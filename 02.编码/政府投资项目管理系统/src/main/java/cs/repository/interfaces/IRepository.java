package cs.repository.interfaces;

import java.util.List;
import java.util.Map;

import cs.repository.odata.ODataObjNew;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;

import cs.repository.odata.ODataObj;

public interface IRepository<T, ID> {
    T findById(ID id);

    List<T> findAll();

    List<T> findByCriteria(Criterion... criterion);

    List<T> findByCriteria(Map<String,String> alias,Criterion... criterion);

    /**
     * 基于 odata 的查询
     * @param oDataObj
     * @return
     */
    List<T> findByOdata(ODataObj oDataObj);

    /**
     * 基于 odata 的查询
     * @param odataObj
     * @return
     */
    List<T> findByOdata2(ODataObjNew odataObj);

    T save(T entity);

    void delete(T entity);

    void flush();

    void clear();

    void setSession(Session session);

    Session getSession();
}

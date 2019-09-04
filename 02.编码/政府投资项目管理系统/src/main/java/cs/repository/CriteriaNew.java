package cs.repository;


import org.hibernate.*;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projection;
import org.hibernate.sql.JoinType;
import org.hibernate.transform.ResultTransformer;

import java.io.Serializable;
import java.util.List;

/**
 * Created by Administrator on 2019/5/29 0029.
 */
public class CriteriaNew implements Criteria, Serializable {

    @Override
    public String getAlias() {
        return null;
    }

    @Override
    public Criteria setProjection(Projection projection) {
        return null;
    }

    @Override
    public Criteria add(Criterion criterion) {
        return null;
    }

    @Override
    public Criteria addOrder(Order order) {
        return null;
    }

    @Override
    public Criteria setFetchMode(String associationPath, FetchMode mode) throws HibernateException {
        return null;
    }

    @Override
    public Criteria setLockMode(LockMode lockMode) {
        return null;
    }

    @Override
    public Criteria setLockMode(String alias, LockMode lockMode) {
        return null;
    }

    @Override
    public Criteria createAlias(String associationPath, String alias) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createAlias(String associationPath, String alias, JoinType joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createAlias(String associationPath, String alias, int joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createAlias(String associationPath, String alias, JoinType joinType, Criterion withClause) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createAlias(String associationPath, String alias, int joinType, Criterion withClause) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, JoinType joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, int joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, String alias) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, String alias, JoinType joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, String alias, int joinType) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, String alias, JoinType joinType, Criterion withClause) throws HibernateException {
        return null;
    }

    @Override
    public Criteria createCriteria(String associationPath, String alias, int joinType, Criterion withClause) throws HibernateException {
        return null;
    }

    @Override
    public Criteria setResultTransformer(ResultTransformer resultTransformer) {
        return null;
    }

    @Override
    public Criteria setMaxResults(int maxResults) {
        return null;
    }

    @Override
    public Criteria setFirstResult(int firstResult) {
        return null;
    }

    @Override
    public boolean isReadOnlyInitialized() {
        return false;
    }

    @Override
    public boolean isReadOnly() {
        return false;
    }

    @Override
    public Criteria setReadOnly(boolean readOnly) {
        return null;
    }

    @Override
    public Criteria setFetchSize(int fetchSize) {
        return null;
    }

    @Override
    public Criteria setTimeout(int timeout) {
        return null;
    }

    @Override
    public Criteria setCacheable(boolean cacheable) {
        return null;
    }

    @Override
    public Criteria setCacheRegion(String cacheRegion) {
        return null;
    }

    @Override
    public Criteria setComment(String comment) {
        return null;
    }

    @Override
    public Criteria addQueryHint(String hint) {
        return null;
    }

    @Override
    public Criteria setFlushMode(FlushMode flushMode) {
        return null;
    }

    @Override
    public Criteria setCacheMode(CacheMode cacheMode) {
        return null;
    }

    @Override
    public List list() throws HibernateException {
        return null;
    }

    @Override
    public ScrollableResults scroll() throws HibernateException {
        return null;
    }

    @Override
    public ScrollableResults scroll(ScrollMode scrollMode) throws HibernateException {
        return null;
    }

    @Override
    public Object uniqueResult() throws HibernateException {
        return null;
    }
}



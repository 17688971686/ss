package cs.repository.odata;


import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.MatchMode;
import org.hibernate.criterion.Restrictions;

import cs.common.StringUtil;

/**
 * Description: odata查询策略
 *
 * @author: tzg
 * @date: 2017/10/30 16:22
 */
public enum OdataCriteriaStrategy {
    LIKE {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.like(fieldName, String.valueOf(value), MatchMode.ANYWHERE);
        }
    },
    NOT_LIKE {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.not(Restrictions.like(fieldName, String.valueOf(value), MatchMode.ANYWHERE));
        }
    },
    EQ {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return value == null ? Restrictions.isNull(fieldName) : Restrictions.eq(fieldName, value);
        }
    },
    NE {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return value == null ? Restrictions.isNotNull(fieldName) : Restrictions.ne(fieldName, value);
        }
    },
    GT {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.gt(fieldName, value);
        }
    },
    GE {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.ge(fieldName, value);
        }
    },
    LT {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.lt(fieldName, value);
        }
    },
    LE {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.le(fieldName, value);
        }
    },
    IN {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.in(fieldName, value.toString().split(","));
        }
    },
    NI {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.not(Restrictions.in(fieldName, value.toString().split(",")));
        }
    },
    ENDSWITH {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.like(fieldName, String.valueOf(value), MatchMode.END);
        }
    },
    STARTSWITH {
        @Override
        public Criterion getCriterion(String fieldName, Object value) {
            return Restrictions.like(fieldName, String.valueOf(value), MatchMode.START);
        }
    };

    /**
     * 获取过滤条件
     *
     * @param fieldName
     * @param value
     * @return
     */
    public abstract Criterion getCriterion(String fieldName, Object value);

    /**
     * 获取过滤条件
     *
     * @param fieldName
     * @param operate
     * @param value
     * @return
     */
    public static Criterion getPredicateByOperate(String fieldName, String operate, Object value) {
        return getStrategy(operate).getCriterion(fieldName, value);
    }

    /**
     * 获取过滤条件
     *
     * @param fieldName
     * @param operate
     * @param value
     * @return
     */
    public static Criterion getPredicateByOperate(String fieldName, OdataFilter.Operate operate, Object value) {
        return getStrategy(operate.name()).getCriterion(fieldName, value);
    }

    /**
     * 获取过滤策略
     *
     * @param strategyName
     * @return
     */
    public static OdataCriteriaStrategy getStrategy(String strategyName) {
        if (StringUtil.isNotBlank(strategyName)) {
            return OdataCriteriaStrategy.valueOf(strategyName.trim().toUpperCase());
        }
        return null;
    }

}

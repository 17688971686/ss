package cs.repository.odata;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import javax.servlet.http.HttpServletRequest;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.util.CollectionUtils;

import cs.common.EntityInfo;
import cs.common.EntityInfoUtils;
import cs.common.ObjectUtils;
import cs.common.StringUtil;

public class ODataObjNew extends Odata {
	
	public ODataObjNew() {
	}

	public ODataObjNew(HttpServletRequest request) {
		super(request);
	}

	public ODataObjNew(String filter, String[] orderby) {
		super(filter, orderby);
	}

	public ODataObjNew(String filter, String[] orderby, boolean isCount, int skip, int top) {
		super(filter, orderby, isCount, skip, top);
	}

	@Override
	public void parseOrderby(String[] orderby, boolean isCall) {
		if (ObjectUtils.isNotEmpty(orderby)) {
			String[] orderbyItems;
			String fieldName;
			for (String o : orderby) {
				if (o.contains(",") && !isCall) {
					parseOrderby(o.split(","), true);
				} else {
					orderbyItems = o.trim().split(" ");
					fieldName = orderbyItems[0];
					if (!StringUtil.isFieldWord(fieldName)) {
						continue;
					}
					addOrderby(fieldAlias(fieldName),
							orderbyItems.length == 2 && "desc".equalsIgnoreCase(orderbyItems[1]));
				}
			}
		}
	}

	/**
	 * 实体信息
	 */
	protected EntityInfo entityInfo;

	public <T> Criteria createQuery(Session session, Class<T> cls) {
        entityInfo = EntityInfoUtils.getEntityInfo(cls);
        Criteria criteria = session.createCriteria(cls);

        if (logger.isDebugEnabled()) {
            logger.debug("查询的实体："+cls.getName()+"，过滤条件："+filterList+"，排序："+orderbyList);
        }

        // 处理filters
        criteria.add(settingWhere(null, true));

        // 创建别名
        if (!CollectionUtils.isEmpty(aliases)) {
            for (OdataCriteriaAlias alias : aliases) {
                criteria.createAlias(alias.getFieldName(), alias.getAlias(), alias.getJoinType());
            }
        }

        // 处理分页
        if (this.top > 0) {
            //统计总数
            if (this.isCount) {

                Long total = (Long) criteria.setProjection(Projections.rowCount()).uniqueResult();
                this.count = total.intValue();

                // TODO 一对多、多对多用 Criteria.DISTINCT_ROOT_ENTITY
                criteria.setProjection(null).setResultTransformer(Criteria.ROOT_ENTITY);
            }

            criteria.setFirstResult(this.skip).setMaxResults(this.top);
        }

        // 处理orderby
        if (ObjectUtils.isNotEmpty(orderbyList)) {
            orderbyList.forEach(o ->
                    criteria.addOrder(o.isOrderbyDesc() ? Order.desc(o.getField()) : Order.asc(o.getField()))
            );
        }

        return criteria;
    }

	/**
	 * 设置过滤条件
	 * 
	 * @param cls
	 * @param filters
	 * @param isAnd
	 * @return
	 */
	public Criterion settingWhere(Class<?> cls, List<OdataFilter> filters, boolean isAnd) {
		entityInfo = EntityInfoUtils.getEntityInfo(cls);
		return settingWhere(filters, isAnd);
	}

	/**
	 * 设置过滤条件
	 *
	 * @param filters
	 * @param isAnd
	 * @return
	 */
	protected Criterion settingWhere(List<OdataFilter> filters, boolean isAnd) {
		if (ObjectUtils.isEmpty(filters)) {
			filters = filterList;
		}
		List<Criterion> criterionList = new ArrayList<>();
		if (ObjectUtils.isNotEmpty(filters)) {
			OdataFilter filter;
			for (OdataFilter f : filters) {
				if (null != f.getFiledName()) {
					criterionList.add(OdataCriteriaStrategy.getPredicateByOperate(fieldAlias(f.getFiledName()),
							f.getOperate(), getFieldValue(entityInfo.getFieldInfo(f.getFiledName()), f.getValue())));
				} else {
					Object value = f.getValue();
					if (null != value) {
						if (value instanceof List) {
							if (ObjectUtils.isNotEmpty(value)) {
								Criterion p = settingWhere((List<OdataFilter>) value,
										OdataFilter.Operate.AND.equals(f.getOperate()));
								if (null != p) {
									criterionList.add(p);
								}
							}
						} else if (value instanceof OdataFilter) {
							filter = (OdataFilter) value;
							criterionList.add(OdataCriteriaStrategy.getPredicateByOperate(filter.getFiledName(),
									filter.getOperate(), filter.getValue()));
						} else if (value instanceof Criterion) {
							criterionList.add((Criterion) value);
						} else {
							throw new IllegalArgumentException("odata逻辑参数有误");
						}
					}
				}
			}
		}
		if (isAnd) {
			return Restrictions.and(criterionList.toArray(new Criterion[criterionList.size()]));
		}
		return Restrictions.or(criterionList.toArray(new Criterion[criterionList.size()]));
	}

	protected Set<OdataCriteriaAlias> aliases;

	/**
	 * 处理字段中的别名
	 *
	 * @param fieldName
	 * @return
	 */
	protected String fieldAlias(String fieldName) {
		if (fieldName.contains("/") || fieldName.contains(".")) {
			if (null == aliases) {
				aliases = new HashSet<>();
			}
			String[] fs = fieldName.replaceAll("\\/", ALIAS_SEPARATOR).split("\\.");
			int len = fs.length;
			if (len > 1) {
				String fieldAlias = "", f, _f = null;
				JoinType joinType;
				OdataCriteriaAlias alias;
				for (int i = 0; i < len - 1; i++) {
					f = fs[i];
					if (f.startsWith("+")) {
						_f = f.substring(1);
						joinType = JoinType.LEFT_OUTER_JOIN;
					} else if (f.endsWith("+")) {
						_f = f.substring(0, f.length() - 1);
						joinType = JoinType.RIGHT_OUTER_JOIN;
					} else {
						_f = f;
						joinType = JoinType.INNER_JOIN;
					}
					fieldAlias += (i > 0 ? "." : "") + _f;
					alias = new OdataCriteriaAlias(fieldAlias, _f, joinType);
					if (aliases.contains(alias) && joinType == JoinType.INNER_JOIN) {
						continue;
					}
					aliases.remove(alias);
					aliases.add(alias);
				}
				return _f + "." + fs[len - 1];
			}
		}
		return fieldName;
	}

	@Override
	public ODataObjNew addFilter(OdataFilter filter) {
		return (ODataObjNew) super.addFilter(filter);
	}

}

package cs.common;

import org.hibernate.Criteria;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
import org.hibernate.transform.Transformers;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import javax.persistence.Column;
import javax.persistence.Id;
import javax.persistence.Table;
import java.lang.reflect.Field;
import java.util.LinkedHashSet;
import java.util.Map;
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;

/**
 * Description: 实体信息操作工具类
 * Author: tzg
 * Date: 2017/6/1 11:29
 */
public class EntityInfoUtils {

    private final static Logger logger = LoggerFactory.getLogger(EntityInfoUtils.class);

    /*
     * 缓存实体信息
     */
    private static final Map<String, EntityInfo> entityInfoCache = new ConcurrentHashMap<String, EntityInfo>();

    /**
     * 获取实体映射信息
     *
     * @param cls 反射实体类
     * @return
     */
    public static EntityInfo getEntityInfo(Class<?> cls) {
        return initEntityInfo(cls);
    }

    /**
     * 获取实体映射信息
     *
     * @param clsName 实体名（包含包路径）
     * @return
     */
    public static EntityInfo getEntityInfo(String clsName) {
        EntityInfo entityInfo = entityInfoCache.get(clsName);
        if (null == entityInfo) {
            try {
                entityInfo = initEntityInfo(Class.forName(clsName));
            } catch (ClassNotFoundException e) {
                e.printStackTrace();
            }
        }
        return entityInfo;
    }

    /**
     * 实体类反射获取表信息【初始化】
     *
     * @param cls 反射实体类
     * @return
     */
    public synchronized static EntityInfo initEntityInfo(Class<?> cls) {
        EntityInfo entityInfo = entityInfoCache.get(cls.getName());
        if (entityInfo != null) {
            return entityInfo;
        }
        entityInfo = new EntityInfo();

        /* 表名 */
        Table table = cls.getAnnotation(Table.class);
        String tableName = null;
        if (table != null && StringUtil.isNotBlank(table.name())) {
            tableName = table.name();
        }
        if (tableName == null) {
            logger.warn("Warn: Entity @Table Not Found!");
        }
        entityInfo.setTableName(tableName);
        entityInfo.setClsName(cls.getSimpleName());
        // 实体字段
        entityInfo.setFieldInfos(entityFieldInfos(cls, entityInfo));
        entityInfoCache.put(cls.getName(), entityInfo);
        return entityInfo;
    }

    /**
     * 获取实体类所有字段
     *
     * @param cls
     * @param entityInfo
     */
    private static Set<EntityFieldInfo> entityFieldInfos(Class<?> cls, EntityInfo entityInfo) {
        Set<EntityFieldInfo> fieldInfos = new LinkedHashSet<EntityFieldInfo>();
        Field[] fields = cls.getDeclaredFields();
        EntityFieldInfo fieldInfo;
        String columnName;
        for (Field field : fields) {
            if (field.isAnnotationPresent(Id.class)) {
                fieldInfo = new EntityFieldInfo(field.getName(), field.getType().getName());
                if (field.isAnnotationPresent(Column.class)) {
                    columnName = field.getAnnotation(Column.class).name();
                    if (StringUtil.isNotBlank(columnName)) {
                        fieldInfo.setFieldColumn(field.getAnnotation(Column.class).name());
                    }
                }
                entityInfo.setIdField(fieldInfo);
            } else if (field.isAnnotationPresent(Column.class)) {
                fieldInfo = new EntityFieldInfo(field.getName(), field.getType().getName());
                columnName = field.getAnnotation(Column.class).name();
                if (StringUtil.isNotBlank(columnName)) {
                    fieldInfo.setFieldColumn(field.getAnnotation(Column.class).name());
                }
                fieldInfos.add(fieldInfo);
//            } else if (field.isAnnotationPresent(OneToOne.class) || field.isAnnotationPresent(ManyToOne.class)) {
//                fieldInfo = new EntityFieldInfo(field.getName(), field.getType().getName(), true);
//                fieldInfos.add(fieldInfo);
            }
        }
        return fieldInfos;
    }


    /**
     * 获取查询的结果集列信息
     *
     * @param cls
     * @param alias
     * @return
     */
    public static ProjectionList getProjectionList(Class<?> cls, String alias) {
        EntityInfo entityInfo = initEntityInfo(cls);
        return getProjectionList(entityInfo, alias, null);
    }

    /**
     * 获取查询的结果集列信息
     *
     * @param entityInfo
     * @param alias
     * @return
     */
    public static ProjectionList getProjectionList(EntityInfo entityInfo, String alias, ProjectionList pList) {
        if (pList == null) {
            pList = Projections.projectionList();
        }
        if (entityInfo != null) {
            if (StringUtil.isNotBlank(alias)) {
                alias += ".";
            } else {
                alias = "";
            }
            EntityFieldInfo idField = entityInfo.getIdField();
            if (idField != null) {
                String idFieldName = idField.getFieldName();
                pList.add(Property.forName(alias + idFieldName), idFieldName);
            }
            for (EntityFieldInfo f : entityInfo.getFieldInfos()) {
//                if (f.isEntity()) {
//                    getProjectionList(getEntityInfo(f.getFieldType()), alias + f.getFieldName(), pList);
//                } else {
                pList.add(Projections.property(alias + f.getFieldName()), f.getFieldName());
//                }
            }
        }
        return pList;
    }

    /**
     * 获取查询的结果集列信息
     *
     * @param entityInfo
     * @return
     */
    public static ProjectionList getProjectionList(EntityInfo entityInfo) {
        return getProjectionList(entityInfo, null, null);
    }

    /**
     * 设置结果转换实体
     *
     * @param criteria
     * @param resultCls
     * @param resultAlias
     * @return
     */
    public static Criteria setResultTransformer(Criteria criteria, Class resultCls, String resultAlias) {
        return criteria.setProjection(getProjectionList(resultCls, resultAlias))
                .setResultTransformer(Transformers.aliasToBean(resultCls));
    }

    /**
     * 设置结果转换实体
     *
     * @param criteria
     * @param resultCls
     * @return
     */
    public static Criteria setResultTransformer(Criteria criteria, Class resultCls) {
        return criteria.setProjection(getProjectionList(resultCls, null))
                .setResultTransformer(Transformers.aliasToBean(resultCls));
    }

}
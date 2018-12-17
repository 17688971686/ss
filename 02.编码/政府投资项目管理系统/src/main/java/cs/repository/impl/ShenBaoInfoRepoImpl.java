package cs.repository.impl;

import java.lang.reflect.Field;
import java.util.ArrayList;
import java.util.List;

import javax.persistence.metamodel.SingularAttribute;

import org.hibernate.Criteria;
import org.hibernate.Session;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.transform.BasicTransformerAdapter;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Repository;

import com.sn.framework.common.ObjectUtils;
import com.sn.framework.odata.OdataFilter;
import com.sn.framework.odata.OdataFilter.Operate;

import cs.common.BasicDataConfig;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfoRun;
import cs.domain.ShenBaoInfo_;
import cs.repository.odata.ODataObjNew;

/**
 * @Description: 申报信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class ShenBaoInfoRepoImpl extends AbstractRepository<ShenBaoInfo, String> {

	/**
	 * 根据任务ID查询待办申报信息 
	 * @param odataObj
	 * @param taskIds 任务ID集合
	 * @param str 项目类型标识
	 * @return
	 */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public List<ShenBaoInfo> findByOdata2(ODataObjNew odataObj, List<String> taskIds, String str) {
        logger.debug("findByOdata2");

        List<OdataFilter> idsFilter = new ArrayList<OdataFilter>(taskIds.size());
        List<OdataFilter> idsFilter2 = new ArrayList<OdataFilter>(taskIds.size());
        List<OdataFilter> idsFilter3 = new ArrayList<OdataFilter>(taskIds.size());
        taskIds.forEach(x -> {
            idsFilter.add(new OdataFilter(ShenBaoInfo_.zong_processId.getName(), Operate.EQ, x));
        });

        if (str.equals("plan")) {
            OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_planReach));

            idsFilter2.add(orFilter);
            OdataFilter orFilter2 = new OdataFilter(null, Operate.AND, idsFilter2);
            odataObj.addFilter(orFilter2);

        } else if (str.equals("yearPlan")) {
            OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_nextYearPlan));
//			OdataFilter andFilter2 =new OdataFilter(null, Operate.AND, idsFilter2);
            idsFilter3.add(orFilter);
            idsFilter3.addAll(idsFilter2);
            OdataFilter andFilter3 = new OdataFilter(null, Operate.AND, idsFilter3);
            odataObj.addFilter(andFilter3);
        } else if (str.equals("all")) {
            OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
            odataObj.addFilter(orFilter);
        } else {
            OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_XMJYS));
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_KXXYJBG));
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_ZJSQBG));
            idsFilter2.add(new OdataFilter(ShenBaoInfo_.projectShenBaoStage.getName(), Operate.EQ, BasicDataConfig.projectShenBaoStage_CBSJGS));

            OdataFilter orFilter2 = new OdataFilter(null, Operate.OR, idsFilter2);
            idsFilter3.add(orFilter);
            idsFilter3.add(orFilter2);
            OdataFilter orFilter3 = new OdataFilter(null, Operate.AND, idsFilter3);
            odataObj.addFilter(orFilter3);
        }

        return odataObj.createQuery(getSession(), ShenBaoInfo.class).list();
    }

    /**
     * 查询个人所有待办申报信息
     * @param odataObj
     * @param taskIds 任务ID集合
     * @return
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public List<ShenBaoInfo> findByOdata3(ODataObjNew odataObj, List<String> taskIds) {
        logger.debug("findByOdata2");

        List<OdataFilter> idsFilter = new ArrayList<OdataFilter>(taskIds.size());
        taskIds.forEach(x -> {
            idsFilter.add(new OdataFilter(ShenBaoInfo_.zong_processId.getName(), Operate.EQ, x));
        });

        OdataFilter orFilter = new OdataFilter(null, Operate.OR, idsFilter);
        odataObj.addFilter(orFilter);

        return odataObj.createQuery(getSession(), ShenBaoInfo.class).list();
    }

    /**
     * 根据流程ID查询待办深白信息
     * @param odataObj
     * @param processInstIdList 流程ID集合
     * @return
     */
    @SuppressWarnings({"unchecked", "rawtypes"})
    public List<ShenBaoInfo> getShenBaoInfoDtos_feedback(ODataObjNew odataObj, List<String> processInstIdList) {
        List<OdataFilter> processInstIdListFilter = new ArrayList<OdataFilter>(processInstIdList.size());

        processInstIdList.forEach(x -> {
            processInstIdListFilter.add(new OdataFilter(ShenBaoInfo_.monitor_processId.getName(), Operate.EQ, x));
        });

        OdataFilter orFilter = new OdataFilter(null, Operate.OR, processInstIdListFilter);
        odataObj.addFilter(orFilter);
        List<ShenBaoInfo> shenBaoInfos = odataObj.createQuery(getSession(), ShenBaoInfo.class).list();
        return shenBaoInfos;
    }

    /**
     * 查询申报待办数据
     * @param odata
     * @return
     */
    public List<ShenBaoInfoRun> findRunByOdata(ODataObjNew odata) {
        return odata.createQuery(getSession(), ShenBaoInfoRun.class).list();
    }

    /**
     * 查询申报待办数据
     * @param odata
     * @return
     */
    @SuppressWarnings({ "unchecked" })
	public List<ShenBaoInfo> findRunByOdata2(ODataObjNew odata) {
    	return odata.createQuery(getSession(), ShenBaoInfo.class).list();
//        return createCriteria(odata.createQuery(getSession(), ShenBaoInfo.class), ShenBaoInfo.class,classLoac()).list();
    }

    /**
     * 获取类字段
     * @return
     */
	public static List<String> classLoac(){
    	ArrayList<String> list = new ArrayList<String>();
    	Class<?> classs = null;
		try {
			classs = Class.forName("cs.domain.ShenBaoInfo");
		} catch (ClassNotFoundException e) {
			// TODO Auto-generated catch block
			e.printStackTrace();
		}
		Field[] field = classs.getDeclaredFields();

		//    	Field[] field = ShenBaoInfo.class.getClass().getDeclaredFields();
    	for (int i = 0; i < field.length; i++) {
			String field2 = field[i].getName();
			list.add(field2);
		}
    	return list;
    }
    
    /**
     * 创建自定义字段映射的查询
     * @param session
     * @param cls
     * @param attribute
     * @return
     */
    public static Criteria createCriteria(Criteria criteria, final Class cls, List<String> attribute) {
//        Criteria criteria = session.createCriteria(cls);
        return setProjectionResult(criteria, cls, attribute);
    }

    /**
     * 自定义字段映射
     * @param criteria
     * @param cls
     * @param attribute
     * @return
     */
    @SuppressWarnings("serial")
	public static Criteria setProjectionResult(final Criteria criteria, final Class cls, List<String> attribute) {
        if (!ObjectUtils.isEmpty(attribute)) {
            ProjectionList projectionList = Projections.projectionList();
            for (String sa : attribute) {
                projectionList.add(Projections.property(sa));
            }
            criteria.setProjection(projectionList).setResultTransformer(new BasicTransformerAdapter() {
                @SuppressWarnings("unchecked")
				@Override
                public Object transformTuple(Object[] tuple, String[] aliases) {
                    Object obj = BeanUtils.instantiate(cls);
                    for (int i = 0; i < attribute.size(); i++) {
                    	ObjectUtils.setFieldValue(obj, attribute.get(i), tuple[i]);
                    }
                    return obj;
                }

            });
        }
        return criteria;
    }

}

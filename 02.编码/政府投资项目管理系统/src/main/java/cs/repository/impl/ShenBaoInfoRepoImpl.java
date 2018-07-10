package cs.repository.impl;

import com.sn.framework.odata.Odata;
import com.sn.framework.odata.OdataFilter;
import com.sn.framework.odata.OdataFilter.Operate;
import cs.common.BasicDataConfig;
import cs.domain.ShenBaoInfo;
import cs.domain.ShenBaoInfoRun;
import cs.domain.ShenBaoInfo_;
import cs.repository.odata.ODataObjNew;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

/**
 * @Description: 申报信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class ShenBaoInfoRepoImpl extends AbstractRepository<ShenBaoInfo, String> {

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
    public List<ShenBaoInfo> findRunByOdata2(ODataObjNew odata) {
        return odata.createQuery(getSession(), ShenBaoInfo.class).list();
    }

}

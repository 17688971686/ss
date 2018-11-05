package cs.repository.odata;

import com.sn.framework.odata.OdataFilter;
import cs.service.impl.PlanReachApplicationServiceImpl;
import org.apache.commons.lang.StringUtils;
import org.apache.log4j.Logger;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.Set;

/**
 * add by liux
 * 针对odataObjNew 进行页面参数处理
 */
public class OdataUtil {

    private static Logger logger = Logger.getLogger(PlanReachApplicationServiceImpl.class);
    /**
     * 参数类型处理
     * @param odataObj
     */
    public static OdataFilter removeOdataFilterFromOdataByFiledName(ODataObjNew odataObj,String filedName){
        return getOdataFilterByFiledName(getPageOdataFilterListByOdataObj(odataObj),filedName);
    }

    public static void replaceOdataFilterByMap(ODataObjNew odataObj,Map<String,String> map){
        System.out.println("替换参数信息："+map);
        logger.info("替换参数信息："+map);
        OdataFilter filter = getPageOdataFilterListByOdataObj(odataObj);
        if(filter!=null && filter.getValue() instanceof List
                && map != null){
            List<OdataFilter> filterList = (List<OdataFilter>) filter.getValue();
            if(filterList!= null && !filterList.isEmpty()){
                Set<String> set = map.keySet();
                for (String key : set){
                    for (OdataFilter odataFilter : filterList){
                        String filedName = odataFilter.getFiledName();
                        if(filedName.equals(key)){
                            Object filedValue = odataFilter.getValue();
                            String val = map.get(key);
                            switch (val){
                                case "Integer":
                                    odataFilter.setValue(((BigDecimal)filedValue).intValue());
                                    System.out.println("替换参数：FiledName:"+filedName+",原类型："+filedValue.getClass().getTypeName()+",替换类型：Integer");
                                    logger.info("替换参数：FiledName:"+filedName+",原类型："+filedValue.getClass().getTypeName()+",替换类型：Integer");
                                    break;
                            }
                        }
                    }
                }
            }
        }
    }

    /**
     * 获取指定参数信息,并删除集合中的指定参数
     * @param filter
     * @param targetFiledName
     * @return
     */
    public static  OdataFilter getOdataFilterByFiledName(OdataFilter filter,String targetFiledName){
        OdataFilter resultFilter = null;
        if(filter!=null && filter.getValue() instanceof List
                &&  !StringUtils.isBlank(targetFiledName)){
            List<OdataFilter> filterList = (List<OdataFilter>) filter.getValue();
            if(filterList!= null && !filterList.isEmpty()){
                for (OdataFilter odataFilter : filterList){
                    String filedName = odataFilter.getFiledName();
                    if(filedName.equals(targetFiledName)){
                        resultFilter = new OdataFilter(odataFilter.getFiledName(),odataFilter.getOperate(),odataFilter.getValue());
                        filterList.remove(odataFilter);
                        break;
                    }
                }
            }
        }
        return resultFilter;
    }

    /**
     * 获取页面传参
     * @param odataObj
     * @return
     */
    public static OdataFilter getPageOdataFilterListByOdataObj(ODataObjNew odataObj){
        List<OdataFilter> odataFilterList = odataObj.getFilterList();
        OdataFilter filter = null;
        if(odataFilterList!=null && !odataFilterList.isEmpty()){
            filter = odataFilterList.get(0);
        }
        System.out.println("获取参数信息："+filter);
        logger.info("获取参数信息："+filter);
        return filter;
    }
}

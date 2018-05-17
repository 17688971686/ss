package cs.repository.odata;

import java.util.ArrayList;
import java.util.List;

import cs.common.ObjectUtils;
import cs.repository.odata.antlr.OdataFilterBaseListener;
import cs.repository.odata.antlr.OdataFilterParser;

/**
 * Description: odata逻辑操作监听
 * Author: tzg
 * Date: 2017/8/15 12:07
 */
public class OdataLogicListenrer extends OdataFilterBaseListener {

    /**
     * 过滤条件
     */
    private List<OdataFilter> filterList = new ArrayList<>();


    public List<OdataFilter> getFilterList() {
        return filterList;
    }

    @Override
    public void enterCriteriaIterm(OdataFilterParser.CriteriaItermContext ctx) {
        OdataLogicListenrer oll = new OdataLogicListenrer();
        ctx.criteriaFactor().forEach(x -> x.enterRule(oll));
        List<OdataFilter> filters = oll.getFilterList();
        if (ObjectUtils.isNotEmpty(filters)) {
            this.filterList.add(filters.size() == 1 ? filters.get(0) :
                    new OdataFilter(null, OdataFilter.Operate.AND, filters));
        }
    }

    @Override
    public void enterCriteriaFactor(OdataFilterParser.CriteriaFactorContext ctx) {
        OdataListener ocl = new OdataListener();
        if (ObjectUtils.isNotEmpty(ctx.simpleCriteria())) {
            ctx.simpleCriteria().enterRule(ocl);
        } else if (ObjectUtils.isNotEmpty(ctx.criteriaExpression())) {
            ctx.criteriaExpression().enterRule(ocl);
        }
        if (ObjectUtils.isNotEmpty(ocl.getFilter())) {
            filterList.add(ocl.getFilter());
        }
    }

}
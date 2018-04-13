package cs.repository.odata;

import java.text.NumberFormat;
import java.text.ParseException;
import java.util.List;

import org.apache.commons.lang3.time.DateUtils;

import cs.common.ObjectUtils;
import cs.common.StringUtil;
import cs.repository.odata.antlr.OdataFilterBaseListener;
import cs.repository.odata.antlr.OdataFilterParser;

/**
 * Description: odata 过滤条件解析监听
 * Author: tzg
 * Date: 2017/8/14 11:41
 */
public class OdataListener extends OdataFilterBaseListener {

    /**
     * 过滤条件
     */
    private OdataFilter filter;

    public OdataFilter getFilter() {
        return filter;
    }

    @Override
    public void enterCriteriaExpression(OdataFilterParser.CriteriaExpressionContext ctx) {
        OdataLogicListenrer oll = new OdataLogicListenrer();
        ctx.criteriaIterm().forEach(x -> x.enterRule(oll));
        List<OdataFilter> filters = oll.getFilterList();
        if (ObjectUtils.isNotEmpty(filters)) {
            this.filter = filters.size() == 1 ? filters.get(0) :
                    new OdataFilter(null, OdataFilter.Operate.OR, filters);
        }
    }

    @Override
    public void enterSimpleCriteria(OdataFilterParser.SimpleCriteriaContext ctx) {
        if (ObjectUtils.isNotEmpty(ctx.criteriaLike())) {
            ctx.criteriaLike().enterRule(this);
        } else if (ObjectUtils.isNotEmpty(ctx.criteriaNotLike())) {
            ctx.criteriaNotLike().enterRule(this);
        } else if (ObjectUtils.isNotEmpty(ctx.criteriaOther())) {
            ctx.criteriaOther().enterRule(this);
        }
    }

    @Override
    public void enterCriteriaLike(OdataFilterParser.CriteriaLikeContext ctx) {
        try {
            this.filter = new OdataFilter(ctx.field().getText(), OdataFilter.Operate.LIKE, extractValue(ctx.value()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void enterCriteriaEndswith(OdataFilterParser.CriteriaEndswithContext ctx) {
        try {
            this.filter = new OdataFilter(ctx.field().getText(), OdataFilter.Operate.LIKE, extractValue(ctx.value()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void enterCriteriaNotLike(OdataFilterParser.CriteriaNotLikeContext ctx) {
        try {
            this.filter = new OdataFilter(ctx.field().getText(), OdataFilter.Operate.NOT_LIKE, extractValue(ctx.value()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    @Override
    public void enterCriteriaOther(OdataFilterParser.CriteriaOtherContext ctx) {
        try {
            this.filter = new OdataFilter(ctx.field().getText(), ctx.operate().getText(), extractValue(ctx.value()));
        } catch (ParseException e) {
            e.printStackTrace();
        }
    }

    /**
     * 抽取实际值
     *
     * @param valueContext
     * @return
     */
    public static Object extractValue(OdataFilterParser.ValueContext valueContext) throws ParseException {
        String value = valueContext.getText();
        if (null == value) {
            throw new IllegalArgumentException("参数值有误");
        }
        if (value.startsWith("'")) {
            return value.substring(1, value.length() - 1).trim();
        } else if (value.startsWith("datetime'")) {
            value = value.substring("datetime'".length(), value.length() - 1).replace("T", " ");
            return DateUtils.parseDate(value, "yyyy-MM-dd hh:mm:ss");
        } else if ("true".equalsIgnoreCase(value) || "false".equalsIgnoreCase(value)) {
            return Boolean.valueOf(value);
        } else if ("null".equalsIgnoreCase(value)) {
            return null;
        } else if (StringUtil.isNumber(value)) {
            return NumberFormat.getInstance().parse(value);
        }

        return value;
    }

}
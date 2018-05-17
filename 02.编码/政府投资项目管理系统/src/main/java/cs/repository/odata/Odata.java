package cs.repository.odata;

import java.io.Serializable;
import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLDecoder;
import java.util.ArrayList;
import java.util.List;

import javax.servlet.http.HttpServletRequest;

import org.antlr.v4.runtime.ANTLRInputStream;
import org.antlr.v4.runtime.CommonTokenStream;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import cs.common.EntityFieldInfo;
import cs.common.ObjectUtils;
import cs.common.StringUtil;
import cs.repository.odata.antlr.OdataFilterLexer;
import cs.repository.odata.antlr.OdataFilterParser;

/**
 * OData抽象类
 * Created by lqs on 2017/7/19.
 */
public abstract class Odata implements Serializable {

    protected Logger logger = LoggerFactory.getLogger(getClass());

    //    protected String select;
    protected int skip = 0;
    protected int top = 0;
    protected int count = 0;
    protected boolean isCount = false;

    public int getSkip() {
        return skip;
    }

    public int getTop() {
        return top;
    }

    public int getCount() {
        return count;
    }

    public boolean isCount() {
        return isCount;
    }

    public Odata() { }

    public Odata(HttpServletRequest request) {
        String filter = request.getParameter("$filter");
        String[] orderby = request.getParameterValues("$orderby");
//        select = request.getParameter("$select");
        String skipStr = request.getParameter("$skip");
        if (StringUtil.isNotBlank(skipStr)) {
            skip = Integer.valueOf(skipStr);
        }
        String topStr = request.getParameter("$top");
        if (StringUtil.isNotBlank(topStr)) {
            top = Integer.valueOf(topStr);
        }
        String inlinecount = request.getParameter("$inlinecount");
        isCount = StringUtil.isNotBlank(inlinecount);

        if (StringUtil.isNotBlank(filter)) { // 参数解码，主要解决中文乱码问题
//            filter = filter.replace("&#39;", "'");  // xss已转义了单引号
            try {
                // 解码，避免中文乱码
                filter = URLDecoder.decode(filter, "UTF-8");
            } catch (UnsupportedEncodingException e) {
                e.printStackTrace();
            }
            parseFilter(filter);
        }

        parseOrderby(orderby, false);
    }

    public Odata(String filter, String[] orderby) {
        this(filter, orderby, false, 0, 0);
    }

    public Odata(String filter, String[] orderby, boolean isCount, int skip, int top) {
        this.isCount = isCount;
        this.skip = skip;
        this.top = top;

        parseFilter(filter);

        parseOrderby(orderby, false);
    }

    //====================================================================================
    /**
     * 过滤条件
     */
    protected List<OdataFilter> filterList = new ArrayList<>();
    /**
     * 排序字段
     */
    protected List<OdataOrderby> orderbyList = new ArrayList<>();

    // 解析查询条件
    public void parseFilter(String filter) {
        if (ObjectUtils.isNotEmpty(filter)) {
            if (logger.isDebugEnabled()) {
                logger.debug("开始解析过滤条件：{}", filter);
            }
            OdataFilterLexer lexer = new OdataFilterLexer(new ANTLRInputStream(filter));
            CommonTokenStream tokens = new CommonTokenStream(lexer);
            OdataFilterParser filterParser = new OdataFilterParser(tokens);

            OdataListener ocl = new OdataListener();
            filterParser.criteriaExpression().enterRule(ocl);
            if (null != ocl.getFilter()) {
                filterList.add(ocl.getFilter());
            }
            if (logger.isDebugEnabled()) {
                logger.debug("完成过滤条件解析：{}", filterList);
            }
        }
    }

    /**
     * 解析排序（默认为asc）
     *
     * @param orderby
     */
    public void parseOrderby(String[] orderby, boolean isCall) {
        if (ObjectUtils.isNotEmpty(orderby)) {
            if (!isCall && logger.isDebugEnabled()) {
                logger.debug("开始解析排序：{}", orderby);
            }
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
                    addOrderby(fieldName, orderbyItems.length == 2 && "desc".equalsIgnoreCase(orderbyItems[1]));
                }
            }
            if (!isCall && logger.isDebugEnabled()) {
                logger.debug("完成排序解析：{}", orderbyList);
            }
        }
    }

    public void setSkip(int skip) {
		this.skip = skip;
	}

	public void setTop(int top) {
		this.top = top;
	}

	public void setCount(int count) {
		this.count = count;
	}

	public void setCount(boolean isCount) {
		this.isCount = isCount;
	}

	public List<OdataFilter> getFilterList() {
		return filterList;
	}

	public void setFilterList(List<OdataFilter> filterList) {
		this.filterList = filterList;
	}

	/**
     * 添加过滤条件
     *
     * @param fielName
     * @param operate
     * @param value
     * @return
     */
    public Odata addFilter(String fielName, String operate, Object value) {
        return addFilter(new OdataFilter(fielName, operate, value));
    }

    /**
     * 添加过滤条件
     *
     * @param fielName
     * @param operate
     * @param value
     * @return
     */
    public Odata addFilter(String fielName, OdataFilter.Operate operate, Object value) {
        return addFilter(new OdataFilter(fielName, operate, value));
    }

    /**
     * 添加过滤条件
     *
     * @param filter
     * @return
     */
    public Odata addFilter(OdataFilter filter) {
        filterList.add(filter);
        return this;
    }

    /**
     * 添加排序字段
     *
     * @param field
     * @param orderbyDesc
     * @return
     */
    public Odata addOrderby(String field, boolean orderbyDesc) {
        orderbyList.add(new OdataOrderby(field, orderbyDesc));
        return this;
    }

    public List<OdataOrderby> getOrderbyList() {
        return orderbyList;
    }

    public void setOrderbyList(List<OdataOrderby> orderbyList) {
        this.orderbyList = orderbyList;
    }


    /**
     * 获取真实字段值，目前主要针对数字类型的字段
     *
     * @param fieldInfo 字段信息
     * @param val       字段值
     * @return
     */
    public final static Object getFieldValue(EntityFieldInfo fieldInfo, Object val) {
        if (null != fieldInfo) {
            if (Long.class.getName().equals(fieldInfo.getFieldType())) {
                return ObjectUtils.toLong(val);
            } else if (Integer.class.getName().equals(fieldInfo.getFieldType())) {
                return ObjectUtils.toInteger(val);
            } else if (Float.class.getName().equals(fieldInfo.getFieldType())) {
                return ObjectUtils.toFloat(val);
            } else if (Double.class.getName().equals(fieldInfo.getFieldType())) {
                return ObjectUtils.toDouble(val);
            } else if (BigDecimal.class.getName().equals(fieldInfo.getFieldType())) {
                return ObjectUtils.toBigDecimal(val);
            }
        }
        return val;
    }

    // 别名分隔符
    public final static String ALIAS_SEPARATOR = "\\.";

}

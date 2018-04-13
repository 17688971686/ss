package cs.repository.odata;

/**
 * Description: 排序字段实体类
 * Author: tzg
 * Date: 2017/7/26 11:45
 */
public class OdataOrderby {

    private String field;
    private boolean orderbyDesc = false;

    public OdataOrderby(String field, boolean orderbyDesc) {
        this.field = field;
        this.orderbyDesc = orderbyDesc;
    }

    public String getField() {
        return field;
    }

    public void setField(String field) {
        this.field = field;
    }

    public boolean isOrderbyDesc() {
        return orderbyDesc;
    }

    public void setOrderbyDesc(boolean orderbyDesc) {
        this.orderbyDesc = orderbyDesc;
    }

    @Override
    public String toString() {
        return "OdataOrderby{" +
                "field='" + field + '\'' +
                ", orderbyDesc=" + orderbyDesc +
                '}';
    }
}
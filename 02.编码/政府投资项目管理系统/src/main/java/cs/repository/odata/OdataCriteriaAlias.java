package cs.repository.odata;

import org.hibernate.sql.JoinType;

/**
 * Description:
 *
 * @author: tzg
 * @date: 2017/10/30 17:21
 */
public class OdataCriteriaAlias {

    private String fieldName;
    private String alias;
    private JoinType joinType;

    public OdataCriteriaAlias(String fieldName, String alias) {
        this.fieldName = fieldName;
        this.alias = alias;
        this.joinType = JoinType.INNER_JOIN;
    }

    public OdataCriteriaAlias(String fieldName, String alias, JoinType joinType) {
        this.fieldName = fieldName;
        this.alias = alias;
        this.joinType = joinType;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getAlias() {
        return alias;
    }

    public void setAlias(String alias) {
        this.alias = alias;
    }

    public JoinType getJoinType() {
        return joinType;
    }

    public void setJoinType(JoinType joinType) {
        this.joinType = joinType;
    }

    @Override
    public boolean equals(Object object) {
        if (this == object) {
            return true;
        }
        if (object == null || getClass() != object.getClass()) {
            return false;
        }

        OdataCriteriaAlias alias1 = (OdataCriteriaAlias) object;

        if (!fieldName.equals(alias1.fieldName)) {
            return false;
        }
        return alias.equals(alias1.alias);
    }

    @Override
    public int hashCode() {
        int result = fieldName.hashCode();
        result = 31 * result + alias.hashCode();
        return result;
    }

}
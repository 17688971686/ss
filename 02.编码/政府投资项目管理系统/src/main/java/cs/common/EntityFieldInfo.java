package cs.common;

import java.io.Serializable;

/**
 * Description: 实体字段信息类
 * Author: tzg
 * Date: 2017/6/1 11:25
 */
public class EntityFieldInfo implements Serializable {

    private static final long serialVersionUID = -7290706947042089210L;

    private String fieldName;
    private String fieldType;
    private String fieldColumn;

    public EntityFieldInfo() {
    }

    public EntityFieldInfo(String fieldName, String fieldType) {
        this.fieldName = fieldName;
        this.fieldType = fieldType;
    }

    public String getFieldName() {
        return fieldName;
    }

    public void setFieldName(String fieldName) {
        this.fieldName = fieldName;
    }

    public String getFieldType() {
        return fieldType;
    }

    public void setFieldType(String fieldType) {
        this.fieldType = fieldType;
    }

    public String getFieldColumn() {
        return fieldColumn;
    }

    public void setFieldColumn(String fieldColumn) {
        this.fieldColumn = fieldColumn;
    }

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        EntityFieldInfo that = (EntityFieldInfo) o;

        if (fieldName != null ? !fieldName.equals(that.fieldName) : that.fieldName != null) return false;
        if (fieldType != null ? !fieldType.equals(that.fieldType) : that.fieldType != null) return false;
        return fieldColumn != null ? fieldColumn.equals(that.fieldColumn) : that.fieldColumn == null;
    }

    @Override
    public int hashCode() {
        int result = fieldName != null ? fieldName.hashCode() : 0;
        result = 31 * result + (fieldType != null ? fieldType.hashCode() : 0);
        result = 31 * result + (fieldColumn != null ? fieldColumn.hashCode() : 0);
        return result;
    }
}
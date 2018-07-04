//package cs.repository.odata;
//
//import java.io.Serializable;
//
///**
// * Description: odata 过滤条件实体
// * Author: tzg
// * Date: 2017/8/22 19:09
// */
//public class OdataFilter<T> implements Serializable {
//
//    private String filedName;
//    private Operate operate;
//    private T value;
//
//    /**
//     * 条件过滤操作
//     */
//    public enum Operate {
//        AND,
//        OR,
//        LIKE,
//        NOT_LIKE,
//        EQ,
//        NE,
//        GT,
//        GE,
//        LT,
//        LE,
//        ENDSWITH,
//        STARTSWITH,
//        IN,
//        NI,
//        ;
//    }
//
//    public OdataFilter(String filedName, String operate, T value) {
//        this(filedName, Operate.valueOf(operate.toUpperCase()), value);
//    }
//
//    public OdataFilter(String filedName, Operate operate, T value) {
//        this.filedName = filedName;
//        this.operate = operate;
//        this.value = value;
//    }
//
//    public String getFiledName() {
//        return filedName;
//    }
//
//    public void setFiledName(String filedName) {
//        this.filedName = filedName;
//    }
//
//    public Operate getOperate() {
//        return operate;
//    }
//
//    public void setOperate(Operate operate) {
//        this.operate = operate;
//    }
//
//    public T getValue() {
//        return value;
//    }
//
//    public void setValue(T value) {
//        this.value = value;
//    }
//
//    @Override
//    public String toString() {
//        return "OdataFilter{" +
//                "filedName='" + filedName + '\'' +
//                ", operate=" + operate +
//                ", value=" + value +
//                '}';
//    }
//}
//package cs.common;
//
//import org.springframework.beans.BeanUtils;
//import org.springframework.util.Assert;
//
//import javax.persistence.Id;
//import java.beans.PropertyDescriptor;
//import java.lang.reflect.*;
//import java.math.BigDecimal;
//import java.math.BigInteger;
//import java.text.ParseException;
//import java.text.SimpleDateFormat;
//import java.util.Collection;
//import java.util.Date;
//import java.util.Map;
//
///**
// * Description: 对象工具类
// * Author: tzg
// * Date: 2017/5/13 12:44
// */
//public class ObjectUtils {
//
//    /**
//     * 把对象转成字符串
//     *
//     * @param obj
//     * @return
//     */
//    public static String toString(Object obj) {
//        if (null == obj) {
//            return null;
//        }
//        if (obj instanceof String) {
//            return (String) obj;
//        }
//        return String.valueOf(obj);
//    }
//
//    /**
//     * 把对象转为整数
//     *
//     * @param obj
//     * @return
//     */
//    public static Integer toInteger(Object obj) {
//        if (isEmpty(obj)) {
//            return null;
//        }
//        if (obj instanceof Long) {
//            return ((Long) obj).intValue();
//        } else if (obj instanceof Integer) {
//            return (Integer) obj;
//        }
//        return Integer.parseInt(toString(obj));
//    }
//
//    /**
//     * 把对象转为长整数
//     *
//     * @param obj
//     * @return
//     */
//    public static Long toLong(Object obj) {
//        if (isEmpty(obj)) {
//            return null;
//        }
//        if (obj instanceof Long) {
//            return (Long) obj;
//        }
//        return Long.parseLong(toString(obj));
//    }
//
//    public final static SimpleDateFormat datatime_format = new SimpleDateFormat("yyyy-MM-dd HH:mm:ss"),
//            data_format = new SimpleDateFormat("yyyy-MM-dd");
//
//    public static Date toDatetime(String dateStr) {
//        if (StringUtil.isNotBlank(dateStr)) {
//            try {
//                return datatime_format.parse(dateStr);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//        }
//        return null;
//    }
//
//    public static Date toDate(String dateStr) {
//        if (StringUtil.isNotBlank(dateStr)) {
//            try {
//                return data_format.parse(dateStr);
//            } catch (ParseException e) {
//                e.printStackTrace();
//            }
//        }
//        return null;
//    }
//
//    /**
//     * 把对象转为双精度型
//     *
//     * @param obj
//     * @return
//     */
//    public static Double toDouble(Object obj) {
//        if (isEmpty(obj)) {
//            return null;
//        }
//        if (obj instanceof Double) {
//            return (Double) obj;
//        }
//        return Double.parseDouble(toString(obj));
//    }
//
//    /**
//     * 把对象转为单精度型
//     *
//     * @param obj
//     * @return
//     */
//    public static Float toFloat(Object obj) {
//        if (isEmpty(obj)) {
//            return null;
//        }
//        if (obj instanceof Float) {
//            return (Float) obj;
//        }
//        return Float.parseFloat(toString(obj));
//    }
//
//    public static BigDecimal toBigDecimal(Object obj) {
//        if (isEmpty(obj)) {
//            return null;
//        }
//        if (obj instanceof BigDecimal) {
//            return (BigDecimal) obj;
//        } else if (obj instanceof String) {
//            return new BigDecimal((String) obj);
//        } else if (obj instanceof BigInteger) {
//            return new BigDecimal((BigInteger) obj);
//        } else if (obj instanceof Number) {
//            return new BigDecimal(((Number) obj).doubleValue());
//        } else {
//            throw new ClassCastException("Not possible to coerce [" + obj + "] from class " + obj.getClass() + " into a BigDecimal.");
//        }
//    }
//
//    /**
//     * 判断对象是否为空
//     *
//     * @param obj
//     * @return
//     */
//    public static boolean isEmpty(Object obj) {
//        if (null == obj) {
//            return true;
//        }
//        if (obj instanceof CharSequence) {
//            return toString(obj).trim().isEmpty(); // 去除前后空格
//        } else if (obj instanceof Collection) {
//            return ((Collection) obj).isEmpty();
//        } else if (obj.getClass().isArray()) {
//            return isAnyEmpty((Object[]) obj);
//        } else if (obj instanceof Map) {
//            return ((Map) obj).isEmpty();
//        }
//        return false;
//    }
//
//    /**
//     * 判断对象不为空
//     *
//     * @param obj
//     * @return
//     */
//    public static boolean isNotEmpty(Object obj) {
//        return !isEmpty(obj);
//    }
//
//    /**
//     * 判断多个对象是否为空，只要有一个为空，就返回false
//     *
//     * @param objects
//     * @return
//     */
//    public static boolean isAnyEmpty(Object... objects) {
//        boolean flag = true;
//        for (int i = 0, len = objects.length; i < len; i++) {
//            flag = isEmpty(objects[i]);
//            if (flag) {
//                break;
//            }
//        }
//        return flag;
//    }
//
//    /**
//     * 判断对象不为空
//     *
//     * @param objects
//     * @return
//     */
//    public static boolean isNoneEmpty(Object... objects) {
//        return !isAnyEmpty(objects);
//    }
//
//    /**
//     * 设置对象的属性值
//     *
//     * @param obj       字段所属对象
//     * @param fieldName 字段名
//     * @param value     字段值
//     * @throws IllegalAccessException
//     * @throws NoSuchMethodException
//     * @throws InvocationTargetException
//     */
//    public static void setFieldValue(Object obj, String fieldName, Object value) throws IllegalAccessException, NoSuchFieldException {
//        if (ObjectUtils.isAnyEmpty(obj, fieldName)) {
//            throw new IllegalArgumentException("参数有误");
//        }
//        Field f = obj.getClass().getDeclaredField(fieldName);
//        f.setAccessible(true);
//        f.set(obj, getAttrValue(f, value));
//    }
//
//    /**
//     * 获取字段值
//     *
//     * @param f
//     * @param attrVal
//     * @return
//     */
//    public static Object getAttrValue(Field f, Object attrVal) {
//        if (f.getType().equals(Long.class) || f.getType().equals(long.class)) {
//            attrVal = toLong(attrVal);
//        } else if (f.getType().equals(Integer.class) || f.getType().equals(int.class)) {
//            attrVal = toInteger(attrVal);
//        } else if (f.getType().equals(Double.class) || f.getType().equals(double.class)) {
//            attrVal = toDouble(attrVal);
//        } else if (f.getType().equals(Float.class) || f.getType().equals(float.class)) {
//            attrVal = toFloat(attrVal);
//        } else if (f.getType().equals(Date.class)) {
//            attrVal = new Date();
//        } else if (f.getType().equals(String.class)) {
//            attrVal = toString(attrVal);
//        }
//        return attrVal;
//    }
//
//    /**
//     * 调用set方法设置字段值
//     *
//     * @param obj       字段所属对象
//     * @param fieldName 字段名
//     * @param value     字段值
//     */
//    public static void methodInvokeSetFieldValue(Object obj, String fieldName, Object value) throws IllegalAccessException, NoSuchMethodException, InvocationTargetException {
//        if (StringUtil.isBlank(fieldName)) {
//            throw new IllegalArgumentException("参数fieldName有误");
//        }
//        methodInvoke(obj, "set".concat(StringUtil.upperCaseFirst(fieldName)), value);
//    }
//
//    /**
//     * 获取对象的属性值
//     *
//     * @param obj       字段所属对象
//     * @param fieldName 字段名
//     * @param <T>
//     * @return
//     * @throws NoSuchFieldException
//     * @throws IllegalAccessException
//     */
//    public static <T> T getFieldValue(Object obj, String fieldName) throws InvocationTargetException, IllegalAccessException {
//        if (ObjectUtils.isAnyEmpty(obj, fieldName)) {
//            throw new IllegalArgumentException("参数有误");
//        }
//        PropertyDescriptor[] targetPds = BeanUtils.getPropertyDescriptors(obj.getClass());
//        for (PropertyDescriptor targetPd : targetPds) {
//            Method readMethod = targetPd.getReadMethod();
//            if (readMethod != null && ("get" + fieldName).equalsIgnoreCase(readMethod.getName())) {
//                if (!Modifier.isPublic(readMethod.getDeclaringClass().getModifiers())) {
//                    readMethod.setAccessible(true);
//                }
//                return (T) readMethod.invoke(obj);
//            }
//        }
//        return null;
//    }
//
//
//    /**
//     * 调用对象的方法
//     *
//     * @param obj        方法所属对象
//     * @param methodName 方法名
//     * @param args       方法入参
//     * @throws InvocationTargetException
//     * @throws IllegalAccessException
//     * @throws NoSuchMethodException
//     */
//    public static <T> T methodInvoke(Object obj, String methodName, Object... args) throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
//        if (ObjectUtils.isEmpty(obj)) {
//            throw new IllegalArgumentException("参数有误");
//        }
//        return methodInvoke((Class<T>) obj.getClass(), obj, methodName, args);
//    }
//
//    /**
//     * 调用对象方法
//     *
//     * @param cls
//     * @param obj
//     * @param methodName
//     * @param args
//     * @param <T>
//     * @return
//     * @throws InvocationTargetException
//     * @throws IllegalAccessException
//     * @throws NoSuchMethodException
//     */
//    public static <T> T methodInvoke(Class<T> cls, Object obj, String methodName, Object... args) throws InvocationTargetException, IllegalAccessException, NoSuchMethodException {
//        if (ObjectUtils.isAnyEmpty(cls, obj, methodName)) {
//            throw new IllegalArgumentException("参数有误");
//        }
//        Class[] argCls = new Class[args.length];
//        for (int i = 0; i < args.length; i++) {
//            argCls[i] = args[i].getClass();
//        }
//        Method getM = cls.getMethod(methodName, argCls);
//        return (T) getM.invoke(obj, args);
//    }
//
//    /**
//     * 获取实体的ID字段（针对javax.persistence.Id注解）
//     *
//     * @param cls
//     * @return
//     */
//    public static Field getIdField(Class cls) {
//        Field[] fields = cls.getDeclaredFields();
//        for (Field f : fields) {
//            if (f.isAnnotationPresent(Id.class)) {
//                return f;
//            }
//        }
//        return null;
//    }
//
//    /**
//     * 获取实体的主键值（针对javax.persistence.Id注解）
//     *
//     * @param entity
//     * @return
//     */
//    public static Object getIdFieldValue(Object entity) {
//        Field idField = getIdField(entity.getClass());
//        idField.setAccessible(true);
//        try {
//            return idField.get(entity);
//        } catch (IllegalAccessException e) {
//            e.printStackTrace();
//        }
//        return null;
//    }
//
//    /**
//     * 反射对象获取泛型
//     *
//     * @param cls   对象
//     * @param index 泛型所在位置
//     * @return Class
//     */
//    public static Class getSuperClassGenricType(final Class cls, final int index) {
//        Type genType = cls.getGenericSuperclass();
//
//        if (!(genType instanceof ParameterizedType)) {
////            logger.warn(String.format("Warn: %s's superclass not ParameterizedType", cls.getSimpleName()));
//            return Object.class;
//        }
//
//        Type[] params = ((ParameterizedType) genType).getActualTypeArguments();
//
//        if (index >= params.length || index < 0) {
////            logger.warn(String.format("Warn: Index: %s, Size of %s's Parameterized Type: %s .", index, cls.getSimpleName(), params.length));
//            return Object.class;
//        }
//        if (!(params[index] instanceof Class)) {
////            logger.warn(String.format("Warn: %s not set the actual class on superclass generic parameter", cls.getSimpleName()));
//            return Object.class;
//        }
//
//        return (Class) params[index];
//    }
//
//    /**
//     * 属性拷贝方法
//     *
//     * @param targetCls
//     * @param source
//     * @param ignoreProperties
//     * @param <T>
//     * @return
//     */
//    public static <T> T convert(Class<T> targetCls, Object source, String... ignoreProperties) {
//        Assert.notNull(targetCls);
//        try {
//            T entity = targetCls.newInstance();
//            BeanUtils.copyProperties(source, entity, ignoreProperties);
//            return entity;
//        } catch (Exception e) {
//            throw new RuntimeException("Error: Conversion Object Failed. Cause:" + e);
//        }
//    }
//
//}
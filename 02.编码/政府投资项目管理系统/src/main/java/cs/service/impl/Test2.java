package cs.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

/**
 * Created by Administrator on 2018/5/14 0014.
 */
public class Test2 {

    public static void main(String[] args){
        double a = 0.0;
        double b =0.0;

        Double.doubleToLongBits(a);
        Double.doubleToLongBits(b);
        System.out.println(a <= b);

        System.out.println(Double.doubleToLongBits(a) > Double.doubleToLongBits(b));
    }

}

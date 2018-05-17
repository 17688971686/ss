package cs.service.impl;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
public class WorkDayAdd {
    // 计算 时间间隔
    public int getLimitTime(int dayNum){
        return (dayNum/5)*7 +(dayNum%5)-1;
    }
    private static Date addWorkDay(Date date, int num) {
        Calendar cal = Calendar.getInstance();
        cal.setTime(date);
        int mod = num % 5;
        int other = num / 5 * 7;
        for (int i = 0; i < mod;) {
            cal.add(Calendar.DATE, 1);
            switch (cal.get(Calendar.DAY_OF_WEEK)) {
                case Calendar.SUNDAY:
                case Calendar.SATURDAY:
                    break;
                default:
                    i++;
                    break;
            }
        }
        if (other > 0)
            cal.add(Calendar.DATE, other);
        return cal.getTime();
    }
    public static void main(String[] args) {
         SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
         try{
             Date shenpiTime = simpleDateFormat.parse("2018-04-09");
             String  tt  = new SimpleDateFormat("yyyy-MM-dd").format(addWorkDay(shenpiTime, 10));
             System.out.println("time  "+tt);
         }catch (Exception e){

         }

    }
}
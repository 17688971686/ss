package cs.service.impl;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.*;

/**
 * Created by Administrator on 2018/5/14 0014.
 */
public class Test2 {
    /**
     * 获取2个日期之间周六，周日的天数
     * @param start
     * @param stop
     * @param format
     * @return
     */
    public static int getSundayNum(Date start, Date stop, String format) {
        List yearMonthDayList = new ArrayList();
        //将起止时间中的所有时间加到List中
        Calendar calendarTemp = Calendar.getInstance();
        calendarTemp.setTime(start);
        while (calendarTemp.getTime().getTime() <= stop.getTime()) {
            yearMonthDayList.add(new SimpleDateFormat(format)
                    .format(calendarTemp.getTime()));
            calendarTemp.add(Calendar.DAY_OF_YEAR, 1);
        }
        Collections.sort(yearMonthDayList);
        int num=0;//周六，周日的总天数
        int size=yearMonthDayList.size();
        int week=0;
        for (int i = 0; i < size; i++) {
            String day=(String)yearMonthDayList.get(i);
            System.out.println(day);
            week=getWeek(day, format);
            if (week==6||week==0) {//周六，周日
                num++;
            }
        }
        return num;
    }
    /**
     * 获取某个日期是星期几
     * @param date
     * @param format
     * @return 0-星期日
     */
    public static int getWeek(String date, String format) {
        Calendar calendarTemp = Calendar.getInstance();
        try {
            calendarTemp.setTime(new SimpleDateFormat(format).parse(date));
        } catch (Exception e) {
            e.printStackTrace();
        }
        int i = calendarTemp.get(Calendar.DAY_OF_WEEK);
        int value=i-1;//0-星期日
        //        System.out.println(value);
        return value;
    }
    public static void main(String[] args) {
        SimpleDateFormat simpleDateFormat = new SimpleDateFormat("yyyy-MM-dd");
        try{
            int i=getSundayNum(simpleDateFormat.parse("2018-04-23"), simpleDateFormat.parse("2018-10-30"), "yyyy-MM-dd");
            System.out.println(i);

        }catch (Exception e){

        }

    }

}

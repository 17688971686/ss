package cs.repository.impl;

import cs.common.utils.DateUtils;
import cs.common.utils.Validate;
import cs.domain.Workday;
import cs.domain.Workday_;
import cs.repository.interfaces.WorkdayRepo;
import org.hibernate.Criteria;
import org.hibernate.criterion.Order;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import java.util.Date;
import java.util.List;

/**
 * @Description: 日期管理持久层
 * @author: wcq
 * @Date：2017年9月12日
 * @version：0.1
 */
@SuppressWarnings({ "deprecation", "unchecked" })
@Repository
public class WorkdayRepoImpl extends AbstractRepository<Workday, String> implements WorkdayRepo {
    public boolean isExist(Date days) {
        Criteria criteria = this.getSession().createCriteria(Workday.class);
        criteria.add(Restrictions.eq(Workday_.dates.getName(), days));
        List<Workday> workdayList = criteria.list();
        return Validate.isList(workdayList);
    }

    /**
     * 计算从当前日期开始，一年内的调休记录
     *
     * @return
     */
    public List<Workday> findWorkDay(String beginTime, String endTime) {
        Criteria criteria = this.getSession().createCriteria(Workday.class);
        if (!Validate.isString(endTime)) {
            criteria.add(Restrictions.le(Workday_.dates.getName(), new Date()));
        } else {
            criteria.add(Restrictions.le(Workday_.dates.getName(), DateUtils.converToDate(endTime, DateUtils.DATE_PATTERN)));
        }
        if (Validate.isString(beginTime)) {
            criteria.add(Restrictions.ge(Workday_.dates.getName(), DateUtils.converToDate(beginTime, DateUtils.DATE_PATTERN)));
        }
        //按添加的日期排序
        criteria.addOrder(Order.asc(Workday_.dates.getName()));
        return criteria.list();
    }


    /**
     * 通过时间段获取
     *
     * @param startDate
     * @return
     */
    public List<Workday> getBetweenTimeDay(Date startDate, Date endDate) {
        //HqlBuilder hqlBuilder = HqlBuilder.create();
        //hqlBuilder.append("select * from cs_workday where dates > to_date('" + DateUtils.converToString(startDate, "yyyy-MM-dd") + "' , 'yyyy-MM-dd')");
        //hqlBuilder.append(" and dates < to_date('" + DateUtils.converToString(endDate, "yyyy-MM-dd") + "' , 'yyyy-MM-dd')");
        List<Workday> workdayList = null;
        //        this.findBySql(hqlBuilder);
        return workdayList;
    }

    public boolean isExistWorkDay(Date days, String temp) {
        Criteria criteria = null;
        //getExecutableCriteria();
        //criteria.add(Restrictions.eq(Workday_.dates.getName(), days));
        //criteria.add(Restrictions.eq(Workday_.status.getName(), temp));
        List<Workday> workdayList = criteria.list();
        return Validate.isList(workdayList);
    }
}

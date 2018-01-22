package cs.repository.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import cs.common.BasicDataConfig;
import cs.domain.TaskHead;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;




/**
 * @Description: 任务信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class TaskHeadRepoImpl extends AbstractRepository<TaskHead, String> {

	@SuppressWarnings({ "rawtypes", "deprecation", "unchecked" })
	public List<TaskHead> findByOdata3(ODataObj oDataObj, String userId, boolean plan) {
		logger.debug("findByOdata3");		
		Criteria crit = this.getSession().createCriteria(TaskHead.class);
		List<ODataFilterItem> filters = oDataObj.getFilter();
		if(filters !=null && filters.size()>0){
			for(ODataFilterItem filter:filters){
				String field = filter.getField();
				String operator = filter.getOperator();
				Object value = filter.getValue();
				switch (operator) {
				case "like":
					crit.add(Restrictions.like(field, "%" + value + "%"));
					break;
				case "eq":
					crit.add(Restrictions.eq(field, value));
					break;
				default:
					break;
				}
			}
		}
		Criterion cron1 = null;
		Criterion cron2 = null;
		Criterion cron3 = null;
		Criterion cron4 = null;
		Criterion criterionOr = null;
		if(plan){
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_JHXD);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_junGong);
			criterionOr=Restrictions.or(cron1,cron2);
		}else{
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_KXXYJBG);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_XMJYS);
			cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_CBSJYGS);
			criterionOr=Restrictions.or(cron1,cron2,cron3);
		}
		cron4 = Restrictions.eq("thisUser",userId);
		Criterion criterionAnd = Restrictions.and(cron4,criterionOr);
		crit.add(criterionAnd);
		//begin:page
		//count
		if(oDataObj.getIsCount()){	
			Integer totalResult = ((Number)crit.setProjection(Projections.rowCount()).uniqueResult()).intValue();
			oDataObj.setCount(totalResult);
			crit.setProjection(null);
		}
	
		if (oDataObj.getTop() != 0) {
			crit.setFirstResult(oDataObj.getSkip());
			crit.setMaxResults(oDataObj.getTop());
		}
		
		if (oDataObj.getOrderby() != null && !oDataObj.getOrderby().isEmpty()) {
			if (oDataObj.isOrderbyDesc()) {
				crit.addOrder(Property.forName(oDataObj.getOrderby()).desc());
			} else {
				crit.addOrder(Property.forName(oDataObj.getOrderby()).asc());
			}
		}		
		//end:page
		return crit.list();
	}

}

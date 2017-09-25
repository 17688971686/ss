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
import cs.domain.framework.Role;
import cs.repository.odata.ODataObj;




/**
 * @Description: 任务信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class TaskHeadRepoImpl extends AbstractRepository<TaskHead, String> {

	public List<TaskHead> findByOdata2(ODataObj oDataObj, String roleId, boolean plan) {
		logger.debug("findByOdata2");		
		Criteria crit = this.getSession().createCriteria(TaskHead.class);
		Criterion cron1 = null;
		Criterion cron2 = null;
		Criterion cron3 = null;
		if(plan == true){
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_qianQi);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_new);
			cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_xuJian);
			Criterion cron5 = Restrictions.eq("taskType",BasicDataConfig.taskType_junGong);
			
			Criterion cron4 = Restrictions.eq("processRole",roleId);
			
			Criterion criterionOr=Restrictions.or(cron1,cron2,cron3,cron5);
			Criterion criterionAnd = Restrictions.and(cron4,criterionOr);
			crit.add(criterionAnd);
		}else{
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_CBSJYGS);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_KXXYJBG);
			cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_XMJYS);
			Criterion cron4 = Restrictions.eq("processRole",roleId);
			
			Criterion criterionOr=Restrictions.or(cron1,cron2,cron3);
			Criterion criterionAnd = Restrictions.and(cron4,criterionOr);
			crit.add(criterionAnd);
		}
		
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

	public List<TaskHead> findByOdata3(ODataObj oDataObj, String userId, boolean plan) {
		logger.debug("findByOdata2");		
		Criteria crit = this.getSession().createCriteria(TaskHead.class);
		Criterion cron1 = null;
		Criterion cron2 = null;
		Criterion cron3 = null;
		if(plan == true){
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_qianQi);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_new);
			cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_xuJian);
			Criterion cron5 = Restrictions.eq("taskType",BasicDataConfig.taskType_junGong);
			
			Criterion cron4 = Restrictions.eq("nextUser",userId);
			
			Criterion criterionOr=Restrictions.or(cron1,cron2,cron3,cron5);
			Criterion criterionAnd = Restrictions.and(cron4,criterionOr);
			crit.add(criterionAnd);
		}else{
			cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_CBSJYGS);
			cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_KXXYJBG);
			cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_XMJYS);
			Criterion cron4 = Restrictions.eq("nextUser",userId);
			
			Criterion criterionOr=Restrictions.or(cron1,cron2,cron3);
			Criterion criterionAnd = Restrictions.and(cron4,criterionOr);
			crit.add(criterionAnd);
		}
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

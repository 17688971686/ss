package cs.repository.impl;

import java.util.Collection;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.domain.TaskRecord;
import cs.model.DomainDto.TaskRecordDto;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
/**
 * @Description: 任务流程信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class TaskRecordRepoImpl extends AbstractRepository<TaskRecord,String>  {
	@Autowired
	ICurrentUser currentUser;
	
	public List<TaskRecord> findByOdata2(ODataObj oDataObj) {
		logger.debug("findByOdata2");		
		Criteria crit = this.getSession().createCriteria(TaskRecord.class);
		List<ODataFilterItem> filters = oDataObj.getFilter();
		if(filters !=null && filters.size()>0){
			for(ODataFilterItem filter:filters){
				String field = filter.getField();
				String operator = filter.getOperator();
				Object value = filter.getValue();
				switch (operator) {
				case "like":
					Criterion crit8 = Restrictions.eq(field, value);
					crit.add(crit8);
					break;
				case "eq":
					
					Criterion crit6 = Restrictions.eq(field, value);
					crit.add(crit6);
					break;
				default:
					break;
				}
			}
		}
		
		Criterion cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_CBSJYGS);
		Criterion cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_KXXYJBG);
		Criterion cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_XMJYS);
		Criterion cron4 = Restrictions.eq("createdBy",currentUser.getUserId());
		
		Criterion criterionOr=Restrictions.or(cron1,cron2,cron3);
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

	public List<TaskRecord> findByOdata3(ODataObj oDataObj) {
		logger.debug("findByOdata3");		
		Criteria crit = this.getSession().createCriteria(TaskRecord.class);
		
		List<ODataFilterItem> filters = oDataObj.getFilter();
		if(filters !=null && filters.size()>0){
			for(ODataFilterItem filter:filters){
				String field = filter.getField();
				String operator = filter.getOperator();
				Object value = filter.getValue();
				switch (operator) {
				case "like":
					Criterion crit8 = Restrictions.like(field, "%" + value + "%");
					crit.add(crit8);
					break;
				case "eq":
					
					Criterion crit6 = Restrictions.eq(field, value);
					crit.add(crit6);
					break;
				default:
					break;
				}
			}
		}
		
		Criterion cron1 = Restrictions.eq("taskType",BasicDataConfig.taskType_qianQi);
		Criterion cron2 = Restrictions.eq("taskType",BasicDataConfig.taskType_new);
		Criterion cron3 = Restrictions.eq("taskType",BasicDataConfig.taskType_xuJian);
		Criterion cron5 = Restrictions.eq("taskType",BasicDataConfig.taskType_junGong);
		Criterion cron6 = Restrictions.eq("taskType",BasicDataConfig.taskType_ZJSQBG);
		Criterion cron4 = Restrictions.eq("createdBy",currentUser.getUserId());
		
		Criterion criterionOr=Restrictions.or(cron1,cron2,cron3,cron5,cron6);
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

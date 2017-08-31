package cs.repository.impl;

import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Disjunction;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import cs.common.ICurrentUser;
import cs.domain.TaskHead;
import cs.repository.odata.ODataObj;



/**
 * @Description: 任务信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class TaskHeadRepoImpl extends AbstractRepository<TaskHead, String> {
	
	@Autowired
	private ICurrentUser currentUser;

	public  List<TaskHead> findByOdata2(ODataObj odataObj) {
		
		Criteria crit = this.getSession().createCriteria(TaskHead.class);
		Disjunction dis = Restrictions.disjunction();
		dis.add(Restrictions.eq("nextUser", currentUser.getLoginName()));
		dis.add(Restrictions.eq("nextUser", ""));
		//begin:page
		//count
		if(odataObj.getIsCount()){	
					
			Integer totalResult = ((Number)crit.setProjection(Projections.rowCount()).uniqueResult()).intValue();
			odataObj.setCount(totalResult);
			crit.setProjection(null);
		}
	
		if (odataObj.getTop() != 0) {
			crit.setFirstResult(odataObj.getSkip());
			crit.setMaxResults(odataObj.getTop());
		}
		
		if (odataObj.getOrderby() != null && !odataObj.getOrderby().isEmpty()) {
			if (odataObj.isOrderbyDesc()) {
				crit.addOrder(Property.forName(odataObj.getOrderby()).desc());
			} else {
				crit.addOrder(Property.forName(odataObj.getOrderby()).asc());
			}
		}		
		//end:page
		crit.add(dis);
		
		return crit.list();
	}

}

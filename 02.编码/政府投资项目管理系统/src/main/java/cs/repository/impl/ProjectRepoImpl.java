package cs.repository.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;
import cs.domain.Project;
import cs.domain.Project_;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
/**
 * @Description: 项目信息持久层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Repository
public class ProjectRepoImpl extends AbstractRepository<Project	, String> {
	public List<Project> findByOdata2(ODataObj oDataObj,Boolean hasUnitNameFilter){
		logger.debug("findByOdata2");		
		Criteria crit = this.getSession().createCriteria(Project.class);
		List<ODataFilterItem> filters = oDataObj.getFilter();
		List<Criterion> allCriterions = new ArrayList<>();//所有的过滤条件
		List<Criterion> filterCriterions = new ArrayList<>();//操作人员添加的过滤条件
		//默认查询已纳入项目库的项目
		filterCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
		if(filters !=null && filters.size()>0){
			for(ODataFilterItem filter:filters){
				String field = filter.getField();
				String operator = filter.getOperator();
				Object value = filter.getValue();
				switch (operator) {
				case "like":
					allCriterions.add(Restrictions.like(field, "%" + value + "%"));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.like(field, "%" + value + "%"));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.like(field, "%" + value + "%"));
						}
					}
					break;
				case "eq":
					allCriterions.add(Restrictions.eq(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.eq(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.eq(field, value));
						}
					}
					break;
				case "ne":
					allCriterions.add(Restrictions.ne(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.ne(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.ne(field, value));
						}
					}
					break;
				case "gt":
					allCriterions.add(Restrictions.gt(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.gt(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.gt(field, value));
						}
					}
					break;
				case "ge":
					allCriterions.add(Restrictions.ge(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.ge(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.ge(field, value));
						}
					}
					break;
				case "lt":
					allCriterions.add(Restrictions.lt(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.lt(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.lt(field, value));
						}
					}
					break;
				case "le":
					allCriterions.add(Restrictions.le(field, value));
					if(hasUnitNameFilter){//如果有单位过滤
						if(!field.equals("isLatestVersion")){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.le(field, value));
						}
					}else{//如果没有单位过滤（默认条件中添加了单位为登陆单位）
						if(!(field.equals("isLatestVersion") || field.equals("unitName"))){//判断过滤条件是否不是默认条件
							filterCriterions.add(Restrictions.le(field, value));
						}
					}
					break;
				default:
					break;
				}
			}
		}
		Conjunction conjunction1 = Restrictions.conjunction();
		Conjunction conjunction2 = Restrictions.conjunction();
		for(Criterion criterion1:allCriterions){
			conjunction1.add(criterion1);
		}
		for(Criterion criterion2:filterCriterions){
			conjunction2.add(criterion2);
		}
		Criterion rest1 = Restrictions.and(conjunction1);
		Criterion rest2= Restrictions.and(conjunction2);
		crit.add(Restrictions.or(rest1,rest2));
		return crit.list();
	}
}

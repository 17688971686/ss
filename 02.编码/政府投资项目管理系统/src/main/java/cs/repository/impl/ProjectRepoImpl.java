package cs.repository.impl;

import java.util.ArrayList;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.Conjunction;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Property;
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
	@SuppressWarnings({ "deprecation", "rawtypes", "unchecked" })
	public List<Project> findByOdata2(ODataObj oDataObj,Boolean isFilters,Boolean hasUnitFilter,Boolean isUnitFilter){
		logger.debug("findByOdata2");		
		Criteria crit = this.getSession().createCriteria(Project.class);
		List<ODataFilterItem> filters = oDataObj.getFilter();
		List<Criterion> unitFiltersCriterions = new ArrayList<>();//本单位过滤条件
		List<Criterion> filterCriterions = new ArrayList<>();//已纳入项目库中的过滤条件
		//默认查询已纳入项目库的项目
		filterCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
		if(filters !=null && filters.size()>0){
			for(ODataFilterItem filter:filters){
				String field = filter.getField();
				String operator = filter.getOperator();
				Object value = filter.getValue();
				switch (operator) {
				case "like":
					if(isFilters){//如果有额外的过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果是本单位过滤
								unitFiltersCriterions.add(Restrictions.like(field, "%" + value + "%"));
								filterCriterions=unitFiltersCriterions;
							}else{//如果是其他单位过滤
								unitFiltersCriterions.add(Restrictions.like(field, "%" + value + "%"));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.like(field, "%" + value + "%"));
							}
						}else{//如果没有单位过滤
							unitFiltersCriterions.add(Restrictions.like(field, "%" + value + "%"));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.like(field, "%" + value + "%"));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.like(field, "%" + value + "%"));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "eq":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.eq(field, value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果是其他单位过滤
								unitFiltersCriterions.add(Restrictions.eq(field, value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.eq(field, value));
							}
						}else{//如果没有单位过滤条件
							unitFiltersCriterions.add(Restrictions.eq(field, value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.eq(field, value));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.eq(field, value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "ne":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.ne(field,value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果是其他单位过滤
								unitFiltersCriterions.add(Restrictions.ne(field, value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.ne(field, value));
							}
						}else{//如果没有单位过滤条件
							unitFiltersCriterions.add(Restrictions.ne(field,value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.ne(field, value));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.ne(field,value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "gt":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.gt(field,value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果是其他单位过滤
								unitFiltersCriterions.add(Restrictions.gt(field, value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.gt(field, value));
							}
						}else{//如果没有单位过滤条件
							unitFiltersCriterions.add(Restrictions.gt(field,value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.gt(field, value));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.gt(field,value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "ge":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.ge(field,value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果没有本单位过滤条件
								unitFiltersCriterions.add(Restrictions.ge(field,value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.ge(field,value));
							}
						}else{//如果没有单位过滤条件
							unitFiltersCriterions.add(Restrictions.ge(field,value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.ge(field, value));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.ge(field,value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "lt":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.lt(field, value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果没有本单位过滤条件
								unitFiltersCriterions.add(Restrictions.lt(field, value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.lt(field, value));
							}
						}else{//如果没有单位过滤条件
							unitFiltersCriterions.add(Restrictions.lt(field, value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.lt(field, value));
							}
						}
					}else{
						unitFiltersCriterions.add(Restrictions.lt(field, value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				case "le":
					if(isFilters){//如果有过滤条件
						if(hasUnitFilter){//如果有单位过滤
							if(isUnitFilter){//如果有本单位过滤
								unitFiltersCriterions.add(Restrictions.le(field, value));
								filterCriterions=unitFiltersCriterions;
							}else{//如果没有本单位过滤条件
								unitFiltersCriterions.add(Restrictions.le(field, value));
								unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), true));
								filterCriterions.add(Restrictions.le(field, value));
							}	
						}else{//如果没有本单位过滤条件
							unitFiltersCriterions.add(Restrictions.le(field, value));
							if(!field.equals("unitName")){
								filterCriterions.add(Restrictions.le(field, value));
							}
						}	
					}else{
						unitFiltersCriterions.add(Restrictions.le(field, value));
						unitFiltersCriterions.add(Restrictions.eq(Project_.isIncludLibrary.getName(), false));
						filterCriterions.add(Restrictions.eq(Project_.isLatestVersion.getName(), true));
					}
					break;
				default:
					break;
				}
			}
		}
		Conjunction conjunction1 = Restrictions.conjunction();
		Conjunction conjunction2 = Restrictions.conjunction();
		for(Criterion criterion1:unitFiltersCriterions){
			conjunction1.add(criterion1);
		}
		for(Criterion criterion2:filterCriterions){
			conjunction2.add(criterion2);
		}
		Criterion rest1 = Restrictions.and(conjunction1);
		Criterion rest2= Restrictions.and(conjunction2);
		crit.add(Restrictions.or(rest1,rest2));
		
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

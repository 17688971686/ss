package cs.repository.repositoryImpl.shenbaoAdmin;

import java.util.Date;
import java.util.List;

import org.hibernate.Criteria;
import org.hibernate.criterion.ProjectionList;
import org.hibernate.criterion.Projections;
import org.hibernate.criterion.Restrictions;
import org.hibernate.sql.JoinType;
import org.springframework.stereotype.Repository;

import cs.domain.MonthReport;
import cs.domain.MonthReport_;
import cs.repository.AbstractRepository;
import cs.repository.odata.ODataObj;

/**
 * @Description:月报持久层 
 * @author: cx
 * @Date：2017年5月12日
 * @version：0.1
 */
@Repository
public class MonthReportRepoImpl extends AbstractRepository<MonthReport, String>implements MonthReportRepo {
	
	
	

}

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
import cs.domain.MonthReportProblem;
import cs.domain.MonthReport_;
import cs.repository.AbstractRepository;
import cs.repository.odata.ODataObj;

/**
 * @Description:月报问题持久层 
 * @author: cx
 * @Date：2017年5月15日
 * @version：0.1
 */
@Repository
public class MonthReportProblemRepoImpl extends AbstractRepository<MonthReportProblem, String>implements MonthReportProblemRepo {
	
}

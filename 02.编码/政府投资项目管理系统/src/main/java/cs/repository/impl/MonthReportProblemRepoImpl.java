package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.MonthReportProblem;
import cs.repository.interfaces.MonthReportProblemRepo;

/**
 * @Description:月报问题持久层 
 * @author: cx
 * @Date：2017年5月15日
 * @version：0.1
 */
@Repository
public class MonthReportProblemRepoImpl extends AbstractRepository<MonthReportProblem, String>implements MonthReportProblemRepo {
	
}

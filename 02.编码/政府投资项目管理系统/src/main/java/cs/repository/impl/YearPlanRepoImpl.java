package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.YearPlan;
import cs.repository.interfaces.YearPlanRepo;

@Repository
public class YearPlanRepoImpl extends AbstractRepository<YearPlan, String> implements YearPlanRepo {

}

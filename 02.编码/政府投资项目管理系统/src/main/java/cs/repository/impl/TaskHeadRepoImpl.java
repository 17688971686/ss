package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.TaskHead;
import cs.repository.interfaces.TaskHeadRepo;

@Repository
public class TaskHeadRepoImpl extends AbstractRepository<TaskHead, String> implements TaskHeadRepo {

}

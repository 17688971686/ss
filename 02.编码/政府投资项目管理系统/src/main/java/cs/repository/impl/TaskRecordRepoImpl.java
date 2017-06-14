package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.TaskRecord;
import cs.repository.interfaces.TaskRecordRepo;
@Repository
public class TaskRecordRepoImpl extends AbstractRepository<TaskRecord,String> implements TaskRecordRepo {

}

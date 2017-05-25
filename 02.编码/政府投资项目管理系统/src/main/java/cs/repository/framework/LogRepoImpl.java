package cs.repository.framework;

import org.springframework.stereotype.Repository;

import cs.domain.framework.Log;
import cs.repository.impl.AbstractRepository;

@Repository
public class LogRepoImpl extends AbstractRepository<Log, Long> implements LogRepo {

	
}

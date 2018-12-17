package cs.repository.framework;

import org.springframework.stereotype.Repository;

import cs.domain.framework.Log;
import cs.repository.impl.AbstractRepository;
/**
 * @author Administrator
 *  日志数据持久层实现类
 */
@Repository
public class LogRepoImpl extends AbstractRepository<Log, Long> implements LogRepo {

	
}

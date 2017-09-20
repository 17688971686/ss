package cs.repository.framework;

import org.springframework.stereotype.Repository;

/**
 * @Description: 意见持久层
 * @author: wcq
 * @Date：2017年9月7日
 * @version：0.1
 */
import cs.domain.Opinion;
import cs.domain.framework.Role;
import cs.repository.impl.AbstractRepository;
@Repository
public class OpinionRepoImpl  extends AbstractRepository<Opinion,String> implements OpinionRepo{

}

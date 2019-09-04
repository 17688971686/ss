package cs.repository.framework;

import cs.domain.framework.AdminResource;
import cs.repository.impl.AbstractRepository;
import org.springframework.stereotype.Repository;

@Repository
public class AdminResourceRepoImpl extends AbstractRepository<AdminResource, String> implements AdminResourceRepo {

}

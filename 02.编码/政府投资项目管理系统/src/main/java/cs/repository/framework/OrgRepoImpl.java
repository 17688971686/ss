package cs.repository.framework;

import org.springframework.stereotype.Repository;

import cs.domain.framework.Org;
import cs.repository.impl.AbstractRepository;

@Repository
public class OrgRepoImpl extends AbstractRepository<Org, String> implements OrgRepo {

	
}

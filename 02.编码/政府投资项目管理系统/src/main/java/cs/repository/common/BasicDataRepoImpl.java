package cs.repository.common;

import java.util.List;

import javax.transaction.Transactional;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.stereotype.Repository;

import cs.domain.BasicData;
import cs.domain.BasicData_;
import cs.repository.AbstractRepository;


/**
 * @deprecated 基础数据的相关操作（持久层）
 * @author cx
 * @date 2017-05-08
 */
@Repository
public class BasicDataRepoImpl extends AbstractRepository<BasicData, String>implements BasicDataRepo{
	
	
}

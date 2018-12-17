package cs.repository.common;

import org.springframework.stereotype.Repository;

import cs.domain.BasicData;
import cs.repository.impl.AbstractRepository;


/**
 *  基础数据的相关操作（持久层）
 * @author cx
 * @date 2017-05-08
 */
@Repository
public class BasicDataRepoImpl extends AbstractRepository<BasicData, String>implements BasicDataRepo{
	
	
}

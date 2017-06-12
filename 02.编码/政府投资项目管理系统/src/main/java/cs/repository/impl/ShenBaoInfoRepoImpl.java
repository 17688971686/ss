package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.ShenBaoInfo;
import cs.repository.interfaces.ShenBaoInfoRepo;

@Repository
public class ShenBaoInfoRepoImpl extends AbstractRepository<ShenBaoInfo	, String>implements ShenBaoInfoRepo  {

}

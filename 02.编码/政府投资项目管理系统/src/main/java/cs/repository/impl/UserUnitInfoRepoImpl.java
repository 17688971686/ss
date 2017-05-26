package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.UserUnitInfo;
import cs.repository.interfaces.UserUnitInfoRepo;
@Repository
public class UserUnitInfoRepoImpl extends AbstractRepository<UserUnitInfo, String>implements UserUnitInfoRepo {

}

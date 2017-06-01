package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.Project;
import cs.repository.interfaces.ProjectRepo;

@Repository
public class ProjectRepoImpl extends AbstractRepository<Project	, String>implements ProjectRepo  {

}

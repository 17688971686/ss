package cs.repository.repositoryImpl.management;

import org.springframework.stereotype.Repository;

import cs.domain.Article;
import cs.repository.AbstractRepository;
@Repository
public class ArticleRepoImpl extends AbstractRepository<Article, String> implements ArticleRepo {

}

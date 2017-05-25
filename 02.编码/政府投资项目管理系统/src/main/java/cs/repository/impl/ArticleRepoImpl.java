package cs.repository.impl;

import org.springframework.stereotype.Repository;

import cs.domain.Article;
import cs.repository.interfaces.ArticleRepo;
@Repository
public class ArticleRepoImpl extends AbstractRepository<Article, String> implements ArticleRepo {

}

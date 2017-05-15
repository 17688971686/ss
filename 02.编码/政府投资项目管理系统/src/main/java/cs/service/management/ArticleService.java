package cs.service.management;

import cs.model.PageModelDto;
import cs.model.Portal.ArticleDto;
import cs.repository.odata.ODataObj;

public interface ArticleService {
	PageModelDto<ArticleDto> get(ODataObj odataObj);

	void createArticle(ArticleDto dto);

	void deleteArticle(String id);

	void deleteArticles(String[] ids);
	
	void updateArticle(ArticleDto dto);
}

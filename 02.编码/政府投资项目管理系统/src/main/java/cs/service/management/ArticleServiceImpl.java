package cs.service.management;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import cs.domain.Article;
import cs.domain.framework.Org;
import cs.model.PageModelDto;
import cs.model.Portal.ArticleDto;
import cs.model.framework.OrgDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.management.ArticleRepo;

public class ArticleServiceImpl implements ArticleService {

	private static Logger logger = Logger.getLogger(ArticleServiceImpl.class);
	@Autowired
	private ArticleRepo articleRepo;
	
	@Override
	public PageModelDto<ArticleDto> get(ODataObj odataObj) {
		List<Article> articleList = articleRepo.findByOdata(odataObj);
		List<ArticleDto> articleDtoList = new ArrayList<>();
		articleList.forEach(x->{
			ArticleDto articleDto=new ArticleDto();
			articleDto.setType(x.getType());
			articleDto.setCreatedBy(x.getCreatedBy());
			articleDto.setContent(x.getContent());
			articleDto.setCreatedDate(x.getCreatedDate());
			articleDto.setTitle(x.getTitle());
			articleDto.setId(x.getId());
			articleDto.setItemOrder(x.getItemOrder());
			articleDto.setFiles(x.getFiles());
			articleDto.setModifiedDate(x.getModifiedDate());
			articleDto.setModifiedBy(x.getModifiedBy());
			articleDto.setPreviewImg(x.getPreviewImg());
			articleDto.setArticleComments(x.getArticleComments());
			articleDtoList.add(articleDto);
		});
		
		PageModelDto<ArticleDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(articleDtoList);

		logger.info("获取文章数据");		
		return pageModelDto;
	}

	@Override
	public void createArticle(ArticleDto dto) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteArticle(String id) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void deleteArticles(String[] ids) {
		// TODO Auto-generated method stub
		
	}

	@Override
	public void updateArticle(ArticleDto dto) {
		// TODO Auto-generated method stub
		
	}

}

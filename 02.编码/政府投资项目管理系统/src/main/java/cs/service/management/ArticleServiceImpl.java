package cs.service.management;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.UUID;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.common.ICurrentUser;
import cs.domain.Article;
import cs.model.PageModelDto;
import cs.model.Portal.ArticleDto;
import cs.repository.odata.ODataObj;
import cs.repository.repositoryImpl.management.ArticleRepo;

@Service
public class ArticleServiceImpl implements ArticleService {

	private static Logger logger = Logger.getLogger(ArticleServiceImpl.class);
	@Autowired
	private ArticleRepo articleRepo;
	
	@Autowired
	private ICurrentUser currentUser;

	
	@Override
	@Transactional
	public PageModelDto<ArticleDto> get(ODataObj odataObj) {
		List<Article> articleList = articleRepo.findByOdata(odataObj);
		List<ArticleDto> articleDtoList = new ArrayList<>();
		articleList.forEach(x -> {
			ArticleDto articleDto = new ArticleDto();
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
					
			articleDtoList.add(articleDto);
		});

		PageModelDto<ArticleDto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(articleDtoList);

		logger.info("获取文章数据");
		return pageModelDto;
	}

	@Override
	@Transactional
	public void createArticle(ArticleDto dto) {
		
		if(dto!=null){
			String id =UUID.randomUUID().toString();
			Article article=new Article();
			article.setType(dto.getType());
			article.setCreatedBy(currentUser.getLoginName());
			article.setContent(dto.getContent());			
			article.setTitle(dto.getTitle());
			article.setId(id);
			article.setItemOrder(dto.getItemOrder());
			article.setFiles(dto.getFiles());	
			article.setModifiedBy(currentUser.getLoginName());
			article.setPreviewImg(dto.getPreviewImg());
			articleRepo.save(article);
			logger.info(String.format("创建文章,Id:%s",id));
		}

	}

	@Override
	@Transactional
	public void deleteArticle(String id) {
		// TODO Auto-generated method stub
		Article entity=articleRepo.findById(id);
		if(entity!=null){
			articleRepo.delete(entity);
			logger.info(String.format("删除文章,标题:%s",entity.getTitle()));
		}
	}

	@Override
	@Transactional
	public void deleteArticles(String[] ids) {
		for (String id : ids) {
			deleteArticle(id);
		}
	}

	@Override
	@Transactional
	public void updateArticle(ArticleDto dto) {
		Article entity=articleRepo.findById(dto.getId());
		
		entity.setContent(dto.getContent());
		entity.setTitle(dto.getTitle());	
		entity.setItemOrder(dto.getItemOrder());
		entity.setFiles(dto.getFiles());
		entity.setModifiedDate(new Date());
		entity.setModifiedBy(dto.getModifiedBy());
		entity.setPreviewImg(dto.getPreviewImg());

		articleRepo.save(entity);
		logger.info(String.format("更新文章,Id:%s",dto.getId()));

	}

}

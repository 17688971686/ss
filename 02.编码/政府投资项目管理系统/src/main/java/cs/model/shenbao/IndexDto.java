package cs.model.shenbao;

import java.util.ArrayList;
import java.util.List;

import cs.model.DomainDto.ArticleDto;

/**
 * @author Administrator
 * 首页数据实体
 */
public class IndexDto {
	private List<ArticleDto> article_tzgg =new ArrayList<>();
	private List<ArticleDto> article_zcfg=new ArrayList<>();
	private List<ArticleDto> article_bszn=new ArrayList<>();
	private List<ArticleDto> article_cybg=new ArrayList<>();
	public List<ArticleDto> getArticle_tzgg() {
		return article_tzgg;
	}
	public void setArticle_tzgg(List<ArticleDto> article_tzgg) {
		this.article_tzgg = article_tzgg;
	}
	public List<ArticleDto> getArticle_zcfg() {
		return article_zcfg;
	}
	public void setArticle_zcfg(List<ArticleDto> article_zcfg) {
		this.article_zcfg = article_zcfg;
	}
	public List<ArticleDto> getArticle_bszn() {
		return article_bszn;
	}
	public void setArticle_bszn(List<ArticleDto> article_bszn) {
		this.article_bszn = article_bszn;
	}
	public List<ArticleDto> getArticle_cybg() {
		return article_cybg;
	}
	public void setArticle_cybg(List<ArticleDto> article_cybg) {
		this.article_cybg = article_cybg;
	}
}

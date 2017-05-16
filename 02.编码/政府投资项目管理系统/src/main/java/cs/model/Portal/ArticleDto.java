package cs.model.Portal;

import cs.model.BaseDto;

public class ArticleDto extends BaseDto{
	private String id;
	private String title;
	private String content;
	
	
	//申报门户：1-通知公告，2-政策法规,3-办事指南,4-常用表格	
	private String type;
	
	private String previewImg;
	
	//多个附件用；分开
	private String files;

	public String getId() {
		return id;
	}

	public void setId(String id) {
		this.id = id;
	}

	public String getTitle() {
		return title;
	}

	public void setTitle(String title) {
		this.title = title;
	}

	public String getContent() {
		return content;
	}

	public void setContent(String content) {
		this.content = content;
	}

	public String getType() {
		return type;
	}

	public void setType(String type) {
		this.type = type;
	}

	public String getPreviewImg() {
		return previewImg;
	}

	public void setPreviewImg(String previewImg) {
		this.previewImg = previewImg;
	}

	public String getFiles() {
		return files;
	}

	public void setFiles(String files) {
		this.files = files;
	}
}

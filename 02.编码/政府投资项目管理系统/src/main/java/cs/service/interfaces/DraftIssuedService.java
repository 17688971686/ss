package cs.service.interfaces;

import cs.domain.DraftIssued;
import cs.model.DomainDto.DraftIssuedDto;

/**
 * @author Administrator
 * 发文拟稿服务层
 */
public interface DraftIssuedService extends IService<DraftIssuedDto, DraftIssued, String>{
	/**
	 * 创建发文拟稿信息
	 * @param draftIssuedDto 发文拟稿表实体信息
	 */
	void createDraft(DraftIssuedDto draftIssuedDto);	
}

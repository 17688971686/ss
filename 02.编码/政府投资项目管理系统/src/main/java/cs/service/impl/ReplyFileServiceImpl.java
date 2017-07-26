package cs.service.impl;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.domain.ReplyFile;
import cs.model.PageModelDto;
import cs.model.DomainDto.ReplyFileDto;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.ReplyFileService;
/**
 * @Description: 批复文件服务层
 * @author: cx
 * @Date：2017年7月10日
 * @version：0.1
 */
@Service
public class ReplyFileServiceImpl extends AbstractServiceImpl<ReplyFileDto, ReplyFile, String>implements ReplyFileService {
	private static Logger logger = Logger.getLogger(ReplyFileServiceImpl.class);
	
	@Override
	@Transactional
	public PageModelDto<ReplyFileDto> get(ODataObj odataObj) {
		logger.info("查询批复文件数据");
		return super.get(odataObj);
	}

	@Override
	@Transactional
	public ReplyFile create(ReplyFileDto dto) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public ReplyFile update(ReplyFileDto dto, String id) {
		// TODO Auto-generated method stub
		return null;
	}

	@Override
	@Transactional
	public void delete(String id) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional
	public void deletes(String[] ids) {
		// TODO Auto-generated method stub

	}

	@Override
	@Transactional
	public ReplyFile findById(String id) {
		// TODO Auto-generated method stub
		return null;
	}

}

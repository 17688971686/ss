package cs.service.interfaces;

import java.util.List;

import cs.domain.InvestmentProject;
import cs.model.DomainDto.InvestmentProjectDto;

/**
 * @author Administrator
 *投资项目服务层
 */
public interface InvestmentProjectService extends IService<InvestmentProjectDto, InvestmentProject, String>{
	
	/**
	 * 根据目录名称来查找投资项目
	 * @param name
	 * @return
	 */
	InvestmentProject findInvestmentProjectByName(String name);
	/**
	 * 根据代码称来查找投资项目
	 * @param code
	 * @return
	 */
	InvestmentProject findInvestmentProjectByCode(String code);
	/**
	 * 根据代码称来查找投资项目
	 * @param parentId 
	 * @return
	 */
	List<InvestmentProject> getInvestmentProjectByParentId(String parentId);
	/**
	 * 删除投资项目条目信息
	 * @param ids id集合
	 */
	void deleteCatalogs(String[] ids);

}

package cs.service.interfaces;

import java.util.List;

import cs.domain.PolicyCatalog;
import cs.model.DomainDto.PolicyCatalogDto;

/**
 * @author Administrator
 *政策目录服务层
 */
public interface PolicyCatalogService extends IService<PolicyCatalogDto, PolicyCatalog, String>{
	
	/**
	 * 根据目录名称来查找政策
	 * @param name
	 * @return dto
	 */
	PolicyCatalog findPolicyCatalogByName(String name);
	/**
	 * 根据代码称来查找政策
	 * @param code
	 * @return dto 
	 */
	PolicyCatalog findPolicyCatalogByCode(String code);
	/**
	 * 根据关联ID来查找政策
	 * @param parentId
	 * @return list dto
	 */
	List<PolicyCatalog> getPolicyCatalogByParentId(String parentId);
	/**
	 * 根据ID删除政策目录
	 * @param ids ID list
	 */
	void deletePolicyCatalogs(String[] ids);

}

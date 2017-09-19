package cs.service.interfaces;

import java.util.List;

import cs.domain.PolicyCatalog;
import cs.model.DomainDto.PolicyCatalogDto;

public interface PolicyCatalogService extends IService<PolicyCatalogDto, PolicyCatalog, String>{
	
	//根据目录名称来查找政策
	PolicyCatalog findPolicyCatalogByName(String name);
	//根据代码称来查找政策
	PolicyCatalog findPolicyCatalogByCode(String code);
	
	List<PolicyCatalog> getPolicyCatalogByParentId(String parentId);
	
	void deletePolicyCatalogs(String[] ids);

}

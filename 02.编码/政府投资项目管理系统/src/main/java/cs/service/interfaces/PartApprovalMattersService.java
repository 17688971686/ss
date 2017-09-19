package cs.service.interfaces;

import cs.domain.PartApprovalMatters;
import cs.model.DomainDto.PartApprovalMattersDto;

public interface PartApprovalMattersService extends IService<PartApprovalMattersDto, PartApprovalMatters, String>{
	
	//根据目录名称来查找政策
	PartApprovalMatters findPartApprovalMattersByName(String name);
	//根据代码称来查找政策
	PartApprovalMatters findPartApprovalMattersByCode(String code);
	
	void deletePartApprovalMattersCatalogs(String[] ids);

}

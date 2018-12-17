package cs.service.interfaces;

import cs.domain.PartApprovalMatters;
import cs.model.DomainDto.PartApprovalMattersDto;

/**
 * @author Administrator
 *政策信息服务层
 */
public interface PartApprovalMattersService extends IService<PartApprovalMattersDto, PartApprovalMatters, String>{
	
	/**
	 * 根据目录名称来查找政策
	 * @param name
	 * @return
	 */
	PartApprovalMatters findPartApprovalMattersByName(String name);
	/**
	 * 根据代码称来查找政策
	 * @param code
	 * @return
	 */
	PartApprovalMatters findPartApprovalMattersByCode(String code);
	/**
	 * 删除部门审批事项信息
	 * @param ids
	 */
	void deletePartApprovalMattersCatalogs(String[] ids);

}

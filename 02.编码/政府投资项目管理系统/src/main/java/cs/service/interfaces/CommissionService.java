package cs.service.interfaces;


import cs.domain.Commission;
import cs.model.DomainDto.CommissionDto;

/**
 * @author Administrator
 *评审委托服务层
 */
public interface CommissionService extends IService<CommissionDto, Commission, String>{

	/**
	 * 根据关联ID查询评审委托信息
	 * @param id 关联ID
	 * @return 评审委托实体
	 */
	CommissionDto getProxyByTaskId(String id);

	/**
	 * 创建评审委托
	 * @param commissionDto
	 * @param id
	 */
	void createProxy(CommissionDto commissionDto, String id);

}

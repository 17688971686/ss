package cs.service.framework;

import java.util.List;

import cs.common.Response;
import cs.common.sysResource.SysResourceDto;
import cs.model.DomainDto.SysConfigDto;

/**
 *  系统资源服务层
 * @author Administrator
 *
 */
public interface SysService {

	/**
	 *  查询系统资源
	 * @return 资源实体集合
	 */
	List<SysResourceDto> getSysResources();
	/**
	 *  初始化系统
	 * @return
	 */
	 Response SysInit();
	 /**
	  *  初始化系统数据
	  * @return
	  */
	 Response SysInitBasicData();
	 /**
	  *  查询系统配置
	  * @return 配置实体集合
	  */
	 List<SysConfigDto> getSysConfigs();
	 /**
	  * 创建task签收人
	  * @param sysConfigDto
	  */
	 void createTaskUser(SysConfigDto sysConfigDto);
	 /**
	  *  根据配置名称查询
	  * @param configName 配置名
	  * @return 配置信息
	  */
	 SysConfigDto getSysConfig(String configName);
	 /**
	  *  初始化配置
	  * @return
	  */
	Response initSysConfig();
}
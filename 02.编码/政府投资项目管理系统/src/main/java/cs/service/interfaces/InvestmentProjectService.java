package cs.service.interfaces;

import java.util.List;

import cs.domain.InvestmentProject;
import cs.model.DomainDto.InvestmentProjectDto;

public interface InvestmentProjectService extends IService<InvestmentProjectDto, InvestmentProject, String>{
	
	//根据目录名称来查找投资项目
	InvestmentProject findInvestmentProjectByName(String name);
	//根据代码称来查找投资项目
	InvestmentProject findInvestmentProjectByCode(String code);
	
	List<InvestmentProject> getInvestmentProjectByParentId(String parentId);
	
	void deleteCatalogs(String[] ids);

}

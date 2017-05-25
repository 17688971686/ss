package cs.service.impl;

import java.util.ArrayList;
import java.util.List;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.MonthReportProblem;
import cs.model.PageModelDto;
import cs.model.DomainDto.MonthReportProblemDto;
import cs.repository.interfaces.MonthReportProblemRepo;
import cs.repository.odata.ODataObj;
import cs.service.framework.UserServiceImpl;
import cs.service.interfaces.MonthReportProblemService;

@Service
public class MonthReportProblemServiceImpl implements MonthReportProblemService {
	private static Logger logger = Logger.getLogger(UserServiceImpl.class);
	//依赖注入持久层
	@Autowired
	private MonthReportProblemRepo monthReportProblemRepo;

	
	/**
	 * 分页查询月报数据
	 */
	@Override
	@Transactional
	public PageModelDto<MonthReportProblemDto> get(ODataObj odataObj) {		
      List<MonthReportProblem> monthReportProblemList = monthReportProblemRepo.findByOdata(odataObj); //查询出所有的月报数据和关联上的项目信息数据
		List<MonthReportProblemDto> monthReportProblemDtoList = new ArrayList<MonthReportProblemDto>(); //将月报数据用实体类集合封装
		System.out.println("查询到的月报问题信息："+monthReportProblemList.size()); //--测试用
		
		//将数据进行转换
		if(monthReportProblemList !=null && monthReportProblemList.size()>0){
			for(MonthReportProblem monthReportProblem : monthReportProblemList){
				MonthReportProblemDto monthReportProblemDto = new MonthReportProblemDto();
				monthReportProblemDto.setId(monthReportProblem.getId());
				monthReportProblemDto.setProblemIntroduction(monthReportProblem.getProblemIntroduction());
				monthReportProblemDto.setSolutionsAndSuggest(monthReportProblem.getSolutionsAndSuggest());
				monthReportProblemDto.setCreatedBy(monthReportProblem.getCreatedBy());
				monthReportProblemDto.setCreatedDate(monthReportProblem.getCreatedDate());
				monthReportProblemDto.setModifiedBy(monthReportProblem.getModifiedBy());
				monthReportProblemDto.setModifiedDate(monthReportProblem.getModifiedDate());
				monthReportProblemDto.setRemark(monthReportProblem.getRemark());
				
				monthReportProblemDtoList.add(monthReportProblemDto);
			}
		}
		
		PageModelDto<MonthReportProblemDto> pageModelDto = new PageModelDto<MonthReportProblemDto>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(monthReportProblemDtoList);
		
		logger.info("查询月报问题数据数据");
		return pageModelDto;		
	}
	

	
	
}


package cs.service.common;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import cs.common.ICurrentUser;
import cs.domain.BasicData;
import cs.domain.BasicData_;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DtoMapper.BasicDataMapper;
import cs.repository.common.BasicDataRepo;

@Service
public class BasicDataServiceImpl implements BasicDataService {
	private static Logger logger = Logger.getLogger(BasicDataServiceImpl.class);
	@Autowired
	private BasicDataRepo basicDataRepo;
	
	@Autowired
	private ICurrentUser currentUser;
	
	private List<BasicDataDto> basicDataDtos;

	private void InitData() {
		basicDataDtos = new ArrayList<>();
		List<BasicData> basicDatas = basicDataRepo.findAll();
		basicDatas.forEach(x -> {
			BasicDataDto basicDataDto = BasicDataMapper.toDto(x);
			basicDataDtos.add(basicDataDto);
		});
		System.out.println("query basicData");
	}

	@Override
	@Transactional
	public String getDescriptionById(String id) {
		if (basicDataDtos == null) {
			InitData();
		}
		if (id != null) {
			Optional<BasicDataDto> baOptional = basicDataDtos.stream().filter(x -> {
				return id.equals(x.getId());
			}).findFirst();
			if (baOptional.isPresent()) {
				return baOptional.get().getDescription();
			} else {
				return null;
			}
		}
		
		return null;

	}

	@Override
	@Transactional
	public List<BasicDataDto> getByIdentity(String identity) {
		if (basicDataDtos == null) {
			InitData();
		}
		List<BasicDataDto> basicDataDtosResult = new ArrayList<>();

		if (identity != null && !identity.isEmpty()) {

			basicDataDtosResult = basicDataDtos.stream().filter(x -> {
				return identity.equals(x.getIdentity());
			}).collect(Collectors.toList());
			return basicDataDtosResult;

		}

		return basicDataDtosResult;
	}

	@Override
	@Transactional
	public List<BasicDataDto> Get() {
		if (basicDataDtos == null) {
			InitData();
		}
		return this.basicDataDtos;
	}

	@Override
	@Transactional
	public void reloadData() {
		this.InitData();

	}

	@Override
	@Transactional
	public void createBasicData(BasicDataDto basicDataDto) {
		//先判断创建的基础数据是否已存在
		Criterion criterion=Restrictions.eq(BasicData_.description.getName(), basicDataDto.getDescription());
		Optional<BasicData> findBasicDataByDescription = basicDataRepo.findByCriteria(criterion).stream().findFirst();
		BasicData findBasicDataById = basicDataRepo.findById(basicDataDto.getId());
		if(findBasicDataByDescription.isPresent()){
			throw new IllegalArgumentException(String.format("基础数据：%s 已经存在,请重新输入！", basicDataDto.getDescription()));
		}else if(findBasicDataById != null){
			throw new IllegalArgumentException(String.format("基础数据编号：%s 已经存在,请重新输入！", basicDataDto.getId()));
		}
		//新增基础数据
		else{
		//进行数据转换
			BasicData basicData = new BasicData();
			BasicDataMapper.buildEntity(basicDataDto, basicData);
			//设置创建人和修改人
			String loginName = currentUser.getLoginName();
			basicData.setCreatedBy(loginName);
			basicData.setModifiedBy(loginName);
			
			basicDataRepo.save(basicData);
			logger.info(String.format("创建基础数据,用户名:%s", loginName));
		}		
	}

	@Override
	@Transactional
	public void deleteBasicData(String id) {
		BasicData basicData = basicDataRepo.findById(id);
		//只能删除最后一级		
		basicDataRepo.delete(basicData);
		String loginName = currentUser.getLoginName();
		logger.info(String.format("删除基础数据,用户名:%s", loginName));		
	}

	@Override
	@Transactional
	public void updateBasicData(BasicDataDto basicDataDto) {
		logger.debug("id:"+basicDataDto.getId());
		BasicData basicData = basicDataRepo.findById(basicDataDto.getId());
		//只修改了名称
		basicData.setDescription(basicDataDto.getDescription());
		//设置修改人和修改时间
		String loginName = currentUser.getLoginName();
		basicData.setModifiedBy(loginName);
		basicData.setModifiedDate(new Date());
		
		basicDataRepo.save(basicData);
		logger.info(String.format("更新基础数据,用户名:%s", loginName));
		
	}

	@Override
	@Transactional
	public BasicData findById(String id) {		
		return basicDataRepo.findById(id);
	}
	
	
	
	
	
	
	
	
	
	

}

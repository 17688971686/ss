package cs.service.common;

import java.security.cert.PKIXRevocationChecker.Option;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.hibernate.Criteria;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.BasicData;
import cs.domain.BasicData_;
import cs.model.DomainDto.BasicDataDto;
import cs.repository.common.BasicDataRepo;
import cs.repository.odata.ODataObj;

@Service
public class BasicDataServiceImpl implements BasicDataService {
	// 依赖注入持久层
	@Autowired
	private BasicDataRepo basicDataRepo;

	@Override
	@Transactional
	public String queryValueById(String id) {
		String value = "";
		if (id != null) {
			BasicData basicData = basicDataRepo.findById(id);
			value = basicData.getDescription();
		} else {
			value = "未知";
		}

		return value;
	}

	/**
	 * @deprecated 根据标识查询出类型集合
	 * @param identity
	 *            标识编号
	 * @return list 类型集合
	 * @author cx
	 * @date 2017-05-09
	 */
	@Override
	@Transactional
	public List<BasicDataDto> queryByIdentity(String identity) {
		List<BasicDataDto> basicDataDtos = new ArrayList<>();

		if (identity != null && !identity.equals("")) {
			Criterion criterion = Restrictions.eq(BasicData_.identity.getName(), identity);
			List<BasicData> basicDatas = basicDataRepo.findByCriteria(criterion);

			basicDatas.forEach(item -> {
				if(item.getpId() == null || "".equals(item.getpId())){//没有父Id，第一级
					BasicDataDto basicDataDto = new BasicDataDto();
					basicDataDto.setComment(item.getComment());
					basicDataDto.setDescription(item.getDescription());
					basicDataDto.setCreatedBy(item.getCreatedBy());
					basicDataDto.setCreatedDate(item.getCreatedDate());
					basicDataDto.setpId(item.getpId());
					basicDataDto.setId(item.getId());
					basicDataDto.setIdentity(item.getIdentity());
					basicDataDto.setModifiedDate(item.getModifiedDate());
					basicDataDto.setModifiedBy(item.getModifiedBy());
					//查找孩子以此id为父Id的，第二级
					List<BasicDataDto> children=queryByParentId(item.getId());
					basicDataDto.setChildren(children);
					basicDataDtos.add(basicDataDto);
				}				
			});

		}

		return basicDataDtos;
	}

	@Override
	@Transactional
	public List<BasicDataDto> queryByParentId(String pId) {
		List<BasicDataDto> basicDataDtoList = new ArrayList<>();
		if(pId != null){
			Criterion criterion = Restrictions.eq(BasicData_.pId.getName(), pId);
			List<BasicData> basicDataList = basicDataRepo.findByCriteria(criterion);
			basicDataList.forEach(x -> {
				BasicDataDto basicDataDto = new BasicDataDto();

				basicDataDto.setComment(x.getComment());
				basicDataDto.setDescription(x.getDescription());
				basicDataDto.setCreatedBy(x.getCreatedBy());
				basicDataDto.setCreatedDate(x.getCreatedDate());
				basicDataDto.setpId(x.getpId());
				basicDataDto.setId(x.getId());
				basicDataDto.setIdentity(x.getIdentity());
				basicDataDto.setModifiedDate(x.getModifiedDate());
				basicDataDto.setModifiedBy(x.getModifiedBy());
				basicDataDtoList.add(basicDataDto);
			});
		}
		return basicDataDtoList;
	}

	@Override
	public List<BasicDataDto> Get(ODataObj odataObj) {
		List<BasicData> basicDatas=basicDataRepo.findByOdata(odataObj);
		List<BasicDataDto> basicDataDtos=new ArrayList<>();
		basicDatas.forEach(x->{
			BasicDataDto basicDataDto = new BasicDataDto();

			basicDataDto.setComment(x.getComment());
			basicDataDto.setDescription(x.getDescription());
			basicDataDto.setCreatedBy(x.getCreatedBy());
			basicDataDto.setCreatedDate(x.getCreatedDate());
			basicDataDto.setpId(x.getpId());
			basicDataDto.setId(x.getId());
			basicDataDto.setIdentity(x.getIdentity());
			basicDataDto.setModifiedDate(x.getModifiedDate());
			basicDataDto.setModifiedBy(x.getModifiedBy());
			basicDataDtos.add(basicDataDto);
		});
		return basicDataDtos;
	}

	@Override
	public String GetDescriptionById(List<BasicDataDto> data, String id) {
		String result=null;
		Optional<BasicDataDto> optional= data.stream()
				.filter(x->x.getId().equals(id))
				.findFirst();			
		if(optional.isPresent()){
			result=optional.get().getDescription();
		}
		return result;
	}

}

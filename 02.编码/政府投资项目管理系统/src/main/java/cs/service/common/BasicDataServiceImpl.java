package cs.service.common;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Scope;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.domain.BasicData;
import cs.model.DomainDto.BasicDataDto;
import cs.model.DtoMapper.BasicDataMapper;
import cs.repository.common.BasicDataRepo;

@Service
public class BasicDataServiceImpl implements BasicDataService {
	@Autowired
	private BasicDataRepo basicDataRepo;
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
		List<BasicDataDto> basicDataDtos = new ArrayList<>();

		if (identity != null && !identity.isEmpty()) {

			basicDataDtos = basicDataDtos.stream().filter(x -> {
				return identity.equals(x.getIdentity());
			}).collect(Collectors.toList());
			return basicDataDtos;

		}

		return basicDataDtos;
	}

	@Override
	public List<BasicDataDto> Get() {
		if (basicDataDtos == null) {
			InitData();
		}
		return this.basicDataDtos;
	}

	@Override
	public void reloadData() {
		this.InitData();

	}

}

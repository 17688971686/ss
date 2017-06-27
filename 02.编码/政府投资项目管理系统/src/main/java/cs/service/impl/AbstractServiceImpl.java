package cs.service.impl;

import java.lang.reflect.ParameterizedType;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import org.springframework.beans.factory.annotation.Autowired;

import cs.model.PageModelDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.IService;

public abstract class AbstractServiceImpl<Dto, Entity, ID > implements IService<Dto, Entity, ID > {
	@Autowired
	public IRepository<Entity, ID> repository;
	@Autowired
	public IMapper<Dto, Entity> mapper;

	@Override
	public PageModelDto<Dto> get(ODataObj odataObj) {
		List<Dto> dtos = repository.findByOdata(odataObj).stream().map((x) -> {
			return mapper.toDto(x);
		}).collect(Collectors.toList());

		PageModelDto<Dto> pageModelDto = new PageModelDto<>();
		pageModelDto.setCount(odataObj.getCount());
		pageModelDto.setValue(dtos);

		return pageModelDto;
	}

	@Override
	@SuppressWarnings("unchecked")
	public Entity create(Dto dto) {
		Entity entity = null;
		if (dto != null) {			
			Class<Entity> entityClass= (Class<Entity>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];;
			
			try {
				entity = entityClass.newInstance();
			} catch (InstantiationException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			} catch (IllegalAccessException e) {
				// TODO Auto-generated catch block
				e.printStackTrace();
			}
			if(entity!=null){
				mapper.buildEntity(dto, entity);	
			}					
		}
		return entity;
	}
	
	@Override
	public Entity update(Dto dto,ID id) {
		Entity entity=repository.findById(id);
		mapper.buildEntity(dto, entity);
		return entity;
	}
	
	@Override
	public void delete(ID id) {
		Entity entity=repository.findById(id);
		if(entity!=null){
			repository.delete(entity);			
		}
	}

	@Override
	@Transactional
	public void deletes(ID[] ids) {
		for (ID id : ids) {
			delete(id);
		}
	}

	

}

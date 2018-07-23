package cs.service.impl;

import java.lang.reflect.ParameterizedType;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.stream.Collectors;

import javax.transaction.Transactional;

import cs.repository.odata.ODataObjNew;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;

import cs.common.ICurrentUser;
import cs.domain.BaseEntity;
import cs.model.PageModelDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.IService;

public abstract class AbstractServiceImpl<Dto, Entity extends BaseEntity, ID> implements IService<Dto, Entity, ID> {
    @Autowired
    public IRepository<Entity, ID> repository;
    @Autowired
    public IMapper<Dto, Entity> mapper;
    @Autowired
    public ICurrentUser currentUser;
    protected Class<Entity> entityClass;

    public AbstractServiceImpl() {
        this.entityClass = (Class<Entity>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
    }

    @Override
    public PageModelDto<Dto> get(ODataObj odataObj) {
        List<Dto> dtos = repository.findByOdata(odataObj).stream().map(mapper::toDto).collect(Collectors.toList());
        return new PageModelDto<>(dtos, odataObj.getCount());
    }

    @Override
    public List<Dto> findByOdata2(ODataObjNew odataObj) {
        return repository.findByOdata2(odataObj).stream().map(mapper::toDto).collect(Collectors.toList());
    }

    @Override
    public PageModelDto<Dto> findPageByOdata2(ODataObjNew odataObj) {
        List<Dto> dtos = repository.findByOdata2(odataObj).stream().map(mapper::toDto).collect(Collectors.toList());
        return new PageModelDto<>(dtos, odataObj.isCount() ? odataObj.getCount() : dtos.size());
    }

    @Override
    @SuppressWarnings("unchecked")
    public Entity create(Dto dto) {
        Entity entity = null;
        if (dto != null) {
            entity = BeanUtils.instantiate(this.entityClass);
            if (entity != null) {
                mapper.buildEntity(dto, entity);
                entity.setCreatedBy(currentUser.getUserId());
                entity.setModifiedBy(currentUser.getUserId());
            }
        }
        return entity;
    }

    @Override
    public Entity update(Dto dto, ID id) {
        Entity entity = repository.findById(id);
        if (entity != null) {
            mapper.buildEntity(dto, entity);
            entity.setModifiedBy(currentUser.getUserId());
            entity.setModifiedDate(new Date());
        }
        return entity;
    }

    @Override
    public void delete(ID id) {
        Entity entity = repository.findById(id);
        if (entity != null) {
            repository.delete(entity);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void deletes(ID[] ids) {
        for (ID id : ids) {
            delete(id);
        }
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public Entity findById(ID id) {
        Entity entity = repository.findById(id);
        return entity;
    }


}

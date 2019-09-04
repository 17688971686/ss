package cs.service.framework;

import cs.domain.framework.AdminResource;
import cs.model.DomainDto.AdminResourceDto;
import cs.model.DtoMapper.AdminResourceMapper;
import cs.repository.framework.AdminResourceRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;

/**
 * @program: lgxm
 * @description: 权限菜单实现类
 * @author: lanyijie
 * @create: 2018-08-06 14:46
 **/

@Service
public class AdminResourceServiceImpl implements AdminResourceService {
    @Autowired
    private AdminResourceRepo adminResourceRepo;
    @Autowired
    private AdminResourceMapper adminResourceMapper;

    @Override
    @Transactional
    public void create(AdminResourceDto adminResourceDto) {
        adminResourceRepo.save(adminResourceMapper.buildEntity(adminResourceDto,new AdminResource()));
    }

    @Override
    @Transactional
    public void edit(AdminResourceDto adminResourceDto) {
        adminResourceRepo.save(adminResourceMapper.buildEntity(adminResourceDto,new AdminResource()));
    }

    @Override
    @Transactional
    public void delete(String id) {
        AdminResource adminResource = adminResourceRepo.findById(id);

        List<AdminResource> adminResources2 = new ArrayList<>();
        adminResources2.add(adminResource);
        List<AdminResource> adminResources = adminResourceRepo.findAll();
        adminResources.forEach(x -> {
            if(id.equals(x.getParentId())) {
                adminResources2.add(x);

                adminResources2.addAll(this.pushAdminResource(adminResources,x.getId()));
            }
        });

        adminResources2.forEach(x -> {
            adminResourceRepo.delete(x);
        });
    }

    private List<AdminResource> pushAdminResource(List<AdminResource> list, String id){
        List<AdminResource> adminResources = new ArrayList();
        list.forEach(x -> {
            if(id.equals(x.getParentId())) {
                adminResources.add(x);

                adminResources.addAll(this.pushAdminResource(adminResources,x.getId()));
            }
        });
        return adminResources;
    }
}

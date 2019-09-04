package cs.service.framework;


import cs.model.DomainDto.AdminResourceDto;

/**
 * Created by lanyijie on 2018-08-06.
 */
public interface AdminResourceService {
    void create(AdminResourceDto adminResourceDto);

    void edit(AdminResourceDto adminResourceDto);

    void delete(String id);
}

package cs.controller.framework;

import cs.common.ICurrentUser;
import cs.domain.framework.AdminResource;
import cs.model.DomainDto.AdminResourceDto;
import cs.model.DtoMapper.AdminResourceMapper;
import cs.repository.framework.AdminResourceRepo;
import cs.repository.odata.ODataFilterItem;
import cs.repository.odata.ODataObj;
import cs.service.framework.AdminResourceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpServletRequest;
import java.util.Date;
import java.util.List;

/**
 * @program: lgxm
 * @description: 权限菜单接口类
 * @author: lanyijie
 * @create: 2018-08-02 15:18
 **/

@Controller
@RequestMapping(name = "权限菜单接口类", path = "roleMenu")
public class roleMenuController {
    private String ctrlName="framework/roleMenu";
    @Autowired
    private AdminResourceRepo adminResourceRepo;
    @Autowired
    private AdminResourceService adminResourceService;
    @Autowired
    private AdminResourceMapper adminResourceMapper;
    @Autowired
    private ICurrentUser currentUser;

    @RequestMapping(name = "删除权限菜单", path = "delRoleMenu",method=RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void delRoleMenu(HttpServletRequest request)  {
        String id = request.getParameter("id");
        adminResourceService.delete(id);
    }

    @RequestMapping(name = "创建权限菜单", path = "",method=RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void createRoleMenu(@RequestBody AdminResourceDto adminResourceDto)  {
        adminResourceDto.setCreatedBy(currentUser.getDisplayName());
        adminResourceDto.setCreatedDate(new Date());
        adminResourceService.create(adminResourceDto);
    }

    @RequestMapping(name = "编辑权限菜单", path = "editRoleMenu",method=RequestMethod.POST)
    @ResponseStatus(value = HttpStatus.CREATED)
    public void editRoleMenu(@RequestBody AdminResourceDto adminResourceDto)  {
        adminResourceDto.setPath(adminResourceDto.getName());
        adminResourceDto.setModifiedBy(currentUser.getDisplayName());
        adminResourceDto.setModifiedDate(new Date());
        adminResourceService.edit(adminResourceDto);
    }

    @RequestMapping(name = "根据name获取权限菜单详情", path = "findRoleMenuByName", method = RequestMethod.GET)
    public @ResponseBody Integer getRoleMenuByName(@RequestParam String name) {
        int status = 0;
        ODataObj dataObj = new ODataObj();
        ODataFilterItem<String> filterItem = new ODataFilterItem<String>();
        filterItem.setField("name");
        filterItem.setOperator("eq");
        filterItem.setValue(name);
        dataObj.getFilter().add(filterItem);
        List<AdminResource> adminResourceList = adminResourceRepo.findByOdata(dataObj);
        if(adminResourceList != null && !adminResourceList.isEmpty()){
            status = 1;
        }
        return status;
    }

    @RequestMapping(name = "根据ID获取权限菜单详情", path = "findRoleMenuById", method = RequestMethod.GET)
    public @ResponseBody
    AdminResourceDto get(HttpServletRequest request) {
        String id = request.getParameter("id");
        AdminResource adminResource = adminResourceRepo.findById(id);
        return adminResourceMapper.toDto(adminResource);
    }

    @RequestMapping(name="权限菜单列表页面",path="html/list",method= RequestMethod.GET)
    public String listPage(){
        return ctrlName + "/roleMenuList";
    }

    @RequestMapping(name="权限菜单新增页面",path="html/add",method= RequestMethod.GET)
    public String addPage(){
        return ctrlName + "/roleMenuAdd";
    }

    @RequestMapping(name="权限菜单编辑页面",path="html/edit",method= RequestMethod.GET)
    public String editPage(){
        return ctrlName + "/roleMenuEdit";
    }
}

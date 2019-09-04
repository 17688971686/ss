package cs.service.framework;

import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.UUID;
import java.util.concurrent.ConcurrentHashMap;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpSession;

import org.activiti.engine.identity.Group;
import org.apache.log4j.Logger;
import org.apache.shiro.SecurityUtils;
import org.apache.shiro.authc.UsernamePasswordToken;
import org.apache.shiro.subject.Subject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import cs.activiti.service.ActivitiService;
import cs.common.BasicDataConfig;
import cs.common.ICurrentUser;
import cs.common.RSABCExample;
import cs.common.Response;
import cs.domain.framework.Org;
import cs.domain.framework.Role;
import cs.domain.framework.User;
import cs.model.PageModelDto;
import cs.domain.ShenPiUnit;
import cs.model.DomainDto.UserUnitInfoDto;
import cs.model.framework.OrgDto;
import cs.model.framework.RoleDto;
import cs.model.framework.UserDto;
import cs.repository.framework.RoleRepo;
import cs.repository.framework.UserRepo;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.UserUnitInfoService;
import org.springframework.util.CollectionUtils;
import org.springframework.util.ObjectUtils;

@Service
public class UserServiceImpl implements UserService {
    private static Logger logger = Logger.getLogger(UserServiceImpl.class);
    @Autowired
    private UserRepo userRepo;
    @Autowired
    private RoleRepo roleRepo;
    @Autowired
	private RoleService roleService;
    @Autowired
    private ICurrentUser currentUser;
    @Autowired
    private UserUnitInfoService userUnitInfoService;
    @Autowired
    private IRepository<ShenPiUnit, String> shenpiUnitRepo;
    @Autowired
    private ActivitiService activitiService;
    private static ConcurrentHashMap<String, Set<String >> Permissions = new ConcurrentHashMap<String,Set<String >>();


    @Override
    public void setPermissions(String key,Set<String > permissions){
        Permissions.put(key,permissions);
    }

    @Override
    public Set<String > getPermissions(String key){
        return Permissions.get(key);
    }

    @Override
    public PageModelDto<UserDto> get(ODataObj odataObj) {

        List<User> listUser = userRepo.findByOdata(odataObj);
        List<UserDto> userDtoList = new ArrayList<>();
        for (User item : listUser) {
            UserDto userDto = new UserDto();
            userDto.setId(item.getId());
            userDto.setLoginName(item.getLoginName());
            userDto.setDisplayName(item.getDisplayName());
            // userDto.setPassword(item.getPassword());
            userDto.setComment(item.getComment());
            userDto.setCreatedDate(item.getCreatedDate());

            // 查询相关角色
            List<RoleDto> roleDtoList = new ArrayList<>();
            for (Role role : item.getRoles()) {
                RoleDto roleDto = new RoleDto();
                roleDto.setComment(role.getComment());
                roleDto.setRoleName(role.getRoleName());
                roleDto.setCreatedDate(role.getCreatedDate());
                roleDto.setId(role.getId());

                roleDtoList.add(roleDto);
            }
            userDto.setRoles(roleDtoList);

            // 查询相关部门
            List<OrgDto> orgDtoList = new ArrayList<>();
            for (Org org : item.getOrgs()) {
                OrgDto orgDto = new OrgDto();
                orgDto.setComment(org.getComment());
                orgDto.setName(org.getName());
                orgDto.setCreatedDate(org.getCreatedDate());
                orgDto.setId(org.getId());

                orgDtoList.add(orgDto);
            }
            userDto.setOrgs(orgDtoList);

            userDtoList.add(userDto);
        }
        PageModelDto<UserDto> pageModelDto = new PageModelDto<>();
        pageModelDto.setCount(odataObj.getCount());
        pageModelDto.setValue(userDtoList);

        logger.info("查询用户数据");
        return pageModelDto;
    }

    @Override
    public User getUserByName(HttpServletRequest request) {
        HttpSession session = ((HttpServletRequest) request).getSession();
        User user = (User) session.getAttribute("riseUser");
        user = userRepo.findUserByName(user.getLoginName());
        return user;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public User createSYSUser(UserDto userDto) {
        User user = userRepo.findUserByName(userDto.getLoginName());
        List<RoleDto> roleList = roleService.Get();
      
            try {
            	//如果登录用户为null，则创建，有则更新
            	if(ObjectUtils.isEmpty(user)){
            		System.out.println("本地user为null!");
            		user = new User();
                    user.setId(UUID.randomUUID().toString());
            	}
                user.setComment(userDto.getComment());
                user.setLoginName(userDto.getLoginName());
                user.setDisplayName(userDto.getDisplayName());
               
                user.setCreatedBy(currentUser.getUserId());
                user.setModifiedBy(currentUser.getUserId());
                user.setPassword(userDto.getPassword());
                user.setCreatedDate(new Date());
                user.setMobilePhone(userDto.getMobilePhone());
                user.setOaId(userDto.getOaId());
                //如果没有角色，自动添加建设单位角色----------不考虑手动去掉建设单位的情况
                if(CollectionUtils.isEmpty(user.getRoles())){
                	for (RoleDto roleDto : roleList) {
    					if(roleDto.getRoleName().equals("建设单位")){
    						List<Role> roles = new ArrayList<>();
    						Role role = new Role();
    						role.setId(roleDto.getId());
    						roles.add(role);
    						user.setRoles(roles);
    					}
    				}
                }
                userRepo.save(user);
                logger.info(String.format("用户,登录名:%s", userDto.getLoginName()));
            } catch (Exception e) {
                e.printStackTrace();
            }
            return user;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void createUser(UserDto userDto) {
        User findUser = userRepo.findUserByName(userDto.getLoginName());
        // 用户不存在
        if (findUser == null) {
            try {
                User user = new User();
                user.setComment(userDto.getComment());
                user.setLoginName(userDto.getLoginName());
                user.setDisplayName(userDto.getDisplayName());
                user.setId(UUID.randomUUID().toString());
                user.setCreatedBy(currentUser.getUserId());
                user.setModifiedBy(currentUser.getUserId());
                // RSA解密前端传递的密码
                String password = RSABCExample.decodeJsValue(userDto.getPassword());
                // String passwordCode = new
                // String(Hex.encode(RSABCExample.encrypt(password)));//RSA加密存储
                user.setPassword(password);

                // 加入角色
                for (RoleDto roleDto : userDto.getRoles()) {
                    Role role = roleRepo.findById(roleDto.getId());
                    if (role != null) {
                        user.getRoles().add(role);
                        // 如果是建设单位，往建设单位表里添加数据
                        if (role.getRoleName().equals(BasicDataConfig.role_unit)) {
                            UserUnitInfoDto userUnitInfoDto = new UserUnitInfoDto();
                            // 如果创建数据中有显示名,设置单位名称
                            if (user.getDisplayName() != null && !"".equals(user.getDisplayName())) {
                                userUnitInfoDto.setUnitName(user.getDisplayName());
                            } else {
                                userUnitInfoDto.setUnitName(user.getLoginName());
                            }
                            // 绑定用户id
                            userUnitInfoDto.setUserName(user.getId());
                            userUnitInfoService.save(user.getLoginName(), userUnitInfoDto);
                        }
                        // 如果是审批单位，往审批单位表里添加数据
                        if (role.getRoleName().equals(BasicDataConfig.role_shenpiUnit)) {
                            ShenPiUnit entity = new ShenPiUnit();
                            if (user.getDisplayName() != null && !"".equals(user.getDisplayName())) {
                                entity.setShenpiUnitName(user.getDisplayName());
                            } else {
                                entity.setShenpiUnitName(user.getLoginName());
                            }
                            entity.setUserId(user.getId());
                            entity.setId(UUID.randomUUID().toString());
                            shenpiUnitRepo.save(entity);
                        }
                    }
                }
                User userResult = userRepo.save(user);
                // 创建候选人
                org.activiti.engine.identity.User activityUser = activitiService.createNewUser(userResult.getId());
                activityUser.setId(userResult.getId());
                activityUser.setFirstName(userResult.getDisplayName());
                activityUser.setPassword(userResult.getPassword());

                activitiService.createUser(activityUser);
                if (!userResult.getRoles().isEmpty()) {
                    for (Role role : userResult.getRoles()) {
                        activitiService.createUserGroupMembership(userResult.getId(), role.getId());
                    }
                }
                logger.info(String.format("创建用户,登录名:%s", userDto.getLoginName()));
            } catch (Exception e) {
                throw new IllegalArgumentException("用户数据更新失败", e.getCause());
            }
        } else {
            throw new IllegalArgumentException(String.format("用户：%s 已经存在,请重新输入！", userDto.getLoginName()));
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUser(String id) {
        User user = userRepo.findById(id);
        if (user != null) {
            if (!CollectionUtils.isEmpty(user.getRoles())) {
                user.getRoles().forEach(x -> {
                    activitiService.deleteMembership(user.getId(), x.getId());
                });
                activitiService.deleteUser(user.getId());
            }
            if (!user.getLoginName().equals("admin")) {
                userRepo.delete(user);
                logger.info(String.format("删除用户,用户名:%s", user.getLoginName()));
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void deleteUsers(String[] ids) {
        for (String id : ids) {
            this.deleteUser(id);
        }
        logger.info("批量删除用户");
    }

    @Override
    public void updateUser(UserDto userDto) {
        User user = userRepo.findById(userDto.getId());
        if (user != null) {
            try {
                user.setLoginName(userDto.getLoginName());
                user.setComment(userDto.getComment());
                user.setDisplayName(userDto.getDisplayName());
                user.setModifiedBy(currentUser.getUserId());
                // if(Util.isNotNull(userDto.getPassword())){
                // String password =
                // RSABCExample.decodeJsValue(userDto.getPassword());//RSA解密前端传递的密码
                // String passwordCode = new
                // String(Hex.encode(RSABCExample.encrypt(password)));//RSA加密存储
                // user.setPassword(userDto.getPassword());
                // }
                user.getRoles().forEach(x -> {
                    activitiService.deleteMembership(user.getId(), x.getId());
                });
                // }
                activitiService.deleteUser(user.getId());

                // 更新activity用户
                org.activiti.engine.identity.User activityUser = activitiService.getUser(userDto.getId());
                // activityUser.setPassword(userDto.getPassword());
                if (activityUser != null) {
                    activityUser.setFirstName(userDto.getDisplayName());
                    // 保存activity用户
                    activitiService.createUser(activityUser);
                } else {
                    activityUser = activitiService.createNewUser(userDto.getId());
                    activityUser.setFirstName(userDto.getDisplayName());
                    activitiService.createUser(activityUser);
                }

                // 重新添加关联
                for (RoleDto role : userDto.getRoles()) {
                    // 角色组存在，直接关联
                    Group group = activitiService.getGroup(role.getId());
                    if (group != null) {
                        activitiService.createUserGroupMembership(userDto.getId(), role.getId());
                    } else {
                        // 创建候选组
                        Group groupNew = activitiService.createNewGroup(role.getId());
                        groupNew.setName(role.getRoleName());
                        activitiService.createGroup(groupNew);

                        activitiService.createUserGroupMembership(activityUser.getId(), groupNew.getId());
                    }

                }
                // 清除已有role
                user.getRoles().clear();
                // 加入角色
                for (RoleDto roleDto : userDto.getRoles()) {
                    Role role = roleRepo.findById(roleDto.getId());
                    if (role != null) {
                        user.getRoles().add(role);
                    }
                }
                userRepo.save(user);
                logger.info(String.format("更新用户,用户名:%s", userDto.getLoginName()));
            } catch (Exception e) {
                throw new IllegalArgumentException("用户数据更新失败", e.getCause());
            }
        }
    }

    /**
     * @Title: initUser
     * @Description: 初始化用户的相关数据
     * @param: map
     * {"id":id,"type":type,"msg":msg}
     */
    @Override
    @Transactional(rollbackFor = Exception.class)
    public void initUser(@SuppressWarnings("rawtypes") Map map) {
        String id = (String) map.get("id");
        String type = (String) map.get("type");
        User user = userRepo.findById(id);
        if (user != null) {
            try {
                if (type.equals("password")) {
                    String msg = (String) map.get("msg");
                    String password = RSABCExample.decodeJsValue(msg);// RSA解密前端传递的密码
                    // String passwordCode = new
                    // String(Hex.encode(RSABCExample.encrypt(password)));//RSA加密存储
                    user.setPassword(password);
                    logger.info(String.format("初始化用户密码,用户名:%s", user.getLoginName()));
                }
                if (type.equals("loginFailCount")) {
                    user.setLoginFailCount(0);
                    logger.info(String.format("初始化用户登陆失败次数,用户名:%s", user.getLoginName()));
                }
                userRepo.save(user);
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Response Login(String userName, String password, String role) {
        Response response = new Response();
        try {
            password = RSABCExample.decodeJsValue(password);// RSA解密前端传递的密码
            User user = userRepo.findUserByName(userName);

            List<String> roleName = new ArrayList<>();
            String[] str = role.split(",");

            for (String string : str) {

                if ("manage".equals(string)) {
                    roleName.add("管理员");
                } else if ("unit".equals(string)) {
                    roleName.add("建设单位");

                } else if ("shenpiUnit".equals(string)) {
                    roleName.add("审批单位");
                }
            }
            if (user != null) {
                // String passwordCode =
                // RSABCExample.decodeJsValue(user.getPassword());//RSA解密数据库存储的密码
                String passwordCode = user.getPassword();
                // if(user.getLoginFailCount()>5&&user.getLastLoginDate().getDay()==(new
                // Date()).getDay()){
                // response.setMessage("登录失败次数过多,请明天再试!");
                // logger.warn(String.format("登录失败次数过多,用户名:%s", userName));
                // }
                // else
                if (password != null && password.equals(passwordCode)) {
                    // 判断用户角色
                    Boolean hasRole = false;
                    List<Role> roles = user.getRoles();

                    loop:
                    for (Role x : roles) {
                        for (String y : roleName) {
                            if (x.getRoleName().equals(y) || x.getRoleName().equals("超级管理员")) {// 如果有对应的角色则允许登录
                                hasRole = true;
                                break loop;
                            } else {
                                hasRole = false;
                            }

                        }
                    }
                    if (hasRole) {
                        currentUser.setLoginName(user.getLoginName());
                        currentUser.setDisplayName(user.getDisplayName());
                        currentUser.setUserId(user.getId());
                        Date lastLoginDate = user.getLastLoginDate();
                        if (lastLoginDate != null) {
                            currentUser.setLastLoginDate(user.getLastLoginDate());
                        }
                        user.setLoginFailCount(0);
                        user.setLastLoginDate(new Date());
                        // shiro
                        UsernamePasswordToken token = new UsernamePasswordToken(user.getLoginName(), passwordCode);
                        Subject currentUser = SecurityUtils.getSubject();
                        currentUser.login(token);

                        response.setSuccess(true);
                        logger.info(String.format("登录成功,用户名:%s", userName));
                    } else {
                        response.setMessage("权限不足，请联系管理员!");
                    }

                } else {
                    user.setLoginFailCount(user.getLoginFailCount() + 1);
                    user.setLastLoginDate(new Date());
                    response.setMessage("用户名或密码错误!");
                }
                userRepo.save(user);
            } else {
                response.setMessage("用户名或密码错误!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        //登录刷新权限
        Set<String > permissions=this.getCurrentUserPermissions();
        this.setPermissions(userName,permissions);
        return response;
    }

    @Override
    @Transactional
    public boolean getRole(String id) {
        Boolean hasRole = false;
        User user2 = userRepo.findById(id);
        loop2:
        if(!CollectionUtils.isEmpty(user2.getRoles())){
        	 for (Role x : user2.getRoles()) {
                 if (x.getRoleName().equals("管理员") || x.getRoleName().equals("超级管理员")) {//如果有对应的角色则允许登录
                     hasRole = true;
                     break loop2;
                 } else {
                 }
             }
        }
       
        return hasRole;
    }

    @SuppressWarnings("deprecation")
    @Override
    @Transactional(rollbackFor = Exception.class)
    public Response DandianLogin(String userName, String password, String role) {
        Response response = new Response();
        try {
            // password = RSABCExample.decodeJsValue(password);//RSA解密前端传递的密码
            User user = userRepo.findUserByName(userName);
            String url = "adminLoginIndex";
            List<String> roleName = new ArrayList<>();
            String[] str = role.split(",");

            for (String string : str) {

                if ("manage".equals(string)) {
                    roleName.add("管理员");
                } else if ("unit".equals(string)) {
                    roleName.add("建设单位");

                } else if ("shenpiUnit".equals(string)) {
                    roleName.add("审批单位");
                }
            }
            if (user != null) {
                String passwordCode = user.getPassword();
                // if(password!=null&&password.equals(passwordCode)){
                // 判断用户角色
                Boolean hasRole = false;
                List<Role> roles = user.getRoles();

                loop:
                for (Role x : roles) {
                    for (String y : roleName) {
                        if (x.getRoleName().equals(y) || x.getRoleName().equals("超级管理员")) {// 如果有对应的角色则允许登录
                            hasRole = true;
                            break loop;
                        } else {
                            hasRole = false;
                        }
                    }
                }

                loop2:
                for (Role x : roles) {
                    if (x.getRoleName().equals("管理员") || x.getRoleName().equals("超级管理员")) {// 如果有对应的角色则允许登录
                        response.setUrls(url);
                        break loop2;
                    } else {
                        response.setUrls("shenbaoAdmin");
                    }
                }
                if (hasRole) {
                    currentUser.setLoginName(user.getLoginName());
                    currentUser.setDisplayName(user.getDisplayName());
                    currentUser.setUserId(user.getId());
                    Date lastLoginDate = user.getLastLoginDate();
                    if (lastLoginDate != null) {
                        currentUser.setLastLoginDate(user.getLastLoginDate());
                    }
                    user.setLoginFailCount(0);
                    user.setLastLoginDate(new Date());
                    // shiro
                    UsernamePasswordToken token = new UsernamePasswordToken(user.getLoginName(), passwordCode);
                    Subject currentUser = SecurityUtils.getSubject();
                    currentUser.login(token);

                    response.setSuccess(true);
                    logger.info(String.format("登录成功,用户名:%s", userName));
                } else {
                    response.setMessage("权限不足，请联系管理员!");
                }

                // }else{
                // user.setLoginFailCount(user.getLoginFailCount()+1);
                // user.setLastLoginDate(new Date());
                // response.setMessage("用户名或密码错误!");
                // }
                userRepo.save(user);
            } else {
                response.setMessage("用户名或密码错误!");
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return response;
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Set<String> getCurrentUserPermissions() {
        // logger.info(String.format("查询当前用户权限,用户名:%s", currentUser.getLoginName()));
        return userRepo.getUserPermission(currentUser.getLoginName());

    }

    @Override
    public void logout() {
        Subject currentUser = SecurityUtils.getSubject();
        if (currentUser != null) {
            currentUser.logout();
            logger.info(String.format("退出登录,用户名:%s", currentUser.getPrincipal()));
        }

    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public void changePwd(String password) {
        String userName = currentUser.getLoginName();
        User user = userRepo.findUserByName(userName);
        if (user != null) {
            try {
                user.setPassword(RSABCExample.decodeJsValue(password));// RSA密码解密
                userRepo.save(user);
                logger.info(String.format("修改密码,用户名:%s", userName));
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    @Override
    @Transactional
    public User findUserByName(String userName) {
        return userRepo.findUserByName(userName);
    }

    @Override
    public User findById(String id) {
        logger.info(String.format("通过id查找用户,用户名id:%s", id));
        return userRepo.findById(id);
    }

    @Override
    @Transactional(rollbackFor = Exception.class)
    public Map<String, Object> getRolesIntoMap(Map<String, Object> map) {
        String currentUserName = currentUser.getLoginName();

        User user = userRepo.findUserByName(currentUserName);
        List<Role> roles = user.getRoles();

        roles.forEach(x -> {
            if ("审批单位".equalsIgnoreCase(x.getRoleName())) {
                map.put("roleType", "approvalUnit");
                return;
            } else if ("建设单位".equalsIgnoreCase(x.getRoleName())) {
                map.put("roleType", "constructionUnit");
            }
        });

        return map;
    }

}

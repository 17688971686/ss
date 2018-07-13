package cs.service.impl;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;

import javax.transaction.Transactional;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import cs.common.BasicDataConfig;
import cs.common.Util;
import cs.domain.PlanReachApplication;
import cs.domain.PlanReachApproval;
import cs.domain.Project;
import cs.domain.ShenBaoInfo;
import cs.domain.UserUnitInfo;
import cs.model.PageModelDto;
import cs.model.DomainDto.PlanReachApplicationDto;
import cs.model.DomainDto.PlanReachApprovalDto;
import cs.model.DomainDto.ShenBaoInfoDto;
import cs.model.DomainDto.ShenBaoUnitInfoDto;
import cs.model.DtoMapper.IMapper;
import cs.repository.interfaces.IRepository;
import cs.repository.odata.ODataObj;
import cs.service.interfaces.PlanReachApprovalService;
import cs.service.interfaces.ProjectService;
import cs.service.interfaces.ShenBaoInfoService;

@Service
public class PlanReachApprovalServiceImpl extends AbstractServiceImpl<PlanReachApprovalDto, PlanReachApproval, String> implements PlanReachApprovalService {
    private static Logger logger = Logger.getLogger(PlanReachApprovalServiceImpl.class);

    @Autowired
    private ShenBaoInfoService shenBaoInfoService;
    @Autowired
    private ProjectService projectService;
    @Autowired
    private IRepository<UserUnitInfo, String> userUnitInfoRepo;
    @Autowired
    private IMapper<ShenBaoInfoDto, ShenBaoInfo> shenBaoInfoMapper;


    @Override
    @Transactional
    public PageModelDto<PlanReachApprovalDto> get(ODataObj odataObj) {
        logger.info("获取计划下达批复数据");
        return super.get(odataObj);
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional
    public void create(Map data) throws ParseException {
        PlanReachApproval entity = new PlanReachApproval();
        PlanReachApprovalDto dto = new PlanReachApprovalDto();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
        dto.setResPerson((String) data.get("resPerson"));
        dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
        dto.setResPersonTel((String) data.get("resPersonTel"));
        dto.setTitle((String) data.get("title"));
        List<String> idStrings = (List<String>) data.get("ids");
        dto.setCreatedBy(currentUser.getUserId());
        dto.setCreatedDate(new Date());
        entity = super.create(dto);
        //处理关联信息
        for (int i = 0; i < idStrings.size(); i++) {
            String array_element = idStrings.get(i);
            ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(array_element);
            entity.getShenBaoInfos().add(shenBaoInfo);
        }

        super.repository.save(entity);
        logger.info(String.format("创建计划下达批复表,名称 :%s", dto.getTitle()));
    }

    @SuppressWarnings("unchecked")
    @Override
    @Transactional(rollbackOn = Exception.class)
    public void update(Map data) throws ParseException {
        PlanReachApprovalDto dto = new PlanReachApprovalDto();
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-mm-dd");
        dto.setResPerson((String) data.get("resPerson"));
        dto.setApprovalTime(sdf.parse((String) data.get("approvalTime")));
        dto.setId((String) data.get("id"));
        dto.setResPersonTel((String) data.get("resPersonTel"));
        dto.setTitle((String) data.get("title"));
        List<String> idStrings = (List<String>) data.get("ids");
        PlanReachApproval entity = super.update(dto, (String) data.get("id"));
        //处理关联信息
        entity.getShenBaoInfos().clear();
        for (int i = 0; i < idStrings.size(); i++) {
            String array_element = idStrings.get(i);
            ShenBaoInfo shenBaoInfo = shenBaoInfoService.findById(array_element);
            entity.getShenBaoInfos().add(shenBaoInfo);
        }
        repository.save(entity);
        logger.info(String.format("更新计划下达批复表,名称 :%s", dto.getTitle()));
    }

    @Override
    @Transactional(rollbackOn = Exception.class)
    public void delete(String id) {
        PlanReachApproval entity = super.findById(id);
        entity.getShenBaoInfos().forEach(x -> {
            
        });
        entity.getShenBaoInfos().clear();
        repository.delete(entity);
        logger.info(String.format("删除下达批复表,名称 :%s", entity.getTitle()));
    }

    @Override
    public List<PlanReachApprovalDto> findByDto(ODataObj odataObj) {
        return null;
    }


}

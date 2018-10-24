package cs.model.DtoMapper;

import cs.domain.YearPlanYearContent;
import cs.model.DomainDto.YearPlanYearContentDto;
import org.springframework.stereotype.Component;

import java.util.UUID;

/**
 * @Description: 申报信息实体类与数据库资源转换类
 * @author: liux
 * @Date：2018年10月22日
 * @version：0.1
 */
@Component
public class YearPlanYearContentMapper implements IMapper<YearPlanYearContentDto, YearPlanYearContent> {

    @Override
    public YearPlanYearContentDto toDto(YearPlanYearContent entity) {
        YearPlanYearContentDto yearPlanYearContentDto = new YearPlanYearContentDto();
        if(entity != null){
            yearPlanYearContentDto.setId(entity.getId());

            //begin#年度计划
            yearPlanYearContentDto.setProjectConstrChar(entity.getProjectConstrChar());
            yearPlanYearContentDto.setPlanYear(entity.getPlanYear());
            yearPlanYearContentDto.setIsApplyOutsideCapital(entity.getIsApplyOutsideCapital());
            yearPlanYearContentDto.setApplyOutsideCapital(entity.getApplyOutsideCapital());

            //下一年度计划三年滚动--第一年
            yearPlanYearContentDto.setApplyYearInvest(entity.getApplyYearInvest());//申请资金累计
            yearPlanYearContentDto.setCapitalSCZ_ggys_TheYear(entity.getCapitalSCZ_ggys_TheYear());
            yearPlanYearContentDto.setCapitalSCZ_gtzj_TheYear(entity.getCapitalSCZ_gtzj_TheYear());
            yearPlanYearContentDto.setCapitalSCZ_qita(entity.getCapitalSCZ_qita());
            yearPlanYearContentDto.setCapitalOtherDescriptionShenBao(entity.getCapitalOtherDescriptionShenBao());
            yearPlanYearContentDto.setYearConstructionContent(entity.getYearConstructionContent());

            //三年滚动--第二年
            yearPlanYearContentDto.setApplyYearInvest_LastYear(entity.getApplyYearInvest_LastYear());//申请资金累计
            yearPlanYearContentDto.setCapitalSCZ_gtzj_LastYear(entity.getCapitalSCZ_gtzj_LastYear());
            yearPlanYearContentDto.setCapitalSCZ_ggys_LastYear(entity.getCapitalSCZ_ggys_LastYear());
            yearPlanYearContentDto.setCapitalSCZ_qita_LastYear(entity.getCapitalSCZ_qita_LastYear());
            yearPlanYearContentDto.setCapitalOtherDescriptionShenBao_LastYear(entity.getCapitalOtherDescriptionShenBao_LastYear());
            yearPlanYearContentDto.setYearConstructionContentLastYear(entity.getYearConstructionContentLastYear());

            //三年滚动--第三年
            yearPlanYearContentDto.setApplyYearInvest_LastTwoYear(entity.getApplyYearInvest_LastTwoYear());//申请资金累计
            yearPlanYearContentDto.setCapitalSCZ_gtzj_LastTwoYear(entity.getCapitalSCZ_gtzj_LastTwoYear());
            yearPlanYearContentDto.setCapitalSCZ_ggys_LastTwoYear(entity.getCapitalSCZ_ggys_LastTwoYear());
            yearPlanYearContentDto.setCapitalSCZ_qita_LastTwoYear(entity.getCapitalSCZ_qita_LastTwoYear());
            yearPlanYearContentDto.setCapitalOtherDescriptionShenBao_LastTwoYear(entity.getCapitalOtherDescriptionShenBao_LastTwoYear());
            yearPlanYearContentDto.setYearConstructionContentLastTwoYear(entity.getYearConstructionContentLastTwoYear());

            yearPlanYearContentDto.setApInvestSum(entity.getApInvestSum());//累计安排投资
            //申报信息备注
            yearPlanYearContentDto.setYearConstructionContentShenBao(entity.getYearConstructionContentShenBao());

            /*
            yearPlanYearContentDto.setYearInvestApproval(entity.getYearInvestApproval());//安排资金累计
            yearPlanYearContentDto.setCapitalAP_ggys_TheYear(entity.getCapitalAP_ggys_TheYear());
            yearPlanYearContentDto.setCapitalAP_gtzj_TheYear(entity.getCapitalAP_gtzj_TheYear());
            yearPlanYearContentDto.setCapitalAP_qita(entity.getCapitalAP_qita());

            yearPlanYearContentDto.setYearInvestApproval_lastYear(entity.getYearInvestApproval_lastYear());//安排资金累计
            yearPlanYearContentDto.setCapitalAP_ggys_LastYear(entity.getCapitalAP_ggys_LastYear());
            yearPlanYearContentDto.setCapitalAP_gtzj_LastYear(entity.getCapitalAP_gtzj_LastYear());
            yearPlanYearContentDto.setCapitalAP_qita_LastYear(entity.getCapitalAP_qita_LastYear());

            yearPlanYearContentDto.setYearInvestApproval_lastTwoYear(entity.getYearInvestApproval_lastTwoYear());//安排资金累计
            yearPlanYearContentDto.setCapitalAP_ggys_LastTwoYear(entity.getCapitalAP_ggys_LastTwoYear());
            yearPlanYearContentDto.setCapitalAP_gtzj_LastTwoYear(entity.getCapitalAP_gtzj_LastTwoYear());
            yearPlanYearContentDto.setCapitalAP_qita_LastTwoYear(entity.getCapitalAP_qita_LastTwoYear());*/

            //基础数据
            yearPlanYearContentDto.setCreatedBy(entity.getCreatedBy());
            yearPlanYearContentDto.setModifiedDate(entity.getModifiedDate());
            yearPlanYearContentDto.setModifiedBy(entity.getModifiedBy());
            yearPlanYearContentDto.setCreatedDate(entity.getCreatedDate());
            yearPlanYearContentDto.setItemOrder(entity.getItemOrder());
        }
        return yearPlanYearContentDto;
    }

    @Override
    public YearPlanYearContent buildEntity(YearPlanYearContentDto dto, YearPlanYearContent entity) {
        if(dto !=null && entity !=null){
            if(entity.getId() == null || entity.getId().isEmpty()){
                entity.setId(UUID.randomUUID().toString());
            }

            //begin#年度计划
            entity.setProjectConstrChar(dto.getProjectConstrChar());
            entity.setPlanYear(dto.getPlanYear());
            entity.setIsApplyOutsideCapital(dto.getIsApplyOutsideCapital());
            entity.setApplyOutsideCapital(dto.getApplyOutsideCapital());

            //下一年度计划（三年滚动）--第一年
			entity.setApplyYearInvest(dto.getApplyYearInvest());//申请年度投资累计
			entity.setCapitalSCZ_ggys_TheYear(dto.getCapitalSCZ_ggys_TheYear());
			entity.setCapitalSCZ_gtzj_TheYear(dto.getCapitalSCZ_gtzj_TheYear());
			entity.setCapitalSCZ_qita(dto.getCapitalSCZ_qita());
			entity.setCapitalOtherDescriptionShenBao(dto.getCapitalOtherDescriptionShenBao());
			entity.setYearConstructionContent(dto.getYearConstructionContent());

            //三年滚动--第二年
			entity.setApplyYearInvest_LastYear(dto.getApplyYearInvest_LastYear());//申请年度投资累计
			entity.setCapitalSCZ_ggys_LastYear(dto.getCapitalSCZ_ggys_LastYear());
			entity.setCapitalSCZ_gtzj_LastYear(dto.getCapitalSCZ_gtzj_LastYear());
			entity.setCapitalSCZ_qita_LastYear(dto.getCapitalSCZ_qita_LastYear());
			entity.setCapitalOtherDescriptionShenBao_LastYear(dto.getCapitalOtherDescriptionShenBao_LastYear());
			entity.setYearConstructionContentLastYear(dto.getYearConstructionContentLastYear());

			//三年滚动--第三年
			entity.setApplyYearInvest_LastTwoYear(dto.getApplyYearInvest_LastTwoYear());//申请年度投资累计
			entity.setCapitalSCZ_gtzj_LastTwoYear(dto.getCapitalSCZ_gtzj_LastTwoYear());
			entity.setCapitalSCZ_ggys_LastTwoYear(dto.getCapitalSCZ_ggys_LastTwoYear());
			entity.setCapitalSCZ_qita_LastTwoYear(dto.getCapitalSCZ_qita_LastTwoYear());
			entity.setCapitalOtherDescriptionShenBao_LastTwoYear(dto.getCapitalOtherDescriptionShenBao_LastTwoYear());
			entity.setYearConstructionContentLastTwoYear(dto.getYearConstructionContentLastTwoYear());

			entity.setApInvestSum(dto.getApInvestSum());//累计安排投资
			//申报信息备注
			entity.setYearConstructionContentShenBao(dto.getYearConstructionContentShenBao());

            /*entity.setYearInvestApproval(dto.getYearInvestApproval());//安排年度投资累计
            entity.setCapitalAP_ggys_TheYear(dto.getCapitalAP_ggys_TheYear());
            entity.setCapitalAP_gtzj_TheYear(dto.getCapitalAP_gtzj_TheYear());
            entity.setCapitalAP_qita(dto.getCapitalAP_qita());

            entity.setYearInvestApproval_lastYear(dto.getYearInvestApproval_lastYear());//安排年度投资累计
            entity.setCapitalAP_ggys_LastYear(dto.getCapitalAP_ggys_LastYear());
            entity.setCapitalAP_gtzj_LastYear(dto.getCapitalAP_gtzj_LastYear());
            entity.setCapitalAP_qita_LastYear(dto.getCapitalAP_qita_LastYear());

            entity.setYearInvestApproval_lastTwoYear(dto.getYearInvestApproval_lastTwoYear());//安排年度投资累计
            entity.setCapitalAP_ggys_LastTwoYear(dto.getCapitalAP_ggys_LastTwoYear());
            entity.setCapitalAP_gtzj_LastTwoYear(dto.getCapitalAP_gtzj_LastTwoYear());
            entity.setCapitalAP_qita_LastTwoYear(dto.getCapitalAP_qita_LastTwoYear());*/

            //基础数据
            entity.setCreatedDate(dto.getCreatedDate());
            entity.setModifiedDate(dto.getModifiedDate());
            entity.setModifiedBy(dto.getModifiedBy());
            entity.setItemOrder(dto.getItemOrder());
            entity.setCreatedBy(dto.getCreatedBy());
        }
        return entity;
    }
}


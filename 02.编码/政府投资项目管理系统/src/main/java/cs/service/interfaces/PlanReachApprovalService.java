package cs.service.interfaces;

import java.text.ParseException;
import java.util.Map;

import cs.domain.PlanReachApproval;
import cs.model.DomainDto.PlanReachApprovalDto;

public interface PlanReachApprovalService extends IService<PlanReachApprovalDto, PlanReachApproval, String>{

	void create(Map dto) throws ParseException;

	void update(Map data) throws ParseException;

}

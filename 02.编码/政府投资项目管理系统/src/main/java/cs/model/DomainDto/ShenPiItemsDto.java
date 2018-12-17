package cs.model.DomainDto;

import cs.domain.ShenPiItems;
/*
 * 审批事项表
 */
public class ShenPiItemsDto extends ShenPiItems{
	private ProjectDto projectDto=new ProjectDto();
	private ShenPiUnitDto shenPiUnitDto=new ShenPiUnitDto();
	public ProjectDto getProjectDto() {
		return projectDto;
	}
	public void setProjectDto(ProjectDto projectDto) {
		this.projectDto = projectDto;
	}
	public ShenPiUnitDto getShenPiUnitDto() {
		return shenPiUnitDto;
	}
	public void setShenPiUnitDto(ShenPiUnitDto shenPiUnitDto) {
		this.shenPiUnitDto = shenPiUnitDto;
	}
}

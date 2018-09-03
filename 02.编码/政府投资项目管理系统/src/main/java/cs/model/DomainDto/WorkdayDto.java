package cs.model.DomainDto;

import cs.domain.Workday;

public class WorkdayDto extends Workday{
	private String datess;
	private String month;

    public String getDatess() {
        return datess;
    }

    public void setDatess(String datess) {
        this.datess = datess;
    }

    public String getMonth() {
        return month;
    }

    public void setMonth(String month) {
        this.month = month;
    }
}

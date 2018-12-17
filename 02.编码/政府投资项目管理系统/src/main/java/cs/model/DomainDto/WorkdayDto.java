package cs.model.DomainDto;

import cs.domain.Workday;
/**
 * @Description:工作日管理实体类 
 * @author: lx
 * @Date：2017年7月10日
 * @version：0.1
 */
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

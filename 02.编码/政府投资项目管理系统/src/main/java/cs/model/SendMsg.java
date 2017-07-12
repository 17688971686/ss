package cs.model;
/**
 * @Description: 短信信息实体类
 * @author: cx
 * @Date：2017年7月11日
 * @version：0.1
 */
public class SendMsg {
	public String pin;//系统的PIN码
	public String fromUser;//自定义发送者
	public String orgaddr;//源地址(可不填)
	public String mobile;//手机号码
	public String content;//短信内容
	public String sendtime;//下发时间，格式：（yyyyMMddhhmmss）(可不填)
	public String needreport;//是否要状态报告,0,不要,1,要(可不填)
	
	public String getOrgaddr() {
		return orgaddr;
	}
	public void setOrgaddr(String orgaddr) {
		this.orgaddr = orgaddr;
	}
	public String getMobile() {
		return mobile;
	}
	public void setMobile(String mobile) {
		this.mobile = mobile;
	}
	public String getContent() {
		return content;
	}
	public void setContent(String content) {
		this.content = content;
	}
	public String getSendtime() {
		return sendtime;
	}
	public void setSendtime(String sendtime) {
		this.sendtime = sendtime;
	}
	public String getNeedreport() {
		return needreport;
	}
	public void setNeedreport(String needreport) {
		this.needreport = needreport;
	}
	
	public String getPin() {
		return pin;
	}

	public void setPin(String pin) {
		this.pin = pin;
	}

	public String getFromUser() {
		return fromUser;
	}

	public void setFromUser(String fromUser) {
		this.fromUser = fromUser;
	}
	
	public class MesBody{
		
	}
}

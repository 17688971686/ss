package cs.model;

import cs.common.XMLUtil;
import jxl.demo.XML;

import javax.xml.bind.annotation.*;
import javax.xml.bind.annotation.adapters.XmlJavaTypeAdapter;

/**
 * @Description: 短信信息实体类
 * @author: cx
 * @Date：2017年7月11日
 * @version：0.1
 */
@XmlAccessorType(XmlAccessType.NONE)
@XmlRootElement(name = "message")
public class SendMsg {
	public String pin;//系统的PIN码
	public String fromUser;//自定义发送者
	@XmlElement(required = true)
	public String orgaddr;//源地址(可不填)
	@XmlElement(required = true)
//	@XmlJavaTypeAdapter(value = XMLUtil.CDATAAdapter.class)
	public String mobile;//手机号码
	@XmlElement(required = true)
//	@XmlJavaTypeAdapter(value = XMLUtil.CDATAAdapter.class)
	public String content;//短信内容
	@XmlElement(required = true)
	public String sendtime;//下发时间，格式：（yyyyMMddhhmmss）(可不填)
	@XmlElement(required = true)
	public String needreport;//是否要状态报告,0,不要,1,要(可不填)

	public SendMsg() {
	}

	public SendMsg(String mobile, String content) {
		this.orgaddr = "";
		this.sendtime = "";
		this.mobile = "<![CDATA[" + mobile + "]]>";
		this.content = "<![CDATA[" + content + "]]>";
		this.needreport = "1";
	}

	public SendMsg(String pin, String fromUser, String orgaddr, String mobile, String content, String sendtime, String needreport) {
		this.pin = pin;
		this.fromUser = fromUser;
		this.orgaddr = orgaddr;
		this.mobile = mobile;
		this.content = content;
		this.sendtime = sendtime;
		this.needreport = needreport;
	}

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

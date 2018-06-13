package cs.service.sms;

import cs.common.AZDGUtils;
import cs.common.BasicDataConfig;
import cs.common.Util;
import cs.common.XMLUtil;
import cs.domain.framework.SysConfig;
import cs.domain.framework.SysConfig_;
import cs.model.SendMsg;
import cs.repository.interfaces.IRepository;
import cs.service.impl.ShenBaoInfoServiceImpl;
import cs.service.sms.exception.SMSException;
import org.apache.log4j.Logger;
import org.hibernate.criterion.Criterion;
import org.hibernate.criterion.Restrictions;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import javax.annotation.PostConstruct;
import javax.xml.bind.JAXBException;
import javax.xml.rpc.ServiceException;
import java.rmi.RemoteException;

@Service
public class SmsServiceImpl extends org.apache.axis.client.Service implements SmsService {

    private static Logger logger = Logger.getLogger(ShenBaoInfoServiceImpl.class);

    @Autowired
    private IRepository<SysConfig, String> sysConfigRepo;

    @Value("${sms_address}")
    private String Sms_address;//发送sms消息的webservice地址
    @Value("${sms_username}")
    private String username;//发送sms消息的用户名
    @Value("${sms_password}")
    private String password;//发送sms消息的密码
    @Value("${sms_azdg_key}")
    private String AZDGKey;// 用于对用户名和密码进行AZDG加密的Key
    // The WSDD service name defaults to the port name.
    private String SmsWSDDServiceName = "Sms";

    // 对象创建后对username和password属性进行AZDG加密
    @PostConstruct
    public void encryptLoginInfo() {
        // 使用用户名进行AZDG加密
        this.username = AZDGUtils.encrypt(username, AZDGKey);
        // 使用密码进行AZDG加密
        this.password = AZDGUtils.encrypt(password, AZDGKey);
    }

    public Sms_PortType getSms() throws SMSException {
       java.net.URL endpoint;
        try {
            endpoint = new java.net.URL(Sms_address);
        }
        catch (java.net.MalformedURLException e) {
            throw new SMSException(e.getMessage(), e);
        }
        return getSms(endpoint);
    }

    public Sms_PortType getSms(java.net.URL portAddress) throws SMSException {
        try {
            SmsSoapBindingStub _stub = new SmsSoapBindingStub(this.username, this.password, portAddress,this);
            _stub.setPortName(getSmsWSDDServiceName());
            return _stub;
        }
        catch (org.apache.axis.AxisFault e) {
            throw new SMSException(e.getMessage(), e);
        }
    }

    /**
     * 发送sms消息的方法
     *
     * @param batch 批次,各个系统用同一账号情况下请用不同批次号码,可为空
     * @param msgs 消息的主题内容，包含手机号，消息内容等
     * @return 消息发送状态
     * @throws SMSException
     */
    @Override
//    @Async
    public String insertDownSms(String batch, SendMsg... msgs) throws SMSException {
        if (msgs.length == 0)
            return null;
        if (batch == null)
            batch = "";
        try {
            // 开始检查是否
            Criterion smsDefCriterion = Restrictions.eq(SysConfig_.configName.getName(), BasicDataConfig.taskType_sendMesg);
            SysConfig smsDefSysConfg = sysConfigRepo.findByCriteria(smsDefCriterion).stream().findFirst().get();

            if(smsDefSysConfg !=null && smsDefSysConfg.getEnable()){
                // 准备短信内容
                StringBuffer sb = new StringBuffer("<sendbody>");
                for (SendMsg msg : msgs) {
                    logger.info("发送短信给: " + msg.getMobile());
                    sb.append(XMLUtil.toXml(msg));
                }
                sb.append("<publicContent></publicContent></sendbody>");

                // 开始发送短信并返回结果
                String resCont = this.getSms().insertDownSms(batch, sb.toString());
                logger.info("短信发送状态: " + resCont);
                return resCont;
            }
            return null;
        } catch (JAXBException | RemoteException e) {
            throw new SMSException(e.getMessage(), e);
        }
    }

    public String getSmsWSDDServiceName() {
        return SmsWSDDServiceName;
    }

    public void setSmsWSDDServiceName(String name) {
        SmsWSDDServiceName = name;
    }

}

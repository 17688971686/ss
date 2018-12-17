/**
 * SmsService.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cs.service.sms;

import cs.model.SendMsg;
import cs.service.sms.exception.SMSException;
/**
 * 短信处理服务层
 * @author Administrator
 *
 */
public interface SmsService extends javax.xml.rpc.Service {

    String insertDownSms(String batch, SendMsg... msgs) throws SMSException;

}

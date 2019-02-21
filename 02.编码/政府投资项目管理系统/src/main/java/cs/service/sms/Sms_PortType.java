/**
 * Sms_PortType.java
 *
 * This file was auto-generated from WSDL
 * by the Apache Axis 1.4 Apr 22, 2006 (06:55:48 PDT) WSDL2Java emitter.
 */

package cs.service.sms;
/**
 * 短信处理工具类
 * @author Administrator
 *
 */
public interface Sms_PortType extends java.rmi.Remote {
	/**
	 * 链接webservice服务
	 * @return
	 * @throws java.rmi.RemoteException
	 */
    public String connMas() throws java.rmi.RemoteException;
    /**
     * 获取上发短信
     * @param destaddr
     * @return
     * @throws java.rmi.RemoteException
     */
    public String getUpSms(String destaddr) throws java.rmi.RemoteException;
    public String rspUpSms(String msgid) throws java.rmi.RemoteException;
    /**
     * 下发短信
     * @param batch 号码
     * @param sendbody  内容
     * @return
     * @throws java.rmi.RemoteException
     */
    public String insertDownSms(String batch, String sendbody) throws java.rmi.RemoteException;
    /**
     * 下发短信返回状态
     * @param batch
     * @param cnt
     * @return
     * @throws java.rmi.RemoteException
     */
    public String getDownSmsResult(String batch, String cnt) throws java.rmi.RemoteException;
    public String getSpecialDownSmsResult(String batch, String msgid) throws java.rmi.RemoteException;
    /**
     * 检查是否发送成功
     * @return
     * @throws java.rmi.RemoteException
     */
    public boolean checkpass() throws java.rmi.RemoteException;
}
